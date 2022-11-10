const fetch = require('node-fetch')
var Queue = require('bull')
const reservationErrors = require('../errors/reservation_error')
const Logger = require('../../logger/src/logger')
const config = require('./../config/config')

const logger = new Logger()
const configStruct = config.getConfig()
var algorithms = require('./algorithms/' +
  configStruct.app.algorithm_implementation)

var doneReservationsQueue = new Queue(
  configStruct.redis.done_reservations_queue,
  `redis://${configStruct.redis.host}:${configStruct.redis.port}`,
)
var pendingReservationsQueue = new Queue(
  configStruct.redis.pending_reservations_queue,
  `redis://${configStruct.redis.host}:${configStruct.redis.port}`,
)
var redisClient = ''
const initRedis = (client) => {
  redisClient = client
}

const sendReservation = async (req, reservation, res) => {
  logger.info(
    'The user with ci: ' +
      reservation.DocumentId +
      ' requested to make a reservation: ' +
      reservation,
    __filename.split('src')[1],
  )

  try{
    await applyTransformationsAndValidations(req, reservation)
  }catch(err){
    throw new reservationErrors.InvalidReservationReceived(
      err
    )
  }

  var assignedCenterQuota
  var wasCenterAssigned = false
  var reservationShouldGoIntoPending = false
  while (!wasCenterAssigned && !reservationShouldGoIntoPending) {
    // 1) Get a potential center (if none ==> add to pending)
    assignedCenterQuota = await findAvailableCenterQuota(
      req,
      reservation,
    ).catch((err) => console.log(err))

    // 2) If no center was received: add to pending
    if (
      !assignedCenterQuota ||
      assignedCenterQuota == null ||
      assignedCenterQuota == undefined
    ) {
      reservationShouldGoIntoPending = true
    } else {
      // 3) Attempt to assign reservation to center
      wasUpdated = await updateCenterQuota(req, assignedCenterQuota)
      if (wasUpdated) {
        wasCenterAssigned = true
      }
    }
  }

  // TODO: VALIDATE HERE THAT LATENCY IS NOT > 5 MINUTES. IF IT IS, RETURN ERROR

  // Notify user ==> Add Reservation to DB ==> Send Response to User
  if (reservationShouldGoIntoPending) {
    // logger.info( "The user with ci: " + reservation.DocumentId + " had his reservation sent to pending reservations: " + reservation, __filename.split("src")[1])

    //logger.info('Out of validations', __filename.split('src')[1])

    var reservationFromDB = undefined
    let result = await req.reservationsDB
      .collection(configStruct.mongo_reservations.reservations_collection)
      .findOne({ document: reservation.DocumentId })
      .then((data) => {
        if (data) {
          reservationFromDB = data
        } else {
          return null
        }
      })
      .catch((err) => {
        // TODO: LOG ERROR
        console.log(err)
        reservationFromDB = undefined
      })

    if (reservationFromDB) {
      throw new reservationErrors.InvalidReservationReceived(
        'Invalid Repeated Reservation with document: ' + reservation.DocumentId,
      )
    }

    // logger.info('Out of validations', __filename.split('src')[1])

    fullReservation = { ...reservation }
    fullReservation.status = 'pending'
    var newReservation = algorithms.transformReservationForDB(fullReservation)

    if (newReservation.latency > 300) {
      throw new reservationErrors.TimeForReservationExpired(
        'The time for processing the reservation was over 5 minutes',
        500,
      )
    }

    notifyUser(newReservation, true, req, req.token)
    sendPendingReservationToEmitterQueue(newReservation)

    //logger.info("The user with ci: " + reservation.DocumentId + " MADE A RESERVATION: " + reservation, __filename.split("src")[1])
    return {
      status: 200,
      message:
        'Reservation added to Waiting List! When new quota available, you will be booked.' +
        ' Reservation code: ' +
        newReservation.reservation_code +
        ' for document: ' +
        newReservation.document +
        '. Latency: ' +
        newReservation.latency +
        ' ==> Initial: ' +
        newReservation.timestamp_sent +
        ' Response: ' +
        newReservation.timestamp_awnser +
        '.',
    }
  } else {

  //logger.info('Out of validations', __filename.split('src')[1])

    var reservationFromDB = undefined
    let result = await req.reservationsDB
      .collection(configStruct.mongo_reservations.reservations_collection)
      .findOne({ document: reservation.DocumentId })
      .then((data) => {
        if (data) {
          reservationFromDB = data
        } else {
          return null
        }
      })
      .catch((err) => {
        // TODO: LOG ERROR
        console.log(err)
        reservationFromDB = undefined
      })

    if (reservationFromDB) {
      throw new reservationErrors.InvalidReservationReceived(
        'Invalid Repeated Reservation with document: ' + reservation.DocumentId,
      )
    }

    // logger.info('Out of validations', __filename.split('src')[1])

    fullReservation = { ...reservation, ...assignedCenterQuota }
    fullReservation.status = 'successful'
    var newReservation = algorithms.transformReservationForDB(fullReservation)

    if (newReservation.latency > 300) {
      throw new reservationErrors.TimeForReservationExpired(
        'The time for processing the reservation was over 5 minutes',
        500,
      )
    }

    sendDoneReservationToEmitterQueue(newReservation)
    notifyUser(newReservation, false, req, req.token)

    //logger.info("The user with ci: " + reservation.DocumentId + " MADE A RESERVATION: " + reservation, __filename.split("src")[1])
    return {
      status: 200,
      message:
        'Successfully booked reservation!' +
        ' Reservation code: ' +
        newReservation.reservation_code +
        '. Document ID: ' +
        newReservation.document +
        '. Location: State ' +
        newReservation.state +
        ', Zone ' +
        newReservation.zone +
        ', Center Code ' +
        newReservation.vaccination_center_code +
        '. Latency: ' +
        newReservation.latency +
        ' ==> Initial: ' +
        newReservation.timestamp_sent +
        ' Response: ' +
        newReservation.timestamp_awnser +
        '.',
    }
  }
}

// - - - -   A U X I L I A R Y   F U N C T I O N S   - - - -

const applyTransformationsAndValidations = async (req, reservation) => {
  console.log(reservation)
  // Transformations
  for (i = 0; i < req.transformations.length; i++) {
    reservation = await req.transformations[i](reservation)
  }
  // Validations
  for (i = 0; i < req.validations.length; i++) {
    await req.validations[i](reservation, req)
    console.log(req.validations[i].name)
  }
  // Late Validations
  for (i = 0; i < req.late_validations.length; i++) {
    await req.late_validations[i](reservation, req)
  }
}

// findAvailableCenterQuota attempts to find available quota (first contemplating hour, if not, in any hour)
const findAvailableCenterQuota = async (req, reservation) => {
  var quota = undefined
  let result = await req.adminDB
    .collection(configStruct.mongo_admin.quota_collection)
    .findOne(getReservationFilters(reservation))
    .then((data) => {
      if (data) {
        quota = data
      } else {
        return null
      }
    })
    .catch((err) => {
      // logger.error("The user with ci: " + reservation.DocumentId + " could not get any vaccination center to fit his reservation: error" + err, __filename.split("src")[1])
      quota = undefined
    })

  if (quota) {
    if (!algorithms.validateWeightedAttributes(quota, reservation)) {
      var newQuota = undefined
      let newResult = await req.adminDB
        .collection(configStruct.mongo_admin.quota_collection)
        .findOne(getReservationFiltersWithHour(reservation))
        .then((data) => {
          if (data) {
            newQuota = data
          } else {
            return null
          }
        })
        .catch((err) => {
          // logger.error("The user with ci: " + reservation.DocumentId + " could not get any vaccination center to fit his reservation: error" + err, __filename.split("src")[1])
          newQuota = undefined
        })
    }
  }

  if (newQuota) {
    return newQuota
  }

  return quota
}

const getReservationFilters = (reservation) => {
  return algorithms.getCenterFilter(reservation)
}

const getReservationFiltersWithHour = (reservation) => {
  return algorithms.getCenterFilterWithHour(reservation)
}

const updateCenterQuota = async (req, quota) => {
  return await req.adminDB
    .collection(configStruct.mongo_admin.quota_collection)
    .updateOne({ quota_code: quota.quota_code }, { $inc: { quota: -1 } })
    .then((data) => {
      if (data.nModified == 0) {
        //logger.info( "The user with ci: " + reservation.DocumentId + " could not book a reservation due to no quota left", __filename.split("src")[1])
        return false
      }
      return true
    })
    .catch((error) => {
      //logger.info( "The user with ci: " + reservation.DocumentId + " could not book a reservation due mongo db error: " + error, __filename.split("src")[1])
      return false
    })
}

const notifyUser = async (reservation, isPending, req, token) => {
  if (isPending) {
    for (i = 0; i < req.configuration.notificationsPendingArray.length; i++) {

      fetch(req.configuration.notificationsPendingArray[i].endpoint, {
        method: 'POST',
        body: JSON.stringify(reservation),
        headers: { 'Content-Type': 'application/json', 'auth-token': token },
      })
        .then((result) => result.json())
        .then(
          (json) => console.log(json),
          //logger.info("Notification was correctly sent to user with document: " + reservation.DocumentId, __filename.split("src")[1])
        )
        .catch(
          (err) => console.log('Notification Error: ' + err),
          //logger.error("Error when sending notification to user with document: " + reservation.DocumentId + ". Error: " + err.message, __filename.split("src")[1])
        )
    }
  } else {
    for (
      i = 0;
      i < req.configuration.notificationsSuccessfulArray.length;
      i++
    ) {

      fetch(req.configuration.notificationsSuccessfulArray[i].endpoint, {
        // TODO: ADD TOKEN TO REQUEST ==> { method: "POST", headers: {"auth-token": token} })
        method: 'POST',
        body: JSON.stringify(reservation),
        headers: { 'Content-Type': 'application/json', 'auth-token': token },
      })
        .then((result) => result.json())
        .then(
          (json) => console.log(json),
          //logger.info("Notification was correctly sent to user with document: " + reservation.DocumentId, __filename.split("src")[1])
        )
        .catch(
          (err) => console.log('Notification Error: ' + err),
          //logger.error("Error when sending notification to user with document: " + reservation.DocumentId + ". Error: " + err.message, __filename.split("src")[1])
        )
    }
  }
}

const sendDoneReservationToEmitterQueue = async (reservationParam) => {
  sendReservationToEmitterQueue(reservationParam, true)
}

const sendPendingReservationToEmitterQueue = async (reservationParam) => {
  sendReservationToEmitterQueue(reservationParam, false)
}

const sendReservationToEmitterQueue = async (
  newReservation,
  isDoneReservation,
) => {
  try {
    if (isDoneReservation) {
      doneReservationsQueue.add(newReservation)
      // logger.info("Done reservation " + newReservation + " enqueued successfully")
    } else {
      pendingReservationsQueue.add(newReservation)
      // logger.info("Done reservation " + newReservation + " enqueued successfully")
    }
  } catch (error) {
    // logger.error("An error ocurred while enqueuing new done reservation " + error, __filename.split("src")[1])
    throw new reservationErrors.ReservationsError(
      'Unable to process and book reservation',
      500,
    )
  }
}

// - - - -  E X P O R T S   - - - -

module.exports = {
  sendReservation,
  initRedis,
}

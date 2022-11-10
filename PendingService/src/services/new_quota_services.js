const mongoose = require("mongoose");
const fetch = require("node-fetch");
const mongodb = require("./../db/mongoose");
const pendingErr = require("./../errors/pending_error");
const config = require("./../config/config");
const Logger = require("../../logger/src/logger");

const configStruct = config.getConfig();
const logger = new Logger();

const processNewQuota = async (quota, token) => {
  var adminDB = await mongodb.initAdminDB(mongoose);
  var reservationsDB = await mongodb.initReservationsDB(mongoose);

  // 1) Get All Reservations That Fit New Quota (sorted by date)
  // TODO: DOCUMENT ==> If find() was sorted, we could retrieve reservations given age
  let fittingReservations = await getPendingReservationsThatFitCriteria(
    quota,
    reservationsDB
  );

  // 2) Attempt to Book Each Reservation (and notify)
  let quotaIsOver = false;
  for (i = 0; i < fittingReservations.length && !quotaIsOver; i++) {
    // Attempt Quota Update
    let result = await updateCenterQuota(quota, adminDB);

    // If No Quota Found ==> Break
    if (result.no_quota_found) {
      // TODO: LOG NO MORE QUOTA AVAILABLE
      return (quotaIsOver = true);
    }

    // If Error ==> Log
    if (result.was_error_thrown) {
      // TODO: LOG ERROR
      return;
    }

    // If OK ==> Notify and Update Reservation
    let updatedReservation = generatedReservationWithQuotaFields(
      quota,
      fittingReservations[i]
    );
    let updateResult = await updateReservationInDB(
      updatedReservation,
      reservationsDB
    );

    if (updateResult.was_error_thrown) {
      resetQuota(quota, adminDB);
    }

    notifyUser(updatedReservation, token);

    // TODO: LOG SUCCESS
  }
  // TODO: LOG ALL PENDING QUOTA UPDATE ATTEMPTED
};

const getPendingReservationsThatFitCriteria = async (quota, reservationsDB) => {
  var reservations = [];

  let filter = getFilterGivenQuota(quota);
  let projection = null;
  let options = null;

  for await (const reservation of reservationsDB
    .collection(configStruct.mongo_reservations.reservations_collection)
    .find(filter)) {
    try {
      reservations.push(reservation);
    } catch (error) {
      throw new pendingErr.InternalPendingErr(
        "Internal error retrieving pending reservations that fit criteria"
      );
    }
  }

  return reservations;
};

const getFilterGivenQuota = (quota) => {
  const algorithm = require("./algorithms/" +
    configStruct.app.algorithm_implementation);
  return algorithm.getFilterGivenQuota(quota);
};

const updateCenterQuota = async (quota, adminDB) => {
  return await adminDB
    .collection(configStruct.mongo_admin.quota_collection)
    .updateOne({ quota_code: quota.quota_code }, { $inc: { quota: -1 } })
    .then((data) => {
      if (data.nModified == 0) {
        //logger.info( "The user with ci: " + reservation.DocumentId + " could not book a reservation due to no quota left", __filename.split("src")[1])
        return {
          no_quota_found: true,
          was_error_thrown: false,
        };
      }
      return {
        no_quota_found: false,
        was_error_thrown: false,
      };
    })
    .catch((error) => {
      //logger.info( "The user with ci: " + reservation.DocumentId + " could not book a reservation due mongo db error: " + error, __filename.split("src")[1])
      return {
        no_quota_found: false,
        was_error_thrown: true,
      };
    });
};

const resetQuota = async (quota, adminDB) => {
  return await adminDB
    .collection(configStruct.mongo_admin.quota_collection)
    .updateOne({ quota_code: quota.quota_code }, { $inc: { quota: 1 } })
    .then((data) => {
      if (data.nModified == 0) {
        //logger.info( "The user with ci: " + reservation.DocumentId + " could not book a reservation due to no quota left", __filename.split("src")[1])
      } else {
        //logger.info( "The user with ci: " + reservation.DocumentId + " could not book a reservation due to no quota left", __filename.split("src")[1])
      }
    })
    .catch((error) => {
      //logger.info( "The user with ci: " + reservation.DocumentId + " could not book a reservation due mongo db error: " + error, __filename.split("src")[1])
    });
};

const notifyUser = (reservation, token) => {
  let notificationType = getNotificationType();
  let notificationAddress =
    configStruct.notification_service.notify_success_address +
    "/" +
    notificationType;

  fetch(notificationAddress, {
    method: "POST",
    body: JSON.stringify(reservation),
    headers: { "Content-Type": "application/json", "auth-token": token },
  })
    .then((result) => result.json())
    .then(
      (json) => console.log("Successfully Notification User: " + json)
      //logger.info("Notification was correctly sent to user with document: " + reservation.DocumentId, __filename.split("src")[1])
    )
    .catch(
      (err) => console.log("Notification Error: " + err)
      //logger.error("Error when sending notification to user with document: " + reservation.DocumentId + ". Error: " + err.message, __filename.split("src")[1])
    );
};

const getNotificationType = () => {
  return configStruct.notification_service.notification_type;
};

const generatedReservationWithQuotaFields = (quota, reservation) => {
  let fullReservation = { ...reservation, ...quota };
  const algorithm = require("./algorithms/" +
    configStruct.app.algorithm_implementation);
  return algorithm.generateReservationForDatabase(fullReservation);
};

const updateReservationInDB = async (reservation, reservationsDB) => {
  return await reservationsDB
    .collection(configStruct.mongo_reservations.reservations_collection)
    .updateOne(
      { reservation_code: reservation.reservation_code },
      generateUpdateFields(reservation)
    )
    .then((data) => {
      if (data.nModified == 0) {
        //logger.info( "The user with ci: " + reservation.DocumentId + " could not book a reservation due to no quota left", __filename.split("src")[1])
        return {
          no_reservation_found: true,
          was_error_thrown: false,
        };
      }
      return {
        no_reservation_found: false,
        was_error_thrown: false,
      };
    })
    .catch((error) => {
      //logger.info( "The user with ci: " + reservation.DocumentId + " could not book a reservation due mongo db error: " + error, __filename.split("src")[1])
      return {
        no_reservation_found: false,
        was_error_thrown: true,
      };
    });
};

const generateUpdateFields = (reservation) => {
  const algorithm = require("./algorithms/" +
    configStruct.app.algorithm_implementation);
  return algorithm.generateUpdateFields(reservation);
};

module.exports = {
  processNewQuota,
};

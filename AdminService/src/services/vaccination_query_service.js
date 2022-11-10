const fetch = require("node-fetch");
const queryModel = require("../models/queryModel");
const adminErr = require("./../error/admin_error");
const config = require("./../config/config");
const configStruct = config.getConfig();
const Logger = require("../../logger/src/logger");
const logger = new Logger();

const getVaccinatedUsers = async (req) => {
  logger.info("get vaccinated users");
  const code = req.query.vaccination_center_code;
  const date = req.query.date;

  const documentFilter = {
    vaccination_center_code: code,
    vaccination_date: new Date(date),
    status: "successful",
    was_vaccinated: true,
  };

  console.log(documentFilter);

  const doneReservations =
    (await countReservationsFromDb(req, documentFilter)) || 0;
  console.log("doneReservations" + doneReservations);

  documentFilter.was_vaccinated = false;
  const missedReservations =
    (await countReservationsFromDb(req, documentFilter)) || 0;
  console.log("missedReservations" + missedReservations);

  const myResponse = {
    done_reservations: doneReservations,
    missed_reservations: missedReservations,
  };

  return myResponse;
};

const countReservationsFromDb = async (req, documentFilter) => {
  return await req.reservationsDB
    .collection(configStruct.mongo_reservations.reservations_collection)
    .countDocuments(documentFilter)
    .then((data) => {
      if (data.modifiedCount == 0) {
        //TODO: throw error
        logger.error("error finding reservations in database.");
        return 0;
      }
      console.log(data);
      return data;
    })
    .catch((error) => {
      //TODO: throw error
      logger.error("error finding reservations in database.");
      return 0;
    });
};

const sortAscending = (a, b) => {
  if (a.state > b.state) {
    return 1;
  }
  if (a.state < b.state) {
    return -1;
  }
  return 0;
};

const getSortedPendingVaccines = async (req) => {
  logger.info("get sorted pending vaccines");
  pendingReservations = await findFieldsInDb(req);
  pendingReservations.sort(sortAscending);

  const states = [];
  var vaccinesMap = new Map();
  pendingReservations.forEach((element) => {
    if (vaccinesMap.get(element.state) == null) {
      vaccinesMap.set(element.state, []);
      states.push(element.state);
    }
    vaccinesMap.get(element.state).push(element.zone);
  });

  states.forEach((element) => {
    vaccinesMap.get(element).sort(sortAscending);
  });

  const myResponse = [];
  states.forEach((element) => {
    state = element;

    zoneArray = vaccinesMap.get(state);
    const zoneMaps = new Map();
    const zones = [];
    zoneArray.forEach((zone) => {
      if (zoneMaps.get(zone) == null) {
        zones.push(zone);
        zoneMaps.set(zone, 1);
      } else {
        newZone = zoneMaps.get(zone) + 1;
        zoneMaps.set(zone, newZone);
      }
    });

    unassigned_per_zone = [];
    zones.forEach((zone) => {
      value = zoneMaps.get(zone);
      unassigned_per_zone.push({ zone: zone, amount: value });
    });

    myResponse.push({
      state: state,
      unassigned_reservations: unassigned_per_zone,
    });
  });
  return myResponse;
};

const findFieldsInDb = async (req) => {
  var response = await req.reservationsDB
    .model("querySchema", queryModel.querySchema)
    .find({ status: "pending" }, "state zone -_id")
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
      //throw error
      return null;
    });

  return response;
};

module.exports = {
  getVaccinatedUsers,
  getSortedPendingVaccines,
};

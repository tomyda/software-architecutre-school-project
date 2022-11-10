const uuid = require("uuid");
const mongoose = require("mongoose");
const quota = require("../models/quota");
const adminErr = require("../error/admin_error");
const VaccionationCenter = require("../models/vaccination_center");
const config = require("./../config/config");
const configStruct = config.getConfig();
const Logger = require("../../logger/src/logger");
const logger = new Logger();

const addVaccinationCenter = async (req) => {
  logger.info(
    "The user with id: " +
      req.user_in_control.user_id +
      " requested to add a vaccination center",
    __filename.split("src")[1]
  );

  // 1) Validate user in control has privileges needed
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin"
  ) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not register vaccination center as his role is not superadmin or admin. current role: " +
        req.user_in_control.auth_client_id,
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidUserInControlError(
      "only 'superadmin' or 'admin' can create a new vaccination center"
    );
  }

  // 2) Create new Vaccination Center
  const vaccinationCenter = req.body;
  var newVaccinationCenter = req.adminDB.model(
    "vaccinationCenters",
    VaccionationCenter.vaccionationCenterSchema
  );

  vaccinationCenter.center_code = uuid.v4();

  if (await isCenterRepeated(vaccinationCenter, req)) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not create a vaccination center as the center name " +
        newVaccinationCenter.name +
        " already exists",
      __filename.split("src")[1]
    );
    throw new adminErr.VaccinationCenterRepeated();
  }

  await newVaccinationCenter.create(vaccinationCenter);

  logger.info(
    "The user with id: " +
      req.user_in_control.user_id +
      " successfully added a vaccination center: " +
      vaccinationCenter,
    __filename.split("src")[1]
  );
};

const updateVaccinationCenterQuota = async (req, queue) => {
  logger.info(
    "The user with id: " +
      req.user_in_control.user_id +
      " requested to update a vaccinations center quota",
    __filename.split("src")[1]
  );

  centerCode = req.params.center_code;
  // 1) Validate user in control has privileges needed
  if (
    req.user_in_control.auth_client_id != "superadmin" &&
    req.user_in_control.auth_client_id != "admin"
  ) {
    logger.error(
      "The user with id " +
        req.user_in_control.user_id +
        " could not update a vaccinations center quota as his role is not superadmin or admin. current role: " +
        req.user_in_control.auth_client_id,
      __filename.split("src")[1]
    );
    throw new adminErr.InvalidUserInControlError(
      "only 'superadmin' or 'admin' can update a vaccination center's quota"
    );
  }

  // 2) Validate Quota
  var newQuota = req.body;
  quota.validateQuota(newQuota);

  // 3) Retrieve Center (validate it exists and get info)
  documentFilter = { center_code: centerCode };
  let findCenterErr;
  let vaccinationCenter;
  let dbCenter = await req.adminDB
    .model("vaccinationCenters", VaccionationCenter.vaccionationCenterSchema)
    .findOne(documentFilter, "-_id -__v")
    .then((data) => {
      if (data) {
        vaccinationCenter = data;
        return vaccinationCenter;
      } else {
        return null;
      }
    })
    .catch((err) => {
      findCenterErr = new adminErr.VaccinationCenterNotFound();
      return;
      // logger.error("The user with ci: " + reservation.DocumentId + " could not get any vaccination center to fit his reservation: error" + err, __filename.split("src")[1])
    });
  if (findCenterErr || !dbCenter) {
    throw new adminErr.VaccinationCenterNotFound();
  }

  // 4) Append Center Info to Quota
  var fullQuota = addCenterDataToQuota(newQuota, dbCenter._doc);
  fullQuota.quota_code = uuid.v4();

  // 5) Add Quota to DB
  let insertedErr = await req.adminDB
    .collection(configStruct.mongo_admin.quota_collection)
    .insertOne(fullQuota)
    .then((result) => {
      return null;
    })
    .catch((err) => {
      return adminErr.ErrorAddingNewQuota("database error");
    });
  if (insertedErr) {
    throw insertedErr;
  }

  // 5) Notify Pending of new Quota
  queue.add(fullQuota);
};

const isCenterRepeated = async (newVaccinationCenter, req) => {
  const filter = {
    zone: newVaccinationCenter.zone,
    state: newVaccinationCenter.state,
    name: newVaccinationCenter.name,
  };
  var repeated = false;
  await req.adminDB
    .model("vaccinationCenters", VaccionationCenter.vaccionationCenterSchema)
    .findOne(filter, (err, result) => {
      if (err || result) {
        repeated = true;
      }
    });
  return repeated;
};

const addCenterDataToQuota = (quota, centerData) => {
  newObject = { ...quota, ...centerData };
  return newObject;
};

module.exports = {
  addVaccinationCenter,
  updateVaccinationCenterQuota,
};

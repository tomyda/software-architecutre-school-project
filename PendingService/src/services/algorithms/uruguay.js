const getFilterGivenQuota = (quota) => {
  if (quota.selection_criteria == "age") {
    return {
      status: "pending",
      state: quota.state,
      zone: quota.zone,
      $and: [
        { age: { $gte: quota.start_age } },
        { age: { $lte: quota.finish_age } },
      ],
      $or: [
        {
          date: { $lte: new Date() },
          hour: quota.working_hours,
        },
        {
          $and: [
            { date: { $lte: new Date(quota.finish_date) } },
            { date: { $gte: new Date(quota.start_date) } },
          ],
          hour: quota.working_hours,
        },
        {
          date: { $lte: new Date() },
        },
        {
          $and: [
            { date: { $lte: new Date(quota.finish_date) } },
            { date: { $gte: new Date(quota.start_date) } },
          ],
        },
      ],
    };
  } else {
    return {
      status: "pending",
      state: quota.state,
      zone: quota.zone,
      priority_group: quota.priority_group,
      $or: [
        {
          date: { $lte: new Date() },
          hour: quota.working_hours,
        },
        {
          $and: [
            { date: { $lte: new Date(quota.finish_date) } },
            { date: { $gte: new Date(quota.start_date) } },
          ],
          hour: quota.working_hours,
        },
        {
          date: { $lte: new Date() },
        },
        {
          $and: [
            { date: { $lte: new Date(quota.finish_date) } },
            { date: { $gte: new Date(quota.start_date) } },
          ],
        },
      ],
    };
  }
};

const generateReservationForDatabase = (fullReservation) => {
  return {
    document: fullReservation.document,
    age: fullReservation.age,
    priority_group: fullReservation.priority_group,
    state: fullReservation.state,
    zone: fullReservation.zone,
    date: fullReservation.date,
    hour: fullReservation.hour,
    vaccination_center_code: fullReservation.center_code,
    timestamp_sent: fullReservation.timestamp_sent,
    cellphone: fullReservation.cellphone,
    quota_code: fullReservation.quota_code,
    reservation_code: fullReservation.reservation_code,
    status: "successful",
  };
};

const generateUpdateFields = (reservation) => {
  return {
    $set: {
      hour: reservation.hour,
      vaccination_center_code: reservation.vaccination_center_code,
      quota_code: reservation.quota_code,
      status: "successful",
    },
  };
};

module.exports = {
  getFilterGivenQuota,
  generateReservationForDatabase,
  generateUpdateFields,
};

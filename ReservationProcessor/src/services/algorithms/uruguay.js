const uuid = require("uuid")

const getCenterFilter = (reservation) => {
    return {
        state: reservation.State,
        zone: reservation.Zone,
        quota: { $gt: 0 },
        start_date: { $lte: new Date(reservation.ReservationDate) },
        finish_date: { $gte: new Date(reservation.ReservationDate) },
        $or: [
            {
                selection_criteria: "age",
                start_age: { $lte: reservation.age },
                finish_age: { $gte: reservation.age },
            },
            {
                selection_criteria: "priority",
                priority_group: reservation.priority_group,
            }
        ],
    }
}

const getCenterFilterWithHour = (reservation) => {
    return {
        state: reservation.State,
        zone: reservation.Zone,
        quota: { $gt: 0 },
        start_date: { $lte: new Date(reservation.ReservationDate) },
        finish_date: { $gte: new Date(reservation.ReservationDate) },
        $or: [
            {
                selection_criteria: "age",
                start_age: { $lte: reservation.age },
                finish_age: { $gte: reservation.age },
                working_hours: reservation.Schedule,

            },
            {
                selection_criteria: "priority",
                priority_group: reservation.priority_group,
                working_hours: reservation.Schedule,

            }
        ],
    }
}

const getSorting = () => {
    return {selection_criteria: -1}
} 

const transformReservationForDB = (reservation) => {
    return {
        document: reservation.DocumentId,
        age: reservation.age,
        priority_group: reservation.priority_group,
        state: reservation.State,
        zone: reservation.Zone,
        date: new Date(reservation.ReservationDate),
        hour: reservation.Schedule,
        vaccination_center_code: reservation.center_code,
        timestamp_sent: new Date(reservation.timestamp_sent),
        timestamp_awnser: new Date(),
        latency:(new Date() - new Date(reservation.timestamp_sent)) / 1000,
        cellphone: new String("+598" + reservation.Cellphone),
        quota_code: reservation.quota_code,
        reservation_code: uuid.v4(),
        status: reservation.status,
    }
}

const validateWeightedAttributes = (quota, reservation) => {
    if (quota.working_hours == reservation.Schedule) {
        return true
    }
    return false
}

module.exports = {
    getCenterFilter,
    getCenterFilterWithHour,
    getSorting,
    transformReservationForDB,
    validateWeightedAttributes,
}
const pendingTransformations = (reservation) => {
  reservation.date = new Date(reservation.date);
  return reservation;
};

const doneTransformations = (reservation) => {
  reservation.date = new Date(reservation.date);
  return reservation;
};

module.exports = {
  pendingTransformations,
  doneTransformations,
};

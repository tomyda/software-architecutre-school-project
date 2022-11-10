const express = require("express");
const expressApp = express();
require("./db/mongoose");
const redis = require("redis");
const util = require("util");
const app = require("./app");
const Queue = require("bull");
const config = require("./config/config");
const configStruct = config.getConfig();
const DoneProcessor = require("./services/done-reservations-processor");
const PendingProcessor = require("./services/pending-reservations-processor");
const doneReservationProcessor = new DoneProcessor();
const pendingReservationProcessor = new PendingProcessor();

app.initApp(expressApp);

expressApp.listen(configStruct.app.port, () => {
  console.log(`Reservation emitter is up on ${configStruct.app.address}`);
});

//Queue:
const client = redis.createClient(
  `redis://${configStruct.redis.host}:${configStruct.redis.port}`
);
client.get = util.promisify(client.get);

const doneReservationsQueue = new Queue(
  configStruct.redis.queue_done_reservations,
  `redis://${configStruct.redis.host}:${configStruct.redis.port}`
);

const pendingReservationsQueue = new Queue(
  configStruct.redis.queue_pending_reservations,
  `redis://${configStruct.redis.host}:${configStruct.redis.port}`
);

doneReservationsQueue.process(100, async (job, done) => {
  doneReservationProcessor.processReservation(job.data, client);
  done();
});

pendingReservationsQueue.process(100, async (job, done) => {
  pendingReservationProcessor.processReservation(job.data, client);
  done();
});

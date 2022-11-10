const EventEmitter = require("events");
const Util = require("util");

class AbstractPipeline {
  constructor() {
    this.filters = [];
    EventEmitter.call(this);
    Util.inherits(AbstractPipeline, EventEmitter);
  }
  use(filter) {
    this.filters.push(filter);
    return this;
  }
  run(input) {
    logger.error(`Run not implemented`, __filename.split("src")[1]);
  }
}

module.exports = AbstractPipeline;

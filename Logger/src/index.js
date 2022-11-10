const Logger = require("./logger");
const logger = new Logger();

logger.error("errorTEST", "labelERRR");
logger.warn("warnTEST", "labelWARN");
logger.info("infoTEST", "labelINFO");
logger.verbose("verboseTEST", "labelVERBOSE");
logger.debug("debugTEST", "labelDEBUG");
logger.silly("sillyTEST", "labelSILLy");

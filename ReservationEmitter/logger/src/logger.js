const config = require('./config/config')
const configStruct = config.getConfig();

const deferBinding = () => {
  let implementation
  try {
    const type = configStruct.logger.implementation || 'winston'
    implementation = require(`./implementations/${type}-logger`)
  } catch (error) {
    console.log('Missing Logger Implementation Provided.')
    implementation = require('./implementations/winston-logger')
  }
  return implementation
}

module.exports = deferBinding()

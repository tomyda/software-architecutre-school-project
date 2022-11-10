
class AbstractTransformation {
  constructor () {
    this.name = ''
    this.description = ''
    this.field = ''
  }
  Name () {
    return this.name
  }
  Description () {
    return this.description
  }
  Transform () {
  }
}

module.exports = AbstractTransformation

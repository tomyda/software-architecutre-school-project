class AbstractValidator {
  constructor() {
    this.name = "";
    this.description = "";
    this.atEnd = false;
  }
  Name() {
    return this.name;
  }
  Description() {
    return this.description;
  }
  Validate() {
      // logger.error(new ValidationError(`Validation not implemented`), __filename.split('src')[1])
  }
}

module.exports = AbstractValidator;

const validator = require("validator")
const dateFormat = require("dateformat");

const adminErrors = require("../error/admin_error")
const config = require('../config/config')
const configStruct = config.getConfig()

const validateQuota = (newQuotaIn) => {
  if (!newQuotaIn.selection_criteria || newQuotaIn.selection_criteria == "") {
    throw new adminErrors.InvalidNewQuota("invalid selection criteria")
  }
  if (newQuotaIn.selection_criteria != "age" && newQuotaIn.selection_criteria != "priority") {
    throw new adminErrors.InvalidNewQuota("invalid selection criteria: only 'age' and 'priority' are allowed")
  }
  if (!newQuotaIn.start_date) {
    throw new adminErrors.InvalidNewQuota("invalid start date")
  }
  if (!newQuotaIn.finish_date) {
    throw new adminErrors.InvalidNewQuota("invalid finish date")
  }
  if(newQuotaIn.selection_criteria === 'age'){
    if (!newQuotaIn.start_age || newQuotaIn.start_age < 1 || newQuotaIn.start_age > 106) {
      throw new adminErrors.InvalidNewQuota("invalid start age")
    }
    if (!newQuotaIn.finish_age || newQuotaIn.finish_age < 1 || newQuotaIn.finish_age > 106) {
      throw new adminErrors.InvalidNewQuota("invalid finish age")
    }
    if (newQuotaIn.finish_age < newQuotaIn.start_age) {
      throw new adminErrors.InvalidNewQuota("invalid finish age (must be after start age)")
    }
  }
  if (!newQuotaIn.quota || newQuotaIn.quota < 1 || newQuotaIn.quota > configStruct.max_amount_of_new_quota) {
    throw new adminErrors.InvalidNewQuota("invalid new quota")
  }
  if (!newQuotaIn.priority_group || newQuotaIn.priority_group < 1 || newQuotaIn.priority_group > 1000) {
    throw new adminErrors.InvalidNewQuota("invalid priority group (must be between 1 and 1000)")
  }
  try {
    newQuotaIn.finish_date = new Date(newQuotaIn.finish_date)
    newQuotaIn.start_date = new Date(newQuotaIn.start_date)
  } catch (err) {
    throw new adminErrors.InvalidNewQuota("invalid dates received")
  }

  if (newQuotaIn.finish_date < newQuotaIn.start_date) {
    throw new adminErrors.InvalidNewQuota("invalid finish date (must be after start date)")
  }
}

module.exports = {
  validateQuota,
}
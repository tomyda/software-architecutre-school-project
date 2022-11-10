const config = require("./../config/config");
const providerErr = require("./../errors/provider_error");

const configStruct = config.getConfig();

const getCitizenInfo = async (req) => {
  let documentID = req.query.id;
  validateDocumentID(documentID);
  documentID = parseInt(documentID);

  var userInfo = undefined;
  let result = await req.populationsDB
    .collection(configStruct.mongo_population.populations_collection)
    .findOne({ DocumentId: documentID })
    .then((data) => {
      if (data) {
        userInfo = data;
        return {
          was_error_thrown: false,
          was_citizen_found: true,
        };
      } else {
        return {
          was_error_thrown: false,
          was_citizen_found: false,
        };
      }
    })
    .catch((err) => {
      userInfo = undefined;
      return {
        was_error_thrown: true,
        was_citizen_found: false,
      };
    });

  if (result.was_error_thrown) {
    throw new providerErr.ProviderError("error retrieving user from db", 500);
  }
  if (result.was_citizen_found) {
    return userInfo;
  }
  throw new providerErr.CitizenNotFound();
};

validateDocumentID = (documentID) => {
  if (!documentID || documentID == "") {
    throw new ProviderError("No document ID received", 400);
  }
};

module.exports = {
  getCitizenInfo,
};

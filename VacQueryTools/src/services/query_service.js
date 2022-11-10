const queryModel = require("../models/queryModel");

const queryAlgorithm = async (req, selectionFilters, projection) => {
  const startTimeStamp = new Date();
  const array = await accessDB(req, selectionFilters, projection);
  const endTimeStamp = new Date();
  const response = groupBy(array, projection);

  return {
    started_at: startTimeStamp,
    finished_at: endTimeStamp,
    duration_in_milliseconds: endTimeStamp - startTimeStamp,
    duration_in_seconds: (endTimeStamp - startTimeStamp) / 1000,
    response: response,
  };
};

const accessDB = async (req, selectionFilters, projection) => {
  var response = await req.reservationsDB
    .model("reservation", queryModel.querySchema)
    .find(selectionFilters, projection)
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
      //throw error
      return null;
    });

  return response;
};

const groupBy = (array, projection) => {
  const orderFields = getOrderFields(projection);
  console.log("my array is: " + array);
  console.log("grouping by: " + orderFields);

  const myResponse = {};

  for (let i = 0; i < array.length; i++) {
    let aux = myResponse;
    const element = array[i];
    console.log(element);

    for (let j = 0; j < orderFields.length; j++) {
      const selCriteria = orderFields[j];
      console.log(selCriteria);

      const elementValue = selCriteria + " " + element._doc[selCriteria];
      console.log(elementValue);

      if (j !== orderFields.length - 1) {
        //if j is not the last one
        if (aux[elementValue] === undefined || aux[elementValue] === null) {
          aux[elementValue] = {};
        }
        aux = aux[elementValue];
      } else {
        if (aux[elementValue] === undefined || aux[elementValue] === null) {
          aux[elementValue] = 1;
        } else {
          aux[elementValue] = aux[elementValue] + 1;
        }
      }
    }
  }

  console.log(myResponse);
  return myResponse;
};

const getOrderFields = (projection) => {
  const fields = projection.split(" ");
  const filterFields = [];
  for (let i = 0; i < fields.length; i++) {
    if (fields[i][0] !== "-") {
      filterFields.push(fields[i]);
    }
  }
  return filterFields;
};

module.exports = {
  queryAlgorithm,
};

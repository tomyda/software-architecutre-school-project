const fetch = require('node-fetch')
const { json } = require('express')
const { promisify } = require('util')
const config = require("./../config/config")

const configStruct = config.getConfig()
const filtersList = 'filtersList'
const expiration = 60

const createQueuePipeline = async (redisClient, token) => {

    var jsonAwnser

    await fetch(configStruct.admin_service.get_address,{ 
        headers: {"auth-token": token} 
      })
      .then((data) => data.json())
      .then((json) => {
        jsonAwnser = json
      })
      .catch((err) => console.log(err))

    filters = jsonAwnser

  if (filters.status) {
    throw filters
  }

  var validations = []
  var transformations = []
  var atEndValidations = []

  console.log(filters)
  // Build Filter "Pipeline" based on Filters from DB
  await filters.forEach((element) => {
    if(element.type == 'validation'){
      const Filter = require(`../validators/${element.name}`)
      const filterToUse = new Filter().Validate()
      if (element.atEnd) {
        atEndValidations.push(filterToUse)
      } else {
        validations.push(filterToUse)
      }
    }else{
      if(element.type == 'transformation'){
        const Transformation = require(`../transformations/${element.name}`)
        const transforamtionToUse = new Transformation().Transform()
        transformations.push(transforamtionToUse)
      }
    }
  })

  return {
    validationsArray: validations, 
    transformationsArray: transformations,
    lateValidationsArray: atEndValidations,
  }
}

module.exports = {
  createQueuePipeline,
}

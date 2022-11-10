const fetch = require('node-fetch')
const config = require("./../config/config")
const configStruct = config.getConfig()

const initConfig = async () => {

    var endpoints 
    await fetch(configStruct.admin_service.get_endpoints)
    .then((data) => data.json())
    .then((json) => {
        endpoints = json
    })
    .catch((err) => console.log(err))

    var idProvider
    var notificationSuccessful = []
    var notificationPending = []

    for (i = 0; i < endpoints.length; i++) {
        if(endpoints[i].service == "id provider"){
            idProvider = endpoints[i]
        }else if (endpoints[i].service == "notificationPending"){
            notificationPending.push(endpoints[i])
        }else if(endpoints[i].service == "notificationSuccessful"){
            notificationSuccessful.push(endpoints[i])
        }
    }

    return {idProvider: idProvider, notificationsSuccessfulArray: notificationSuccessful, notificationsPendingArray: notificationPending}
}


module.exports = {
    initConfig,
}
  
const firebase  = require('firebase-admin')
const config = require('./clientConfig.json')

let clientInitialized

const connector = {
    check: () => {
        if (!clientInitialized) {
            firebase.initializeApp(config)
            clientInitialized = true
        }
    },
    auth: () => {
        connector.check()
        return firebase.auth()
    }
}

module.exports = connector

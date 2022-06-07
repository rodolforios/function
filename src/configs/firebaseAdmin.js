const admin = require('firebase-admin')
const config = require('./adminConfig.json')

let adminInitialized

const connector = {
    check: () => {
        if (!adminInitialized) {
            admin.initializeApp({
                credential: admin.credential.cert(config),
                databaseURL: 'https://auth-a828a.firebaseio.com'
            })
            adminInitialized = true
        }
    },
    database: () => {
        connector.check()
        return admin.database()
    },
    auth: () => {
        connector.check()
        return admin.auth()
    }
}

module.exports = connector


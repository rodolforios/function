const functions = require('firebase-functions')

process.on("unhandledRejection", error => {
    console.error(error.stack)
})

const server = functions.https.onRequest(require('./server'))
const triggers = require('./src/triggers')

module.exports = {
    api: server,
    ...triggers
}
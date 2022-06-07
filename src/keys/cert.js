const fs = require('fs')

const cert = function() {
    return Buffer.from(fs.readFileSync(`${__dirname}/secret`), 'base64').toString()
}

const pubcert = function() {
    return Buffer.from(fs.readFileSync(`${__dirname}/secret.pub`), 'base64').toString()
}

module.exports = { cert, pubcert }
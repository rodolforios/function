const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const _ = require('lodash')

const translator = require('./src/user/translator')

// Server configs
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
    if (req.path === '/authenticate' && _.get(req, 'headers.authorization')) {
        const [ type, token ] = req.headers.authorization.split(' ');
        if (type && token && _.includes([ 'Basic', 'Bearer' ], type)) {
            req.auth = { type, token }
        }
    }
    next()
})

// Customers
app.post('/creates2authUser', translator.create)
app.post('/authenticate', translator.authenticate)
app.get('/pubkey', translator.pubkey)

module.exports = app

const validator = require('../components/validator')
const errors = require('../components/errors')
const interactor = require('./interactor')

const translator = {
    create: async function({ body: { requester, data: jwt }}, res, next) {
        try {
            validator({
                type: 'object',
                required: [ 'requester', 'jwt' ]
            }, { requester, jwt })
            res.json(await interactor.create({ requester, jwt }))
        } catch (error) {
            translator._log(error)
            errors.toHTTP(error, res)
        }
        next()
    },
    authenticate: async function({ auth: { type, token } }, res, next) {
        try {
            if (!token) throw new errors.UNAUTHORIZED('A basic or bearer authentication must be provided')
            res.json(await interactor.authenticate({ type, token }))
        } catch (error) {
            translator._log(error)
            errors.toHTTP(error, res)
        }
        next()
    },
    pubkey: function(req, res, next) {
        try {
            res.end(interactor.pubkey())
        } catch (error) {
            translator._log(error)
            errors.toHTTP(error, res)
        }
        next()
    },
    _log: console.error
}

module.exports = translator

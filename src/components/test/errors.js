const expect = require('expect.js')
const sinon = require('sinon')
const errors = require('../errors')

describe('The errors component', () => {

    let res, expectedStatus, expectedError

    beforeEach(() => {
        res = {
            status: function(status) {
                expect(status).to.be(expectedStatus)
                return this
            },
            json: function(error) {
                expect(error).to.eql(expectedError)
            }
        }
    })

    describe('when converting an error to http', () => {

        it('should convert a NOT_FOUND error to a 404 HTTP error', () => {
            expectedStatus = 404
            expectedError = { message: 'Resource not found' }
            errors.toHTTP(new errors.NOT_FOUND(), res)
        })

        it('should convert an ALREADY_CREATED error to a 409 HTTP error', () => {
            expectedStatus = 409
            expectedError = { message: 'Resource already created' }
            errors.toHTTP(new errors.ALREADY_CREATED(), res)
        })

        it('should convert an UNAUTHORIZED error to a 401 HTTP error', () => {
            expectedStatus = 401
            expectedError = { message: 'Invalid credentials' }
            errors.toHTTP(new errors.UNAUTHORIZED(), res)
        })

        it('should convert an UNCAUGHT_ERROR error to a 500 HTTP error', () => {
            expectedStatus = 500
            expectedError = { message: 'invalid something' }
            errors.toHTTP(new errors.UNCAUGHT_ERROR('invalid something'), res)
        })

        it('should convert an VALIDATION_ERROR error to a 422 HTTP error', () => {
            expectedStatus = 422
            expectedError = { message: 'invalid something' }
            errors.toHTTP(new errors.VALIDATION_ERROR('invalid something'), res)
        })

        it('should convert an LOCKED_RESOURCE error to a 423 HTTP error', () => {
            expectedStatus = 423
            expectedError = { message: 'ERROR MESSAGE' }
            errors.toHTTP(new errors.LOCKED_RESOURCE('ERROR MESSAGE'), res)
        })

        it('should convert an PAYMENT_REJECTED error to a 402 HTTP error', () => {
            expectedStatus = 402
            expectedError = { message: 'ERROR MESSAGE' }
            errors.toHTTP(new errors.PAYMENT_REJECTED('ERROR MESSAGE'), res)
        })

        it('should convert an FORBIDDEN error to a 403 HTTP error', () => {
            expectedStatus = 403
            expectedError = { message: 'ERROR MESSAGE' }
            errors.toHTTP(new errors.FORBIDDEN('ERROR MESSAGE'), res)
        })

        it('should convert an INVALID_FIELD error to a 400 HTTP error', () => {
            expectedStatus = 400
            expectedError = { message: 'ERROR MESSAGE' }
            errors.toHTTP(new errors.INVALID_FIELD('ERROR MESSAGE'), res)
        })

    })

})

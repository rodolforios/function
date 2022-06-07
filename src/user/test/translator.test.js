const expect = require('expect.js')
const sinon = require('sinon')
const translator = require('../translator')
const errors = require('../../components/errors')
const interactor = require('../interactor')

describe('the users translator', function() {
    
    const next = () => {}
    const res = { json: () => {} }
    let logStub, createStub, authenticateStub, pubkeyStub, toHttpStub

    before(() => {
        logStub = sinon.stub(translator, '_log')
    })

    after(() => {
        logStub.restore()
    })

    beforeEach(() => {
        toHttpStub = sinon.stub(errors, 'toHTTP')
        createStub = sinon.stub(interactor, 'create')
        authenticateStub = sinon.stub(interactor, 'authenticate')
        pubkeyStub = sinon.stub(interactor, 'pubkey')
    })

    afterEach(() => {
        createStub.restore()
        authenticateStub.restore()
        pubkeyStub.restore()
        toHttpStub.restore()
    })

    describe('when creating a new user', function() {

        it('should throw errors if requester or jwt are invalid', async function() {
            await translator.create({ body: {} }, res, next)
            await translator.create({ body: { requester: 'me' } }, res, next)
            await translator.create({ body: { data: 'jwt' } }, res, next)
            expect(toHttpStub.firstCall.args[0]).to.eql(new errors.VALIDATION_ERROR("data should have required property '.requester'"))
            expect(toHttpStub.secondCall.args[0]).to.eql(new errors.VALIDATION_ERROR("data should have required property '.jwt'"))
            expect(toHttpStub.thirdCall.args[0]).to.eql(new errors.VALIDATION_ERROR("data should have required property '.requester'"))
        })

        it('should send requester and jwt to interactor', async function() {
            await translator.create({ body: { requester: 'requester', data: 'jwt' }}, res, next)
            expect(createStub.firstCall.args[0]).to.eql({ requester: 'requester', jwt: 'jwt' })
        })

    })

    describe('when authenticating', function() {

        it('should return an error if there is no auth token', async function() {
            await translator.authenticate({ auth: { type: 'basic' }}, res, next)
            expect(toHttpStub.firstCall.args[0]).to.eql(new errors.UNAUTHORIZED('A basic or bearer authentication must be provided'))
        })

        it('should send the right params to interactor', async function() {
            await translator.authenticate({ auth: { type: 'basic', token: 'jwt' }}, res, next)
            expect(authenticateStub.firstCall.args[0]).to.eql({ type: 'basic', token: 'jwt' })
        })

    })

    describe('when pubkey', function() {

        it('should return an error if interactor throws', async function() {
            pubkeyStub.throws()
            await translator.pubkey({}, res, next)
            expect(toHttpStub.firstCall.args[0]).to.eql(new Error)
        })

        it('should send the right params to interactor', async function() {
            await translator.pubkey({}, res, next)
            expect(pubkeyStub.called).to.be.ok()
        })

    })

})
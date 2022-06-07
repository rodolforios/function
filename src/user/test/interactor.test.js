const expect = require('expect.js')
const sinon = require('sinon')
const interactor = require('../interactor')
const errors = require('../../components/errors')
const entity = require('../entity')

describe('the users interactor', function() {

    let appKeyStub, decodeStub, createStub, packStub, basicAuthStub, bearerAuthStub, verifyStub, hydrateStub

    beforeEach(() => {
        appKeyStub = sinon.stub(entity, 'appKey')
        decodeStub = sinon.stub(entity, 'decode')
        createStub = sinon.stub(entity, 'create')
        packStub = sinon.stub(entity, 'packJwt')
        basicAuthStub = sinon.stub(entity, 'basicAuth')
        verifyStub = sinon.stub(entity, 'verifyToken')
        hydrateStub = sinon.stub(entity, 'hydrate')
    })

    afterEach(() => {
        appKeyStub.restore()
        decodeStub.restore()
        createStub.restore()
        packStub.restore()
        basicAuthStub.restore()
        verifyStub.restore()
        hydrateStub.restore()
    })

    describe('when creating a new user', function() {

        const input = { requester: 'requester', jwt: 'jwt' }
        const blueprint = { app_key: 'appkey', reports: true }
        const decoded = {
            email         : 'email',
            password      : 'password',
            name          : 'name',
            cnpj          : 'cnpj',
            legal_name    : 'legal_name',
            nome_operacao : 'nome_operacao'
        }

        it('should throw for each required param not found', async function() {
            const testValidation = async missingParam => {
                decodeStub.resolves(Object.assign(decoded, { [`${missingParam}`] : null }))
                try { 
                    await interactor.create(input)
                } catch (error) {
                    expect(error).to.eql(new errors.VALIDATION_ERROR(`data should have required property '.${missingParam}'`))
                }
            }
            appKeyStub.resolves(blueprint)
            await Promise.all([ 'email', 'password', 'name', 'cnpj', 'legal_name' ].map(testValidation))
        })

        it('should send the right params to each entity function', async function() {
            appKeyStub.resolves(blueprint)
            decodeStub.resolves(decoded)
            createStub.resolves({ the: 'user', apps: blueprint})
            await interactor.create(input)
            expect(appKeyStub.firstCall.args[0]).to.eql('requester')
            expect(decodeStub.firstCall.args).to.eql(['jwt', 'appkey'])
            expect(createStub.firstCall.args).to.eql([blueprint, decoded])
            expect(packStub.firstCall.args[0]).to.eql({ the: 'user', apps: { reports: true }})
        })

    })

    describe('when authenticating', function() {

        it('should send the right params to each entity function', async function() {
            basicAuthStub.resolves('jwt')
            verifyStub.resolves({ uid: 'userId' })
            hydrateStub.resolves({ the: 'userData' })
            await interactor.authenticate({ type: 'Basic', token: 'token'})
            expect(basicAuthStub.firstCall.args[0]).to.eql('token')
            expect(verifyStub.firstCall.args[0]).to.eql('jwt')
            expect(hydrateStub.firstCall.args[0]).to.eql('userId')
            expect(packStub.firstCall.args[0]).to.eql({ the: 'userData' })
        })

        it('should send the right params to each entity function', async function() {
            verifyStub.resolves({ uid: 'userId' })
            await interactor.authenticate({ type: 'Bearer', token: 'jwt'})
            expect(basicAuthStub.called).not.to.be.ok()
            expect(verifyStub.firstCall.args[0]).to.eql('jwt')
        })

    })

})
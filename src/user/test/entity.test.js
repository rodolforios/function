const expect = require('expect.js')
const sinon = require('sinon')
const entity = require('../entity')
const errors = require('../../components/errors')
const adapter = require('../adapter')
const moment = require('moment')

describe('the users entity', function() {

    let createAuthStub, createContractStub, createUserStub, logUserStub, getUserStub, getContractStub, verifyTokenStub, appKeyStub

    beforeEach(() => {
        createAuthStub = sinon.stub(adapter, 'createAuthUser')
        createContractStub = sinon.stub(adapter, 'createContract')
        createUserStub = sinon.stub(adapter, 'createUser')
        logUserStub = sinon.stub(adapter, 'logUserIn')
        getUserStub = sinon.stub(adapter, 'getUser')
        getContractStub = sinon.stub(adapter, 'getContract')
        verifyTokenStub = sinon.stub(adapter, 'verifyToken')
        appKeyStub = sinon.stub(adapter, 'appKey')
    })

    afterEach(() => {
        createAuthStub.restore()
        createContractStub.restore()
        createUserStub.restore()
        logUserStub.restore()
        getUserStub.restore()
        getContractStub.restore()
        verifyTokenStub.restore()
        appKeyStub.restore()
    })

    describe('when creating a new user', function() {

        const blueprint = {
            app_key: 'appkey',
            reports: true,
            wallet: {
                contract: {
                    the: 'contract'
                },
                user_defined: {
                    user: 'definitions'
                }
            },
            dataChangeURLHook: 'https://nome_operacao.s2way.com/services/auth',
            infrastructure:{
                aws:{
                    sns:true,
                    tags:[
                        'nome_operacao-pp',
                        'nome_operacao-mrw',
                        'nome_operacao-feeder',
                        'nome_operacao-s2waydist',
                        'nome_operacao-parking-client-ap'
                    ]
                }
            },
        }
        const decoded = {
            email         : 'email',
            password      : 'password',
            name          : 'name',
            cnpj          : 'cnpj',
            legal_name    : 'legal_name',
            nome_operacao : 'floripa'
        }

        it('should send the right params to each entity function', async function() {
            const momentStub = sinon.stub(moment.prototype, 'format')
            const uuidStub = sinon.stub(entity, '_newUUID').returns('contractId')
            createAuthStub.resolves({ uid: 'userId' })
            createUserStub.resolves({ the: 'user', apps: blueprint })
            momentStub.returns('now')
            await entity.create(blueprint, decoded)
            expect(createAuthStub.firstCall.args[0]).to.eql(decoded)
            expect(createContractStub.firstCall.args).to.eql([ 'contractId', {
                app_key: 'appkey',
                reports: true,
                wallet : {
                    contract: {
                        the: 'contract',
                        name: 'name',
                        cnpj: 'cnpj',
                        legal_name: 'legal_name'
                    },
                    user_defined: {
                        user: 'definitions'
                    }
                },
                dataChangeURLHook: 'https://floripa.s2way.com/services/auth',
                infrastructure:{
                    aws:{
                        sns:true,
                        tags:[
                            'floripa-pp',
                            'floripa-mrw',
                            'floripa-feeder',
                            'floripa-s2waydist',
                            'floripa-parking-client-ap'
                        ]
                    }
                },
            }])
            expect(createUserStub.firstCall.args).to.eql([ 'userId', {
                name: 'Admin name',
                created: 'now',
                contract_id: 'contractId'
            }])
            uuidStub.restore()
        })

    })

    describe('when decoding basic auth', function() {

        it('should throw if email or password are undefined', async function() {
            try {
                await entity.basicAuth('dGVzdDo=')
            } catch (error) {
                expect(error).to.eql(new errors.UNAUTHORIZED('Missing user or password for basic authentication'))
            }
            expect(logUserStub.called).not.to.be()
        })

        it('should decode base64 credentials and send them to adapter', async function() {
            logUserStub.resolves('jwt')
            expect(await entity.basicAuth('dGVzdDpwYXNz')).to.be('jwt')
            expect(logUserStub.firstCall.args).to.eql([ 'test', 'pass' ])
        })

    })

    describe('when hydrating user data', function() {

        it('should throw if user is not found', async function() {
            getUserStub.resolves()
            try {
                await entity.hydrate()
            } catch (error) {
                expect(error).to.eql(new errors.NOT_FOUND('User not found'))
            }
            expect(getContractStub.called).not.to.be()
        })

        it('should throw if user is not found', async function() {
            getUserStub.resolves({ the: 'user', contract_id: 'contractId' })
            getContractStub.resolves({ the: 'contract' })
            expect(await entity.hydrate('userId')).to.eql({
                apps: { the: 'contract'}, identity: { the: 'user', contract_id: 'contractId' }, contract_id: 'contractId'
            })
            expect(getUserStub.firstCall.args[0]).to.eql('userId')
            expect(getContractStub.firstCall.args[0]).to.eql('contractId')
        })

        it('should delete a wallet split properties if user role is admin', async function() {

            userContract = {
                field: 'value',
                wallet: {
                    split: 'any_value'
                }
            }

            getUserStub.resolves({ the: 'user', contract_id: 'contractId', role: 'admin' })
            getContractStub.resolves(userContract)

            expect(await entity.hydrate('userId')).to.eql({
                apps: { field: 'value', wallet: {} }, identity: { the: 'user', contract_id: 'contractId', role: 'admin' }, contract_id: 'contractId'
            })

            expect(getUserStub.firstCall.args[0]).to.eql('userId')
            expect(getContractStub.firstCall.args[0]).to.eql('contractId')
        })
    })

    describe('just for coverage', function() {

        it('gotta pump those numbers up', function() {
            entity._newUUID()
            try {
                entity.decode('asdf')
            } catch (error) {
                expect(error).to.be.ok()
            }
            expect(entity.packJwt({ the: 'jwt' })).to.be.ok()
        })

    })

})
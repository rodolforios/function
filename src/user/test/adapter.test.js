const expect = require('expect.js')
const sinon = require('sinon')
const firebaseAdmin = require('../../configs/firebaseAdmin')
const firebaseClient = require('../../configs/firebaseClient')

describe('the users adapter', function() {

    let adminStub, clientStub, databaseStub

    before(() => {
        dbStub = sinon.stub(firebaseAdmin, 'database')
        adminAuthStub = sinon.stub(firebaseAdmin, 'auth')
        clientAuthStub = sinon.stub(firebaseClient, 'auth')
        adapter = require('../adapter')
    })

    after(() => {
        dbStub.restore()
        adminAuthStub.restore()
        clientAuthStub.restore()
    })

    it('when getting app key, should send the right params to firebase', async function() {
        const refStub = sinon.stub()
        const onceStub = sinon.stub()
        const valStub = sinon.stub()

        valStub.returns({ the: 'document' })
        onceStub.resolves({ val: valStub })
        refStub.returns({ once: onceStub })
        dbStub.returns({ ref: refStub })

        expect(await adapter.appKey('requester')).to.eql({ the: 'document' })
        expect(refStub.firstCall.args[0]).to.eql('/appkeys/requester')
    })

    it('when creating auth user, should send the right params to firebase', async function() {
        const createStub = sinon.stub()

        createStub.resolves({ some: 'thing' })
        adminAuthStub.returns({ createUser: createStub })

        expect(await adapter.createAuthUser({ user: 'data' })).to.eql({ some: 'thing' })
        expect(createStub.firstCall.args[0]).to.eql({ user: 'data' })
    })

    it('when creating contract, should send the right params to firebase', async function() {
        const refStub = sinon.stub()
        const setStub = sinon.stub()

        setStub.resolves({ the: 'document' })
        refStub.returns({ set: setStub })
        dbStub.returns({ ref: refStub })

        expect(await adapter.createContract('contractId', { the: 'contract' })).to.eql({ the: 'document' })
        expect(refStub.firstCall.args[0]).to.eql('/contracts/contractId')
        expect(setStub.firstCall.args[0]).to.eql({ the: 'contract' })
    })

    it('when creating user, should send the right params to firebase', async function() {
        const refStub = sinon.stub()
        const setStub = sinon.stub()

        setStub.resolves({ the: 'document' })
        refStub.returns({ set: setStub })
        dbStub.returns({ ref: refStub })

        expect(await adapter.createUser('userId', { the: 'user' })).to.eql({ the: 'document' })
        expect(refStub.firstCall.args[0]).to.eql('/users/userId')
        expect(setStub.firstCall.args[0]).to.eql({ the: 'user' })
    })

    it('when loggin user in, should send the right params to firebase', async function() {
        const signInWithEmailAndPasswordStub = sinon.stub()
        const getIdTokenStub = sinon.stub()

        getIdTokenStub.resolves('jwtToken')
        signInWithEmailAndPasswordStub.resolves({ some: 'thing' })
        clientAuthStub.returns({
            signInWithEmailAndPassword: signInWithEmailAndPasswordStub,
            currentUser: {
                getIdToken: getIdTokenStub
            }
        })

        expect(await adapter.logUserIn('email', 'pass')).to.eql('jwtToken')
        expect(signInWithEmailAndPasswordStub.firstCall.args).to.eql([ 'email', 'pass' ])
        expect(getIdTokenStub.called).to.be.ok()
    })

    it('when verifying token, should send the right params to firebase', async function() {
        const verifyStub = sinon.stub()

        verifyStub.resolves({ some: 'thing' })
        adminAuthStub.returns({ verifyIdToken: verifyStub })

        expect(await adapter.verifyToken('jwt')).to.eql({ some: 'thing' })
        expect(verifyStub.firstCall.args[0]).to.eql('jwt')
    })

    it('when getting a doc, should send the right params to firebase', async function() {
        const refStub = sinon.stub()
        const onceStub = sinon.stub()
        const valStub = sinon.stub()

        valStub.returns({ the: 'document' })
        onceStub.resolves({ val: valStub })
        refStub.returns({ once: onceStub })
        dbStub.returns({ ref: refStub })

        expect(await adapter._get('collection', 'id')).to.eql({ the: 'document' })
        expect(refStub.firstCall.args[0]).to.eql('/collection/id')

        expect(await adapter.getUser('userId')).to.eql({ the: 'document' })
        expect(refStub.secondCall.args[0]).to.eql('/users/userId')

        expect(await adapter.getContract('contractId')).to.eql({ the: 'document' })
        expect(refStub.thirdCall.args[0]).to.eql('/contracts/contractId')
    })


})
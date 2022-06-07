const firebaseAdmin = require('../configs/firebaseAdmin')
const firebaseClient = require('../configs/firebaseClient')

const adapter = {
    appKey: async requester => (await firebaseAdmin.database().ref('/appkeys/' + requester).once('value')).val(),
    createAuthUser: async data => {
        return await firebaseAdmin.auth().createUser(data)
    },
    createContract: async (id, contract) => {
        return await firebaseAdmin.database().ref('/contracts/' + id).set(contract)
    },
    createUser: async (id, user) => {
        return await firebaseAdmin.database().ref('/users/' + id).set(user)
    },
    logUserIn: async(email, password) => {
        await firebaseClient.auth().signInWithEmailAndPassword(email, password)
        return await firebaseClient.auth().currentUser.getIdToken()
    },
    getUser: async id => adapter._get('users', id),
    getContract: async id => adapter._get('contracts', id),
    verifyToken: async token => await firebaseAdmin.auth().verifyIdToken(token),
    _get: async (collection, id) => (await firebaseAdmin.database().ref(`/${collection}/${id}`).once('value')).val(),
}

module.exports = adapter
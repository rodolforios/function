const functions = require('firebase-functions')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const cert = require('./keys/cert')

const firebaseAdmin = require('./configs/firebaseAdmin')

const AUTH_SECRET = '61d3a80f-dcbe-44f9-bf05-e7b428fecef7'

const _packJWT = data => jwt.sign(data, cert.cert(), { expiresIn: "7 days", algorithm: 'RS256' })

const signalContractUpdate = functions.database.ref('/contracts/{contractId}')
    .onUpdate( async ({ after }, { params: { contractId } }) => {
        const contract = after.val()

        if (!contract.dataChangeURLHook) return null

        const user = await firebaseAdmin
            .database()
            .ref('/users')
            .orderByChild('contract_id')
            .equalTo(contractId)
            .once('value')

        if (!user.exists()) return null

        try {

            const options = {
                url: contract.dataChangeURLHook,
                method: 'POST',
                headers: {
                    secret: AUTH_SECRET,
                    Accept: '*/*',
                    'Content-Type': 'application/json'
                }
            }

            const response = await axios.request(options)

            if (response.status !== 200) {
                throw new Error('request error');
            }

        } catch (error) {
            console.error(error)
        }

    })

module.exports = {
    signalContractUpdate
}

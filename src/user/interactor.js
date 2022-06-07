const _ = require('lodash')
const entity = require('./entity')
const validator = require('../components/validator')

const interactor = {
    create: async ({ requester, jwt }) => {
        const contractBlueprint = await entity.appKey(requester)
        const decodedData = await entity.decode(jwt, contractBlueprint.app_key)
        validator({
            type: 'object',
            required: [ 'email', 'password', 'name', 'cnpj', 'legal_name', 'nome_operacao' ]
        }, decodedData)
        const user = await entity.create(contractBlueprint, decodedData)
        return entity.packJwt(_.omit(user, 'apps.app_key'))
    },
    authenticate: async ({ type, token }) => {
        const jwtToken = await (type === 'Basic' ? entity.basicAuth(token) : token)
        const { uid: userId } = await entity.verifyToken(jwtToken)
        const userData = await entity.hydrate(userId)
        return entity.packJwt(userData)
    },
    pubkey: entity.pubKey
}

module.exports = interactor
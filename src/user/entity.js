//const uuid = require('uuid/v4')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const { UNAUTHORIZED, NOT_FOUND } = require('../components/errors')
const adapter = require('./adapter')
const { cert, pubcert } = require('../keys/cert')

const entity = {
    appKey: adapter.appKey,
    decode: (data, key) => jwt.verify(data, key),
    create: async (contractBlueprint, decoded) => {
        const contractId = entity._newUUID()
        const { uid: userId } = await adapter.createAuthUser(decoded)

        const urlHook = contractBlueprint.dataChangeURLHook;
        delete contractBlueprint.dataChangeURLHook;

        const infraAwsTags = contractBlueprint.infrastructure.aws.tags;
        contractBlueprint.infrastructure.aws.tags = [];
        infraAwsTags.forEach((tag) => {
            contractBlueprint.infrastructure.aws.tags.push(_.replace(tag, 'nome_operacao', decoded.nome_operacao))
        })

        const contract = {
            ...contractBlueprint,
            dataChangeURLHook: _.replace(urlHook, 'nome_operacao', decoded.nome_operacao),
            wallet: {
                contract: {
                    ...contractBlueprint.wallet.contract,
                    name: decoded.name,
                    cnpj: decoded.cnpj,
                    legal_name: decoded.legal_name
                },
                user_defined: contractBlueprint.wallet.user_defined
            }
        }
        await adapter.createContract(contractId, contract)
        const user = {
            name: `Admin ${decoded.name}`,
            created: moment().format(),
            contract_id: contractId
        }
        await adapter.createUser(userId, user)
        return { apps: contract, identity: user, contract_id: contractId }
    },
    basicAuth: async encoded => {
        const [ email, password ] = Buffer.from(encoded, 'base64').toString().split(':')
        if (!(email && password)) throw new UNAUTHORIZED('Missing user or password for basic authentication')
        return await adapter.logUserIn(email, password)
    },
    verifyToken: adapter.verifyToken,
    hydrate: async userId => {
        const user = await adapter.getUser(userId)
        if (!user) throw new NOT_FOUND('User not found')
        const contract = await adapter.getContract(user.contract_id)
        if (user.role == 'admin') delete contract.wallet.split
        return { apps: contract, identity: user, contract_id: user.contract_id }
    },
    packJwt: data => jwt.sign(data, cert(), { expiresIn: "7 days", algorithm: 'RS256' }),
    pubKey: pubcert,
    _newUUID: () => uuidv4().replace(/-/g, '')
}

module.exports = entity
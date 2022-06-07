const Ajv = require('ajv')
const errors = require('../components/errors')

module.exports = (schema, data) => {
    const ajv = new Ajv({ removeAdditional: true })
    const valid = ajv.validate(schema, data)
    if (!valid)
        throw new errors.VALIDATION_ERROR(ajv.errorsText())
}

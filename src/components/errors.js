
class ALREADY_CREATED {
    constructor(message, info) {
        this.name = 'ALREADY_CREATED'
        this.message = message || 'Resource already created'
        this.info = info || {}
    }
}

class FORBIDDEN {
    constructor(message, info) {
        this.name = 'FORBIDDEN'
        this.message = message
        this.info = info
    }
}

class LOCKED_RESOURCE {
    constructor(message, info) {
        this.name = 'LOCKED_RESOURCE'
        this.message = message
        this.info = info
    }
}

class INVALID_FIELD {
    constructor(message, info) {
        this.name = 'INVALID_FIELD'
        this.message = message
        this.info = info || {}
    }
}

class NOT_FOUND {
    constructor(message, info) {
        this.name = 'NOT_FOUND'
        this.message = message || 'Resource not found'
        this.info = info || {}
    }
}

class PAYMENT_REJECTED {
    constructor(message, info) {
        this.name = 'PAYMENT_REJECTED'
        this.message = message
        this.info = info
    }
}

class UNAUTHORIZED {
    constructor(message, info) {
        this.name = 'UNAUTHORIZED'
        this.message = message || 'Invalid credentials'
        this.info = info || {}
    }
}

class UNCAUGHT_ERROR {
    constructor(message, info) {
        this.name = 'UNCAUGHT_ERROR'
        this.message = message
        this.info = info || {}
    }
}

class VALIDATION_ERROR {
    constructor(message, info) {
        this.name = 'VALIDATION_ERROR'
        this.message = message
        this.info = info || {}
    }
}

const toHTTP = (error, res) => {

    const { message } = error

    let status = 500
    if (error instanceof ALREADY_CREATED) status = 409
    if (error instanceof FORBIDDEN) status = 403
    if (error instanceof LOCKED_RESOURCE) status = 423
    if (error instanceof INVALID_FIELD) status = 400
    if (error instanceof NOT_FOUND) status = 404
    if (error instanceof PAYMENT_REJECTED) status = 402
    if (error instanceof UNAUTHORIZED) status = 401
    if (error instanceof VALIDATION_ERROR) status = 422

    return res.status(status).json({ message })
}

module.exports = { 
    ALREADY_CREATED,
    FORBIDDEN,
    LOCKED_RESOURCE,
    INVALID_FIELD,
    NOT_FOUND,
    PAYMENT_REJECTED,
    UNAUTHORIZED,
    UNCAUGHT_ERROR,
    VALIDATION_ERROR,
    toHTTP
}
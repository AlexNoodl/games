export const registerRequest = {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
        username: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
    }
}

export const loginRequest = {
    type: 'object',
    required: ['login', 'password'],
    properties: {
        login: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
    }
}

export const forgotPasswordRequest = {
    type: 'object',
    required: ['email'],
    properties: {
        email: {
            type: 'string'
        },
    }
}

export const resetPasswordRequest = {
    type: 'object',
    required: ['password'],
    properties: {
        password: {
            type: 'string'
        },
    }
}

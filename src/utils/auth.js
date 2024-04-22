import * as jose from 'jose'

export const logout = () => {
    localStorage.removeItem('idToken')
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('refreshToken')
    window.location.reload()
}

export const getRole = () => {
    const idToken = localStorage.getItem('idToken')
    if (idToken) {
        const decoded = jose.decodeJwt(idToken)
        if (decoded.iss == process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ISSUER) {
            return 'USER'
        } else if (decoded.iss == process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ADMIN_ISSUER) {
            return 'ADMIN'
        }
    }
    return null
}

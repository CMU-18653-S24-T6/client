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
        if (decoded.iss == "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_vD2YcU8XD") {
            return 'USER'
        } else if (decoded.iss == "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_Xl3U0uJws") {
            return 'ADMIN'
        }
    }
    return null
}

export const getUid = () => {
    const token = localStorage.getItem('token')
    if (token) {
        const decoded = jose.decodeJwt(token)
        return decoded.sub
    }
    return null
}

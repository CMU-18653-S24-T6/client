export const logout = () => {
    localStorage.removeItem('idToken')
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('refreshToken')
    window.location.reload()
}

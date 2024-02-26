'use client'

import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import Link from 'next/link'

const signinWithPwd = async setError => {
    const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_AWS_REGION })
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const input = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    }
    const command = new InitiateAuthCommand(input)
    const response = client
        .send(command)
        .then(data => {
            console.log('Success:', data)
            localStorage.setItem('token', data.AuthenticationResult.AccessToken)
            localStorage.setItem('email', email)
            localStorage.setItem('refreshToken', data.AuthenticationResult.RefreshToken)
            localStorage.setItem('idToken', data.AuthenticationResult.IdToken)
            window.location = '/'
        })
        .catch(error => {
            setError(error.message)
        })
}

const signUpWithPwd = async (setError, setPage) => {
    const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_AWS_REGION })
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const input = {
        ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
    }
    const command = new SignUpCommand(input)
    const response = client
        .send(command)
        .then(data => {
            console.log('Success:', data)
            sessionStorage.setItem('email', email)
            setPage('verify')
        })
        .catch(error => {
            setError(error.message)
        })
}

const confirmSignUp = async (setError, setPage) => {
    const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_AWS_REGION })
    const email = sessionStorage.getItem('email')
    const code = document.getElementById('code').value
    const input = {
        ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
    }
    const command = new ConfirmSignUpCommand(input)
    const response = client
        .send(command)
        .then(data => {
            console.log('Success:', data)
            setPage('login')
        })
        .catch(error => {
            setError(error.message)
        })
}

const LogInOrSignUp = ({ setPage }) => {
    const [error, setError] = useState(null)
    return (
        <div className="flex flex-col gap-4 items-center min-w-72 max-w-72">
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                id="email"
                error={error}
                onChange={() => setError(null)}
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                id="password"
                onChange={() => setError(null)}
                error={error}
                helperText={error}
            />
            <Button variant="contained" fullWidth onClick={() => signinWithPwd(setError)}>
                Log In
            </Button>
            <Button variant="outlined" fullWidth onClick={() => signUpWithPwd(setError, setPage)}>
                Sign Up
            </Button>
            <hr />
            <Button variant="outlined" fullWidth disabled>
                Log In with Google
            </Button>
            <Button variant="outlined" fullWidth disabled>
                Log In with GitHub
            </Button>
            <Link href="/" className="w-full">
                <Button variant="outlined" fullWidth>
                    Continue as Guest
                </Button>
            </Link>
        </div>
    )
}

const Verify = ({ setPage }) => {
    const [error, setError] = useState(null)
    return (
        <div className="flex flex-col gap-4 items-center min-w-64">
            <TextField
                label="Verification Code"
                variant="outlined"
                type="password"
                fullWidth
                error={error}
                helperText={error}
                id="code"
            />
            <Button variant="contained" fullWidth onClick={() => confirmSignUp(setError, setPage)}>
                Verify
            </Button>
        </div>
    )
}

export default function Home() {
    const [page, setPage] = useState('login') // 'login' or 'verify'
    return (
        <>
            <main className="flex flex-col min-h-screen items-center justify-center gap-64 p-4">
                <div className="flex items-center justify-center gap-12 flex-wrap">
                    <div className="flex flex-col gap-6 max-w-96">
                        <h1 className="text-4xl font-bold">Welcome to EventPeak</h1>
                        <div className="flex flex-col gap-2">
                            <p className="font-thin">A hightly available ticket flash sale system.</p>
                            <p className="font-thin">
                                At EventPeak, we offer the best events in your city. We have a wide range of events,
                                from concerts to sports and everything in between. We offer the best prices and the best
                                availability.
                            </p>
                            <p className="font-thin">
                                This project was developed for CMU course 18653-SV-S24 by Team 6.
                            </p>
                        </div>
                    </div>
                    {page === 'login' && <LogInOrSignUp setPage={setPage} />}
                    {page === 'verify' && <Verify setPage={setPage} />}
                </div>
            </main>
        </>
    )
}

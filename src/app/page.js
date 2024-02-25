import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

export default function Home() {
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
                    <div className="flex flex-col gap-4 items-center min-w-64">
                        <TextField label="Email" variant="outlined" fullWidth type="email" />
                        <TextField label="Password" variant="outlined" type="password" fullWidth />
                        <Button variant="contained" fullWidth>
                            Log In or Sign Up
                        </Button>
                        <Button variant="outlined" fullWidth>
                            Log In with Google
                        </Button>
                        <Button variant="outlined" fullWidth>
                            Log In with GitHub
                        </Button>
                        <hr />
                        <Button variant="outlined" fullWidth>
                            Continue as Guest
                        </Button>
                    </div>
                </div>
            </main>
        </>
    )
}

'use client'

import { Button } from '@mui/material'
import { eventRequester } from '@/utils/requester'

export default function DeleteButton({ id }) {
    const deleteEvent = async id => {
        await eventRequester.delete(`/${id}`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        })
        window.location.reload()
    }
    return (
        <Button
            variant="outlined"
            color="error"
            onClick={() => {
                deleteEvent(id)
            }}
        >
            Delete Event
        </Button>
    )
}

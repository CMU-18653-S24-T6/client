import React from 'react'
import Button from '@mui/material/Button'
import Link from 'next/link'

import { eventRequester } from '@/utils/requester'
import moment from 'moment'

export default async function EventPage() {
    const events = await eventRequester.get('/')
    return (
        <div className="page">
            <div className="flex justify-between align-middle items-center">
                <h1>Manage Events</h1>
                <Link href="/event-admin/create-event">
                    <Button>+ Create Event</Button>
                </Link>
            </div>
            <p className="text-gray-100">
                Below is the list of events that are currently available. Please find the event details below.
            </p>
            <ul className="flex flex-col gap-3">
                {events.data.map(event => (
                    <li key={event.id} className="my-8 flex justify-between">
                        <div className="flex flex-col gap-2 items-start">
                            <h2 className="mb-1">{event.eventName}</h2>
                            <p>{moment(event.eventStartTime).format('MMM DD, YYYY hh:mm')}</p>
                            <p className="text-gray-300 font-light">{event.description}</p>
                            <Button variant="outlined" color="error">
                                Delete Event
                            </Button>
                        </div>
                        <div>
                            <img
                                src={process.env.NEXT_PUBLIC_EVENT_IMG_PREFIX + event.imageUri}
                                alt={event.eventName}
                                height="300"
                                width="400"
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

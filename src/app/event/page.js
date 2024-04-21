import React from 'react'
import Button from '@mui/material/Button'
import Link from 'next/link'

import { eventRequester } from '@/utils/requester'
import moment from 'moment'

export default async function EventPage() {
    const events = await eventRequester.get('/')
    return (
        <div className="page">
            <h1>Welcome to ZenTicket</h1>
            <p className="text-gray-100">
                At Zenticket, we offer you with the best performance, events, and shows with competitive prices. Please
                find the list of recent events below.
            </p>
            <ul className="flex flex-col gap-3">
                {events.data.map(event => (
                    <li key={event.id} className="my-8 flex justify-between">
                        <div className="flex flex-col gap-2 items-start">
                            <h2 className="mb-1">{event.eventName}</h2>
                            <p>{moment(event.eventStartTime).format('MMM DD, YYYY hh:mm')}</p>
                            <p className="text-gray-300 font-light">{event.description}</p>
                            <Link href={`/event/${event.id}`}>
                                <Button variant="contained" color="primary">
                                    Buy Tickets
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <img
                                src={NEXT_PUBLIC_EVENT_IMG_PREFIX + event.imageUri}
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

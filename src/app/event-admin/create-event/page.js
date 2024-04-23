'use client'

import { FormControl, FormLabel, Input, InputLabel, TextField, Button } from '@mui/material'
import { useState } from 'react'
import { eventRequester } from '@/utils/requester'
import moment from 'moment'
import s3Upload from '@/utils/s3Upload'

export default function Page() {
    const [numTG, setNumTG] = useState(1)
    const [file, setFile] = useState(null)
    const createList = num => {
        let list = []
        for (let i = 0; i < num; i++) {
            list.push(i)
        }
        return list
    }

    const submitForm = async () => {
        // submit image
        let imgUrl
        if (file) {
            imgUrl = await s3Upload(file)
        }

        console.log(imgUrl)
        // submit event
        const formData = {
            eventName: document.getElementById('event-name').value,
            description: document.getElementById('event-description').value,
            eventStartTime: moment(document.getElementById('event-start-time').value).unix(),
            releaseTime: moment(document.getElementById('ticket-release-time').value).unix(),
            ticketGroups: createList(numTG).map((_, i) => {
                return {
                    groupName: document.getElementById(`ticket-group-name-${i}`).value,
                    price: parseFloat(document.getElementById(`ticket-group-price-${i}`).value),
                    stock: parseInt(document.getElementById(`ticket-group-stock-${i}`).value),
                }
            }),
            imageUri: imgUrl,
        }
        eventRequester.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        const res = await eventRequester.post('/', formData)
        console.log(res)
        window.location.href = '/event-admin'
    }

    return (
        <div className="page">
            <h1>Create an Event</h1>
            <form className="flex flex-col gap-12" id="event-form">
                <div className="flex flex-col gap-4">
                    <h2>Basic Info</h2>
                    <FormControl>
                        <FormLabel htmlFor="event-name">Event Name</FormLabel>
                        <Input id="event-name" />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="event-description">Description</FormLabel>
                        <TextField id="event-description" multiline minRows={5} />
                    </FormControl>
                    <FormControl htmlFor="event-start-time">
                        <FormLabel>Start Time</FormLabel>
                        <Input id="event-start-time" type="datetime-local" />
                    </FormControl>
                    <FormControl htmlFor="ticket-release-time">
                        <FormLabel>Ticket Release Time</FormLabel>
                        <Input id="ticket-release-time" type="datetime-local" />
                    </FormControl>
                </div>
                <div className="">
                    <h2>Image</h2>
                    <div className="flex gap-2 item-end">
                        <Button variant="contained" component="label">
                            Upload
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={e => {
                                    setFile(e.target.files[0])
                                }}
                            />
                        </Button>
                        <span className="font-thin">{file ? file.name : 'No file selected'}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h2>Ticket Groups</h2>
                    <FormControl htmlFor="num-tg">
                        <FormLabel>Number of Ticket Groups</FormLabel>
                        <Input
                            id="num-tg"
                            type="number"
                            defaultValue={1}
                            onChange={e => {
                                setNumTG(e.target.value)
                            }}
                        />
                    </FormControl>
                    <div className="pl-4 gap-4 flex flex-col">
                        {createList(numTG).map((_, i) => {
                            return (
                                <div key={i} className="flex gap-4">
                                    <FormControl className="justify-center">
                                        <span>{i + 1}</span>
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor={`ticket-group-name-${i}`}>Ticket Group Name</InputLabel>
                                        <Input id={`ticket-group-name-${i}`} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor={`ticket-group-price-${i}`}>Price</InputLabel>
                                        <Input id={`ticket-group-price-${i}`} type="number" />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor={`ticket-group-stock-${i}`}>Stock</InputLabel>
                                        <Input id={`ticket-group-stock-${i}`} type="number" />
                                    </FormControl>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button variant="contained" onClick={submitForm}>
                        Create Event
                    </Button>
                </div>
            </form>
        </div>
    )
}

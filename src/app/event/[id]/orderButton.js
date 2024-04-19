'use client'

import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'

import { orderRequester } from '@/utils/requester'

export default function OrderButton({ data, eventData }) {
    const [checkOutStep, setCheckOutStep] = useState(0)
    const [stock, setStock] = useState('pending')
    const handleOpen = () => setCheckOutStep(1)
    const handleClose = () => setCheckOutStep(0)

    const Step1 = () => {
        useEffect(() => {
            orderRequester.get(`/events/${eventData.id}`).then(res => {
                const stockData = res.data
                const stock = stockData.ticketGroups.find(group => group.groupName === data.groupName).stock
                setTimeout(() => {
                    setStock(stock)
                }, 300)
            })
        }, [])
        return (
            <>
                <h2 id="child-modal-title">Confirm Your Order</h2>
                <p className="text-sm text-gray-200">Event: {eventData.eventName}</p>
                <p className="text-sm text-gray-200">Group: {data.groupName}</p>
                <p className="text-sm text-gray-200">Price: ${data.price}</p>
                <hr className="my-2" />
                {stock === 'pending' ? (
                    <p className="text-sm text-gray-200 py-1">Checking stock...</p>
                ) : (
                    <Button onClick={() => setCheckOutStep(2)} variant="contained">
                        Place Your Order
                    </Button>
                )}
                <Button onClick={handleClose}>Cancel</Button>
            </>
        )
    }

    const Step2 = () => {
        const [ticketData, setTicketData] = useState(null)
        useEffect(() => {
            orderRequester.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            orderRequester
                .post('/orders', {
                    eventId: eventData.id,
                    ticketGroupId: data.id,
                })
                .then(res => {
                    setTicketData(res.data)
                    console.log(res)
                })
        }, [])
        return (
            <>
                <h2 id="child-modal-title">{ticketData ? 'Your Tickets are Reerved' : 'Please Wait'}</h2>
                <p className="text-sm text-gray-200">Event: {eventData.eventName}</p>
                <p className="text-sm text-gray-200">Group: {data.groupName}</p>
                <p className="text-sm text-gray-200">Price: ${data.price}</p>
                <hr className="my-2" />
                <h3>Your Ticket Information</h3>
                <p className="text-sm text-gray-200">Ticket ID: {ticketData?.ticket_id}</p>
                <p className="text-sm text-gray-200">Order ID: {ticketData?.order_id}</p>
                <Button
                    variant="contained"
                    disabled={!ticketData}
                    sx={{ mt: 1 }}
                    onClick={() => {
                        window.location.href = `/mockPayment?order_id=${ticketData?.order_id}&ticket_id=${ticketData?.ticket_id}&price=${data.price}`
                    }}
                >
                    Go To Payment
                </Button>
            </>
        )
    }

    return (
        <>
            <Button disabled={data.stock === 0} onClick={handleOpen}>
                Order Now
            </Button>
            <Modal open={!!checkOutStep} onClose={handleClose}>
                <div className="flex flex-col absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-950 bg-opacity-90 p-8 rounded-md min-w-96">
                    {checkOutStep === 1 && <Step1 />}
                    {checkOutStep === 2 && <Step2 />}
                </div>
            </Modal>
        </>
    )
}

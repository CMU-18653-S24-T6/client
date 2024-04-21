'use client'

import { orderRequester } from '@/utils/requester'
import { useEffect, useState } from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Link from 'next/link'

export default function Page() {
    const [orders, setOrders] = useState([])
    useEffect(() => {
        orderRequester.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        orderRequester.get('/orders').then(res => {
            setOrders(res.data)
        })
    }, [])
    return (
        <div className="page">
            <h1>Manage Orders</h1>
            <p>Please find user orders listed below</p>
            <hr className="my-2" />
            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Event Name</TableCell>
                            <TableCell align="left">Ticket Type</TableCell>
                            <TableCell align="left">Ticket ID</TableCell>
                            <TableCell align="left">Price</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">User Id</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="left">
                                    <Link href={`/event/${order.ticket.ticketGroup.event.id}`}>
                                        {order.ticket.ticketGroup.event.eventName}
                                    </Link>
                                </TableCell>
                                <TableCell align="left">{order.ticket.ticketGroup.groupName}</TableCell>
                                <TableCell align="left">{order.id}</TableCell>
                                <TableCell align="left">${order.price}</TableCell>
                                <TableCell align="left">{order.status}</TableCell>
                                <TableCell align="left">{order.userId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

import { eventRequester, orderRequester } from '@/utils/requester'
import moment from 'moment'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import OrderButton from './orderButton'
import Link from "next/link";
import { Button } from '@mui/material'

export const revalidate = 15
export const dynamic = 'force-dynamic'

export default async function EventPage({ params }) {
    const { id } = params // event id
    const events = await eventRequester.get(`/`)
    const event = events.data.find(event => event.id === id)
    let stockData
    try {
        const stock = await orderRequester.get(`/events/${id}`)
        stockData = stock.data
    } catch (e) {
        console.error(e)
        stockData = { ticketGroups: [] }
    }

    if (!stockData.ticketGroups) {
        stockData = { ticketGroups: [] }
    }

    return (
        <div className="page flex justify-between">
            <div className="flex justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h1>{event.eventName}</h1>
                        <p className="text-gray-300">{moment(event.eventStartTime).format('MMM DD, YYYY HH:MM')}</p>
                        <p>{event.description}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="my-0">Ticket Information</h2>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Availability</TableCell>
                                        <TableCell align="right">Order</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stockData.ticketGroups.map(row => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="left">
                                                {row.groupName}
                                            </TableCell>
                                            <TableCell align="right">${row.price}</TableCell>
                                            <TableCell align="right">{row.stock}</TableCell>
                                            <TableCell align="right">
                                                <OrderButton data={row} eventData={event}>
                                                    Order Now
                                                </OrderButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Link href={`/review/${id}`}>
                                <Button>Event Review</Button>
                            </Link>
                        </TableContainer>

                    </div>
                </div>
            </div>
            <div>
                <img
                    src={process.env.NEXT_PUBLIC_EVENT_IMG_PREFIX + event.imageUri}
                    alt={event.eventName}
                    height="300"
                    width="400"
                />
            </div>
        </div>
    )
}

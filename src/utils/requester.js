import axios from 'axios'

const eventRequester = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_EVENT_ROOT,
    headers: {
        'Content-Type': 'application/json',
    },
})

const orderRequester = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_ORDER_ROOT,
    headers: {
        'Content-Type': 'application/json',
    },
})

const reviewRequester = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_REVIEW_ROOT,
    headers: {
        'Content-Type': 'application/json',
    },
})

const profileRequester = axios.create({
     baseURL: process.env.NEXT_PUBLIC_BACKEND_PROFILE_ROOT,
     headers: {
         'Content-Type': 'application/json',
     },
})

export { eventRequester, orderRequester, reviewRequester, profileRequester}

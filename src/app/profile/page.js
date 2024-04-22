'use client'

import { profileRequester } from '@/utils/requester'
import { useState, useEffect } from "react"
import './App.css';
import { Spinner, Toast } from 'react-bootstrap'
import EditProfile from './component/EditProfile'
import NewProfile from './component/NewProfile'

export default function Profile() {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(false);

    const [showToast, setShowToast] = useState(false);

    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        profileRequester.defaults.headers.common['Authorization'] = localStorage.getItem('token')

        profileRequester.get('/profile').then(response => {
            setData(response.data);
            console.log(response.data);
            setLoading(false);
        }).catch(error => {
            setErrorMsg(error.response.data.msg);
            setShowToast(true);
            setLoading(false);
        })
    }, []);

    if (loading) {
        return (<div className="App">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>)
    }

    const handleSubmit = (newData) => {
        setLoading(true);
        console.log(newData);
        profileRequester.post('/profile', newData).then(response => {
            setData(response.data);
            setLoading(false);
        }).catch(error => {
            setErrorMsg(error.response.data.message);
            setLoading(false);
            setShowToast(true);
        });

        setEditing(false);
    }

    return (
        <div className="App">

            {showToast ? (
                <Toast className="d-inline-block m-1"
                    bg="secondary">
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Notice</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {errorMsg}
                    </Toast.Body>
                </Toast>
            ) :
                (editing ? (<EditProfile data={data} onSubmit={handleSubmit} />) : (<NewProfile data={data} onEdit={() => { setEditing(true) }} />))}
        </div>
    );
}

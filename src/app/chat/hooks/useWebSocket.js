import React, { useEffect, useState } from 'react';

export default function useWebSocket() {
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            const wsInstance = new WebSocket(`wss://57c0f9smi0.execute-api.us-west-2.amazonaws.com/default/?accessToken=${encodeURIComponent(accessToken)}`);

            wsInstance.onopen = () => {
                console.log('WebSocket connection established');
            };

            wsInstance.onmessage = () => {
                console.log(e.data);
                let body = JSON.parse(e.data);

                if (body.senderId !== clientId) {
                    if (chatList.find(item => item === body.senderId) === undefined) {
                        setChatList(prev => [...prev, body.senderId]);
                    }
                }
                if (currentChat) {
                    if ((body.senderId == clientId && body.recipientId == currentChat) ||
                        (body.senderId == currentChat && body.recipientId == clientId)) {
                        if (body.recipientId == currentChat) {
                            setMessageList(prev => [...prev, {
                                direction: 1,
                                message: body.content
                            }]);
                        } else {
                            setMessageList(prev => [...prev, {
                                direction: 0,
                                message: body.content
                            }]);
                        }
                    }
                }
            }
            wsInstance.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            wsInstance.onclose = () => {
                console.log('WebSocket connection closed');
            };

            setWs(wsInstance);

            // Cleanup on component unmount
            return () => {
                wsInstance.close();
            };
        }
    }, []); // Empty dependency array ensures this effect runs only once

    return ws;
}
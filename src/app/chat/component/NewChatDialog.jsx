import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Sidebar,
    ConversationList,
    Conversation,
    ConversationHeader,
    MessageGroup,
    Avatar
} from "@chatscope/chat-ui-kit-react"
import { useEffect, useState, useRef } from "react"
import { chatRequester } from '@/utils/requester'
import { getRole, getUid } from '@/utils/auth'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import  useWebSocket from '../hooks/useWebSocket';

const ChatDialog = (props) => {

    const [clientId, setClientId] = useState('');
    const clientIdRef = useRef(clientId);
    const [role, setRole] = useState('');
    const [chatList, setChatList] = useState([]);
    const chatListRef = useRef(chatList);
    const [currentChat, setCurrentChat] = useState(null);
    const currentChatRef = useRef(currentChat);
    const [messageList, setMessageList] = useState([]);
    const [sendState, setSendState] = useState(false);

    useEffect(() => {
        const currentRole = getRole()
        const identity = currentRole === 'ADMIN' ? 'admin' : getUid();
        setClientId(identity)
        setRole(currentRole)
        chatRequester.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        if (currentRole === 'ADMIN') {
            chatRequester.get('/contacts').then(response => {
                console.info('Admin access: return history customer list: ')
                console.info(response.data);
                setChatList(response.data);
            }).catch(e => {
                console.error(e);
            });
        } else {
            console.info('Customer access: return admin')
            setCurrentChat('admin');
        }
    }, []);

    useEffect(() => {
        chatRequester.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        if (currentChat) {
            chatRequester.get(`/history/${currentChat}`).then(response => {
                setMessageList(response.data.map(item => {
                    return {
                        direction: item.recipientId === currentChat ? 1 : 0,
                        message: item.content
                    }
                }));
            }).catch(e => {
                console.error(e);
            });
        }
    }, [currentChat]);

    useEffect(() => {
        chatListRef.current = chatList;
    }, [chatList]);

    useEffect(() => {
        currentChatRef.current = currentChat;
    }, [currentChat]);

    useEffect(() => {
        clientIdRef.current = clientId;
    }, [clientId]);

    function useWebSocket() {
        const [ws, setWs] = useState(null);

        useEffect(() => {
            const accessToken = localStorage.getItem('token');
            if (accessToken) {
                const wsInstance = new WebSocket(`wss://57c0f9smi0.execute-api.us-west-2.amazonaws.com/default/?accessToken=${encodeURIComponent(accessToken)}`);

                wsInstance.onopen = () => {
                    console.log('WebSocket connection established');
                    setSendState(true);
                };

                wsInstance.onmessage = (e) => {
                    console.log(e.data);
                    let body = JSON.parse(e.data);

                    if (body.senderId !== clientId) {
                        const currentChatList = chatListRef.current;
                        console.log("Chat list when message received:", currentChatList);
                        if (!currentChatList.find(item => item === body.senderId)) {
                            setChatList(prev => [...prev, body.senderId]);
                        }
                    }

                    console.log("current chatting with user: ", currentChatRef.current);
                    if (currentChatRef.current) {
                        const currentClientId = clientIdRef.current;
                        console.log("current client id is: ", currentClientId);
                        setMessageList(prev => [...prev, {
                            direction: 0,
                            message: body.content
                        }]);
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

    const ws = useWebSocket();

    const sendMsg = (msg) => {
        let payload = {
            action: "message",
            message: {
                senderId: clientId,
                recipientId: role === 'ADMIN' ? currentChat : 'admin',
                content: msg,
                timestamp: Date.now()
            }
        }
        setMessageList(prev => [...prev, {
            direction: 1,
            message: payload.message.content
        }]);
        console.log(payload);
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
    }

    return (
        <>
            <MainContainer>
                <Sidebar position={"left"}>
                    <ConversationList>
                        {
                            chatList.map((item, index) => {
                                return (<Conversation key={index} name={item.name}
                                                      active={currentChat === item}
                                                      onClick={e => setCurrentChat(item)}>
                                    <Avatar src={"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"}/>
                                </Conversation>);
                            })}
                    </ConversationList>
                </Sidebar>
                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Content userName={currentChat?.name}/>
                    </ConversationHeader>
                    <MessageList>
                        {messageList.map((msg, index) => {
                            return (<MessageGroup key={index} direction={msg.direction}>
                                <MessageGroup.Messages>
                                    <Message model={{
                                        type: 'text',
                                        payload: msg.message
                                    }}/>
                                </MessageGroup.Messages>
                            </MessageGroup>)
                        })}
                    </MessageList>
                    <MessageInput attachButton={false} disabled={!sendState && currentChat !== null}
                                  placeholder="Please Type Message"
                                  onSend={sendMsg}></MessageInput>
                </ChatContainer>
            </MainContainer>
        </>
    )
}


export default ChatDialog;
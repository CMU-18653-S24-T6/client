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
import { useEffect, useState } from "react"
import { chatRequester } from '@/utils/requester'
import { getRole, getUid } from '@/utils/auth'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import  useWebSocket from '../hooks/useWebSocket';

const ChatDialog = (props) => {

    const [clientId, setClientId] = useState('');
    const [role, setRole] = useState('');
    const [chatList, setChatList] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [sendState, setSendState] = useState(false);

    useEffect(() => {
        setClientId(getUid())
        const currentRole = getRole()
        setRole(currentRole)
        chatRequester.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        if (currentRole === 'ADMIN') {
            chatRequester.get('/contacts').then(response => {
                console.info('Admin access: return customer list')
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
                        console.log('sender id is', body.senderId);
                        if (chatList.find(item => item === body.senderId) === undefined) {
                            setChatList(prev => [...prev, body.senderId]);
                        }
                    }

                    if (currentChat) {
                        if ((body.senderId === clientId && body.recipientId === currentChat) ||
                            (body.senderId === currentChat && body.recipientId === clientId)) {
                            if (body.recipientId === currentChat) {
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

    const ws = useWebSocket();

    const sendMsg = (msg) => {
        let body = {
            action: "message",
            message: {
                senderId: clientId,
                recipientId: role === 'ADMIN' ? currentChat : 'admin',
                content: msg,
                timestamp: Date.now()
            }
        }
        ws.send(JSON.stringify(body));
    }

    return (
        <>
            <MainContainer>
                <Sidebar position={"left"}>
                    <ConversationList>
                        {
                            chatList.map((item, index) => {
                                console.log(item)
                                console.log(index)
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
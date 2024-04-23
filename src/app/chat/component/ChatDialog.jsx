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
import {useEffect, useState, useRef} from "react"
import { chatRequester } from '@/utils/requester'
import { getRole, getUid } from '@/utils/auth'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const ChatDialog = (props) => {

    const accessToken = useRef('');
    const [chatList, setChatList] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [sendState, setSendState] = useState(false);

    useEffect(() => {
        const clientId = getUid()
        const role = getRole()
        accessToken.current = localStorage.getItem("token")
        chatRequester.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        if (role === 'ADMIN') {
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
                console.info(response.data);
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

    const ws = new WebSocket(`wss://57c0f9smi0.execute-api.us-west-2.amazonaws.com/default/?accessToken=eyJraWQiOiJvVG9tMFQxV0dBQ2R3TjRzcG9nQXY0VmFzQnZUYlh4UlJcL2JvVDVNK05rQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwODUxNTNhMC1mMDAxLTcwM2UtYzYyNC0zN2E5M2RmZGU2MTUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9YbDNVMHVKd3MiLCJjbGllbnRfaWQiOiIxcTMycXNvMWh1YWptNXRhcjZsNGdvMnNvZSIsIm9yaWdpbl9qdGkiOiJlNmMwMzljYi02YjgxLTQ4NzUtYmQ2ZC0zNDQ4Mjc1YmExMmQiLCJldmVudF9pZCI6ImUwZjRmYzNlLTFmOTYtNDNlNC1iNmRiLWIzYzA1ZmYzMjg2NSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MTM4MTg2NDEsImV4cCI6MTcxMzkwNTA0MSwiaWF0IjoxNzEzODE4NjQxLCJqdGkiOiJjNDg3NDQ5OC0zNWNiLTQxMTYtOTA1ZC0xNjZiZDk1MTA3OWQiLCJ1c2VybmFtZSI6IjA4NTE1M2EwLWYwMDEtNzAzZS1jNjI0LTM3YTkzZGZkZTYxNSJ9.ahQ5tVUc9SRWfThkpx6dkkDNKM3Snd-PMXjjb_pStNB4M32XCACP_6CySnz6XCpdJSmxVO8BJMZ3E3IHi3bRJMDp-BBe_LclDY1eNDWWgK7zvHRQKCqq6n9gcN_2Z4mHV_B996OKgnO1uFCXaCAagQ3cQA4QlLPHstSy4TH3xeY38gRpuarUqf_68Bf6bgH0m6z2U-P61DBuFbuc7ozEEdqmLALd0vaUEsGQRbgBdklOvpBUSvoMagGpcfR_-ix6Z5YG3gZGfjiRvy9k5I75WK8l0jCeIrrR54ec2iKh8_UR5zFG5gNOfWmNPY4J47_FdMh3tYzVvcxXszzIMvVzTQ`);

    ws.onopen = () => {
        setSendState(true);
    }
    ws.onmessage = (e) => {
        console.log(e.data);
        let body = JSON.parse(e.data);

        if (body.senderId != clientId) {
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

    ws.onclose = () => {
        setSendState(false);
    }
    ws.onerror = (e) => {
        console.error(e);
        setSendState(false);
    }

    const sendMsg = (msg) => {
        let body = {
            action: "message",
            message: {
                senderId: currentChat,
                recipientId: 'admin',
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
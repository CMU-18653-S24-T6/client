import React, { useState } from 'react';
import NewChatDialog from './NewChatDialog';
import {Box} from "@mui/material";
import {Button} from "react-bootstrap";
import ChatIcon from "@mui/icons-material/Chat";
import {Close} from "@mui/icons-material";

function ChatComponent() {
    const [isVisible, setIsVisible] = useState(false);

    const closeChatWindow = () => {
        setIsVisible(false);
    };

    const openChatWindow = () => {
        setIsVisible(true);
    };

    return (
        <Box>
            {!isVisible && <Button onClick={openChatWindow} className='bottom-right-button'>
                <ChatIcon />
            </Button>}
            <Box className={`${isVisible ? '' : 'hidden'} bottom-right-component`}>
                <Button onClick={closeChatWindow}><Close></Close></Button>
                <NewChatDialog />
            </Box>
        </Box>
    );
}

export default ChatComponent;
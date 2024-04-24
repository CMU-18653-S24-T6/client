import React, { useState } from 'react';
import ChatDialog from './ChatDialog';
import {Box} from "@mui/material";
import {Button} from "react-bootstrap";
import ChatIcon from "@mui/icons-material/Chat";

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
                <Button onClick={closeChatWindow}>Hide</Button>
                <ChatDialog />
            </Box>
        </Box>
    );
}

export default ChatComponent;
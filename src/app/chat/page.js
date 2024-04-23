'use client'
import './App.css';
import ChatDialog from "./component/ChatDialog"
import NewChatDialog from "@/app/chat/component/NewChatDialog";

export default function Chat() {

    return (
        <div className="App">
            <NewChatDialog/>
        </div>
    );
}

import {useParams} from "react-router-dom";
import ReplyList from "./ReplyList";
import React from "react";
import { useRouter } from 'next/router';

function Reply() {
    const { topicId, rid } = useParams(); // 在这里获取 rid
    return <ReplyList key={rid} topicId={topicId} rid={rid}/>; // 将 rid 作为 key 传递给 ReplyList 组件
}

export default Reply;
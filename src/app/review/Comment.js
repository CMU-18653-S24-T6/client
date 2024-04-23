'use client'
import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Modal, Input} from 'antd';
import {
    CommentOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import {SmallReplyList} from "./SmallReplyList/SmallReplyList";
import {reviewRequester,profileRequester} from "@/utils/requester";
import * as jose from 'jose'
const Comment = ({ topicId,rid, uid, content, date, updatedtime,deleteComment,showReply}) => {
    const [contents, setContents] = useState(content);
    const [updatedTime, setUpdatedTime] = useState(updatedtime);
    const navigate = useRouter();
    const [isEditing, setEditing] = useState(false);
    const dateFormat = new Date(date);
    const standardDate = `${dateFormat.getFullYear()}-${dateFormat.getMonth() + 1}-${dateFormat.getDate()} ${dateFormat.getHours()}:${dateFormat.getMinutes()}`;
    const idToken = localStorage.getItem('idToken')
    let decoded = null;
    let currentUid = null;
    if(idToken){
        decoded = jose.decodeJwt(idToken)
        currentUid = decoded.sub;
    }
    const [userName, setUserName] = useState('');
    const toReply = () => {
        navigate.push(`/review/${topicId}/${rid}`);
    }
    useEffect(() => {
        setContents(content);
    }, [content]);
    useEffect(() => {
        setUpdatedTime(updatedtime);
    }, [updatedtime]);
    useEffect(() => {
        profileRequester.get(`/profile/username/12345678`)
            .then((response) => {
                setUserName(response.data.username);
            });
    }, [uid]);
    const msg = {
        rid,
        uid,
        content,
        placeHolder: `Reply@${userName}`
    }
    const edit = () =>{
        setEditing(true);
    }

    const timeStampToFormat = (timeStamp) => {
        const date = new Date(timeStamp);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }

    const updateComment = (e) => {
        e.stopPropagation();
        const updated = Date.now();
        const postData = {
            content: contents,
            date: updated
        }
        reviewRequester.put(`/reviews/${topicId}/${rid}`, postData)
            .then((response) => {
            });
        setEditing(!isEditing);
        setUpdatedTime(updated);
    }

    const deleteComment2 = () => {
        reviewRequester.delete(`/reviews/${topicId}/${rid}`)
            .then((response) => {
            });
    }

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Are you sure deleting this comment?',
            icon: <ExclamationCircleOutlined />,
            okText: 'yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteComment2();
                deleteComment(rid);
            },
            onCancel() {
            },
        });
    };

    const showHistory = () => {
        navigate.push(`/review/mementos/${topicId}/${rid}`)
    }

    const cancelUpdate = () => {
        setEditing(false);
    }


    const items = [
        {
            key: '1',
            icon: <Button icon={<EditOutlined/>} onClick={(e)=>{e.stopPropagation();edit()}}/>
        },
        {
            key: '2',
            icon: <Button icon={<HistoryOutlined/>} onClick={(e)=>{e.stopPropagation();showHistory()}}></Button>
        },
        {
            key: '3',
            icon: <Button icon={<DeleteOutlined/>} onClick={(e)=>{e.stopPropagation();showDeleteConfirm()}}></Button>
        },
    ];

    return (
        <div className="comment">
            <div className="comment-body">
                <div className="d-flex justify-content-between">
                    <div className="comment-author" style={{ color: 'orange',fontSize: '17px' }}>{userName}</div>
                    <div>
                        <Dropdown menu={{items}} onClick={(e)=>e.stopPropagation()}>
                            <EllipsisOutlined onClick={(e)=>e.stopPropagation()}/>
                        </Dropdown>
                    </div>
                </div>
                {isEditing ? (
                    <div>
                    <Input.TextArea
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                        onClick={event => event.stopPropagation()}
                        style={{ border: 'none',fontSize: '17px'  }}
                    />
                    <Button onClick={(e) =>{updateComment(e)}}>
                        Save
                    </Button>
                        <Button onClick={(e) =>{cancelUpdate(e)}}>
                            Cancel
                        </Button>
                    </div>
                ) : (<div className="text-start text-wrap text-break" style={{ fontSize: '17px' }}>{contents}</div>)}
                <div>
                    <SmallReplyList rid={rid} topicId={topicId}/>
                </div>
                {/*{updatedTime && <div className="comment-datetime text-left" style={{ fontStyle: 'italic',fontSize: '12px',color: '#adb5bd' }}>Last edited on: {timeStampToFormat(updatedTime)}</div>}*/}
                <div className="d-flex justify-content-between">
                    <div>
                    {updatedTime && <div className="comment-datetime text-left" style={{ fontStyle: 'italic',fontSize: '12px',color: '#adb5bd' }}>Last edited on: {timeStampToFormat(updatedTime)}</div>}
                    <div className="comment-datetime text-left" style={{ color: '#ccc' ,fontSize: '12px'}}>{standardDate}</div>
                    </div>
                    {showReply && <Button icon={<CommentOutlined/>} onClick={(e)=>{e.stopPropagation();toReply();}}></Button>}
                </div>
            </div>
        </div>
    );
}

export default Comment;
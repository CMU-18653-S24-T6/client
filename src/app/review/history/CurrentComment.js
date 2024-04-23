'use client'
import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Modal, Input} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import {reviewRequester,profileRequester} from "@/utils/requester";
import * as jose from 'jose'
function CurrentComment({ topidId,rid, uid, content, date,updatedtime,deleteComment,addMemento}) {
    const [contents, setContents] = useState(content);
    const [updatedTime, setUpdatedTime] = useState(updatedtime);
    const [isEditing, setEditing] = useState(false);
    const [userName, setUserName] = useState('');
    const dateFormat = new Date(date);
    const standardDate = `${dateFormat.getFullYear()}-${dateFormat.getMonth() + 1}-${dateFormat.getDate()} ${dateFormat.getHours()}:${dateFormat.getMinutes()}`;
    const idToken = localStorage.getItem('idToken')
    let decoded = null;
    let currentUid = null;
    if(idToken){
        decoded = jose.decodeJwt(idToken)
        currentUid = decoded.sub;
    }
    useEffect(() => {
        setContents(content);
    }, [content]);
    useEffect(() => {
        setUpdatedTime(updatedtime);
    }, [updatedtime]);
    useEffect(() => {
        profileRequester.get(`/profile/username/${uid}`)
            .then((response) => {
                setUserName(response.data.username);
            })
    }, [uid]);
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
        console.log(postData)
        reviewRequester.put(`/reviews/${topidId}/${rid}`, postData)
            .then((response) => {
                console.log(response);
            });
        if(updatedTime){
            addMemento({rid,uid,content,date:updatedTime});
        }
        else{
            addMemento({rid,uid,content,date});
        }
        setEditing(!isEditing);
        setUpdatedTime(updated);
    }

    const deleteComment2 = () => {
        reviewRequester.delete(`/reviews/${topidId}/${rid}`)
            .then((response) => {
                console.log(response);
            });
    }

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Are you sure deleting this comment?？',
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



    const items = [
        {
            key: '1',
            icon: <Button icon={<EditOutlined/>} onClick={(e)=>{e.stopPropagation();edit()}}/>
        },
        {
            key: '2',
            icon: <Button icon={<DeleteOutlined/>} onClick={(e)=>{e.stopPropagation();showDeleteConfirm()}}></Button>
        },
    ];

    return (
        <div className="comment">
            <div className="comment-body">
                <div className="d-flex justify-content-between">
                    <div className="comment-author" style={{ color: 'orange',fontSize: '17px' }}>{userName}</div>
                    <div>
                        {/*<Button icon={<EditOutlined />} onClick={(e)=>{e.stopPropagation();edit()}}></Button>*/}
                        {/*<Button icon={<HistoryOutlined/>}></Button>*/}
                        <Dropdown menu={{items}} onClick={(e)=>e.stopPropagation()}>
                            <EllipsisOutlined onClick={(e)=>e.stopPropagation()}/>
                            {/*<Button icon={<EllipsisOutlined/>}></Button>*/}
                        </Dropdown>
                    </div>
                </div>
                {isEditing ? (
                    <div>
                        <Input.TextArea
                            value={contents}
                            onChange={(e) => setContents(e.target.value)}
                            onClick={event => event.stopPropagation()}
                            style={{ border: 'none',fontSize: '17px' }}
                        />
                        <Button onClick={(e) =>{updateComment(e)}}>
                            Save
                        </Button>
                    </div>
                ) : (<div className="text-start" style={{ fontSize: '17px' }}>{contents}</div>)}
                {updatedTime && <div className="comment-datetime" style={{ fontStyle: 'italic',fontSize: '12px',color: '#ccc' }}>Last edited on: {timeStampToFormat(updatedTime)}</div>}
                <div className="comment-datetime" style={{ color: '#ccc' ,fontSize: '12px'}}>{standardDate}</div>
            </div>
        </div>
    );
}
export default CurrentComment;
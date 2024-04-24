import React, {useEffect, useState} from "react";
import {Button, Modal} from "antd";
import {DeleteOutlined, ExclamationCircleOutlined, UndoOutlined} from "@ant-design/icons";
import {reviewRequester,profileRequester} from "@/utils/requester";
import * as jose from 'jose'
function CommentMemento({cmid,commentid, uid, content, date,currentComment,setComments,addMemento,deleteMemento}) {
    const dateFormat = new Date(date);
    const standardDate = `${dateFormat.getFullYear()}-${dateFormat.getMonth() + 1}-${dateFormat.getDate()} ${dateFormat.getHours()}:${dateFormat.getMinutes()}`;
    const [userName, setUserName] = useState('');
    const idToken = localStorage.getItem('idToken')
    let decoded = null;
    let currentUid = null;
    if(idToken){
        decoded = jose.decodeJwt(idToken)
        currentUid = decoded.sub;
    }
    const undo = () => {
        const putData = {
            updateTime: Date.now(),
            historyId: cmid,
            rid: commentid
        };
        reviewRequester.put(`/reviews/histories/undo`,putData)
            .then((response) => {
                setComments({...currentComment,content,updatedtime:putData.updateTime});
                deleteMemento(cmid);
                addMemento(currentComment);
            });
    }
    useEffect(() => {
        profileRequester.get(`/profile/username/${uid}`)
            .then((response) => {
                setUserName(response.data);
            })
    }, [uid]);

    const deleteComment2 = () => {
        reviewRequester.delete(`/reviews/histories/undo/${cmid}`)
            .then((response) => {
                console.log(response);
            });
    }

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Are you sure deleting this momento？',
            icon: <ExclamationCircleOutlined />,
            okText: 'yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteComment2();
                deleteMemento(cmid);
            },
            onCancel() {
            },
        });
    };

    const showUndoConfirm = () => {
        Modal.confirm({
            title: 'Are you sure undo to this version？',
            icon: <ExclamationCircleOutlined />,
            okText: 'yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                undo();
            },
            onCancel() {
            },
        });
    };
    return (
        <div className="comment">
            <div className="comment-body">
                <div className="d-flex justify-content-between">
                    <div className="comment-author" style={{ color: 'orange',fontSize: '17px' }}>{userName}</div>
                    {(currentUid === uid)&&<div>
                        <Button icon={<DeleteOutlined />} onClick={(e)=>{e.stopPropagation();showDeleteConfirm()}}></Button>
                        <Button icon={<UndoOutlined />} onClick={(e)=>{e.stopPropagation();showUndoConfirm()}}></Button>
                    </div>}
                </div>
                <div className="text-start text-wrap text-break" style={{ fontSize: '17px' }}>{content}</div>
                <div className="d-flex justify-content-between">
                    <div className="comment-datetime" style={{ color: '#ccc' ,fontSize: '12px'}}>{standardDate}</div>
                </div>
            </div>
        </div>
    )
}

export default CommentMemento;
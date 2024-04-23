import React, { useState } from 'react';
import { Form, Input, Button, Row, Col  } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import {SendOutlined} from "@ant-design/icons";
import {reviewRequester} from "@/utils/requester";
import * as jose from 'jose'
const CommentForm = ({ msg, topicId, closeModel, addComment}) => {
    const [comment, setComment] = useState('');
    const idToken = localStorage.getItem('idToken')
    let decoded = null;
    let currentUid = null;
    if(idToken){
        decoded = jose.decodeJwt(idToken)
        currentUid = decoded.sub;
    }
    const handleSubmit = () => {
        const postData = {
            uid: currentUid,
            content: comment,
            parentId: msg.rid,
            date: Date.now()
        }
        reviewRequester.post(`/reviews/${topicId}`, postData)
            .then((response) => {
                addComment({...postData,rid:response.data.data});
            });
        setComment('');
        closeModel();
    };

    return (
        <Form>
            <Row gutter={9}>
                <Col span={20}>
                    <Form.Item>
                        <Input.TextArea rows={2} value={comment} onChange={e => setComment(e.target.value)} placeholder={msg.placeHolder} />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item>
                        <Button type="primary" onClick={handleSubmit} icon={<SendOutlined />}></Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default CommentForm;
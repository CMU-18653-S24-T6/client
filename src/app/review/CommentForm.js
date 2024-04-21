import React, { useState } from 'react';
import { Form, Input, Button, Row, Col  } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import {SendOutlined} from "@ant-design/icons";
import axios from "axios";
const CommentForm = ({ msg, topicId, closeModel, addComment}) => {
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        const postData = {
            uid: "Richard",
            content: comment,
            parentId: msg.rid,
            date: Date.now()
        }
        axios.post(`http://localhost:8080/reviews/${topicId}`, postData)
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
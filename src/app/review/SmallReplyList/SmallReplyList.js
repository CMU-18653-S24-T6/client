'use client'
import React, {useEffect, useState} from "react";
import {List, Typography} from "antd";
import "../css/App.css";
import { useRouter } from 'next/Navigation';
import {reviewRequester} from "@/utils/requester";
export function SmallReplyList({rid,topicId}){
    const [replies, setReplies] = useState([{}]);
    const [total, setTotal] = useState(0);
    const navigate = useRouter();
    const handleClick = () => {
        navigate.push(`/review/${topicId}/${rid}`);
    }
    useEffect(() => {
        reviewRequester.get(`/reviews/replies/${rid}?page=0`)
            .then((response) => {
                setReplies(response.data.data.reviews);
                setTotal(response.data.data.total);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    let itemsToShow = replies.slice(0, 2);
    if (replies.length > 2) {
        itemsToShow.push({ isTotal: true, total: replies.length });
    }
    if(total === 0){
        return;
    }
    return (
        <div onClick={handleClick}>
        <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={itemsToShow}
            renderItem={item => {
                if (item.isTotal) {
                    return (
                        <List.Item className="no-border-no-padding">
                            <div className="list-container">
                                <Typography.Link>{total} replies total &gt;</Typography.Link>
                            </div>
                        </List.Item>
                    );
                }
                return (
                    <List.Item className="no-border-no-padding">
                        <div className="list-container text-wrap text-break">
                            <strong style={{color:'#0000EE'}}>{item.uid}</strong>:{item.content}
                        </div>
                    </List.Item>
                );
            }}
        />
        </div>
    );
}
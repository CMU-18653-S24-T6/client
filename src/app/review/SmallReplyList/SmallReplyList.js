'use client'
import React, {useEffect, useState} from "react";
import {List, Typography} from "antd";
import "../css/App.css";
import { useRouter,usePathname } from 'next/navigation'
import {profileRequester, reviewRequester} from "@/utils/requester";
export function SmallReplyList({rid,topicId}){
    const [replies, setReplies] = useState([{}]);
    const [total, setTotal] = useState(0);
    const navigate = useRouter();
    const pathname = usePathname();
    const handleClick = () => {
        // navigate.push(`/review/${topicId}/${rid}`);
        navigate.push(`${pathname}?view=reply&rid=${rid}`,{scroll: false});
    }
    async function fetchRepliesAndUsernames() {
        try {
            const response = await reviewRequester.get(`/reviews/replies/${rid}?page=0`);
            setTotal(response.data.data.total);

            const reviews = response.data.data.reviews;
            if (reviews.length > 0) {
                const slicedReplies = reviews.slice(0, 2);
                const newReplies = await Promise.all(
                    slicedReplies.map(async item => {
                        const res = await profileRequester.get(`/profile/username/${item.uid}`);
                        return { ...item, userName: res.data };
                        return item;
                    })
                );
                if(response.data.data.total > 2){
                    newReplies.push({ isTotal: true, total: replies.length });
                }
                setReplies(newReplies);
            } else {
                setReplies([]);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchRepliesAndUsernames();
    }, []);
    if(total === 0){
        return;
    }
    // console.log(replies)
    return (
        <div onClick={handleClick}>
        <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={replies}
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
                            <strong style={{color:'#0000EE'}}>{item.userName}</strong>:{item.content}
                        </div>
                    </List.Item>
                );
            }}
        />
        </div>
    );
}
'use client'
import CommentList from "./CommentList";
import Comment from "./Comment";
import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Drawer} from 'antd';
import { useRouter } from 'next/navigation'
import {BackButton} from "./BackButton";
import CommentForm from "./CommentForm";
import {CommentOutlined} from "@ant-design/icons";
import { reviewRequester } from "@/utils/requester";

function ReplyList({rid, topicId}) {
    const [replies, setReplies] = useState([]);
    const [comments, setComments] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useRouter();

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const fetchMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        reviewRequester.get(`reviews/replies/${rid}?page=${page}`)
            .then(res => {
                const newData = res.data.data.reviews;
                console.log(newData);
                setReplies([...replies, ...newData]);
                setHasMore(res.data.data.hasMore);
                setPage(prevPage => prevPage + 1);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    };
    useEffect(() => {
        reviewRequester.get(`/reviews/${topicId}/${rid}`)
            .then((response) => {
                console.log("the main comment is "+response.data)
                setComments(response.data.data);
            }).catch((error) => {
            console.log(error);
        });
        fetchMoreData();
    }, []);
    const msg = {
        rid,
        placeHolder: `Replies`
    }
    const [message, setMessage] = useState(msg);
    const deleteReply = (rid) => {
        const newReplies = replies.filter((item) => item.rid !== rid);
        setReplies(newReplies);
    };

    const deleteComment = (rid) => {
        navigate.back();
    }
    const addReply = (reply) => {
        const date = new Date(reply.date);
        reply.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        setReplies([reply, ...replies]);
    }

    const showModalWithMsg = (msg) => {
        setIsModalVisible(true);
        setMessage(msg);
    }
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <BackButton/>
                <h1 className="flex-grow-1 text-center mb-0">ReplyList</h1>
                <div style={{width: "80px"}}></div>
            </div>
            <div>
                <Card>
                    <Comment {...comments} show={showModalWithMsg} deleteComment={deleteComment}
                             style={{width: '100%'}} showReply={false}/>
                </Card>
                <Divider style={{borderWidth: 5, borderColor: '#e8e8e8'}}/>
                <div>
                <CommentList comments={replies} deleteComment={deleteReply} showReply={true} fetchMoreData={fetchMoreData} hasMore={hasMore}
                             onLoading={loading}/>
                </div>
                <div style={{position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', paddingBottom: '0px'}}>
                    <Button icon={<CommentOutlined/>} style={{width: '100%'}}
                            onClick={() => setIsModalVisible(true)}>Reply</Button>
                </div>
                {isModalVisible && (
                    <Drawer
                        placement="bottom"
                        closable={false}
                        onClose={() => setIsModalVisible(false)}
                        height={100}
                        open={isModalVisible}
                    >
                        <CommentForm msg={message} topicId={topicId} closeModel={() => setIsModalVisible(false)}
                                     addComment={addReply} setAddToList={true}/>
                    </Drawer>
                )}
            </div>
        </div>
    )
}

export default ReplyList;
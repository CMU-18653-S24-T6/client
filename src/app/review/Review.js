'use client'
import React, {useEffect, useState} from "react";
import CommentList from "./CommentList";
import {Button, Drawer} from "antd";
import {CommentOutlined} from "@ant-design/icons";
import CommentForm from "./CommentForm";
import { reviewRequester} from "@/utils/requester";

function Review({topicId}) {
    const [comments, setComments] = useState([]);
    //set what comment need to reply

    const [message, setMessage] = useState({placeHolder: "Comment"});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const fetchMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        reviewRequester.get(`/reviews/${topicId}?page=${page}`)
            .then(res => {
                const newData = res.data.data.reviews;
                setComments([...comments,...newData]);
                setHasMore(res.data.data.hasMore);
                setPage(page + 1);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchMoreData();
    },[]);
    const addComment = (comment) => {
        const date = new Date(comment.date);
        comment.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        setComments([comment, ...comments]);
    }
    const deleteComment = (rid) => {
        const newComments = comments.filter((item) => item.rid !== rid);
        setComments(newComments);
    };

    const showModalWithMsg = (msg) => {
        setIsModalVisible(true);
        setMessage(msg);
    }
    const closeModal = () => {
        setMessage({placeHolder: "Comment..."});
        setIsModalVisible(false);
    }

    return (
        <div style={{ width: '100%', textAlign: 'center' }}>
            <h1 className="flex-grow-1 text-center mb-0 text-white">UserReview</h1>
            <CommentList
                comments={comments}
                show={showModalWithMsg}
                setMessage={setMessage}
                deleteComment={deleteComment}
                showReply={true}
                fetchMoreData={fetchMoreData}
                hasMore={hasMore}
                onLoading={loading}
            />
            <div style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', paddingBottom: '0px' }}>
                <Button
                    icon={<CommentOutlined />}
                    style={{ width: '100%' }}
                    onClick={() => {
                        showModalWithMsg(message)
                    }}
                >
                    Comment
                </Button>
            </div>
            {isModalVisible && (
                <Drawer placement="bottom" closable={false} onClose={closeModal} height={100} open={isModalVisible}>
                    <CommentForm msg={message} topicId={topicId} closeModel={closeModal} addComment={addComment} />
                </Drawer>
            )}
        </div>
    )
}

export default Review;
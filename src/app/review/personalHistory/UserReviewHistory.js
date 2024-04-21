'use client'
import React, {useEffect, useState} from "react";
import CommentList from "../CommentList";
import axios from "axios";
import {BackButton} from "../BackButton";
function UserReviewHistory({uid}) {
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState({placeHolder: "Comment"});
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const fetchMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        axios.get(`http://localhost:8080/reviews/uids/${uid}?page=${page}`)
            .then(res => {
                console.log(res.data.data.reviews)
                const newData = res.data.data.reviews;
                setComments([...comments, ...newData]);
                setHasMore(res.data.data.hasMore);
                setPage(prevPage => prevPage + 1);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchMoreData();
    },[]);
    const deleteComment = (rid) => {
        const newComments = comments.filter((item) => item.rid !== rid);
        setComments(newComments);
    };

    return (
        <div className="App">
            <div className="d-flex justify-content-between align-items-center">
                <BackButton/>
                <h1 className="flex-grow-1 text-center mb-0">Review History</h1>
                <div style={{width: "80px"}}></div>
            </div>
            <CommentList comments={comments}
                         setMessage={setMessage}
                         deleteComment={deleteComment}
                         fetchMoreData={fetchMoreData}
                         showReply={true}
                         hasMore={hasMore}
                         onLoading={loading}
            />
        </div>
    );
}

export default UserReviewHistory;
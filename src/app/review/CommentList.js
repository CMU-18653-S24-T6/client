'use client'
import React, {useEffect} from 'react';
import { List, Card } from 'antd';
import Comment from './Comment';
import './css/App.css';
const CommentList = ({ comments , setMessage, deleteComment,showReply,fetchMoreData,hasMore,onLoading}) => {
    useEffect(() => {
        const listContainer = document.getElementById('list-container');
        const handleScroll = () => {
            const nearBottom = listContainer.scrollHeight - listContainer.scrollTop - listContainer.clientHeight < 1;
            if (nearBottom) {
                if (hasMore && !onLoading) {
                    fetchMoreData();
                }
            }
        };

        if (listContainer) {
            listContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (listContainer) {
                listContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [fetchMoreData, hasMore, onLoading]);
    return (
        <div id="list-container" style={{ height: '800px', overflowY: 'auto' }}>
        <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={props => (
            <List.Item className="comment-fade-enter comment-fade-enter-active" key={props.rid}>
                <Card bordered={true} style={{ width: '100%' }}>
                    <Comment {...props} setMessage={setMessage} deleteComment={deleteComment} showReply={showReply}/>
                </Card>
            </List.Item>
        )}/>
    </div>
);
}

export default CommentList;
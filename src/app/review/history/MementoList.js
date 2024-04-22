'use client'
import {Card, List} from "antd";
import React, {useEffect, useState} from "react";
import CommentMemento from "./CommentMemento";
import { useRouter } from 'next/navigation'
import {BackButton} from "../BackButton";
import CurrentComment from "./CurrentComment";
import {reviewRequester} from "@/utils/requester";

function MementoList({topicId,rid}) {
    const [mementos, setMementos] = useState([]);
    const [comments, setComments] = useState([]);
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const fetchMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        reviewRequester.get(`/reviews/histories/${rid}?page=${page}`)
            .then(res => {
                const newData = res.data.data.reviews;
                setMementos([...mementos,...newData]);
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
                setComments(response.data.data);
            }).catch((error) => {
            console.log(error);
        });
        fetchMoreData();
    }, []);
    useEffect(() => {
        const listContainer = document.getElementById('list-container');
        const handleScroll = () => {
            const nearBottom = listContainer.scrollHeight - listContainer.scrollTop - listContainer.clientHeight < 1;
            if (nearBottom) {
                if (hasMore && !loading) {
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
    }, []);
    const deleteComment = (rid) => {
        navigate.back();
    }
    const addMemento = (memento) => {
        const date = new Date(memento.date);
        memento.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        setMementos(prevMementos => [memento, ...prevMementos]);
    }

    const deleteMemento = (cmid) => {
        setMementos(prevMementos => prevMementos.filter(item => item.cmid !== cmid));
    }
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <BackButton/>
                <h1 className="flex-grow-1 text-center mb-0">Edit History</h1>
                <div style={{ width: "80px" }}></div>
            </div>
            <Card>
                <CurrentComment {...comments} addMemento={addMemento} deleteComment={deleteComment} style={{width: '100%'}}/>
            </Card>
            <div id="list-container" style={{ height: '70vh', overflow: 'auto' }}>
            <List
                dataSource={mementos}
                itemLayout="horizontal"
                renderItem={props => (
                    <List.Item className="comment-fade-enter comment-fade-enter-active" key={props.cmid}>
                        <Card bordered={true} style={{ width: '100%' }}>
                            <CommentMemento {...props} setComments={setComments} currentComment={comments} addMemento={addMemento} deleteMemento={deleteMemento}/>
                        </Card>
                    </List.Item>
                )}
            />
            </div>
        </div>
    );
}

export default MementoList;
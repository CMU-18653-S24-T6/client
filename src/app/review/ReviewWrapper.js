'use client'
import {useEffect, useState} from "react";
import Review from "@/app/review/Review";
import ReplyList from "@/app/review/ReplyList";
import MementoList from "@/app/review/history/MementoList";
import { useSearchParams } from 'next/navigation'

function ReviewWrapper({topicId}) {
    const SearchParams = useSearchParams();
    const view= SearchParams.get('view');
    const rid = SearchParams.get('rid');
    return (
        <div>
            {!view && <Review topicId={topicId}/>}
            {view === 'reply' && <ReplyList key={rid} rid={rid} topicId={topicId}/>}
            {view === 'memento' && <MementoList topicId={topicId} rid={rid}/>}
        </div>
    );
}

export default ReviewWrapper;
import Review from "@/app/review/Review";


export default function ReviewPage({ params }) {
    const { topicId } = params;
    return <Review topicId={topicId}/>
}
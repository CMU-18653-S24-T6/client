import ReplyList from "@/app/review/ReplyList";

export default function ReplyPage({ params }) {
  const { topicId, rid } = params;
  return <ReplyList key={rid} topicId={topicId} rid={rid}/>
}
import MementoList from "@/app/review/history/MementoList";

export default function MementoPage({ params }){
    const { topicId, rid } = params;
    return <MementoList topicId={topicId} rid={rid}/>
}
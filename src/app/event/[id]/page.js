import ReviewWrapper from "@/app/review/ReviewWrapper";
import EventDescription from "@/app/event/[id]/eventDescription";
export const revalidate = 15
export const dynamic = 'force-dynamic'
import { Tabs } from "antd";

export default function EventPage({ params }){
    const { id } = params;
    const items = [
        {
            key: '1',
            label: 'Description',
            children: <EventDescription id={id} />
        },
        {
            key: '2',
            label: 'Review',
            children: <ReviewWrapper topicId={id} />
        }
    ]
    return (
        <div>
            <Tabs defaultActiveKey="1"
                  items={items}
                  style={{ width: '100%', height: '100%'}}
            />
        </div>
    )
}




import {Button} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import { useRouter } from 'next/navigation';

export function BackButton() {
    const navigate = useRouter();
    const handleBack = () => {
        navigate.back();
    }
    return (
        <Button onClick={handleBack} icon={<ArrowLeftOutlined />}></Button>
    );
}
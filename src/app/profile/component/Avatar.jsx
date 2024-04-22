import { Image } from "react-bootstrap";

const Avatar = ({ img = './avatar.png', size = 64 }) => {
    return (
        <Image src={img} alt={img} width={size} height={size} thumbnail></Image>
    )
}

export default Avatar;
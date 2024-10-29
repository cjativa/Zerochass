import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardImg,
    CardBody,
    CardFooter,
    Button
} from "shards-react";

export interface IProfileCardProps {
    name: string,
    profileImageUrl: string,
    blurb: string,
    username: string,
}

export const ProfileCard = ({ name, profileImageUrl, blurb, username }: IProfileCardProps) => {
    return (
        <Card className="profile-card" >
            <CardBody className="pc-body">
                <img
                    src={profileImageUrl}
                    className="pc-body__image"
                    height={'100px'}
                    width={'100px'}
                />
                <CardTitle>{name}</CardTitle>
                <p>{blurb}</p>
            </CardBody>
            <CardFooter className="pc-footer">
                See <a className="pc-footer__link">more posts from them</a>
            </CardFooter>
        </Card>
    );
}
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Button as ShardButton } from "shards-react";

interface IButtonProps {
    style: 'primary' | 'secondary' | 'danger',

    children?: ReactNode,
    disabled?: boolean,
    className?: string,
    onClick?: () => void,
    asLink?: boolean,
    path?: string
};

export const Button = ({ style, onClick, asLink, path, className, disabled, children }: IButtonProps) => {

    const handleOnClick = () => {
        if (onClick) {
            onClick();
        }
    };

    // Construct the link button
    if (asLink) {
        return (
            <ShardButton
                onClick={handleOnClick}
                disabled={disabled}
                theme={style}
            >
                <Link href={`/${path}`}>
                    <a>
                        {children}
                    </a>
                </Link>
            </ShardButton>
        );
    }

    // Otherwise, return normal button
    return (
        <ShardButton
            onClick={handleOnClick}
            disabled={disabled}
            theme={style}
        >
            {children}
        </ShardButton>
    );
};
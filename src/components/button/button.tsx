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
    path?: string,

    actionSuccess?: null | boolean,
    actionSuccessText?: string,
    actionFailureText?: string,
};

export const Button = ({ style, onClick, asLink, path, className, disabled, children, actionSuccess,
    actionSuccessText, actionFailureText }: IButtonProps) => {

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
        <div className="button">
            <ShardButton
                onClick={handleOnClick}
                disabled={disabled}
                theme={style}
            >
                {children}
            </ShardButton>

            {/** Display text during success of an action */}
            {actionSuccess && actionSuccessText &&
                <span className="button__status--success">
                    {actionSuccessText}
                </span>
            }

            {/** Display text during failure of an action */}
            {(actionSuccess === false) && actionFailureText &&
                <span className="button__status--fail">
                    {actionFailureText}
                </span>
            }
        </div>

    );
};
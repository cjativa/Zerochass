import React, { ReactNode } from 'react';
import { Fade } from "shards-react";

interface IFaderProps {
    showIn: boolean,
    isSuccess: null | boolean,

    successText?: string,
    errorText?: string,

    exit?: boolean,
};

export const Fader = ({ exit, showIn, isSuccess, successText, errorText, }: IFaderProps) => {

    let classString = 'fader fader--';
    let renderedText = '';

    if (isSuccess) {
        classString += 'success';
        renderedText = successText;
    }

    if (isSuccess === false) {
        classString += 'error';
        renderedText = errorText;
    }

    if (isSuccess === null) {
        classString += 'hidden';
    }

    return (
        <Fade
            in={showIn}
            exit={exit}
            className={classString}
        >
            {renderedText}
        </Fade>
    );
};
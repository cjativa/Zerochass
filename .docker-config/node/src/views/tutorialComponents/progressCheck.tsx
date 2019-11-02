import React, { useState, useEffect } from 'react';

interface Props {
    sectionComplete: boolean,
    onProgressClick: any,
    index: number
}

export const ProgressCheck = (props: Props) => {

    let progressClass = '';

    switch (props.sectionComplete) {
        case false:
            progressClass = 'not-started';
            break;
        case null:
            progressClass = 'in-progress';
            break;
        case true:
            progressClass = 'completed';
            break;
        default:
            progressClass = '';
            break;
    }

    const { onProgressClick, index } = props;

    return (
        <span id="progress-span" className="fa-stack fa-2x" onClick={() => { onProgressClick(index) }}>
            <i className={`fas fa-circle fa-stack-2x ${progressClass}-bg`}></i>
            <i className={`fas fa-check fa-stack-1x fa-inverse ${progressClass}-fg`} style={{ fontSize: '38px' }}></i>
        </span>
    );
}

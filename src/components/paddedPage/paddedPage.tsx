import React from "react";


interface IPaddedPageProps {
    heading: string,
    subHeading: string,
    children: JSX.Element
}

export const PaddedPage = ({ heading, subHeading, children }: IPaddedPageProps) => {
    return (
        <div className="padded-page">
            <div className="padded-page__content">
                <div className="padded-page__head">
                    <h1>{heading}</h1>
                    <p>{subHeading}</p>
                </div>
                {children}
            </div>
        </div>
    );
};
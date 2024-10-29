import React, { useState } from "react";
import { Card } from "shards-react";
import Link from "next/link";

import { PaddedPage } from '../../components/paddedPage/paddedPage';
import { TagItem } from '../../components/tagItem/tagItem';
import { Button } from '../../components/button/button';
import { useAxios } from '../../hooks/useAxios';

export const Dashboard = ({ tutorials }) => {

    const [dashboardTutorials, setDashboardTutorials] = useState(tutorials);
    const { performRequest, requestInProgress, responseData } = useAxios();

    const handleDeleteClick = async (tutorial: any) => {
        await performRequest({
            endpoint: 'write',
            method: 'DELETE',
            payload: { id: tutorial.id },
        });

        const refreshedTutorials = await performRequest({
            endpoint: 'write',
            method: 'GET'
        });

        setDashboardTutorials(refreshedTutorials);
    };

    return (
        <PaddedPage
            heading="Dashboard"
            subHeading="Here's where you'll find tutorials you've written."
        >

            <div className="dashboard">
                <Card className="dashboard__card">

                    {/** Tutorial list table */}
                    <table className="dashboard__table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Featured Image</th>
                                <th>Tags</th>
                                <th>Slug</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {dashboardTutorials.map((tutorial, index) => {
                                return (
                                    <tr
                                        className="dashboard__row"
                                        key={`${tutorial.title}__${index}`}
                                    >
                                        {/** Title and enabled */}
                                        <td>
                                            <span
                                                className={`circle ${tutorial.enabled ? "enabled" : "not-enabled"
                                                    }`}
                                            />
                                            <Link href={`/write/${tutorial.id}`}>
                                                <a className="dashboard__row-link">{tutorial.title}</a>
                                            </Link>
                                        </td>

                                        {/** Featured Image */}
                                        <td>
                                            {tutorial.featuredImage ? (
                                                <img
                                                    className="dashboard__row-fi"
                                                    src={tutorial.featuredImage}
                                                />
                                            ) : (
                                                <i className="dashboard__row-fi fas fa-image " />
                                            )}
                                        </td>

                                        {/** Tags */}
                                        <td className="dashboard__row-tags">
                                            <div className="dashboard__row-tags-inner" >
                                                {tutorial.tags.map((tag, index) =>
                                                    <TagItem
                                                        key={index}
                                                        tagId={tag.id}
                                                        tagName={tag.tag}
                                                        useMargin={true}
                                                    />

                                                )}
                                            </div>
                                        </td>

                                        {/** Slug Url */}
                                        <td>
                                            {(tutorial.enabled)
                                                ? <a
                                                    className={`dashboard__row-slug enabled`}
                                                    href={`/tutorial/${tutorial.slug}`}
                                                >
                                                    {tutorial.slug}
                                                </a>
                                                : <p
                                                    className="dashboard__row-slug"
                                                >
                                                    {tutorial.slug}
                                                </p>
                                            }

                                        </td>

                                        {/** Deletion action */}
                                        <td>
                                            <Button
                                                style={'danger'}
                                                onClick={() => handleDeleteClick(tutorial)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>
            </div>
        </PaddedPage>
    )
};
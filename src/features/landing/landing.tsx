import React from 'react';

import { SiteBanner } from './siteBanner/siteBanner';
import { TutorialBannerList } from './tutorialBannerList/tutorialBannerList';

interface ILandingProps {
    tutorials: any,
};

export const Landing = ({ tutorials }: ILandingProps) => {

    return (
        <div className="landing">
            <SiteBanner />
            <TutorialBannerList
                tutorials={tutorials}
            />
        </div>
    );
};
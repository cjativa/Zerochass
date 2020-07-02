type TutorialColors = 'pink' | 'teal' | 'black' | 'white';

interface TutorialSection {
    id: number,
    title: string,
    content: string,
    isDeleted?: boolean,
};

export interface Tutorial {
    id: number,

    title: string,
    description1: string,
    description2: string,

    sections: TutorialSection[],

    tags: string[],
    color: TutorialColors,

    featuredImage: string,
    enabled: boolean,

    codeUrl?: string,
    liveUrl?: string,
};

/** A tutorial request can have 
 * - an existing featured image -- which would be a string (or object, if it didn't have a featured image prior) */
export interface TutorialRequest {
    id?: number,

    title: string,
    description1: string,
    description2: string,

    sections: TutorialSection[] ,

    tags: string[],
    color: TutorialColors,

    featuredImage: { dataUrl: string } | string,
    enabled: boolean,
};

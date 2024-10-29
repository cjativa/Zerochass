import { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';

import { fetcher } from '../../../../server/api/constants/fetcher';

export const Profile = () => {

    const { data, error } = useSWR('/api/profile', fetcher);

    const [profileImage, setProfileImage] = useState(null);
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [heading, setHeading] = useState('');
    const [website, setWebsite] = useState('');

    useEffect(() => {

        if (data) {
            setProfileImage(data.profileImage);
            setName(data.name);
            setAbout(data.about || '');
            setHeading(data.heading || '');
            setWebsite(data.website || '');
        }

    }, [data]);

    const onSave = async () => {
        const data = { profileImage, name, about, heading, website };
        const { data: updatedProfile } = (await axios({ url: '/api/profile', data, method: 'POST' }));
    };

    return (
        <div className="profile">

            {/** Heading section */}
            <div className="profile__heading">
                {<img src={profileImage} />}
                <div className="form-field">
                    <label className="form-field__label">Heading</label>
                    <input
                        className="form-field__input"
                        type="text"
                        placeholder="I'm a newbie software engineer"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                    />
                </div>
            </div>

            {/** Divider */}
            <hr className="divider" />

            {/** Rest of profile information */}
            <div className="profile__body">

                {/** Name field */}
                <div className="form-field">
                    <label className="form-field__label">Name</label>
                    <input
                        className="form-field__input"
                        type="text" value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/** About Me field */}
                <div className="form-field">
                    <label className="form-field__label">About Me</label>
                    <textarea 
                    className="form-field__ta" 
                    placeholder='A quick little snippet about you — something like "Coffee afficionado on my journey to save our world from behind my desktop"' value={about} onChange={(e) => setAbout(e.target.value)} />
                </div>

                {/** Website field */}
                <div className="form-field">
                    <label className="form-field__label">Website</label>
                    <input className="form-field__input" type="text" placeholder="Enter your website URL here" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                {/** Save */}
                <div className="form-field">
                    <button onClick={() => onSave()} className="form-field__button save">Save</button>
                </div>
            </div>
        </div>
    )
};
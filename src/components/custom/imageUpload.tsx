import { useState, useEffect, useContext } from 'react';

export const ImageUpload = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    const fileChangedHandler = event => {
        const file = event.target.files[0];
        setSelectedFile(file);
    }

    return (
        <>
            <input type="file" onChange={fileChangedHandler} />
        </>
    )
};
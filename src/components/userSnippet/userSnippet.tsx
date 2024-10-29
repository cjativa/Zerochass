
interface IUserSnip {

    profileImageUrl: string,
    name?: string,
    username?: string,

    usePadding?: boolean,
};

export const UserSnip = ({ profileImageUrl, name, username, usePadding = true }: IUserSnip) => {
    const padClass = (usePadding) ? 'fill' : '';

    return (
        <div className={`user-snip ${padClass}`}>

            {/** Always show therofile picture circle */}
            <img src={profileImageUrl} className="user-snip__avi" />

            {/** Only show name and username when both are available */}
            {name && username &&
                <div className="user-snip__details">
                    <p>{name}</p>
                    <p className="user-snip__username">@{username}</p>
                </div>
            }
        </div>
    );
};
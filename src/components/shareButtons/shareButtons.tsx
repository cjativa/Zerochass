import { CustomIcon } from '../custom/CustomIcon';
import { createShareForPlatform } from '../custom/ShareGenerator'

interface Props {
    link: string,
    title: string,
    text: string
}


export const ShareButtons = (props: Props) => {

    const { title, link, text } = props;

    const share = (platform: 'FACEBOOK' | 'TWITTER' | 'LINKEDIN') => {
        const shareLink = createShareForPlatform(link, title, platform, text);
        window.open(shareLink, '_blank');
    }

    const shareTwitter = () => {
        share("TWITTER");
    };

    const shareFacebook = () => {
        share("FACEBOOK");
    };

    const shareLinkedIn = () => {
        share("LINKEDIN");
    };

    return (
        <div className="share-btns">
            {/** Facebook icon */}
            <CustomIcon icon={`fab fa-facebook-f`} color={`#4267B2`} onClick={shareFacebook} />
            {/** Twitter icon */}
            <CustomIcon icon={`fab fa-twitter`} color={`#1DA1F2`} onClick={shareTwitter} />
            {/** LinkedIn icon */}
            <CustomIcon icon={`fab fa-linkedin-in`} color={`#0072b1`} onClick={shareLinkedIn} />
        </div>
    )
}
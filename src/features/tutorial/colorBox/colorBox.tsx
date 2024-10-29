
interface IColorBoxProps {
    title: string,
    children: JSX.Element
};

export const ColorBox = ({ title, children }) => {
    return (
        <div className="color-box">
            <span className="color-box__title">
                {title}
            </span>
            <div className="color-box__content">
                {children}
            </div>
        </div>
    );
};
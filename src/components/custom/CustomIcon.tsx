interface Props {
    icon: string,
    color: string,
    onClick: any,
    stacked?: boolean
}

export const CustomIcon = (props: Props) => {

    const { icon, color, onClick, stacked } = props;
    const shouldStack = (stacked == true || stacked == undefined) ? true : false;
    let className = shouldStack ? `fa-stack fa-2x circle` : '';

    return (
        <span className={`${className}`} onClick={() => { onClick() }}>
            {shouldStack && <i className={`fas fa-circle fa-stack-2x bg`} style={{ color }} />}
            <i className={`${icon} fa-stack-1x fa-inverse fg`}></i>
        </span>
    );
}
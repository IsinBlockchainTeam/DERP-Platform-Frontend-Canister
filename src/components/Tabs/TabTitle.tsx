type Props = {
    title: string;
    rightSlot?: JSX.Element;
}


const TabTitle = ({ title, rightSlot }: Props) => {
    return <div className="flex justify-between items-center" style={{marginTop: '20px', marginBottom: '20px'}}>
        <span className="text-3xl font-light">{title}</span>
        {rightSlot && rightSlot}
    </div>
}

export default TabTitle;

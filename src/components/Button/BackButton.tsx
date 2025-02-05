export interface Props {
    onGoBack: () => void;
}


const BackButton = ({
    onGoBack
}: Props) => {
    return <label className="btn btn-accent btn-circle btn-sm mr-4 text-white" onClick={onGoBack}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
    </label>
}


export default BackButton;

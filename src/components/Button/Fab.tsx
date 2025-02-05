export type Props = {
    text: string;
    disabled?: boolean;
    onClick: () => void;
};

export default function Fab({ text, disabled, onClick }: Props) {
    return (
        <div className="fixed bottom-5 right-5">
            <button
                className="btn btn-primary"
                onClick={onClick}
                disabled={disabled}
            >
                {text}
            </button>
        </div>
    );
}

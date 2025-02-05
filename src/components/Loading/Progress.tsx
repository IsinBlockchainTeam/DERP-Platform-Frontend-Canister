interface Props {
    marginYClassName?: string;
}

function Progress({marginYClassName = 'my-8'}: Props) {
    return (
        <div className={'flex justify-center ' + marginYClassName}>
            <progress className="progress w-56 progress-primary" />
        </div>
    );
}

export default Progress;
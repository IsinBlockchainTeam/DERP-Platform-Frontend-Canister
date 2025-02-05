import LoadingSpinner from './LoadingSpinner';
import {useEffect, useRef, useState} from 'react';

// It shows an overlay loader. This loader assumes the size of the first parent node with relative position.
// To change the size of the loader, it may therefore be necessary to change the position value of the parent node to relative.
function FormLoader() {
    const [maskStyle, setMaskStyle] = useState({top: 0, left: 0});
    const loaderContainer = useRef<HTMLDivElement>(null);

    const initMaskTop = () => {
        const relativeParents = document.querySelectorAll('.relative');

        if(relativeParents.length > 0) {
            const relativeParent = relativeParents[relativeParents.length - 1];

            if(relativeParent && relativeParent.scrollTop !== maskStyle.top)
                setMaskStyle({...maskStyle, top: relativeParent.scrollTop});

            return relativeParent
        }

        return undefined;
    }

    const onParentScroll = (relativeParent: Element) => {
        if(relativeParent && relativeParent.scrollTop !== maskStyle.top)
            setMaskStyle({...maskStyle, top: relativeParent.scrollTop});
    }

    useEffect(() => {
        const relativeParent = initMaskTop();

        if(relativeParent) {
            const listener = () => onParentScroll(relativeParent);
            relativeParent.addEventListener('scroll', listener)

            return () => {
                relativeParent.removeEventListener('scroll', listener);
            }
        }
    }, []);

    return (
        <div ref={loaderContainer}>
            <div className="w-full h-full absolute bg-gray-200 opacity-40 top-0 left-0" style={maskStyle}></div>
            <div className="flex items-center w-full h-full absolute top-0 left-0" style={maskStyle}>
                <LoadingSpinner/>
            </div>
        </div>
    );
}

export default FormLoader;
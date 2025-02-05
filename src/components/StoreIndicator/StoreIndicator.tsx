import React from 'react';
import { StoreDto } from '../../dto/stores/StoreDto';


interface Props {
    store: StoreDto,
    onInfo: () => void,
}

const StoreIndicator = ({
    store,
    onInfo
}: Props) => {
    return <>
        <div className="flex flex-row col-auto items-center my-4 mx-0">
            <div className="text-4xl font-light">{store.name}</div>
            <div className='btn btn-ghost btn-sm btn-square ml-2' onClick={onInfo}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            </div>
        </div>
    </>
}

export default StoreIndicator;

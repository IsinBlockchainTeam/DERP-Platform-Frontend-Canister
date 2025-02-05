import { Outlet } from 'react-router-dom';

export default function ChainsTab() {
    return (
        <div className='flex w-full flex-col'>
            <Outlet />
        </div>
    )
}

import { Outlet } from 'react-router';

export default function OffersTab() {
    return (
        <div className='flex w-full flex-col'>
            <Outlet />
        </div>
    )
}
import { Outlet } from "react-router-dom";

const AccountingTransactionsTab = () => {
    return (
        <div className="flex flex-col">
            <Outlet />
        </div>
    )
}

export default AccountingTransactionsTab;

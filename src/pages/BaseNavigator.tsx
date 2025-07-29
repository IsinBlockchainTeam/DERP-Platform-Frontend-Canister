import { Outlet, useParams } from "react-router";
import Header from "../components/Header/Header";
import { GenericMenuContent } from "../components/Menu/GenericMenu";
import { ResourceType } from "../components/Menu/MenuProps";
import { useEffect, useMemo, useState } from "react";
import { auth } from "../api/auth";
import { UserRole } from "../model/UserRole";
import Sidebar from "../components/SideBar/Sidebar";

function BaseNavigator() {
    const [role, setRole] = useState<UserRole>();
    const { merchantId, resellerId } = useParams();

    useEffect(() => {
        try {
            console.log("Getting supplier data");
            const data = auth.getSupplierData();
            const roleFromAuth = data.role;
            console.log(data)
            setRole(roleFromAuth);
        } catch (e) {
            console.error("Error getting supplier data:", e);
        }
    }, []);

    const currentResource: ResourceType = useMemo(() => {
        if (merchantId) {
            return "merchant";
        }

        if (resellerId) {
            return "reseller";
        }

        return "admin";
    }, [merchantId, resellerId]);

    return (
        <main>
            {/*<Header role={role} />*/}
            <div className="drawer">
                <input id="derp-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <div className="container-fluid items-center h-screen w-full max-w-full">
                        <Outlet />
                    </div>
                </div>
                <Sidebar role={role} resourceType={currentResource} />
            </div>
        </main>
    );
}

export default BaseNavigator;

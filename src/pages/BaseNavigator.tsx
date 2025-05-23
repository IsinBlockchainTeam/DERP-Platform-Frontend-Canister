import { Outlet, useParams } from "react-router";
import Header from "../components/Header/Header";
import { GenericMenuContent } from "../components/Menu/GenericMenu";
import { ResourceType } from "../components/Menu/MenuProps";
import { useEffect, useMemo, useState } from "react";
import { auth } from "../api/auth";
import { UserRole } from "../model/UserRole";

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
            <Header role={role} />
            <div className="drawer">
                <input id="derp-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <div className="container-fluid items-center h-screen w-full max-w-full">
                        <Outlet />
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="derp-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        <GenericMenuContent role={role} resourceType={currentResource} />
                    </ul>
                </div>
            </div>
        </main>
    );
}

export default BaseNavigator;

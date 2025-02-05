import { useNavigate } from "react-router";
import { auth } from "../../api/auth";
import { UserRole } from "../../model/UserRole";
import { useEffect, useState } from "react";
import { DEFAULT_FONT } from "../../constants";
import { insertFontCSSRule } from "../../utils";
import { useTranslation } from "react-i18next";
import { AdminMenu } from "../Menu/AdminMenu";
import { MerchantMenu } from "../Menu/MerchantMenu";
import { ResellerMenu } from "../Menu/ResellerMenu";

interface Props {
    color?: string;
    storeName?: string;
    
    // The path that the logo should link to when clicked
    homeUrl?: string;
    textColor?: string;
    font?: string;
}

function Header({
    color,
    storeName = "Decentralized ERP",
    homeUrl = "/",
    textColor = "black",
    font = DEFAULT_FONT,
}: Props) {
    const navigate = useNavigate();
    const [role, setRole] = useState<UserRole>();
    const colorRegex = new RegExp("[#][a-fA-F0-9]{6}");
    const { t } = useTranslation(undefined, { keyPrefix: "menu" });

    const logout = () => {
        auth.logout()
            .then(() => {
                navigate("/login");
            })
            .catch(() => {
                console.log("Error during logout");
            });
    };

    useEffect(() => {
        try {
            console.log("Getting supplier data");
            const data = auth.getSupplierData();
            const role = data.role;
            console.log(data)
            setRole(role);
        } catch (e) {}

        insertFontCSSRule(font);
    }, []);

    return (
        <div
            className={`top-0 z-10 navbar bg-primary h-16`}
            style={
                color && colorRegex.test(color)
                    ? { backgroundColor: color }
                    : {}
            }
        >
            <div className="navbar-start">
                {
                    (() => { 
                        switch(role) {
                            case UserRole.SUPPLIER:
                                return <MerchantMenu/>;

                            case UserRole.RESELLER:
                                return <ResellerMenu/>

                            case UserRole.ADMIN:
                                return <AdminMenu/>

                            default:
                                return <div>User Role not recognized</div>
                        }
                    })()
                }
            </div>
            <div className="navbar-center">
                <a
                    href={homeUrl}
                    className="btn btn-ghost normal-case text-xl"
                    style={{ color: textColor, fontFamily: font }}
                >
                    <img src="/derp-logo.png" alt="DERP Logo" className="w-full h-full" />
                </a>
            </div>
            <div className="navbar-end">
                {role && [UserRole.SUPPLIER, UserRole.ADMIN, UserRole.RESELLER].includes(role) && (
                    <a onClick={logout} className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                        </svg>
                    </a>
                )}
            </div>
        </div>
    );
}

export default Header;

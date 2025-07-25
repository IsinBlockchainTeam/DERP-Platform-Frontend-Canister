import { useNavigate } from "react-router";
import { auth } from "../../api/auth";
import { UserRole } from "../../model/UserRole";
import { DEFAULT_FONT } from "../../constants";

interface Props {
    color?: string;
    storeName?: string;

    // The path that the logo should link to when clicked
    homeUrl?: string;
    textColor?: string;
    font?: string;
    role?: UserRole;
}

function Header({
    color,
    storeName = "Decentralized ERP",
    homeUrl = "/",
    textColor = "black",
    font = DEFAULT_FONT,
    role,
}: Props) {
    const navigate = useNavigate();
    const colorRegex = new RegExp("[#][a-fA-F0-9]{6}");

    const logout = () => {
        auth.logout()
            .then(() => {
                navigate("/login");
            })
            .catch(() => {
                console.log("Error during logout");
            });
    };

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
                { /* Hamburger menu */ }
                <label tabIndex={0} className="btn btn-ghost btn-circle text-white" htmlFor="derp-drawer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h7"
                        />
                    </svg>
                </label>
            </div>
            <div className="navbar-center">
                <a
                    href={homeUrl}
                    className="btn btn-ghost normal-case text-xl"
                    style={{ color: textColor, fontFamily: font }}
                >
                    <img src="/datashaker-logo.png" alt="DERP Logo" className="w-full h-full" />
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

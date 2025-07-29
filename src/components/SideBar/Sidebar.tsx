import {GenericMenuContent} from "../Menu/GenericMenu";
import {ResourceType} from "../Menu/MenuProps";
import {useState} from "react";
import {UserRole} from "../../model/UserRole";
import {auth} from "../../api/auth";
import {useNavigate} from "react-router-dom";

interface SidebarProps {
    resourceType: ResourceType;
    role?: UserRole;
}


const Sidebar = (props:SidebarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

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
        <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Header with Menu Button */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#FE9C00] to-[#1B2BD3] flex items-center justify-between px-4 z-30 lg:hidden shadow-lg">
                <button
                    className="p-2 text-white bg-transparent border-none rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10 hover:scale-105"
                    onClick={toggleMobileMenu}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="text-xl font-bold text-white tracking-wide">
                    DATASHAKER
                </div>
            </div>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-[#F9EFED] to-white border-r border-[#FE9C00]/20 transform transition-transform duration-300 ease-in-out z-50 shadow-2xl flex flex-col lg:relative lg:translate-x-0 lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

                {/* Logo Section */}
                <div className="p-6 border-b border-[#FE9C00]/30 flex items-center justify-between bg-primary text-white">
                    <div className="flex items-center gap-3">
                        <img src="/datashaker-logo.png" alt="DERP Logo" className="w-full h-full"/>
                    </div>

                    {/* Close button for mobile */}
                    <button
                        className="p-2 text-white bg-transparent border-none rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10 hover:scale-105 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Menu */}
                <GenericMenuContent
                    role={props.role}
                    resourceType={props.resourceType}
                    behaviorAfterClick={() => {
                        if (window.innerWidth < 1024) {
                        toggleMobileMenu();
                    }}}
                />
                {/* User Section */}
                <div className="p-5 border-t border-[#FE9C00]/30 bg-[#F9EFED]">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#FE9C00]/20 transition-all duration-200 hover:border-[#FE9C00]/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#FE9C00] to-[#1B2BD3] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[#000038] leading-tight"></div>
                            <div className="text-xs text-[#737373] leading-tight">
                                {props.role ? props.role : 'User Role'}
                            </div>
                        </div>
                        {props.role && [UserRole.SUPPLIER, UserRole.ADMIN, UserRole.RESELLER].includes(props.role) && (
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
            </div>
        </>
    );
};

export default Sidebar;
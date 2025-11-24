import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {GenericMenuProps, MenuRouteCategory, MenuRouteConfig} from "./MenuProps";
import {UserRole} from "../../model/UserRole";
import {useState} from "react";

// Define all possible application routes here

const allAppRoutes: MenuRouteCategory[] = [
    {
        id: "administration",
        name: "Administration",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>),
        routes: [
            {
                name: "Gestione Aziende",
                url: '/admin',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    </svg>
                ),
                roles: [UserRole.ADMIN],
                resourceTypes: ['admin','merchant', 'reseller', 'common'],
            }
        ],
        roles: [UserRole.ADMIN],
        resourceTypes: ['admin','merchant', 'reseller', 'common'],
    },
    {
        id: "dashboard",
        name: "Analytics",
        icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>),
        routes: [
            {
                name: "Dashboard",
                url: (merchantId) => `/merchant/${merchantId}/analytics`,
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                ),
                roles: [UserRole.ADMIN, UserRole.SUPPLIER],
                resourceTypes: ['merchant'],
            },

        ],
        roles: [UserRole.ADMIN, UserRole.SUPPLIER],
        resourceTypes: ['merchant']
    },
    {
        id: "stores",
        name: "Gestione Azienda",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        routes: [
            {
                name: "I miei Store",
                url: (merchantId) => `/merchant/${merchantId}/stores`,
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                    </svg>
                ),
                roles: [UserRole.ADMIN,UserRole.SUPPLIER],
                resourceTypes: ['merchant'],
            },
            {
            name: "Integrazioni",
            url: (merchantId) => `/merchant/${merchantId}/interfaces`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
                </svg>
            ),
            roles: [UserRole.ADMIN,UserRole.SUPPLIER],
            resourceTypes: ['merchant'],
        },
        ],
        roles: [UserRole.ADMIN,UserRole.SUPPLIER],
        resourceTypes: ['merchant']
    }
];


export const GenericMenuContent = (props: GenericMenuProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: "menu" }); // Assuming "menu" is a suitable general prefix
    const { merchantId, resellerId } = useParams();
    const [activeItem, setActiveItem] = useState('dashboard');
    const [expandedSections, setExpandedSections] = useState(['dashboard']);
    const navigate = useNavigate();

    // Determine the correct ID to use based on resourceType
    const currentId = props.resourceType === 'merchant' ? merchantId : props.resourceType === 'reseller' ? resellerId : undefined;

    if (props.resourceType === 'merchant' && !merchantId) {
        return null; // Or some other handling if merchantId is expected but not present
    }
    if (props.resourceType === 'reseller' && !resellerId) {
        return null; // Or some other handling if resellerId is expected but not present
    }

    const toggleSection = (sectionId:string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const handleItemClick = (item:MenuRouteConfig) => {
        setActiveItem(item.name);
        navigate(getUrl(item) || '/');
        if(props.behaviorAfterClick)
            props.behaviorAfterClick();

    };

    const getUrl = (route: MenuRouteConfig) => {
        let finalUrl = "";
        if (typeof route.url === "function") {
            // Only pass ID if the URL function expects it (e.g. for merchant or reseller specific routes)
            if ((props.resourceType === 'merchant' && merchantId) || (props.resourceType === 'reseller' && resellerId)) {
                finalUrl = route.url(currentId);
            } else if (!currentId && route.url.length === 0) { // For functions like () => "/some/path"
                finalUrl = route.url();
            } else {
                // This case should ideally not happen if routes are defined correctly with resourceTypes
                // Or the URL function should handle undefined id gracefully
                console.warn(`URL function for route "${route.name}" was called without expected ID for resourceType "${props.resourceType}".`);
                return ""; // Skip rendering this route if URL cannot be determined
            }
        } else {
            finalUrl = route.url;
        }

        if (!finalUrl && route.name !== 'homepage') { // Homepage might be "/" and currentId could be undefined for admin
            // If finalUrl is still empty (and not homepage), something is wrong.
            // This check might need refinement based on how homepage URL is defined for admin/common.
            // For now, if not homepage and URL is empty, skip.
            console.warn(`Skipping route "${route.name}" due to empty URL.`);
            return "";
        }
        return finalUrl;
    }

    const checkShow = (route: MenuRouteCategory | MenuRouteConfig) => {
        return ( route.resourceTypes.includes(props.resourceType) || route.resourceTypes.includes('common') ) && (props.role && route.roles.includes(props.role));
    }

    return (
        <nav className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
                {allAppRoutes.map((r) => {
                    return (
                        checkShow(r) ? <div key={r.id} className="space-y-2">
                            <button
                                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-[#737373] hover:text-[#000038] transition-colors duration-200"
                                onClick={() => toggleSection(r.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-[#FE9C00]">{r.icon}</span>
                                    <span>{r.name}</span>
                                </div>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${expandedSections.includes(r.id) ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                            {expandedSections.includes(r.id) && (
                                <ul className="space-y-1 ml-4">
                                    {r.routes.map((item) => (
                                        <li key={item.name}>
                                            <button
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm relative overflow-hidden ${
                                                    activeItem === item.name
                                                        ? 'text-white bg-primary shadow-lg transform translate-x-1'
                                                        : 'text-[#737373] hover:text-[#000038] hover:bg-[#FE9C00]/10 hover:transform hover:translate-x-1'
                                                }`}
                                                onClick={() => handleItemClick(item)}
                                            >
                                          <span className="relative z-10 flex-shrink-0">
                                            {item.icon}
                                          </span>
                                        <span className="relative z-10 font-medium">{item.name}</span>
                                        {activeItem === item.name && (
                                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-white rounded-l z-10" />
                                        )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div> : <></>
                );
                })}
                </div>
                </nav>
                )
        ;
};
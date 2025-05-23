import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { GenericMenuProps, MenuRouteConfig, ResourceType } from "./MenuProps";
import { UserRole } from "../../model/UserRole";

// Define all possible application routes here
const allAppRoutes: MenuRouteConfig[] = [
    // Common routes (can be overridden by specific resourceType if name matches)
    {
        name: "homepage",
        url: "/",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        ),
        resourceTypes: ['common'], // Available for all resource types
    },
    // Merchant specific routes
    {
        name: "interfaces",
        url: (merchantId) => `/merchant/${merchantId}/interfaces`,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
            </svg>
        ),
        resourceTypes: ['merchant'],
    },
    {
        name: "stores",
        url: (merchantId) => `/merchant/${merchantId}/stores`,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
        ),
        resourceTypes: ['merchant'],
    },
    {
        name: "dashboard", // This was "balance" in MerchantMenu, renaming for consistency or keeping as "dashboard"
        url: (merchantId) => `/merchant/${merchantId}/balance`,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
        ),
        show: (role, resourceType) => resourceType === 'merchant' && role !== UserRole.SUPPLIER,
        resourceTypes: ['merchant'],
    },
    // Reseller specific routes can be added here if any, currently ResellerMenu only had 'homepage'
    // Admin specific routes can be added here if any, currently AdminMenu only had 'homepage'
];

export const GenericMenuContent = ({ role, resourceType }: GenericMenuProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: "menu" }); // Assuming "menu" is a suitable general prefix
    const { merchantId, resellerId } = useParams();

    // Determine the correct ID to use based on resourceType
    const currentId = resourceType === 'merchant' ? merchantId : resourceType === 'reseller' ? resellerId : undefined;

    if (resourceType === 'merchant' && !merchantId) {
        return null; // Or some other handling if merchantId is expected but not present
    }
    if (resourceType === 'reseller' && !resellerId) {
        return null; // Or some other handling if resellerId is expected but not present
    }

    const visibleRoutes = allAppRoutes.filter(route => {
        // Check if the route is for the current resourceType or is common
        const isForCurrentResource = route.resourceTypes.includes(resourceType) || route.resourceTypes.includes('common');
        if (!isForCurrentResource) {
            return false;
        }

        // If a role is provided and the route has a show condition, evaluate it
        if (role && route.show) {
            return route.show(role, resourceType);
        }

        // If no role is provided (e.g. loading) but route has a show condition,
        // we might hide it by default or handle based on specific requirements.
        // For now, if role is not defined, and show condition exists, we hide it.
        // If role is not defined and no show condition, it means it's always visible for this resource type.
        if (!role && route.show) {
            return false; // Hide if role not loaded and show condition exists
        }

        return true; // Otherwise, the route is visible
    });

    return (
        <div
            tabIndex={0}
            className="menu mt-3 pr-2 py-2"
        >
            {visibleRoutes.map((r) => {
                let finalUrl = "";
                if (typeof r.url === "function") {
                    // Only pass ID if the URL function expects it (e.g. for merchant or reseller specific routes)
                    if ((resourceType === 'merchant' && merchantId) || (resourceType === 'reseller' && resellerId)) {
                        finalUrl = r.url(currentId);
                    } else if (!currentId && r.url.length === 0) { // For functions like () => "/some/path"
                        finalUrl = r.url();
                    } else {
                        // This case should ideally not happen if routes are defined correctly with resourceTypes
                        // Or the URL function should handle undefined id gracefully
                        console.warn(`URL function for route "${r.name}" was called without expected ID for resourceType "${resourceType}".`);
                        return null; // Skip rendering this route if URL cannot be determined
                    }
                } else {
                    finalUrl = r.url;
                }

                if (!finalUrl && r.name !== 'homepage') { // Homepage might be "/" and currentId could be undefined for admin
                    // If finalUrl is still empty (and not homepage), something is wrong.
                    // This check might need refinement based on how homepage URL is defined for admin/common.
                    // For now, if not homepage and URL is empty, skip.
                    console.warn(`Skipping route "${r.name}" due to empty URL.`);
                    return null;
                }


                return (
                    <li key={r.name} className="menu-item mr-2 mt-2">
                        <a href={finalUrl}>
                            {r.icon}
                            {t(r.name as any)} {/* Assuming translation keys match route names */}
                        </a>
                    </li>
                );
            })}
        </div>
    );
}; 
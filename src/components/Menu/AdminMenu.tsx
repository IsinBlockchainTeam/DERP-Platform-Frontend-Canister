import { useTranslation } from "react-i18next";

const routes = [
    {
        name: "homepage",
        url: "/",
    },
];

export const AdminMenu = () => {
    const { t } = useTranslation(undefined, { keyPrefix: "adminMenu" });

    return (
        <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
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

            <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
                {routes.map((r) => (
                    <li key={r.url}>
                        <a href={r.url}>{t(r.name as any)}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

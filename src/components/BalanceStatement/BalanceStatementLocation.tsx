import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import SmartIntInput from "../SmartIntInput/SmartIntInput";


interface Props {
    merchantId: string;
    categoryId: string;
    year: number;
    item?: {
        id: number;
        label: string;
    };
    month?: number;
    day?: number;
}

const BalanceStatementLocation = ({
    merchantId,
    categoryId,
    year,
    item,
    month,
    day
}: Props) => {
    const {i18n} = useTranslation();

    const monthFormat = (month: number) => {
        const lang = i18n.language;
        const date = new Date(2020, month); // Year and day are arbitrary; monthIndex is 0-based
        return new Intl.DateTimeFormat(lang, { month: 'long' }).format(date);
    }

    return <div className="breadcrumbs text-sm">
        <ul className="pb-3 ps-3">
            <li>
                <NavLink
                to={`/merchant/${merchantId}/balance/${year}/categories/${categoryId}`}
                className="font-bold text-primary"
            >{year}</NavLink>
            </li>
            {
                item !== undefined && <li><NavLink
                    to={`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${item.id}`}
                    className="font-bold text-primary"
                >{item.label}</NavLink></li>
            }
            {
                month !== undefined && <li><NavLink
                    to={`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${item?.id}/months/${month}`}
                    className="font-bold text-primary"
                >{monthFormat(month)}</NavLink></li>
            }
            {
                day !== undefined && <li><NavLink
                    to={`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${item?.id}/months/${month}/days/${day}`}
                    className="font-bold text-primary"
                >{day}</NavLink></li>
            }
        </ul>
    </div>
}


export default BalanceStatementLocation;

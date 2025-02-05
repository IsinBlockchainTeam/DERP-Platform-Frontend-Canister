import { useTranslation } from 'react-i18next';

export type GenericTableColumn<T> = {
    header: string;
    accessor: (keyof T) | ((row: T) => string | JSX.Element | undefined);
};

export type GenericTableAction<T> = {
    label: string | JSX.Element;
    onClick: (row: T) => void;
}

type TableProps<T> = {
    data: T[];
    columns: GenericTableColumn<T>[];
    actions?: GenericTableAction<T>[];
    isActive?: boolean | ((row: T) => boolean);
};


/**
 * A generic table component that can be used to display any data in a table format.
 * MUST be wrapped in a flex column to work properly.
 */
const GenericTable = <T extends object>(props: TableProps<T>) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'genericTable' });

    const renderColumn = (column: GenericTableColumn<T>, row: T): string | JSX.Element => {
        if (typeof column.accessor === "function") {
            return column.accessor(row) ?? "-";
        }

        return (row[column.accessor] ?? "-") + "";
    };

    const activeClass = (row: T): string => {
        if (props.isActive) {
            if (typeof props.isActive === "function") {
                return props.isActive(row) ? "active" : "";
            } else {
                return props.isActive ? "active" : "";
            }
        }

        return "";
    }

    return (
        <div className="overflow-x-auto">
            <table className="table w-full overflow-hidden">
                <thead>
                    <tr>
                        {props.columns.map((column) => (
                            <th className="text-base" key={column.header}>{column.header}</th>
                        ))}

                        {props.actions && props.actions.length > 0 && <th className="text-base text-right">{t('actions')}</th>}
                    </tr>
                </thead>
                <tbody>
                    {props.data.length > 0 ? props.data.map((row: T, rowIndex) => (
                        <tr key={rowIndex} className={`hover ${activeClass(row)}`}>
                            {props.columns.map((column) => (
                                <td className="font-light" key={column.accessor as string}>{
                                    renderColumn(column, row)
                                }</td>
                            ))}

                            {props.actions && props.actions.length > 0 && <td className="text-right">
                                {props.actions.map((action, actionIndex) => (
                                    <button key={actionIndex} className="btn btn-ghost btn-sm" onClick={() => action.onClick(row)}>{action.label}</button>
                                ))}
                            </td>}
                        </tr>
                    )) : null
                    }
                </tbody>
            </table>
            {props.data.length === 0 && <div role="alert" style={{ padding: "30px" }} className="text-center">{t('noData')}</div>
            }
        </div>
    );
};

export default GenericTable;

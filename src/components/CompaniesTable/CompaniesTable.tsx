import GenericTable, { GenericTableColumn } from "../../components/Table/GenericTable";
import { InfoCompanyDto } from '../../dto/CompanyDto';
import { useTranslation } from 'react-i18next';

interface Props {
    data: InfoCompanyDto[];
    onDetails: (company: InfoCompanyDto) => void;
    onEdit?: (company: InfoCompanyDto) => void;
}

function CompaniesTable({
    data,
    onDetails,
    onEdit,
}: Props) {
    const { t } = useTranslation(undefined, { keyPrefix: 'companiesTable' });

    //TODO fare tutte le traduzioni
    const resellerColumns: GenericTableColumn<InfoCompanyDto>[] = [
        {
            header: t('businessName'),             // Represents the company name
            accessor: 'businessName',                 // Updated accessor
        },
        {
            header: t('additionalInfo'),                  // Additional information about the company
            accessor: 'additionalInfo',       // Updated accessor
        },
        {
            header: t('address'),              // Address of the company
            accessor: 'address',               // Updated accessor
        },
        {
            header: t('postalCodeAndLocation'),         // Postal code and location
            accessor: 'postalCodeAndLocation', // Updated accessor
        },
        {
            header: t('canton'),                // Canton (optional)
            accessor: 'canton',               // Updated accessor
        },
        {
            header: t('country'),                // Country (optional)
            accessor: 'country',              // Updated accessor
        },
        {
            header: t('idi'),             // IDI number (optional)
            accessor: 'idi',                   // Updated accessor
        },
        {
            header: t('vat'),             // VAT number (optional)
            accessor: 'vat',                   // Updated accessor
        },
        {
            header: t('phone'),               // Phone number
            accessor: 'phone',                 // Updated accessor
        },
        {
            header: t('webSite'),                    // Company website (optional)
            accessor: 'webSite',               // Updated accessor
        },
        {
            header: t('email'),                  // Email address
            accessor: 'email',                 // Updated accessor
        }
    ];


    const actions = [{
        label: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        ), onClick: (row: InfoCompanyDto) => {
            onDetails(row);
        }
    }]

    if (onEdit) {
        actions.push({
            label: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            ), onClick: (row) => {
                onEdit?.(row);
            }
        })
    }
    return (
        <>
            <GenericTable data={data} columns={resellerColumns}
                actions={actions}
            ></GenericTable>
        </>
    );
}

export default CompaniesTable;

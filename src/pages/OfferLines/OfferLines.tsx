import { NavLink, useLocation } from 'react-router-dom';
import React, { Fragment, useState } from 'react';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import GenericTable, { GenericTableColumn } from '../../components/Table/GenericTable';
import { useTranslation } from 'react-i18next';
import { OfferLine } from '../../dto/OfferLine';
import TabTitle from '../../components/Tabs/TabTitle';
import { Outlet } from 'react-router';

export default function OfferLines() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const { offerLines } = location.state || {};
    const { t } = useTranslation(undefined, { keyPrefix: "offerLinesPage" });


    const tableColumns: GenericTableColumn<OfferLine>[] = [
        {
            header: "ID",
            accessor: "id",
        },
        {
            header: t("description"),
            accessor: "description",
        },
        {
            header: t("quantity"),
            accessor: "quantity",
        },
        {
            header: t("price"),
            accessor: "price",
        }
    ];

    return loading ? (
                <div className="flex flex-row grow items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <Fragment>
                    <TabTitle
                        title="Offer Lines"
                    />
                    <div className="flex w-full flex-col" style={{ padding: '20px' }}>
                        <GenericTable data={offerLines} columns={tableColumns} />
                    </div>
                </Fragment>
            )

    // return (
    //     <div className="flex w-full flex-col p-8">
    //         <h1 className="text-5xl font-light mb-8">Offer lines dashboard</h1>
    //         <div role="tablist" className="tabs tabs-lifted">
    //             <input type="radio" role="tab" className="tab tab-active" aria-label="Offer lines" />
    //             <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
    //                 <GenericTable data={offerLines} columns={tableColumns} />
    //             </div>
    //         </div>
    //     </div>
    // );
}
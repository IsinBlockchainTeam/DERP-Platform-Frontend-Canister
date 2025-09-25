import { useEffect, useState } from 'react';
import { storeService } from '../../api/services/Store';
import { StoreDto } from '../../dto/stores/StoreDto';
import { useParams } from 'react-router-dom';
import { useStoreId } from '../../utils';


export const InvoiceOverview = () => {

    const [invoices, setInvoices] = useState<any[]>([]);
    const { merchantId } = useParams<{ merchantId: string }>();
    const storeId = useStoreId();

    useEffect(() => {
        setInvoices([
            {id: 1, amount: 100, date: new Date()},
            {id: 2, amount: 200, date: new Date()},
            {id: 3, amount: 300, date: new Date()},
        ])
    }, []);

    return <div className={"container mx-auto"}>
        <div className={"flex flex-col gap-10"}>
        <h1>InvoiceOverview</h1>
        <div className={"flex w-full flex-col gap-2"}>
            {invoices.map(invoice => (
                <div className="card bg-base-100 w-full shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Fattura {invoice.id}</h2>
                        <p>{invoice.amount}</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">Show detail</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
    </div>
}

export default InvoiceOverview;
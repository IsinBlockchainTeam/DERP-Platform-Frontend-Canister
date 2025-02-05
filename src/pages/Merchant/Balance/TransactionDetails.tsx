import { AccountingTransaction, TicketAccountingTransaction } from "@derp/company-canister";
import { ordersService } from "../../../api/services/Orders";
import { DownloadIcon } from "../../../components/Icons/Icons";

interface Props {
    transaction?: AccountingTransaction | null;
}

interface FieldProps {
    label: string;
    value: string;
}

const Field = ({ label, value }: FieldProps) => {
    return <div className="flex flex-row">
        <p className="font-bold">
            {label}:
        </p>
        <p className="ml-4">
            {value}
        </p>
    </div>
}

//const download = (data: string, filename: string) => {
//    const file = new Blob([data], { type: 'application/json' });
//    const a = document.createElement("a");
//    const url = URL.createObjectURL(file);
//    a.href = url;
//    a.download = filename;
//    a.click();
//    URL.revokeObjectURL(url);
//}

//const downloadUrl = (url: string, filename: string) => {
//    const a = document.createElement("a");
//    a.href = url;
//    a.download = filename;
//    a.click();
//    URL.revokeObjectURL(url);
//}


const downloadReceipts = (trx: TicketAccountingTransaction) => {
    if (!trx.PaymentDetails) {
        throw new Error("No payment details found");
    }

    for (const paymentDetail of trx.PaymentDetails) {
        const a = document.createElement("a");
        a.href = ordersService.getInvoiceProxyUrl(paymentDetail.externalUrl);
        // TODO:
        // fix this since it wont work locally we are trivially doing this
        if (a.href.includes("localhost:3000")) {
            a.href = a.href.replace("localhost:3000", "localhost:8080");
        }
        a.download = `receipt-${trx.Header.DLTERPId}-${paymentDetail.externalId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}


// TODO: i18n
// TODO: Un-hardcode source and status
// TODO: Un-hardcode trx type --- move TicketAccountingTransaction to a separate renderer
const TransactionDetails = ({ transaction }: Props) => {
    return <div className="p-5" style={{ minWidth: 500 }}>
        <>
            {transaction ?
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <Field label="ID" value={transaction.Header.DLTERPId || ""} />
                        <Field label="Currency" value={transaction.Header.Currency || ""} />
                        <Field label="Total" value={transaction.Header.TotalAmount?.toFixed(2) || ""} />
                        <Field label="Source" value="TCPOS" />{/*transaction.Header.Source || ""} /> */}
                        <Field label="Status" value="Not accounted" />{/*transaction.Header.Status || ""} /> */}
                    </div>
                    <div>
                        <button
                            className="btn btn-primary"
                            disabled={((transaction as TicketAccountingTransaction).PaymentDetails?.length || 0) < 1}
                            onClick={() => downloadReceipts(transaction as TicketAccountingTransaction)}
                        >
                            <DownloadIcon /> PDF
                        </button>
                    </div>
                </div>
                :
                <p>Choose a transaction</p>
            }
        </>
    </div>
};

export default TransactionDetails;

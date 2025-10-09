import InvoiceOverview from '../Invoices/SupplierInvoiceOverview';

type Props = {
    feature:string

}


export const FeatureDetailPage = (props:Props) => {

    return (<>
        {props.feature === 'invoice' && <InvoiceOverview />}
        </>
    );
}

export default FeatureDetailPage;
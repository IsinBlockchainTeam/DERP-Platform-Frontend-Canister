import InvoiceOverview from '../Invoices/InvoiceOverview';

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
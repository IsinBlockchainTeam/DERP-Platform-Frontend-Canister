import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type Props ={
    storeId: number;
    merchantId: number;
}


export const InvoiceAccessCard = (props:Props)=>{

    const navigate = useNavigate();

    return <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
            <img src="/invoice.jpg" alt="Invoices" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">Fatture</h2>
            <p>Accedi all'elenco completo delle tue fatture, scarica i documenti e monitora lo stato dei pagamenti</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={() => navigate(`/merchant/${props.merchantId}/stores/store/invoices?storeId=${props.storeId}`)}>Vai alle fatture</button>
            </div>
        </div>
    </div>
}

export default InvoiceAccessCard;


import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type Props ={
    destinationUrl: string;
    logoUrl: string;
    title: string;
    text: string;
    buttonText: string;
}


export const MenuAccessCard = (props:Props)=>{

    const navigate = useNavigate();

    return <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure className="h-48 overflow-hidden bg-base-200 ">
            <img src={props.logoUrl} alt="Invoices" className="w-full h-full object-contain p-3 " />
        </figure>
        <div className="card-body">
            <h2 className="card-title">{props.title}</h2>
            <p>{props.text}</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={() => navigate(props.destinationUrl)}>{props.buttonText}</button>
            </div>
        </div>
    </div>
}

export default MenuAccessCard;


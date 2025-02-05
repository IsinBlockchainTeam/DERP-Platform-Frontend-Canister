import {StoreDto} from "../../dto/stores/StoreDto";
import React from "react";
import "./StoreCard.css";

interface Props {
    store: StoreDto;
    actions: () => JSX.Element;
}

function StoreCard({store, actions}: Props) {
    return (
        <div className="card card-compact w-80 bg-base-100 shadow-xl m-3 card-bordered">
            <figure className="p-2 store-logo">
              <img src={`/stores/image?imageUrl=${store.imageUrl}`} alt="Store Image" className="object-contain w-full h-full" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{store.name}</h2>
                <span>{store.address}</span>
                <span>{store.postalCodeAndLocation}</span>
                <span>{store.country}</span>

                <div className="card-actions justify-end">
                    {actions()}
                </div>
            </div>
        </div>
    );
}

export default StoreCard;
import React, {useEffect, useState} from "react";
import SmartIntInput from "../SmartIntInput/SmartIntInput";

interface Props {
    onChangedQuantity: (quantity: number) => void;
    max?: number;
    min?: number;
}
function QuantityModifier ({onChangedQuantity, max = Number.MAX_SAFE_INTEGER, min = 0}: Props) {
    const [quantity, setQuantity] = useState(1);

    const decrease = () => {
        setQuantity(quantity-1);
    }

    const increase = () => {
        setQuantity(quantity+1);
    }

    useEffect(() => {
        onChangedQuantity(quantity);
    }, [quantity, onChangedQuantity])

    return (
        <div className="flex justify-center items-center">
            <button title="decrement" className="btn btn-primary btn-xs btn-square" onClick={decrease}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6"/>
                </svg>
            </button>
            <SmartIntInput
                onChange={setQuantity}
                value={quantity}
                min={min}
                max={max}
                className="input-bordered input-sm w-10 text-center p-1 m-1"
            />
            <button title="increment" className="btn btn-primary btn-xs btn-square" onClick={increase}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
            </button>
        </div>
    );
}

export default QuantityModifier;
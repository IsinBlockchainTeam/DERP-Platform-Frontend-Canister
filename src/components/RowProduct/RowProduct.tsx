import React, {useState} from "react";
import QuantityModifier from "../QuantityModifier/QuantityModifier";

interface Props {
    id: number;
    description: string;
    onChangedQuantity: (quantity: number) => void;
    onChangedStatus: (newStatus: boolean) => void;
}
function RowProduct({id, description, onChangedQuantity, onChangedStatus}: Props) {
    const [status, setStatus] = useState(false);
    const changeStatus = () => {
        const currentStatus = status;
        setStatus(!currentStatus);
        onChangedStatus(!currentStatus);
    }

    return (
        <tr key={id}>
            <th>
                <label>
                    <input role="checkbox" type="checkbox" className="checkbox text-center" onClick={changeStatus}/>
                </label>
            </th>
            <td>{id}</td>
            <td className="font-bold">{description}</td>
            <td className="font-bold">
                {
                    status &&  <QuantityModifier onChangedQuantity={ (quantity) => {onChangedQuantity(quantity)}} max={99} min={1}/>
                }
            </td>
        </tr>
    );
}

export default RowProduct;
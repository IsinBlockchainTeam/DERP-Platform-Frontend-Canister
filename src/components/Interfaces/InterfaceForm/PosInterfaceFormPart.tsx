import { useTranslation } from "react-i18next";
import { CreateTcposInterfaceReqDto, InterfaceType } from "../../../dto/ErpInterfacesDto";
import { InterfaceFormPartProps } from "./BaseInterfaceFormPart";
import { useEffect } from "react";
import { PosType } from "../../../model/PosType";
import TcposInterfaceFormPart from "./Pos/TcposAssociationFormPart";

type Props = InterfaceFormPartProps<CreateTcposInterfaceReqDto>
const typesFormMap = {
    [PosType.TCPOS]: TcposInterfaceFormPart,
    [PosType.INTERNAL]: () => <div></div> // no additional parameters for internal POS
}

const PosInterfaceFormPart = (props: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInterfacesDashboard' });

    useEffect(() => {
        console.log("props.interfaceType", props.iface.posType);
        console.log("props.posType", props.iface.posType);
        props.onChange({ ...props.iface });
    }, [props.interfaceType]);
    
    const Component = props.iface.posType ? typesFormMap[props.iface.posType] : null;

    return <>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('form.posType')}</span>
            </div>

            <select className="select select-bordered" value={props.iface.posType || "null"} onChange={e => props.onChange({ ...props.iface, posType: e.target.value as PosType })}>
                <option value="null" disabled>{t('form.posTypeLabel')}</option>
                <option value={PosType.TCPOS}>{t('form.pos.typeTcpos')}</option>
                <option value={PosType.INTERNAL}>{t('form.pos.typeInternal')}</option>
            </select>
        </label>
    
        {Component && <Component {...props} />}
    </>
}

export default PosInterfaceFormPart;

import { useTranslation } from "react-i18next";
import { CreateKumoInterfaceReqDto, CreateTcposInterfaceReqDto } from "../../../dto/ErpInterfacesDto";
import { InterfaceFormPartProps } from "./BaseInterfaceFormPart";
import { useEffect } from "react";
import { WondType } from "../../../model/WondType";

// This is directly leading to TCPOS since there is no sense in developing a solution for lightspeed rn.
// In order to implement lightspeed configuration, follow inheritance as with 'Association' form parts.

type Props = InterfaceFormPartProps<CreateTcposInterfaceReqDto>

const WondTcposInterfaceFormPart = (props: Props) => {
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierInterfacesDashboard'});
    
    useEffect(() => {
        props.onChange({...props.iface, wondType: WondType.TCPOS});
    }, [props.interfaceType]);

    return <>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('form.wond.tcpos.username')}:</span>
            </div>
            <input type="text" placeholder={t('form.wond.tcpos.username')} className="input input-bordered w-full " 
                value={props.iface.username || ""} onChange={e => props.onChange({...props.iface, username: e.target.value})} />
        </label>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('form.wond.tcpos.password')}:</span>
            </div>
            <input type="password" placeholder={t('form.wond.tcpos.password')} className="input input-bordered w-full " 
                value={props.iface.password || ""} onChange={e => props.onChange({...props.iface, password: e.target.value})} />
        </label>
    </>
}

export default WondTcposInterfaceFormPart;
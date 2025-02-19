import { useTranslation } from "react-i18next";
import { CreateTcposInterfaceReqDto, TcposAssociationResponseDto, TcposInterfaceResponseDto } from "../../../../dto/ErpInterfacesDto";
import { InterfaceFormPartProps } from "../BaseInterfaceFormPart";

type Props = InterfaceFormPartProps<CreateTcposInterfaceReqDto>

const TcposInterfaceFormPart = (props: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInterfacesDashboard' })

    return <>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('form.pos.tcpos.username')}:</span>
            </div>
            <input type="text" placeholder={t('form.pos.tcpos.username')} className="input input-bordered w-full "
                value={props.iface.username || ""} onChange={e => props.onChange({ ...props.iface, username: e.target.value })} />
        </label>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('form.pos.tcpos.password')}:</span>
            </div>
            <input type="password" placeholder={t('form.pos.tcpos.password')} className="input input-bordered w-full "
                value={props.iface.password || ""} onChange={e => props.onChange({ ...props.iface, password: e.target.value })} />
        </label>
    </>
}

export default TcposInterfaceFormPart;

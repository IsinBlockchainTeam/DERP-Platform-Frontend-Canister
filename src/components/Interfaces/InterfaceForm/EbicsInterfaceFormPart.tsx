import { useTranslation } from "react-i18next";
import { CreateEbicsInterfaceRequestDto, CreateKumoInterfaceReqDto } from "../../../dto/ErpInterfacesDto";
import { InterfaceFormPartProps } from "./BaseInterfaceFormPart";

type Props = InterfaceFormPartProps<CreateEbicsInterfaceRequestDto>

const EbicsInterfaceFormPart = (props: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInterfacesDashboard' });

    return <>
        <label className="form-control w-full mt-2">
            <div className="label">
                <span className="label-text">{t('form.bank.bankName')}:</span>
            </div>
            <input type="text" placeholder={t('form.bank.bankName')} className="input input-bordered w-full"
                value={props.iface.bankName || ""} onChange={e => props.onChange({ ...props.iface, bankName: e.target.value })} />
        </label>
        <label className="form-control w-full mt-2">
            <div className="label">
                <span className="label-text">{t('form.bank.partnerId')}:</span>
            </div>
            <input type="text" placeholder={t('form.bank.partnerId')} className="input input-bordered w-full"
                value={props.iface.partnerId || ""} onChange={e => props.onChange({ ...props.iface, partnerId: e.target.value })} />
        </label>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('form.bank.hostId')}:</span>
            </div>
            <input type="text" placeholder={t('form.bank.hostId')} className="input input-bordered w-full "
                value={props.iface.hostId || ""} onChange={e => props.onChange({ ...props.iface, hostId: e.target.value })} />
        </label>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('form.bank.userId')}:</span>
            </div>
            <input type="text" placeholder={t('form.bank.userId')} className="input input-bordered w-full "
                value={props.iface.userId || ""} onChange={e => props.onChange({ ...props.iface, userId: e.target.value })} />
        </label>
        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('form.bank.passphrase')}:</span>
            </div>
            <input placeholder={t('form.bank.passphrase')} className="input input-bordered w-full " type="password"
                value={props.iface.passphrase || ""} onChange={e => props.onChange({ ...props.iface, passphrase: e.target.value })} />
        </label>
    </>
}

export default EbicsInterfaceFormPart;
import { useTransition } from "react";
import { CreateInterfaceReqDto, InterfaceType } from "../../../dto/ErpInterfacesDto";
import { useTranslation } from "react-i18next";

export interface InterfaceFormPartProps<T extends CreateInterfaceReqDto = CreateInterfaceReqDto> {
    iface: Partial<T>
    onChange: (iface: Partial<T>) => void
    merchantId: number
    interfaceType: InterfaceType
}

export type BaseInterfaceFormProps = Omit<InterfaceFormPartProps, 'interfaceType'> & {
    updating: boolean
}

const BaseInterfaceFormPart = ({
    iface, onChange, updating
}: BaseInterfaceFormProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInterfacesDashboard' })

    return <>

        <label className="form-control w-full mt-2">
            <div className="label">
                <span className="label-text">{t('form.name')}</span>
            </div>
            <input type="text" placeholder={t('form.name')} className="input input-bordered w-full"
                value={iface.name || ""}
                onChange={(e) => onChange({ ...iface, name: e.target.value })}
            />
        </label>

        <label className="form-control w-full  mt-2">
            <div className="label">
                <span className="label-text">{t('form.interfaceType')}</span>
            </div>

            <select className="select select-bordered" value={iface.interfaceType || "null"} onChange={e => onChange({ ...iface, interfaceType: e.target.value as InterfaceType })}>
                <option value="null" disabled>{t('form.interfaceTypeLabel')}</option>
                <option value={InterfaceType.WOND} disabled={updating && iface.interfaceType !== InterfaceType.WOND}>{t('form.typeWond')}</option>
                <option value={InterfaceType.KUMO} disabled={updating && iface.interfaceType !== InterfaceType.KUMO}>{t('form.typeKumo')}</option>
                <option value={InterfaceType.EBICS} disabled={updating && iface.interfaceType !== InterfaceType.EBICS}>{t('form.typeEbics')}</option>
            </select>
        </label>

        <label className="form-control w-full mt-2">
            <div className="label">
                <span className="label-text">{t('form.url')}</span>
            </div>
            <input type="text" placeholder={t('form.url')} className="input input-bordered w-full "
                value={iface.url || ""}
                onChange={(e) => onChange({ ...iface, url: e.target.value })}
            />
        </label>
    </>
}

export default BaseInterfaceFormPart;
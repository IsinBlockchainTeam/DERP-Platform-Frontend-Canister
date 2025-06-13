import { DispatchRuleDto, DispatchRuleType } from "@derp/company-canister";
import { DispatchRuleFormProps, DispatchRuleTypeFormElement, DispatchRuleViewProps, InvoicePartyReferenceDto } from "../types";
import { useTranslation } from "react-i18next";

function getParty(value: DispatchRuleDto): InvoicePartyReferenceDto {
    return value.recipient[0] ?? { id: [], name: [] };
}

export default function InvoiceRecipientDispatchRuleForm(props: DispatchRuleFormProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.INVOICE_RECIPIENT' });

    const party = getParty(props.value);

    const handleIdChange = (id: string) => {
        props.onChange({
            ...props.value,
            recipient: [{ ...party, id: [id], name: [] }]
        });
    };

    const handleNameChange = (name: string) => {
        props.onChange({
            ...props.value,
            recipient: [{ ...party, id: [], name: [name] }]
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.id') as string}</span>
                </label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder={t('fields.idPlaceholder') as string}
                    value={party.id[0] ?? ""}
                    onChange={(e) => handleIdChange(e.target.value)}
                    disabled={!!party.name[0]}
                />
            </div>

            <div className="text-center font-bold">{t('or') as string}</div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('fields.name') as string}</span>
                </label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder={t('fields.namePlaceholder') as string}
                    value={party.name[0] ?? ""}
                    onChange={(e) => handleNameChange(e.target.value)}
                    disabled={!!party.id[0]}
                />
            </div>
        </div>
    );
}

export const InvoiceRecipientDispatchRuleView = (props: DispatchRuleViewProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm.type.types.INVOICE_RECIPIENT' });
    const party = getParty(props.value);

    return (
        <div>
            {party.id[0] && <h1>{t('fields.id') as string}: {party.id[0]}</h1>}
            {party.name[0] && <h1>{t('fields.name') as string}: {party.name[0]}</h1>}
        </div>
    );
}

export const InvoiceRecipientDispatchRuleFormElement: DispatchRuleTypeFormElement = {
    value: DispatchRuleType.INVOICE_RECIPIENT,
    formComponent: InvoiceRecipientDispatchRuleForm,
    viewComponent: InvoiceRecipientDispatchRuleView,
    validate: (value: DispatchRuleDto) => {
        const party = getParty(value);
        return (party.id.length > 0 && !!party.id[0]) || (party.name.length > 0 && !!party.name[0]);
    }
} 
import { DispatchRuleDto, AccountingOperation } from "@derp/company-canister";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface BaseFieldsFormProps {
    value: DispatchRuleDto;
    onChange: (value: DispatchRuleDto) => void;
}

export default function BaseFieldsForm({ value, onChange }: BaseFieldsFormProps) {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.rulesForm' });

    const handleDateChange = (field: 'validFrom' | 'validTo', date: Date | null) => {
        if (date) {
            const newDate = new Date(date);
            newDate.setHours(0, 0, 0, 0);
            onChange({
                ...value,
                [field]: [newDate.toISOString()]
            });
        } else {
            onChange({
                ...value,
                [field]: []
            });
        }
    };

    const handleAccountingOperationChange = (operation: AccountingOperation) => {
        onChange({
            ...value,
            accountingOperation: operation
        });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Accounting Operation */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{t('accountingOperation')}</span>
                </label>
                <select 
                    className="select select-bordered w-full"
                    value={value.accountingOperation}
                    onChange={(e) => handleAccountingOperationChange(e.target.value as AccountingOperation)}
                >
                    {Object.values(AccountingOperation).map((op) => (
                        <option key={op} value={op}>
                            {t(`accountingOperations.${op}`)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Validity Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">{t('validFrom')}</span>
                    </label>
                    <DatePicker
                        selected={value.validFrom?.[0] ? new Date(value.validFrom[0]) : null}
                        onChange={(date: Date | null) => handleDateChange('validFrom', date)}
                        className="input input-bordered w-full"
                        dateFormat="yyyy-MM-dd"
                        maxDate={value.validTo?.[0] ? new Date(value.validTo[0]) : undefined}
                        isClearable
                        placeholderText={t('selectDate')}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">{t('validTo')}</span>
                    </label>
                    <DatePicker
                        selected={value.validTo?.[0] ? new Date(value.validTo[0]) : null}
                        onChange={(date: Date | null) => handleDateChange('validTo', date)}
                        className="input input-bordered w-full"
                        dateFormat="yyyy-MM-dd"
                        minDate={value.validFrom?.[0] ? new Date(value.validFrom[0]) : undefined}
                        isClearable
                        placeholderText={t('selectDate')}
                    />
                </div>
            </div>
        </div>
    );
}
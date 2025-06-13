import { DispatchRuleType } from "@derp/company-canister";
import { DispatchRuleDto } from "@derp/company-canister";

export interface InvoicePartyReferenceDto {
    id: [string] | [];
    name: [string] | [];
}

export interface DispatchRuleFormProps {
    value: DispatchRuleDto;
    onChange: (value: DispatchRuleDto) => void;
}

export interface DispatchRuleViewProps {
    value: DispatchRuleDto;
}

export interface DispatchRuleTypeFormElement {
    value: DispatchRuleType;
    formComponent: React.ComponentType<DispatchRuleFormProps>;
    viewComponent: React.ComponentType<DispatchRuleViewProps>;
    validate: (value: DispatchRuleDto) => boolean;
}
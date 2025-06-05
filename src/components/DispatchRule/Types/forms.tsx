import { GroupDispatchRuleFormElement } from "./ProductGroup/GroupDispatchRuleFormElement";
import { VatGroupDispatchRuleFormElement } from "./VatGroup/VatGroupDispatchRuleFormElement";
import { PaymentMethodDispatchRuleFormElement } from "./PaymentMethod/PaymentMethodDispatchRuleFormElement";
import { BankAccountDispatchRuleFormElement } from "./BankAccount/BankAccountDispatchRuleFormElement";
import { BankCausalDispatchRuleFormElement } from "./BankCausal/BankCausalDispatchRuleFormElement";
import { BankCounterpartDispatchRuleFormElement } from "./BankCounterpart/BankCounterpartDispatchRuleFormElement";
import { BankMovementTypeDispatchRuleFormElement } from "./BankMovementType/BankMovementTypeDispatchRuleFormElement";
import { DispatchRuleTypeFormElement } from "./types";


export const forms: DispatchRuleTypeFormElement[] = [
    GroupDispatchRuleFormElement,
    VatGroupDispatchRuleFormElement,
    PaymentMethodDispatchRuleFormElement,
    BankAccountDispatchRuleFormElement,
    BankCausalDispatchRuleFormElement,
    BankCounterpartDispatchRuleFormElement,
    BankMovementTypeDispatchRuleFormElement,
    // {
    //     value: DispatchRuleType.PAYMENT_METHOD,
    // },
    // {
    //     value: DispatchRuleType.BANK_ACCOUNT,
    // },
    // {
    //     value: DispatchRuleType.BANK_CAUSAL,
    // },
    // {
    //     value: DispatchRuleType.BANK_COUNTERPART,
    // },
    // {
    //     value: DispatchRuleType.BANK_MOVEMENT_TYPE,
    // },
]
import { StatementItemsClient, AccountingTransactionClient, DispatchRulesClient } from "@derp/company-canister";
import { productsService } from "./services/Products";
import { StatementItemCategory } from "@derp/company-canister";
import i18n from "i18next"

const icpUrl = process.env.REACT_APP_ICP_URL;
if (!icpUrl) {
    throw new Error("REACT_APP_ICP_URL is not set");
}

const canisterId = process.env.REACT_APP_CANISTER_ID;
if (!canisterId) {
    throw new Error("REACT_APP_CANISTER_ID is not set");
}

export const accountingTransactionClient = new AccountingTransactionClient(icpUrl, canisterId);
const statementItemsClientOriginal = new StatementItemsClient(icpUrl, canisterId);


// Proxy (middleware) to add a custom logic when reading categories/category
// handles the translation of the category name with i18n
export const statementItemsClient = new Proxy(statementItemsClientOriginal, {
    get(target, prop, receiver) {
        if (prop === 'getStatementItemsCategories') {
            return async () => {
                const categories = await target.getStatementItemsCategories();
                return categories.map((category: StatementItemCategory) => {
                    const key = `merchantBalance.defaultCategories.${category.name}`;
                    if(i18n.exists(key)) {
                        return {
                            ...category,
                            name: i18n.t(key as any)
                        }
                    }
                    return category;
                });
            }
        }

        return target[prop as keyof StatementItemsClient];
    }
})

export const dispatchRulesClient = new DispatchRulesClient(icpUrl, canisterId);
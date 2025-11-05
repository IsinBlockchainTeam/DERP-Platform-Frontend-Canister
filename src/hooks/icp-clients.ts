
// useClients.ts
import { useState, useEffect } from 'react';
import AccountingTransactionService from '../api/services/AccountingTransactions';
import { StatementItemCategory, StatementItemsClient } from '@derp/company-canister';
import i18n from 'i18next';

const icpUrl = process.env.REACT_APP_ICP_URL;

// Hook generico che reinizializza il client quando cambia il canisterId
function useICPService<T>(
    canisterId: string | undefined,
    createClient: (icpUrl: string, canisterId: string) => T
) {
    const [client, setService] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!canisterId) {
            setLoading(true);
            return;
        }

        try {
            if (!icpUrl) {
                throw new Error("REACT_APP_ICP_URL is not set");
            }

            const newClient = createClient(icpUrl, canisterId);
            setService(newClient);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setService(null);
        } finally {
            setLoading(false);
        }
    }, [canisterId]); // Si reinizializza quando cambia il canisterId

    return { client, loading, error };
}

export function useAccountingTransactionService(canisterId: string | undefined) {
    return useICPService(
        canisterId,
        (url, id) => new AccountingTransactionService(url, id)
    );
}

const createStatementItemsClientWithProxy = (
    icpUrl: string,
    canisterId: string
): StatementItemsClient => {
    const statementItemsClientOriginal = new StatementItemsClient(icpUrl, canisterId);

    // Proxy (middleware) to add custom logic when reading categories
    // handles the translation of the category name with i18n
    const statementItemsClientProxy = new Proxy(statementItemsClientOriginal, {
        get(target, prop, receiver) {
            if (prop === 'getStatementItemsCategories') {
                return async () => {
                    const categories = await target.getStatementItemsCategories();
                    return categories.map((category: StatementItemCategory) => {
                        const key = `merchantBalance.defaultCategories.${category.name}`;
                        if (i18n.exists(key)) {
                            return {
                                ...category,
                                name: i18n.t(key as any)
                            };
                        }
                        return category;
                    });
                };
            }

            return target[prop as keyof StatementItemsClient];
        }
    });

    return statementItemsClientProxy as StatementItemsClient;
};

// Hook personalizzato per StatementItemsClient
export function useStatementItemsService(canisterId: string | undefined) : {
    client: StatementItemsClient | null;
    loading: boolean;
    error: Error | null;
} {
    return useICPService(
        canisterId,
        createStatementItemsClientWithProxy
    );
}

//
// export function useDispatchRulesClient(canisterId: string | undefined) {
//     return useClient(
//         canisterId,
//         (url, id) => new DispatchRulesClient(url, id)
//     );
// }
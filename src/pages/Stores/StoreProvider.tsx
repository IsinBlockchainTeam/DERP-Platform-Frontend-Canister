// contexts/StoreContext.jsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoreDto } from '../../dto/stores/StoreDto';
import { storeService } from '../../api/services/Store';
import { DispatchRule, DispatchRulesClient, StatementItemCategory, StatementItemsClient } from '@derp/company-canister';
import i18n from 'i18next';
import AccountingTransactionService from '../../api/services/AccountingTransactions';

const icpUrl = process.env.REACT_APP_ICP_URL;


interface StoreContextType {
    store: StoreDto | null;
    loading: boolean;
    error: Error | null;
    refreshStore: () => Promise<void>;
    setStore: (store: StoreDto | null) => void;
    accountingTransactionService: AccountingTransactionService | null;
    statementItemsClient: StatementItemsClient | null;
    dispatchRuleClient: DispatchRulesClient | null;
}

// Tipo per le props del Provider
interface StoreProviderProps {
    children: ReactNode;
    storeId: number;
}

interface ClientHookReturn<T> {
    client: T | null;
    loading: boolean;
    error: Error | null;
}

const createStatementItemsClientWithProxy = (
    icpUrl: string,
    canisterId: string
): StatementItemsClient => {
    const clientOriginal = new StatementItemsClient(icpUrl, canisterId);

    return new Proxy(clientOriginal, {
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
    }) as StatementItemsClient;
};

// Context con valore di default
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Provider
export const StoreProvider = ({ children, storeId }: StoreProviderProps) => {
    const [store, setStore] = useState<StoreDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [accountingTransactionService, setAccountingTransactionService] = useState<AccountingTransactionService | null>(null);
    const [statementItemsClient, setStatementItemsClient] =  useState<StatementItemsClient | null>(null);
    const [dispatchRuleClient, setDispatchRuleClient] = useState<DispatchRulesClient | null>(null);

    useEffect(() => {
        if (store?.canisterId && icpUrl) {
            try {
                // Inizializza AccountingTransactionService
                const accountingService = new AccountingTransactionService(
                    icpUrl,
                    store.canisterId
                );
                setAccountingTransactionService(accountingService);

                // Inizializza StatementItemsClient con Proxy
                const statementClient = createStatementItemsClientWithProxy(
                    icpUrl,
                    store.canisterId
                );
                setStatementItemsClient(statementClient);

                const dispatchRuleClient = new DispatchRulesClient(icpUrl, store.canisterId);
                setDispatchRuleClient(dispatchRuleClient);
            } catch (err) {
                console.error('Errore nell\'inizializzazione dei client ICP:', err);
                setError(err instanceof Error ? err : new Error('Errore client ICP'));
            }
        }
    }, [store?.canisterId]);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                setLoading(true);
                const data = await storeService.getStore(storeId);
                setStore(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Errore sconosciuto'));
                setStore(null);
            } finally {
                setLoading(false);
            }
        };

        if (storeId) {
            fetchStore();
        }
    }, [storeId]);

    const refreshStore = async (): Promise<void> => {
        try {
            const data = await storeService.getStore(storeId);
            setStore(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Errore sconosciuto'));
        }
    };

    const value: StoreContextType = {
        store,
        loading,
        error,
        refreshStore,
        setStore,
        accountingTransactionService,
        statementItemsClient,
        dispatchRuleClient
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};

// Hook personalizzato con type guard
export const useStore = (): StoreContextType => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore deve essere usato dentro StoreProvider');
    }
    return context;
};

export const useStoreData = (): Pick<StoreContextType, 'store' | 'loading' | 'error' | 'refreshStore'> => {
    const { store, loading, error, refreshStore } = useStore();
    return { store, loading, error, refreshStore };
};

// Hook per AccountingTransactionService
export const useAccountingService = (): ClientHookReturn<AccountingTransactionService> => {
    const { accountingTransactionService, loading, error } = useStore();
    return {
        client: accountingTransactionService,
        loading,
        error
    };
};

export const useDispatchRuleClient = (): ClientHookReturn<DispatchRulesClient> => {
    const { dispatchRuleClient, loading, error } = useStore();
    return {
        client: dispatchRuleClient,
        loading,
        error
    };
};


// Hook per StatementItemsClient
export const useStatementItemsClient = (): ClientHookReturn<StatementItemsClient> => {
    const { statementItemsClient, loading, error } = useStore();
    return {
        client: statementItemsClient,
        loading,
        error
    };
};
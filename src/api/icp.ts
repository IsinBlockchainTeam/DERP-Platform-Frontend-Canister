import { StatementItemsClient, AccountingTransactionClient } from "@derp/company-canister";

// TODO: This must be done ONLY WHEN IN LOCAL NETWORK
//agent.fetchRootKey();

const icpUrl = process.env.REACT_APP_ICP_URL;
if (!icpUrl) {
    throw new Error("REACT_APP_ICP_URL is not set");
}

const canisterId = process.env.REACT_APP_CANISTER_ID;
if (!canisterId) {
    throw new Error("REACT_APP_CANISTER_ID is not set");
}

export const accountingTransactionClient = new AccountingTransactionClient(icpUrl, canisterId);
export const statementItemsClient = new StatementItemsClient(icpUrl, canisterId);

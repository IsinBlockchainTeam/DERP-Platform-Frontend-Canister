export enum SupportedChainType {
    EVM = 'EVM',
    BITCOIN = 'BITCOIN',
    BITCOIN_TESTNET = 'BITCOIN_TESTNET',
}

export interface SupportedChainDTO {
  id: number;

  name: string;
  explorerUrl: string;
  supplierAddress: string;
  type: SupportedChainType;
  jsonRpcProviderUrl: string;

  chainId?: number;
}
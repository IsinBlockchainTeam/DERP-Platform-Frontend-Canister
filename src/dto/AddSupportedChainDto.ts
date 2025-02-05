export interface AddSupportedChainDTO {
  chainId: number;
  name: string;
  explorerUrl: string;
  supplierAddress: string;
  jsonRpcProviderUrl: string;
  type: string;
}
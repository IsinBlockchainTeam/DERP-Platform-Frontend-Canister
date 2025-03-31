export interface SupportedCryptoDTO {
  id: number;
  name: string;
  chainId: number;

  toSwissFrancs: number;
  isNative: boolean;
  iconUrl?: string;
  contractAddress?: string;
}

export interface AddSupportedCryptoDTO {
  name: string;
  chainId: number;
  toSwissFrancs: number;
  isNative: boolean;
  contractAddress?: string;
};
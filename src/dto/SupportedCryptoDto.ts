export interface SupportedCryptoDTO {
  id: string;
  name: string;
  url: string;
  chainUrl: string;
  toSwissFrancs: number;
  isNative: boolean;
  contractAddress?: string;
  iconUrl?: string;
}

export interface AddSupportedCryptoDTO {
  name: string;
  chainUrl: string;
  toSwissFrancs: number;
  isNative: boolean;
  contractAddress?: string;
};
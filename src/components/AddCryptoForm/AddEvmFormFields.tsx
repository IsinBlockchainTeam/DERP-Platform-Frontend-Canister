import React from 'react'
import { AddSupportedCryptoDTO } from '../../dto/SupportedCryptoDto';
import {Trans, useTranslation} from "react-i18next";

interface Props {
  addingCrypto: Partial<AddSupportedCryptoDTO>;
  onChange: (newCrypto: Partial<AddSupportedCryptoDTO>) => void;
}

export default function AddEvmFormFields({ addingCrypto, onChange }: Props) {
  const {t} = useTranslation(undefined, {keyPrefix: 'supplierChains.addCrypto'});

  return <>
    {/* Name */}
    <div className="label">
      <span className="label-text">{t('addSupportedCrypto')}</span>
    </div>
    <input type="text" placeholder="ETH" className="input input-bordered input-sm max-w-xs mb-4 w-full"
      value={addingCrypto.name} onChange={v => onChange({ ...addingCrypto, name: v.target.value })}
    />

    {/* isNative checkbox */}
    <label className="cursor-pointer label flex items-center justify-start">
      <input type="checkbox" className="checkbox" checked={addingCrypto.isNative} onChange={v => onChange({ ...addingCrypto, isNative: v.target.checked })} />
      <span className="label-text ml-2">{t('isNative')}</span>
    </label>

    {/* toSwissFrancs */}
    <div className="label">
      <span className="label-text">
        {t('howManySwissFrancs', {replace: { cryptoName: addingCrypto.name || "<...>"}})}
      </span>
    </div>
    <input type="number" placeholder="1000" className="input input-bordered input-sm max-w-xs mb-4 w-full"
      step={0.01} onChange={v => onChange({ ...addingCrypto, toSwissFrancs: parseFloat(v.target.value) })} />

    {/** Non-native crypto information */}
    {!addingCrypto.isNative && <>
      {/* Smart Contract Address */}
      <div className="label">
        <span className="label-text">{t('smartContractAddress')}</span>
      </div>
      <input type="text" placeholder="0x..." className="input input-bordered input-sm max-w-xs mb-4 w-full"
        value={addingCrypto.contractAddress} onChange={v => onChange({ ...addingCrypto, contractAddress: v.target.value })}
      />
    </>
    }
  </>
}

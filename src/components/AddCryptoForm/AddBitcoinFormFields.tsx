import React from 'react'
import { AddSupportedCryptoDTO } from '../../dto/SupportedCryptoDto';
import {Trans, useTranslation} from "react-i18next";

interface Props {
  addingCrypto: Partial<AddSupportedCryptoDTO>;
  onChange: (newCrypto: Partial<AddSupportedCryptoDTO>) => void;
}

export default function AddBitcoinFormFields({ addingCrypto, onChange }: Props) {
  const {t} = useTranslation(undefined, {keyPrefix: 'supplierChains.addCrypto'});
  addingCrypto.name = 'BTC'
  addingCrypto.isNative = true

  return <>
    {/* Name */}
    < div className="label" >
      <span className="label-text">{t('cryptoName')}</span>
    </div >
    <input type="text" placeholder="ETH" className="input input-bordered input-sm max-w-xs mb-4 w-full"
      disabled value={addingCrypto.name} />

    {/* isNative checkbox */}
    <label className="cursor-pointer label flex items-center justify-start">
      <input type="checkbox" className="checkbox" checked={addingCrypto.isNative} disabled />
      <span className="label-text ml-2">{t('isNative')}</span>
    </label>

    {/* toSwissFrancs */}
    <div className="label">
      <span className="label-text">
        <Trans i18nKey={'supplierChains.addCrypto.howManySwissFrancs'} cryptoName={addingCrypto.name}>How many Swiss Francs will 1 {addingCrypto.name} be worth?</Trans>
      </span>
    </div>
    <input type="number" placeholder="1000" className="input input-bordered input-sm max-w-xs mb-4 w-full"
      step={0.01} onChange={v => onChange({ ...addingCrypto, toSwissFrancs: parseFloat(v.target.value) })} />
  </>
}

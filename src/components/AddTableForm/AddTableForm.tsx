import React from 'react'
import { WondType } from '../../model/WondType';
import {useTranslation} from "react-i18next";

type Props = {
  label: string;
  username: string;
  password: string;
  erpType: WondType;
  onChangeUsername: (username: string) => void;
  onChangePassword: (password: string) => void;
  onChangeLabel: (label: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AddTableForm({
  label, username, password, erpType,
  onChangeLabel, onChangePassword, onChangeUsername, onConfirm, onCancel
}: Props) {
  const {t} = useTranslation(undefined, {keyPrefix: 'supplierTables.addTable'});
  const canConfirmAddTable = () => {
    const credentialsOk = erpType === WondType.NONE || (username.length !== 0 && password.length !== 0);
    return label.length !== 0 && credentialsOk;
  }

  console.log(erpType)

  return <>
    <div className="flex flex-col grow mr-3">
      <input type="text" className="input input-bordered mb-3" placeholder={t('tableLabelPlaceholder')} value={label} onChange={e => onChangeLabel(e.target.value)}/>
      { 
        erpType !== WondType.NONE &&
          <div>
            <input type="text" className="input input-bordered mb-3" placeholder={t('erpUsernamePlaceholder')} value={username} onChange={e => onChangeUsername(e.target.value)}/>
            <input type="password" className="input input-bordered mb-3" placeholder={t('erpPasswordPlaceholder')} value={password} onChange={e => onChangePassword(e.target.value) }/>
          </div>
      }
    </div>
    <div className="flex flex-row col justify-end">
      {/* Cancel button */}
      <button className="btn btn-sm btn-accent mr-3" onClick={() => onCancel()}>
        {t('cancelBtn')}
      </button>
      {/* Ok button */}
      <button className={"btn btn-sm btn-primary mr-3 " + (canConfirmAddTable() ? '' : 'disabled')} onClick={() => onConfirm()}>
        {t('confirmBtn')}
      </button>
    </div>
  </>
}

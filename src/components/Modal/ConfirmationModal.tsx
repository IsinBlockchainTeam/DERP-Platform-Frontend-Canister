import {Modal} from "./Modal";
import React from "react";
import {useTranslation} from "react-i18next";

export interface Props {
  title: string;
  message?: string;
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({title, message, onConfirm, onChangeOpen, open}: Props) {
  const {t} = useTranslation(undefined, {keyPrefix: 'confirmDialog'});

  const _onConfirm = async () => {
    onConfirm();
    onChangeOpen(false);
  }

  return <Modal open={open} onChangeOpen={onChangeOpen}>
    <div className={"modal-header"}>
      <h3 className={"text-3xl font-light"}>{title}</h3>
    </div>
    <div className={"modal-body mt-4"}>
      <p>{message}</p>
    </div>
    <div className={"modal-action"}>
      <button className={"btn"} onClick={() => onChangeOpen(false)}>{t('cancel')}</button>
      <button className={"btn btn-error"} onClick={_onConfirm}>{t('confirm')}</button>
    </div>
  </Modal>
}
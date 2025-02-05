import React from 'react'
import { SupportedCryptoDTO } from '../../dto/SupportedCryptoDto'
import "./CryptoCard.css";
import {chainService} from "../../api/services/Chains";

export interface Props {
  crypto: SupportedCryptoDTO;
}

export default function CryptoCard({ crypto }: Props) {

  console.log(crypto)

  return (
    <div className="card w-56 h-56 bg-base-100 shadow-xl border">
      <figure className="px-3 pt-5 logo">
        <img src={chainService.cryptoImageUrl(crypto.iconUrl)} alt="Cryptocurrency Image" className="rounded-xl object-contain w-full h-full" />
      </figure>
      <div className="card-body items-center text-center">
        <h3 className="card-title">{crypto.name}</h3>
        <p>1 {crypto.name} = {crypto.toSwissFrancs} CHF.</p>
      </div>
    </div>
  )
}

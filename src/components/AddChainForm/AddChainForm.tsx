import React, { FormEvent, useEffect, useState } from 'react'
import SmartIntInput from '../SmartIntInput/SmartIntInput'
import { AddSupportedChainDTO } from '../../dto/AddSupportedChainDto'
import { chainService } from '../../api/services/Chains'
import LoadingSpinner from '../Loading/LoadingSpinner'
import { useTranslation } from "react-i18next";

export interface Props {
    afterSubmit: () => void;
    storeUrl: string;
}

const defaultChain = {
    chainId: 0,
    explorerUrl: '',
    jsonRpcProviderUrl: '',
    name: '',
    supplierAddress: '',
    type: ''
}

export default function AddChainForm({ afterSubmit, storeUrl }: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [chain, setChain] = useState<Partial<AddSupportedChainDTO>>(defaultChain)
    const [chainTypes, setChainTypes] = useState<string[]>([])
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierChains.addChain' });

    useEffect(() => {
        setLoading(true)
        chainService.getChainTypes().then((t) => {
            setChainTypes(t)
            setChain({ ...chain, type: t[0] })
        }).finally(() => { setLoading(false) })
    }, [])


    const submit: React.FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let invalid = chain.type === 'EVM' && (!chain.chainId || !chain.jsonRpcProviderUrl);
        invalid = invalid || !chain.name || !chain.explorerUrl || !chain.supplierAddress

        if (invalid) {
            alert(t('invalidData'))
            return
        }

        setLoadingSubmit(true)
        try {
            await chainService.addChain(storeUrl, chain as AddSupportedChainDTO)
        } finally {
            setLoadingSubmit(false)
            setChain(defaultChain)
            afterSubmit()
        }
    }

    return (
        <div className='flex flex-col items-center justify-start'>
            <span className='text-xl mb-4'>{t('addSupportedChain')}</span>

            {loading ? <LoadingSpinner />
                :
                <form className='w-full flex flex-col items-center justify-center' onSubmit={submit}>
                    {/* Chain type */}
                    <div className="label">
                        <span className="label-text">{t('chainType')}</span>
                    </div>
                    <select className="select select-bordered select-sm w-full max-w-xs" onChange={(e) => setChain({ ...chain, type: e.target.value })}>
                        {(chainTypes || []).map((chainType) => (
                            <option key={chainType} value={chainType}>{chainType}</option>
                        ))}
                    </select>

                    {/* ID */}
                    {chain.type == 'EVM' &&
                        <>
                            <div className="label">
                                <span className="label-text">{t('chainId')}</span>
                            </div>
                            <SmartIntInput
                                value={chain.chainId || 0}
                                onChange={(v) => setChain({ ...chain, chainId: v })}
                                className="input-bordered input-sm text-center p-1 m-1 mb-4 max-w-xs w-full" />
                        </>
                    }

                    {/* Name */}
                    <div className="label">
                        <span className="label-text">{t('chainName')}</span>
                    </div>
                    <input type="text" placeholder="Ethereum" className="input input-bordered input-sm max-w-xs mb-4 w-full"
                        value={chain.name} onChange={v => setChain({ ...chain, name: v.target.value })}
                    />

                    {/* RPC URL */}
                    {chain.type == 'EVM' &&
                        <>
                            <div className="label">
                                <span className="label-text">{t('chainRpcUrl')}</span>
                            </div>
                            <input type="text" placeholder="https://mainnet.infura.io/v3/..." className="input input-bordered input-sm max-w-xs mb-4 w-full"
                                value={chain.jsonRpcProviderUrl} onChange={v => setChain({ ...chain, jsonRpcProviderUrl: v.target.value })}
                            />
                        </>
                    }

                    {/* Explorer URL */}
                    <div className="label">
                        <span className="label-text">{t('explorerUrl')}</span>
                    </div>
                    <input type="text" placeholder="https://etherscan.io" className="input input-bordered input-sm max-w-xs mb-4 w-full"
                        value={chain.explorerUrl} onChange={v => setChain({ ...chain, explorerUrl: v.target.value })}
                    />

                    {/* Money Receiver Address */}
                    <div className="label">
                        <span className="label-text">{t('payeeAddress')}</span>
                    </div>
                    <input type="text" placeholder="0x..." className="input input-bordered input-sm max-w-xs mb-4 w-full"
                        value={chain.supplierAddress} onChange={v => setChain({ ...chain, supplierAddress: v.target.value })}
                    />

                    <button type="submit" className="btn btn-primary mt-10" disabled={loadingSubmit}>{loadingSubmit ? <LoadingSpinner /> : t('submitBtn')}</button>
                </form>
            }
        </div>
    )
}

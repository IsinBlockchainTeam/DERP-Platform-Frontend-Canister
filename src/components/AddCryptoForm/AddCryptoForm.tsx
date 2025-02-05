import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { chainService } from '../../api/services/Chains'
import LoadingSpinner from '../Loading/LoadingSpinner'
import { AddSupportedCryptoDTO, SupportedCryptoDTO } from '../../dto/SupportedCryptoDto'
import { SupportedChainDTO } from '../../dto/SupportedChainDto'
import AddBitcoinFormFields from './AddBitcoinFormFields'
import AddEvmFormFields from './AddEvmFormFields'
import { useTranslation } from "react-i18next";

export interface Props {
    chainUrl: string,
    storeUrl: string,
    onDone: () => void;
}

const defaultCrypto: AddSupportedCryptoDTO = {
    chainUrl: '',
    isNative: true,
    name: '',
    toSwissFrancs: 0,
}

export default function AddCryptoForm({ onDone, chainUrl, storeUrl }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [loadingTabLogo, setLoadingTabLogo] = useState<boolean>(false);
    const [chain, setChain] = useState<SupportedChainDTO | undefined>(undefined);
    const [addingCrypto, setAddingCrypto] = useState<Partial<AddSupportedCryptoDTO>>({ ...defaultCrypto, chainUrl });
    const [addedCrypto, setAddedCrypto] = useState<SupportedCryptoDTO>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [step, setStep] = useState<number>(0);
    const [logoName, setLogoName] = useState<string>('');
    const inputFileLogo = useRef<HTMLInputElement>(null);

    const { t } = useTranslation(undefined, { keyPrefix: 'supplierChains.addCrypto' });

    const chooseLogo = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (inputFileLogo.current) inputFileLogo.current.click();
    }

    const onLogoChange = () => {
        if (inputFileLogo.current && inputFileLogo.current.files && inputFileLogo.current.files.length > 0)
            setLogoName(inputFileLogo.current.files[0].name);
    }

    const done = () => {
        setAddingCrypto(defaultCrypto)
        setAddedCrypto(undefined)
        setErrorMessage(undefined)
        setStep(0)
        onDone()
    }

    useEffect(() => {
        setLoading(true);
        chainService.listChains(storeUrl).then((chains) => {
            const c = chains.find((c) => c.url === chainUrl);
            if (!c) {
                throw new Error(`Chain ${chainUrl} not found`);
            }

            setChain(c);
        }).finally(() => { setLoading(false) })
    }, [])

    const steps = [
        {
            id: 0,
            name: t('cryptoConfiguration'),
            submit: async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault()

                let valid = !!(addingCrypto.chainUrl && addingCrypto.name && addingCrypto.toSwissFrancs !== 0);
                valid = valid && !!(addingCrypto.isNative || addingCrypto.contractAddress);

                if (!valid) {
                    alert(t('errors.invalidData'));
                    console.log(addingCrypto);
                    return;
                }

                setLoadingSubmit(true)
                try {
                    const added = await chainService.addSupportedCrypto(storeUrl, {
                        chainUrl: addingCrypto.chainUrl?.trim(),
                        contractAddress: addingCrypto.contractAddress?.trim(),
                        name: addingCrypto.name?.trim(),
                        toSwissFrancs: addingCrypto.toSwissFrancs,
                        isNative: addingCrypto.isNative,
                    } as AddSupportedCryptoDTO);

                    console.log(added)
                    setAddedCrypto(added)
                    setErrorMessage(undefined)
                    setAddingCrypto(defaultCrypto)
                    setStep(1)
                } catch (e: any) {
                    setErrorMessage(e?.message || t('errors.unknown'));
                } finally {
                    setLoadingSubmit(false)
                }
            },
            html: (submit: (e: FormEvent<HTMLFormElement>) => any) => (
                <>
                    {(errorMessage?.length || 0) > 0 && <div role="alert" className="alert alert-error max-w-xs mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{errorMessage}</span>
                    </div>
                    }
                    <form className='w-full flex flex-col items-center justify-center' onSubmit={submit}>

                        {chain?.type === 'BITCOIN' || chain?.type === 'BITCOIN_TESTNET' ?
                            <AddBitcoinFormFields addingCrypto={addingCrypto} onChange={setAddingCrypto} />
                            :
                            <AddEvmFormFields addingCrypto={addingCrypto} onChange={setAddingCrypto} />
                        }
                        <div className='flex flex-row items-center justify-center'>
                            <button type="button" className="btn btn-primary mt-10 mr-5" disabled={loadingSubmit} onClick={done}>{loadingSubmit ? <LoadingSpinner /> : t('cancelBtn')}</button>
                            <button type="submit" className="btn btn-primary mt-10" disabled={loadingSubmit}>{loadingSubmit ? <LoadingSpinner /> : t('nextBtn')}</button>
                        </div>
                    </form>
                </>
            ),
        },
        {
            id: 1,
            name: t('logoConfiguration'),
            submit: async (e: FormEvent<HTMLFormElement>) => {
                setLoadingTabLogo(true);
                e.preventDefault();

                try {
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    if (!addedCrypto?.id) return;

                    const newCrypto = await chainService.setCryptoImage(storeUrl, formData, addedCrypto.id)
                    setAddedCrypto(newCrypto);
                    setErrorMessage(undefined);
                } catch (e: any) {
                    setErrorMessage(e?.message || "Unknown error during logo upload");
                } finally {
                    setLoadingTabLogo(false);
                }
            },
            html: (submit: (e: FormEvent<HTMLFormElement>) => any) => (
                <>
                    {(errorMessage?.length || 0) > 0 && <div role="alert" className="alert alert-error max-w-xs mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{errorMessage}</span>
                    </div>
                    }
                    <form action="/stores/image" method="POST" onSubmit={submit} className='flex flex-col items-center'>
                        <div className="avatar">
                            <div className="w-48 h-48 rounded bg-no-repeat bg-contain bg-center" style={{ backgroundImage: `url(${chainService.cryptoImageUrl(addedCrypto?.iconUrl)}` }} ></div>
                        </div>
                        <label className="label">
                            <span className="label-text font-bold text-primary">{t('chooseNewLogo')} (max 2mb):</span>
                        </label>
                        <div className="border rounded-lg p-2 flex flex-row items-center">
                            <button className="btn" onClick={chooseLogo}>{t('chooseBtn')}</button>
                            <span className={inputFileLogo.current && inputFileLogo.current.files && inputFileLogo.current.files.length > 0 ?
                                'pl-2'
                                :
                                'pl-2 text-gray-400'}> {logoName} </span>
                            <button type="submit"
                                disabled={!(inputFileLogo.current && inputFileLogo.current.files && inputFileLogo.current.files.length > 0)}
                                className="btn btn-primary ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                            </button>
                        </div>

                        <input ref={inputFileLogo}
                            type="file"
                            id="image"
                            name="logo"
                            className="hidden"
                            accept="image/png,image/jpeg"
                            onChange={onLogoChange}
                        />

                        <button type="button"
                            className="btn btn-primary mt-6 ml-4" onClick={done}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="pl-2">{t('doneBtn')}</span>
                        </button>
                    </form>
                </>
            ),
        }
    ]

    return (
        <div className='flex flex-col items-center justify-start'>
            <span className='text-xl mb-4'>{t('addSupportedCrypto')}</span>

            {loading ? <LoadingSpinner />
                :
                <>
                    <ul className="steps mb-8 w-full">
                        {steps.map(s => (
                            <li key={s.id} className={`step ${step >= s.id ? 'step-primary' : ''}`}>
                                <a onClick={() => setStep(s.id)}>{s.name}</a>
                            </li>
                        ))}
                    </ul>
                    {steps[step].html(steps[step].submit)}
                </>
            }
        </div>
    )
}

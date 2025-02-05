import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {useSearchParams} from 'react-router-dom';
import {auth} from '../../api/auth';
import {supplierService} from '../../api/services/Supplier';
import FormLoader from '../../components/Loading/FormLoader';
import {useTranslation} from "react-i18next";

// TODO la validitá del token di registrazione andrebbe verificata anche all'inizio
//  se il token non é valido nascondere il form e mostrare errore
function SupplierSignup() {
    const [queryParams] = useSearchParams();
    const [token, setToken] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierSignup'});
    const navigate = useNavigate();

    const signup = () => {
        setLoading(true);
        clearErrorMessage();

        if(!username || !username.includes('@')) {
            showErrorMessage(t('errors.email'));
            return;
        }

        if(!password) {
            showErrorMessage(t('errors.password'));
            return;
        }

        if(password !== passwordConfirm) {
            showErrorMessage(t('errors.passwordConfirm'));
            return;
        }
            
        return supplierService.register(username, password, token).then(() => {
            navigate('/supplier/stores');
        }).catch(error => {
            showErrorMessage(error.response.data.message);
        })
    }

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setLoading(false);
    }

    const clearErrorMessage = () => {
        setErrorMessage('');
    }

    useEffect(() => {
        const token = queryParams.get('token');

        if(token){
            auth.logout().then(() => {
                setToken(token);
            })
        }
    }, [])

    return (
        <main>
            <div className="h-screen flex flex-col items-center justify-center">
                <div className="form-control">
                    <h1 className="text-center font-bold text-2xl mb-10">Decentralized ERP</h1>

                    <div className={errorMessage ? 'alert alert-error shadow-lg mb-10' : 'hidden'}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{errorMessage}</span>
                        </div>
                    </div>

                    <div className="border border-primary p-8 rounded shadow-xl text-center relative">
                        <form>
                            <h2 className="text-center font-bold text-xl mb-6">{t('title')}</h2>
                            <label className="label">
                                <span className="label-text font-bold text-primary">{t('email')}:</span>
                            </label>
                            <input
                                type="text" id="email" placeholder="Email"
                                className="input input-bordered w-full max-w-xs"
                                value={username}
                                onChange={e => setUsername(e.target.value)}/>

                            <label className="label">
                                <span className="label-text font-bold text-primary">{t('password')}:</span>
                            </label>
                            <input
                                type="password" id="password" placeholder="Password"
                                className="input input-bordered w-full max-w-xs"
                                value={password}
                                onChange={e => setPassword(e.target.value)}/>

                            <label className="label">
                                <span className="label-text font-bold text-primary">{t('passwordConfirm')}:</span>
                            </label>
                            <input
                                type="password" id="password" placeholder="Confirm password"
                                className="input input-bordered w-full max-w-xs"
                                value={passwordConfirm}
                                onChange={e => setPasswordConfirm(e.target.value)}/>

                            <button className="btn btn-primary mt-6" onClick={e => { e.preventDefault(); signup()}}>{t('signupBtn')}</button>
                        </form>

                        {
                            loading && <FormLoader/>
                        }
                    </div>

                </div>
            </div>
        </main>
    );
}

export default SupplierSignup;

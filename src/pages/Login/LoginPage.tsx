import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../api/auth';
import { UserRole } from '../../model/UserRole';
import { useTranslation } from "react-i18next";
import { companyInfoService } from "../../api/services/CompanyInfo";
import { UserInfoDto } from '../../dto/UserInfoDto';
import { AuthClient } from '@dfinity/auth-client';
import { User, Lock, ArrowRight } from 'lucide-react';


const identityProvider = () => {
    if (process.env.REACT_APP_DFX_NETWORK === "local") {
        return `http://${process.env.REACT_APP_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
    } else if (process.env.REACT_APP_DFX_NETWORK === "ic") {
        return `https://${process.env.REACT_APP_CANISTER_ID_INTERNET_IDENTITY}.ic0.app`;
    } else {
        return `https://${process.env.REACT_APP_CANISTER_ID_INTERNET_IDENTITY}.dfinity.network`;
    }
};

function LoginPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [userData, setUserData] = useState<UserInfoDto | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierLogin' });
    const [authClient, setAuthClient] = useState<any>(null);

    const createAuthClient = async () =>{
        setAuthClient(await AuthClient.create());
    }

    const submitICPLogin = async () => {
        await authClient.login({
            identityProvider:  identityProvider(),
            onSuccess: async () => {
                await fakeLogin();
            },
            onError: (err: any) => {
                showErrorMessage(err.message);
            },
        });
    }

    //TODO change this shit, for the demo we use always admin credentials to authenticate with the backend
    const fakeLogin = async () => {
        setLoading(true);
        clearErrorMessage();
        await auth.login('demo@grottovalletta.ch', 'demo');
        const uData = await auth.getMe();
        setUserData(uData);
        navigate(`/merchant/${uData.companyId}/balance`);
    }

    const submitLogin = async () => {
        setLoading(true);
        clearErrorMessage();
        await auth.login(username, password)

        const uData = await auth.getMe();
        setUserData(uData);

        try {
            switch (uData.role) {
                case UserRole.ADMIN:
                    navigate('/admin')
                    break;
                case UserRole.SUPPLIER:
                    const companyInfo = await companyInfoService.getCompanyInfo();
                    if (!companyInfo) {
                        // TODO: saving company infos can be done only by resellers.
                        // It is useless to redirect there for suppliers
                        goToSaveCompanyInfo();
                    } else {
                        navigate(`/merchant/${uData.companyId}/`);
                    }
                    break;
                case UserRole.RESELLER:
                    navigate(`/reseller/${uData.companyId}/`)
                    goToDashboard(uData);
                    break;
            }
        } catch (error: any) {
            showErrorMessage(error.message);
            setLoading(false);
        } finally {
            setLoading(false);
        };
    }

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
    }

    const clearErrorMessage = () => {
        setErrorMessage('');
    }

    const goToDashboard = (userData: UserInfoDto) => {
        if (userData.role === UserRole.ADMIN) {
            navigate('/admin');
        } else if (userData.role === UserRole.SUPPLIER) {
        }
    }

    const goToSaveCompanyInfo = () => {
        navigate('/supplier/saveCompanyInfo');
    }

    useEffect(() => {
        if (auth.isLogged()) {
            if (!userData) {
                auth.getMe().then(userData => goToDashboard(userData));
            }
        }
        createAuthClient();
    }, [])

    return (
        <main>
            <div className="h-screen flex flex-col items-center justify-center">
                <div className="relative w-full max-w-xl">

                    {/* Login Card */}
                    <div className="bg-primary border-4 border-gray-700 rounded-lg overflow-hidden">
                        <div className="p-8">
                            <div className="flex justify-center mb-1">
                                <img src="derp-logo.png" alt="DERP Logo" className="h-32" />
                            </div>
                            <form className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        className="input w-full h-12 px-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200"
                                        value={username}
                                        onChange={e => {
                                            setUsername(e.target.value);
                                        }}
                                    />
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                </div>

                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="input w-full h-12 px-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                </div>

                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        className="w-full h-12 bg-white rounded-lg font-semibold shadow-lg transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
                                        onClick={e => {
                                            e.preventDefault();
                                            fakeLogin();
                                        }}
                                    >
                                        Login
                                    </button>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-secondary ">Or continue with</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={e => {
                                            e.preventDefault();
                                            submitICPLogin();
                                        }}
                                        className="w-full h-12 bg-gray-50 rounded-lg text-gray-700 font-semibold border border-gray-200 hover:bg-gray-100 transform hover:-translate-y-0.5 transition duration-200"
                                    >
                                        Internet Identity
                                    </button>
                                </div>
                            </form>
                        </div>


                    </div>

                    {/* Bottom Text */}
                    <p className="text-center text-sm mt-6">
                        © 2025 DERP. All rights reserved.
                    </p>
                </div>
            </div>
        </main>
    );
}

export default LoginPage;

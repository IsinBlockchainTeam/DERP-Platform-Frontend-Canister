import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../api/auth';
import { UserRole } from '../../model/UserRole';
import { useTranslation } from "react-i18next";
import { UserInfoDto } from '../../dto/UserInfoDto';
import { AuthClient } from '@dfinity/auth-client';
import {User, Lock, Shield, Zap, TrendingUp, ChevronRight, EyeOff, Eye} from 'lucide-react';
import { companyService } from '../../api/services/Company';
import styles from './LoginPage.module.css';


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
    const [showPassword, setShowPassword] = useState(false);
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
                await submitLogin();
                //await fakeLogin();
            },
            onError: (err: any) => {
                showErrorMessage(err.message);
            },
        });
    }

    const submitLogin = async () => {
        setLoading(true);
        clearErrorMessage();
        try {
            await auth.login(username, password);
            const uData = await auth.getMe();
            setUserData(uData);

            // The existing redirection logic based on uData.role will be called by postLoginRedirect
            // which is triggered by the useEffect hook due to setUserData or directly if needed.
            // For now, we can rely on the useEffect to handle the redirect after userData is set.
            // Or, if immediate redirect is preferred after login without waiting for useEffect's re-render cycle:
            await postLoginRedirect(uData); // Call postLoginRedirect directly

        } catch (error: any) {
            // Assuming 'auth.login' or 'auth.getMe' throws an error that can be caught here.
            // You might need to check the specific error type or message if the API provides one
            // for invalid credentials to distinguish from other network/server errors.
            showErrorMessage(t('errors.invalidCredentials'));
            setLoading(false); // Ensure loading is set to false on error
        } 
        // setLoading(false) is already handled by postLoginRedirect's finally block if successful
        // or in the catch block above if auth.login/getMe fails.
    }

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
    }

    const clearErrorMessage = () => {
        setErrorMessage('');
    }

    const postLoginRedirect = async (userData: UserInfoDto) => {
        setLoading(true);
        clearErrorMessage();
        try {
            switch (userData.role) {
                case UserRole.ADMIN:
                    navigate('/admin')
                    break;
                case UserRole.SUPPLIER:
                    const companyInfo = await companyService.getById(userData.companyId);
                    if (!companyInfo) {
                        // TODO: saving company infos can be done only by resellers.
                        // It is useless to redirect there for suppliers
                        goToSaveCompanyInfo();
                    } else {
                        navigate(`/merchant/${userData.companyId}/`);
                    }
                    break;
                case UserRole.RESELLER:
                    navigate(`/reseller/${userData.companyId}/`)
                    break;
            }
        } catch (error: any) {
            showErrorMessage(error.message); // Assuming you want to handle errors here as well
        } finally {
            setLoading(false);
        }
    }

    const goToSaveCompanyInfo = () => {
        navigate('/supplier/saveCompanyInfo');
    }

    useEffect(() => {
        if (auth.isLogged()) {
            setLoading(true);
            clearErrorMessage();
            if (!userData) {
                auth.getMe()
                    .then(fetchedUserData => postLoginRedirect(fetchedUserData))
                    .catch((error: any) => {
                        showErrorMessage(error.message);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
            else {
                postLoginRedirect(userData)
                    .finally(() => {
                        setLoading(false); // Ensure loading is false if userData already exists
                    });
            }
        }
        createAuthClient();
    }, [])

    return (
        <div className={styles.loginPage}>
            <div className={styles.backgroundElements}>
                <div className={styles.floatingCircle}></div>
                <div className={styles.floatingCircle}></div>
                <div className={styles.floatingCircle}></div>
                <div className={styles.floatingCircle}></div>
            </div>

            <div className={styles.loginCard}>
                {/* Brand Section */}
                <div className={styles.brandSection}>
                    <div className={styles.brandBgElements}>
                        <div className={styles.brandCircle}></div>
                        <div className={styles.brandCircle}></div>
                        <div className={styles.brandCircle}></div>
                    </div>

                    <div className={styles.brandContent}>
                        <div className={styles.brandLogo}>
                            <div className={styles.logoIcon}>
                                <div className={styles.logoInner}>D</div>
                            </div>
                            <div className={styles.brandText}>
                                <h1>DATASHAKER</h1>
                                <p>enjoy your data</p>
                            </div>
                        </div>

                        <h2 className={styles.brandDescription}>
                            The decentralised connector of SME's financial flows
                        </h2>
                        <p className={styles.brandTagline}>
                            Transform your back-office operations into an automated, blockchain-secured financial management system.
                        </p>

                        <div className={styles.featuresList}>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>
                                    <Shield size={16} color="white" />
                                </div>
                                <span><strong>Blockchain Security:</strong> Immutable transactions on ICP</span>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>
                                    <Zap size={16} color="white" />
                                </div>
                                <span><strong>One-Click Automation:</strong> Auto reconciliation & accounting</span>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>
                                    <TrendingUp size={16} color="white" />
                                </div>
                                <span><strong>Reduce Costs:</strong> Cut operating expenses by 7-10%</span>
                            </div>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>7-10%</span>
                                <div className={styles.statLabel}>Cost Reduction</div>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>1-Click</span>
                                <div className={styles.statLabel}>Processing</div>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>100%</span>
                                <div className={styles.statLabel}>Secured</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <img src="datashaker-logo.png" alt="DERP Logo" className="h-16"/>
                        <p className={styles.formSubtitle}>Access your financial data dashboard</p>
                    </div>

                    <div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Username</label>
                            <div className={styles.inputWrapper}>
                                <User className={styles.inputIcon} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={styles.formInput}
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.formInput}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.passwordToggle}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className={styles.errorMessage}>
                                {errorMessage}
                            </div>
                        )}

                        <button
                            onClick={submitLogin}
                            disabled={loading || !username || !password}
                            className={styles.loginButton}
                        >
                            {loading ? (
                                <div className={styles.spinner}></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>

                        <div className={styles.divider}>
                            <span className={styles.dividerText}>Or continue with</span>
                        </div>

                        <button
                            onClick={submitICPLogin}
                            disabled={loading}
                            className={styles.icpButton}
                        >
                            {loading ? (
                                <div className={`${styles.spinner} ${styles.spinnerOrange}`}></div>
                            ) : (
                                <>
                                    <div className={styles.icpIcon}></div>
                                    <span>Internet Identity</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className={styles.trustIndicators}>
                        <div className={styles.trustItem}>
                            <Shield size={14} />
                            <span>Blockchain Secured</span>
                        </div>
                        <div className={styles.trustItem}>
                            <div style={{width: 14, height: 14, background: '#FE9C00', borderRadius: '50%'}}></div>
                            <span>ICP Network</span>
                        </div>
                    </div>

                    <p className={styles.copyright}>
                        © 2025 DATASHAKER. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

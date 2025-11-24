import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DEFAULT_THEME } from './constants';
import AdminDashboard from './pages/Administration/AdminDashboard';
import PaymentCanceled from "./pages/PaymentFailed/PaymentFailed";
import Report from './pages/Report/Report';
import Redirect from './pages/Redirect/Redirect';
import LoginPage from './pages/Login/LoginPage';
import TemporaryInvoice from "./pages/TemporaryInvoice/TemporaryInvoice";
import PaymentFailed from './pages/PaymentFailed/PaymentFailed';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import StoreDetails from './pages/Stores/StoreDetails';
import ChainDetails from './pages/Stores/Tabs/ChainDetails';
import TablesTab from './pages/Stores/Tabs/TablesTab';
import AppearanceTab from './pages/Stores/Tabs/AppearanceTab';
import ChainsTab from './pages/Stores/Tabs/ChainsTab';
import './i18n/i18n';
import ConfirmPayment from "./pages/ConfirmPayment/ConfirmPayment";
import SuppliersTab from "./pages/Stores/Tabs/SuppliersTab/SuppliersTab";
import CustomersTab from "./pages/Stores/Tabs/CustomersTab";
import ChainList from './pages/ChainList/ChainList';
import AccountingTransactionsTab from './pages/Stores/Tabs/AccountingTransactionsTab/AccountingTransactionsTab';
import BaseNavigator from './pages/BaseNavigator';
import ResellerPage from './pages/Reseller/ResellerPage';
import MerchantsTab from './pages/Reseller/Tabs/MerchantsTab';
import AdminResellers from './pages/Administration/Tabs/AdminResellers';
import AdminMerchants from './pages/Administration/Tabs/AdminMerchants';
import MerchantsPage from './pages/Merchant/MerchantPage';
import InterfacesTab from './pages/Merchant/InterfacesTab';
import StoresTab from './pages/Merchant/StoresTab';
import DataSyncTab from './pages/Stores/Tabs/DataSyncTab/DataSyncTab';
import DataSyncHome from './pages/Stores/Tabs/DataSyncTab/DataSyncHome';
import DataSyncAccountingTransactions from './pages/Stores/Tabs/DataSyncTab/DataSyncAccountingTransactions';
import OffersTab from './pages/Stores/Tabs/OffersTab';
import ProductsTab from './pages/Stores/Tabs/ProductsTab';
import OfferLines from './pages/OfferLines/OfferLines';
import OfferList from './pages/Stores/Tabs/OfferList';
import InterfacesDashboard from './pages/Interfaces/InterfacesDashboard';
import AccountingTransactionsList from './pages/Stores/Tabs/AccountingTransactionsTab/AccountingTransactionsList';
import AccountingTransactionDetails from './pages/Stores/Tabs/AccountingTransactionsTab/AccountingTransactionDetails';
import InterfacesHome from './pages/Stores/Tabs/InterfacesTab/InterfacesHome';
import BalanceSettings from './pages/Merchant/Balance/BalanceSettings';
import StoreInterfacesTab from './pages/Stores/Tabs/InterfacesTab/StoreInterfacesTab';
import BalanceSettingsCategories from './pages/Merchant/Balance/BalanceSettings/BalanceSettingsCategories';
import BalanceSettingsItems from './pages/Merchant/Balance/BalanceSettings/BalanceSettingsItems';
import BalanceTab from './pages/Merchant/Balance/BalanceTab';
import MonthlyBalanceView from './pages/Merchant/Balance/MonthlyBalanceView';
import DailyBalanceView from './pages/Merchant/Balance/DailyBalanceView';
import DailyDetailBalanceView from './pages/Merchant/Balance/DailyDetailBalanceView';
import DataSyncPosSync from './pages/Stores/Tabs/DataSyncTab/DataSyncPosSync';
import BalanceSettingsRules from './pages/Merchant/Balance/BalanceSettings/BalanceSettingsRules';
import AnalyticsComingSoon from "./components/Analytics/AnalyticsComingSoon";
import StoreManagementPage from './pages/Stores/StoreManagementPage';
import SupplierInvoiceOverview from './pages/Invoices/SupplierInvoiceOverview';
import InvoiceOverview from './pages/Invoices/InvoiceOverview';
import StorePage from './pages/Stores/StorePage';


function App() {
    // TODO: sará possibile cambiare il valore di questo stato per cambiare il tema dell'app
    const [theme, setTheme] = useState<string>(DEFAULT_THEME);

    useEffect(() => {
        document.querySelector('html')?.setAttribute('data-theme', theme);

    }, [theme]);



    return (
        <Routes>
            <Route path="/" element={<Navigate to='/login' />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>

            { /* Customer Paths */}
            <Route path="/table" element={<TemporaryInvoice />}></Route>
            <Route path="/paymentSuccess" element={<PaymentSuccess />}></Route>
            <Route path="/paymentFailed" element={<PaymentFailed />}></Route>
            <Route path="/paymentCanceled" element={<PaymentCanceled />}></Route>
            <Route path="/report" element={<Report />}></Route>
            <Route path="/confirmPayment" element={<ConfirmPayment />}></Route>
            <Route path="/redirect" element={<Redirect />}></Route>

            {/* Every route child of this will have the header */}
            <Route path={"/*"} element={<BaseNavigator />}>

                {/* Admin Paths */}
                <Route path="admin" element={<AdminDashboard />}>
                    <Route index element={<Navigate to="reseller" />}></Route>
                    <Route path="reseller" element={<AdminResellers />}></Route>
                    <Route path="merchant" element={<AdminMerchants />}></Route>
                </Route>

                {/* Merchant Paths */}
                <Route path="merchant/:merchantId/" element={<MerchantsPage />}>


                    <Route path="analytics" element={<AnalyticsComingSoon />} />
                    <Route path="stores" element={<StoresTab />}></Route>
                    <Route path="stores/:storeId" element={<StorePage />} >
                        <Route index element={<StoreManagementPage />} />
                        <Route path="balance" element={<Navigate to={`${new Date().getFullYear()}`} />} />
                        <Route path="balance/:year" element={<Navigate to="categories" />} />
                        <Route path="balance/:year/categories" element={<BalanceTab />} />
                        <Route path="balance/:year/categories/:categoryId/items/:itemId/months" element={<MonthlyBalanceView />} />
                        <Route path="balance/:year/categories/:categoryId/items/:itemId/months/:monthId/days" element={<DailyBalanceView />} />
                        <Route path="balance/:year/categories/:categoryId/items/:itemId/months/:monthId/days/:day/transactions" element={<DailyDetailBalanceView/>} />
                        <Route path="balance/settings" element={<BalanceSettings />}>
                            <Route index element={<Navigate to="categories" />} />
                            <Route path="categories" element={<BalanceSettingsCategories />} />
                            <Route path="items" element={<BalanceSettingsItems />} />
                            <Route path="rules" element={<BalanceSettingsRules />} />
                        </Route>
                        <Route path="transactions" element={<AccountingTransactionsTab />}>
                            <Route index element={<AccountingTransactionsList />}></Route>
                            <Route path=":transactionType/:transactionId" element={<AccountingTransactionDetails />}></Route>
                        </Route>
                        {/*<Route path="supplier-invoices" element={<SupplierInvoiceOverview />} />*/}
                        {/*<Route path="invoices" element={<InvoiceOverview />} />*/}
                        {/*<Route path="suppliers" element={<SuppliersTab />} />*/}
                        {/*<Route path="customers" element={<CustomersTab />} />*/}
                        {/*<Route path="data-sync" element={<DataSyncTab />} >*/}
                        {/*    <Route index element={<DataSyncHome />}></Route>*/}
                        {/*    <Route path={"accounting-transactions"} element={<DataSyncAccountingTransactions />}></Route>*/}
                        {/*    <Route path={"pos"} element={<DataSyncPosSync />}></Route>*/}
                        {/*</Route>*/}
                    </Route>

                    <Route path="interfaces" element={<InterfacesTab />}>
                        <Route index element={<InterfacesDashboard />} />
                    </Route>
                </Route>

                { /* Store Paths */}


                {/*<Route path="merchant/:merchantId/stores/store" element={<StoreDetails />} >*/}
                {/*    <Route index element={<TablesTab />}></Route>*/}
                {/*    <Route path="style" element={<AppearanceTab />}></Route>*/}
                {/*    <Route path="chains" element={<ChainsTab />}>*/}
                {/*        <Route index element={<ChainList />}></Route>*/}
                {/*        <Route path="chain" element={<ChainDetails />}></Route>*/}
                {/*    </Route>*/}
                {/*    <Route path="suppliers" element={<SuppliersTab />}></Route>*/}
                {/*    <Route path="customers" element={<CustomersTab />}></Route>*/}

                {/*    <Route path={"invoices"} element={<InvoiceOverview />}></Route>*/}
                {/*    <Route path={"invoices/invoice"} element={<InvoicePage />}></Route>*/}
                {/*    <Route path={"data-sync"} element={<DataSyncTab />}>*/}
                {/*        <Route index element={<DataSyncHome />}></Route>*/}
                {/*        <Route path={"accounting-transactions"} element={<DataSyncAccountingTransactions />}></Route>*/}
                {/*        <Route path={"pos"} element={<DataSyncPosSync />}></Route>*/}
                {/*    </Route>*/}
                {/*    <Route path="offers" element={<OffersTab />}>*/}
                {/*        <Route index element={<OfferList />} />*/}
                {/*        <Route path=":offerId" element={<OfferLines />} />*/}
                {/*    </Route>*/}
                {/*    <Route path="interfaces" element={<StoreInterfacesTab />}>*/}
                {/*        <Route index element={<InterfacesHome />} />*/}
                {/*    </Route>*/}
                {/*    <Route path="products" element={<ProductsTab />}></Route>*/}
                {/*</Route>*/}

                { /* Reseller Paths */}
                <Route path="reseller/:resellerId/" element={<ResellerPage />}>
                    <Route index element={<MerchantsTab />} />
                </Route>

                <Route path='*' element={<Navigate to='/' />}></Route>
            </Route>
        </Routes>
    );
}

export default App;

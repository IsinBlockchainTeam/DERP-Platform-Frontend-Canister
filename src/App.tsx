import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DEFAULT_THEME } from './constants';
import AdminDashboard from './pages/Administration/AdminDashboard';
import PaymentCanceled from "./pages/PaymentFailed/PaymentFailed";
import Report from './pages/Report/Report';
import Offers from "./pages/Offers/Offers";
import Redirect from './pages/Redirect/Redirect';
import LoginPage from './pages/Login/LoginPage';
import SupplierSignup from './pages/SupplierSignup/SupplierSignup';
import TemporaryInvoice from "./pages/TemporaryInvoice/TemporaryInvoice";
import SupplierOrders from "./pages/SupplierOrders/SupplierOrders";
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
import { SupplierInvoicesTab } from "./pages/Stores/Tabs/InvoicesTab/SupplierInvoicesTab";
import { InvoicePage } from "./pages/Stores/Tabs/InvoicesTab/InvoicePage";
import UpdateCompanyInfo from "./pages/CompanyInfo/UpdateCompanyInfo";
import SaveCompanyInfo from "./pages/CompanyInfo/SaveCompanyInfo";
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
import BalanceTab from './pages/Merchant/Balance/BalanceTab';
import BalanceView from './pages/Merchant/Balance/BalanceView';
import MonthlyBalanceView from './pages/Merchant/Balance/MonthlyBalanceView';
import DailyBalanceView from './pages/Merchant/Balance/DailyBalanceView';
import DailyDetailBalanceView from './pages/Merchant/Balance/DailyDetailBalanceView';
import BalanceSettings from './pages/Merchant/Balance/BalanceSettings';
import StoreInterfacesTab from './pages/Stores/Tabs/InterfacesTab/StoreInterfacesTab';
import BalanceSettingsCategories from './pages/Merchant/Balance/BalanceSettings/BalanceSettingsCategories';
import BalanceSettingsItems from './pages/Merchant/Balance/BalanceSettings/BalanceSettingsItems';
import { AuthClient } from '@dfinity/auth-client';
import BalanceTabDEMO from './pages/Merchant/Balance/DEMO/BalanceTabDEMO';
import MonthlyBalanceViewDEMO from './pages/Merchant/Balance/DEMO/MonthlyBalanceViewDEMO';
import DailyBalanceViewDEMO from './pages/Merchant/Balance/DEMO/DailyBalanceViewDEMO';
import DailyDetailBalanceViewDEMO from './pages/Merchant/Balance/DEMO/DailyDetailBalanceViewDEMO';


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
            <Route path="/offers" element={<Offers />}></Route>
            <Route path="/table" element={<TemporaryInvoice />}></Route>
            <Route path="/paymentSuccess" element={<PaymentSuccess />}></Route>
            <Route path="/paymentFailed" element={<PaymentFailed />}></Route>
            <Route path="/paymentCanceled" element={<PaymentCanceled />}></Route>
            <Route path="/report" element={<Report />}></Route>
            <Route path="/confirmPayment" element={<ConfirmPayment />}></Route>
            <Route path="/redirect" element={<Redirect />}></Route>

            {/* TODO: Are these still needed? */}
            <Route path="/supplier/signup" element={<SupplierSignup />}></Route>
            <Route path="/supplier/orders" element={<SupplierOrders />}></Route>
            <Route path="/supplier/updateCompanyInfo" element={<UpdateCompanyInfo />}></Route>
            <Route path="/supplier/saveCompanyInfo" element={<SaveCompanyInfo />}></Route>

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
                    <Route index element={<Navigate to="balance" />}></Route>
                    <Route path="balance" element={<Navigate to={`${new Date().getFullYear()}`} />} />
                    <Route path="balance/:year" element={<Navigate to="categories" />} />
                    {/*<Route path="balance/:year/categories" element={<BalanceTabDEMO />}>*/}
                    {/*    <Route index element={<BalanceView />} />*/}
                    {/*    <Route path=":categoryId" element={<Navigate to="items" />} />*/}
                    {/*    <Route path=":categoryId/items" element={<BalanceView />} />*/}
                    {/*    <Route path=":categoryId/items/:itemId" element={<Navigate to="months" />} />*/}
                    {/*    <Route path=":categoryId/items/:itemId/months" element={<MonthlyBalanceView />} />*/}
                    {/*    <Route path=":categoryId/items/:itemId/months/:monthId" element={<Navigate to="days" />} />*/}
                    {/*    <Route path=":categoryId/items/:itemId/months/:monthId/days" element={<DailyBalanceView />} />*/}
                    {/*    <Route path=":categoryId/items/:itemId/months/:monthId/days/:day" element={<Navigate to="transactions" />} />*/}
                    {/*    <Route path=":categoryId/items/:itemId/months/:monthId/days/:day/transactions" element={<DailyDetailBalanceView/>} />*/}
                    {/*</Route>*/}
                    <Route path="balance/:year/categories/:categoryId/items/:itemId/months" element={<MonthlyBalanceViewDEMO />} />
                    <Route path="balance/:year/categories/:categoryId/items/:itemId/months/:monthId/days" element={<DailyBalanceViewDEMO />} />
                    <Route path="balance/:year/categories/:categoryId/items/:itemId/months/:monthId/days/:day/transactions" element={<DailyDetailBalanceViewDEMO/>} />
                    <Route path="balance/:year/categories" element={<BalanceTabDEMO />}>
                        {/*<Route path=":categoryId/items/:itemId/months/:monthId" element={<Navigate to="days" />} />*/}
                        {/*<Route path=":categoryId/items/:itemId/months/:monthId/days/:day" element={<Navigate to="transactions" />} />*/}
                    </Route>
                    <Route path="balance/settings" element={<BalanceSettings />}>
                        <Route index element={<Navigate to="categories" />} />
                        <Route path="categories" element={<BalanceSettingsCategories />} />
                        <Route path="items" element={<BalanceSettingsItems />} />
                    </Route>
                    <Route path="stores" element={<StoresTab />}></Route>
                    <Route path="interfaces" element={<InterfacesTab />}>
                        <Route index element={<InterfacesDashboard />} />
                    </Route>
                </Route>
                <Route path="merchant/:merchantId/stores/store" element={<StoreDetails />} >
                    <Route index element={<TablesTab />}></Route>
                    <Route path="style" element={<AppearanceTab />}></Route>
                    <Route path="chains" element={<ChainsTab />}>
                        <Route index element={<ChainList />}></Route>
                        <Route path="chain" element={<ChainDetails />}></Route>
                    </Route>
                    <Route path="suppliers" element={<SuppliersTab />}></Route>
                    <Route path="customers" element={<CustomersTab />}></Route>
                    <Route path="transactions" element={<AccountingTransactionsTab />}>
                        <Route index element={<AccountingTransactionsList />}></Route>
                        <Route path=":transactionId" element={<AccountingTransactionDetails />}></Route>
                    </Route>
                    <Route path={"invoices"} element={<SupplierInvoicesTab />}></Route>
                    <Route path={"invoices/invoice"} element={<InvoicePage />}></Route>
                    <Route path={"data-sync"} element={<DataSyncTab />}>
                        <Route index element={<DataSyncHome />}></Route>
                        <Route path={"accounting-transactions"} element={<DataSyncAccountingTransactions />}></Route>
                    </Route>
                    <Route path="offers" element={<OffersTab />}>
                        <Route index element={<OfferList />} />
                        <Route path=":offerId" element={<OfferLines />} />
                    </Route>
                    <Route path="interfaces" element={<StoreInterfacesTab />}>
                        <Route index element={<InterfacesHome />} />
                    </Route>
                    <Route path="products" element={<ProductsTab />}></Route>
                </Route>

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

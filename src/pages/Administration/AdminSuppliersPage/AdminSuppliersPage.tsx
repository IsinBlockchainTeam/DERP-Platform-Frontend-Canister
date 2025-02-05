import {useEffect, useState} from "react";
import FormLoader from "../../../components/Loading/FormLoader";
import {useTranslation} from "react-i18next";
import {supplierService} from "../../../api/services/Supplier";
import {Supplier} from "../../../dto/stores/StoreList";
import {useNavigate} from "react-router-dom";
import { companyInfoService } from '../../../api/services/CompanyInfo';
import { CompanyInfoDto } from '../../../dto/CompanyInfoDto';

export function AdminSuppliersPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<{ email: string, webId: string, companyInfo: CompanyInfoDto }[]>();
  const {t} = useTranslation(undefined, {keyPrefix: 'adminDashboard.suppliersPage'})

  const init = async () => {
    try {
      setLoading(true);
      const suppliers = await supplierService.list();
      const supplierDetailsPromises = suppliers.map( (supplier) =>  ({
        ...supplier,
        promise: companyInfoService.getCompanyInfoBySupplierWebId(supplier.webId)
      }));
      const supplierDetails = await Promise.all(supplierDetailsPromises.map(async (supplier) => {
          const companyInfo = await supplier.promise;
          return {
          email: supplier.email,
          webId: supplier.webId,
          companyInfo: companyInfo ? companyInfo : { businessName: '', email: '', phone: '', idi: '', vat: '', webSite: '', representativeUserEmail: ''} as CompanyInfoDto
          }
      }));

      setSuppliers(supplierDetails);
    } catch (error : unknown) {
      if (error instanceof Error)
        console.error(error.message);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    init().then();
  }, []);

  const onDetails = async (supplier: Supplier) => {
    const urlQuery = new URLSearchParams();
    urlQuery.set('supplierWebId', supplier.webId);
    urlQuery.set('supplierEmail', supplier.email);

    navigate(`details?${urlQuery.toString()}`);
  }

  return <main>
    {loading ? <FormLoader/> :
      <div className={'flex flex-wrap items-center justify-around py-4'}>
        <div className="overflow-x-auto max-w-3xl items-center">
          <h2 className="text-2xl mb-4 font-bold text-center">{t('title')}</h2>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Email</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">WebID</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Business name</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">IDI</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Representative</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Actions</div>
              </th>
            </tr>
            </thead>
            <tbody>
            {suppliers?.map(s => (
                <tr
                    key={s.webId}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                    <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-ellipsis overflow-hidden dark:text-white max-w-[12rem]"
                    >
                        {s.email}
                    </td>
                    <td className="px-6 py-4">
                        {s.webId || "None"}
                    </td>
                    <td className="px-6 py-4">
                        {s.companyInfo.businessName || "None"}
                    </td>
                    <td className="px-6 py-4">
                        {s.companyInfo.idi || "None"}
                    </td>
                    <td className="px-6 py-4">
                        {s.companyInfo.representativeUserEmail || "None"}
                    </td>
                    <td className="px-6 py-4">
                        <button type='button' className={'btn btn-sm'} onClick={() => onDetails(s)}>Details</button>
                    </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    }
  </main>
}

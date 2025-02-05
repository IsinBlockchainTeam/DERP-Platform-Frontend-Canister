import { useTranslation } from "react-i18next";
import TabTitle from "../../../../components/Tabs/TabTitle";
import { useNavigate, useSearchParams } from "react-router-dom";


export default function DataSyncHome() {
  const { t } = useTranslation(undefined, { keyPrefix: "supplierDataSync" });
  const [urlSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const resources: {
    name: string;
    to: string;
    translateKey: any;
  }[] = [
    {
      translateKey: "accountingTransactions",
      name: "accountingTransactions",
      to: "./accounting-transactions",
    },
  ]

  return (
    <>
      <TabTitle title={t("title")} />
      <p className="font-light">{t("subtitle")}</p>

      <ul className="menu bg-base-200 rounded-box w-64 mt-16">
        {
          resources.map((resource) => (
            <li key={resource.name} className="text-2xl font-light w-auto">
              <a onClick={() => navigate(resource.to + "?" + urlSearchParams.toString())}>
                {(t(resource.translateKey)) as any}
                <span className="w-3" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </a>
            </li>
          ))
        }
      </ul>
    </>
  )
}
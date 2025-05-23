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
    descriptionKey: string;
    icon: JSX.Element;
    color: string;
  }[] = [
    {
      translateKey: "accountingTransactions",
      descriptionKey: "accountingTransactionsDescription",
      name: "accountingTransactions",
      to: "./accounting-transactions",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: "primary-100",
    },
    {
      translateKey: "posDataSync",
      descriptionKey: "posDataSyncDescription",
      name: "posDataSync", 
      to: "./pos",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0 0 20.25 8.734V8.25a2.25 2.25 0 0 0-2.25-2.25h-13.5A2.25 2.25 0 0 0 2.25 8.25v.484c0 .71.23 1.42.69 2.006M12 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      ),
      color: "primary-200",
    },
  ];

  return (
    <>
      <TabTitle title={t("title")} />
      <p className="font-light text-lg mb-8">{t("subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl items-stretch">
        {resources.map((resource) => (
          <div
            key={resource.name}
            onClick={() => navigate(resource.to + "?" + urlSearchParams.toString())}
            className="group cursor-pointer transition-all duration-300 h-full"
          >
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-shadow duration-300 h-full flex flex-col">
              {/* Header with subtle color */}
              <div className={`bg-${resource.color} group-hover:bg-primary-100 border-b border-gray-200 p-6 transition-colors duration-300`}>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-white rounded-lg p-3">
                    <div className="text-primary">
                      {resource.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {(t(resource.translateKey)) as any}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-gray-600 mb-4">
                  {(t(resource.descriptionKey as any)) as any}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 group-hover:text-primary group-hover:underline transition-colors duration-300">
                    {t("clickToConfigure")}
                  </span>
                  <div className="bg-gray-50 group-hover:bg-primary-50 rounded-full p-2 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors duration-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
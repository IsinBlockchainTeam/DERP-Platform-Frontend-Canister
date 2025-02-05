import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "../../api/auth";
import { StoreDto } from "../../dto/stores/StoreDto";
import { TableDto } from "../../dto/TableDto";
import { copyToClipboard } from "../../utils";
import FormLoader from "../Loading/FormLoader";
import QrCode from "../QrCode/QrCode";

export type Props = {
    store: StoreDto;
    table?: TableDto;
};

export default function QRViewer({ store, table}: Props) {
    const { t } = useTranslation(undefined, { keyPrefix: "supplierTables" });
    const [loading, setLoading] = useState<boolean>(false);
    const [tableLink, setTableLink] = useState<string>("");

    const generateTableLink = async () => {
        setLoading(true);
        try {
            if (!store) throw new Error("Not valid selected store");
            if (!table) throw new Error("Not valid selected table");

            const token = await auth.generateCustomerToken({
                storeUrl: store.url,
                erpType: store.erpType,
                erpUrl: store.erpUrl,
                tableId: table.id,
            });

            const url = await auth.shorten(
                `${window.location.origin}/table?token=${token}`,
            );
            setTableLink(url);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(store && table?.id)
            generateTableLink();
    }, [store, table]);

    return (
        <div>
            {loading ? (
                <FormLoader />
            ) : (
                tableLink && table && (
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl mb-4 font-bold">
                            {t("qrViewTitle")}
                        </h1>
                        <p className="text-caption text-center p-2">{t("qrViewCaption")}</p>
                        {<QrCode value={tableLink} tableName={table.label}/>}
                    </div>
                )
            )}
        </div>
    );
}

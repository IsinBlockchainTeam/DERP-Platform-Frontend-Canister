import { useNavigate, useSearchParams } from "react-router-dom";
import { parseSearchParamSafe } from "../../../../utils";
import DocumentViewer from "../../../../components/DocumentViewer/DocumentViewer";
import React, { useEffect } from "react";

export const InvoicePage = () => {
    const [params] = useSearchParams();
    const pdfUrl = parseSearchParamSafe(params, 'pdfUrl');

    useEffect(() => {
        console.log("Showing pdf at url: " + pdfUrl)
    }, []);

    return <main>
        <DocumentViewer invoiceUrl={decodeURIComponent(pdfUrl)} temporary={false} onLoadError={() => {
            return;
        }} onLoadSuccess={() => {
            return;
        }} />
    </main>
}

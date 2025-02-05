import {Document, Page, pdfjs} from 'react-pdf';
import React, {useState} from "react";
import {DEFAULT_A4_PAGE_WIDTH} from "../../constants";

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.js';

interface Props {
    invoiceUrl: string;
    temporary: boolean;
    onLoadError: (error: any) => void;
    onLoadSuccess: ({pages}: any) => void;
}

function DocumentViewer ({invoiceUrl, temporary, onLoadError, onLoadSuccess}: Props) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageWidth, setPageWidth] = useState(0);

    const updatePageWidth = () => {
        window.innerWidth > DEFAULT_A4_PAGE_WIDTH ? setPageWidth(DEFAULT_A4_PAGE_WIDTH): setPageWidth(window.innerWidth);
    }

    const onSuccess = ({numPages}: any) => {
        setNumPages(numPages);
        onLoadSuccess({numPages});
    }

    React.useEffect(() => {
        updatePageWidth();
        window.addEventListener('resize', updatePageWidth);
    }, []);

    return (
        <div className={`flex content-center justify-center`}>
            <Document file={invoiceUrl} onLoadError={onLoadError} onLoadSuccess={onSuccess} className="max-w-full">
                {
                    Array.from(new Array(numPages), (element, index) => (
                        // @ts-expect-error - the exported types are not updated with the size prop
                        <Page size="A4" renderAnnotationLayer={false} renderTextLayer={false} pageNumber={index+1} key={index} width={pageWidth}/>
                    ))
                }
            </Document>
        </div>
    );
}

export default DocumentViewer;

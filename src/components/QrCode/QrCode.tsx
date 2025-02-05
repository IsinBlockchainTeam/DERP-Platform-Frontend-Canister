import QRCode from "qrcode.react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { copyToClipboard } from "../../utils";

interface Props {
    value: string;
    tableName: string;
}

function QrCode({ value, tableName }: Props) {
    const { t } = useTranslation();
    const tableLinkSpanElement = useRef<HTMLSpanElement>(null);

    const downloadQRCode = () => {
        const canvas = document.getElementById("qr") as HTMLCanvasElement;
        const qrCodeURL = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        const aElement = document.createElement("a");
        aElement.href = qrCodeURL;
        aElement.download = tableName + ".png";
        document.body.appendChild(aElement);
        aElement.click();
        document.body.removeChild(aElement);
    };

    const copyLink = () => {
        copyToClipboard(
            tableLinkSpanElement.current,
            value,
            t("supplierTables.qrViewTitle"),
        );
    };

    return (
        <div className="mt-6 flex flex-col items-center card-bordered p-4">
            <QRCode id="qr" value={value} size={128} includeMargin={true} />
            <div className="flex flex-col w-full">
                <button
                    className="btn btn-primary mt-2"
                    onClick={downloadQRCode}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                    </svg>

                    {t("downloadQr")}
                </button>
            </div>
            <div className="divider">{t("adminDashboard.or")}</div>
            <div className="flex flex-col w-full">
                <button className="btn btn-primary mt-2" onClick={copyLink}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                        />
                    </svg>

                    {t("copyQrLink")}
                </button>
            </div>

            <span
                hidden
                ref={tableLinkSpanElement}
                className={`whitespace-nowrap`}
            >
                {value}
            </span>
        </div>
    );
}

export default QrCode;

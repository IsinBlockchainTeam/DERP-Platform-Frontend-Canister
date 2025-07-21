import { StatementItem } from "@derp/company-canister";
import {useState} from "react";
import ReactDatePicker from "react-datepicker";
import {statementItemsClient} from "../../api/icp";
import {convertTransactionsToCSV, downloadCSVFromArray} from "../../utility/FileManagement";
import {Download} from "lucide-react";



type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    statementItemByCategoryMap: Map<number | undefined, StatementItem[]>;
}



const ExportStatementItemsModal = (props:Props)=> {

    const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(null);
    const [selectedToDate, setSelectedTpDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDateFromChange = (date: Date | null) => {
        setSelectedFromDate(date);
    };

    const handleDateToChange = (date: Date | null) => {
        setSelectedTpDate(date);
    };

    const exportAllStatementItemsToCsv = async () => {
        setIsLoading(true);
        try {
            if (props.statementItemByCategoryMap.size === 0) {
                console.warn('No statement items available to export.');
                return;
            }

            if (selectedFromDate === null || selectedToDate === null) {
                console.warn('Select a date range before exporting.');
                return;
            }

            const allStatementItems = Array.from(props.statementItemByCategoryMap.values()).flat();
            if (allStatementItems.length === 0) {
                console.warn('No statement items found for export.');
                return;
            }

            const normalizedFromDate = new Date(selectedFromDate);
            normalizedFromDate.setUTCHours(0, 0, 0, 0); // Normalize to start of day
            const normalizedToDate = new Date(selectedToDate);
            normalizedToDate.setUTCHours(23, 59, 59, 999); // Normalize to end of day
            const csvData = [];
            for(const statementItem of allStatementItems) {
                for(let date = new Date(normalizedFromDate); date <= normalizedToDate; date.setDate(date.getDate() + 1)) {
                    const recordsAndTransactions = await statementItemsClient.getStatementItemRecordsWithTransactions(statementItem.id,date);
                    csvData.push(await convertTransactionsToCSV(recordsAndTransactions));
                }
            }
            const csvDataWithoutUndefined:string[] = csvData.filter((data): data is string => data !== undefined && true &&  data !== '');
            console.log(csvDataWithoutUndefined);

            downloadCSVFromArray(csvDataWithoutUndefined);
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }finally {
            setIsLoading(false);
            props.onClose();
        }
    }

    return (
        <div className={`modal  ${props.isOpen ? 'modal-open' : ''}`}>
            <div className="flex flex-col modal-box h-auto min-h-[500px] overflow-y-auto">
                <h3 className="font-bold text-lg mb-4">{props.title}</h3>
                <div className="flex flex-col grow justify-between">
                {isLoading && <div className="justify-center loading loading-spinner loading-lg"></div>}
                {!isLoading && <>
                    <div className="flex form-control w-full justify-center items-center">
                        <div>
                        <label className="label">
                            <span className="label-text">Select From Date:</span>
                        </label>
                        <ReactDatePicker
                            selected={selectedFromDate}
                            onChange={handleDateFromChange}
                            className="input input-bordered"
                            dateFormat="yyyy-MM-dd"
                        />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Select To Date:</span>
                            </label>
                            <ReactDatePicker
                                selected={selectedToDate}
                                onChange={handleDateToChange}
                                className="input input-bordered"
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                    </div>
                    <div className="modal-action justify-end">
                        <button
                            className="btn btn-ghost"
                            onClick={props.onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className={`btn btn-primary`}
                        onClick={exportAllStatementItemsToCsv}
                        disabled={!selectedFromDate || !selectedToDate}
                    >
                        <>
                            <Download className="h-4 w-4 mr-2"/>
                            Export CSV
                        </>
                    </button>
                </div>
                </>
                }
                </div>
            </div>
        </div>
    );

}

export default ExportStatementItemsModal;
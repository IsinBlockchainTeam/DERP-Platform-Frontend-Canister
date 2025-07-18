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

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDateFromChange = (date: Date | null) => {
        setSelectedDate(date);
    };


    const exportAllStatementItemsToCsv = async () => {
        try {
            if (props.statementItemByCategoryMap.size === 0) {
                console.warn('No statement items available to export.');
                return;
            }

            if (selectedDate === null) {
                console.warn('No date selected.');
                return;
            }

            const allStatementItems = Array.from(props.statementItemByCategoryMap.values()).flat();
            if (allStatementItems.length === 0) {
                console.warn('No statement items found for export.');
                return;
            }
            const csvData = [];
            for(const statementItem of allStatementItems) {
                const recordsAndTransactions = await statementItemsClient.getStatementItemRecordsWithTransactions(statementItem.id,new Date(Date.UTC(
                    selectedDate.getUTCFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDay()
                )));

                csvData.push(convertTransactionsToCSV(recordsAndTransactions));
            }
            const csvDataWithoutUndefined:string[] = csvData.filter((data): data is string => data !== undefined && true &&  data !== '');
            console.log(csvDataWithoutUndefined);
            downloadCSVFromArray(csvDataWithoutUndefined);
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    }

    return (
        <div className={`modal  ${props.isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box h-auto min-h-[500px] overflow-y-auto ">
                <h3 className="font-bold text-lg mb-4">{props.title}</h3>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Select Date:</span>
                    </label>
                    <ReactDatePicker
                        selected={selectedDate}
                        onChange={handleDateFromChange}
                        className="input input-bordered"
                        dateFormat="yyyy-MM-dd"
                    />
                </div>

                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={props.onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={`btn btn-primary`}
                        onClick={exportAllStatementItemsToCsv}
                        disabled={!selectedDate}
                    >
                    <>
                        <Download className="h-4 w-4 mr-2"/>
                        Export CSV
                    </>
                    </button>
                </div>
            </div>
        </div>
    );

}

export default ExportStatementItemsModal;
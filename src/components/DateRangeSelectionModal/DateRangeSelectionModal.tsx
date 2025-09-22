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
    confirmButtonText?: string;
    onSubmit: (fromDate:Date, toDate:Date) => void;
}



const DataRangeSelectionModal = (props:Props)=> {

    const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(null);
    const [selectedToDate, setSelectedToDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDateFromChange = (date: Date | null) => {
        setSelectedFromDate(date);
    };

    const handleDateToChange = (date: Date | null) => {
        setSelectedToDate(date);
    };

    const confirmAndClose = () => {
        if (!selectedFromDate || !selectedToDate) {
            return;
        }
        setIsLoading(true);
        try {
            props.onSubmit(selectedFromDate,selectedToDate);
            props.onClose();
        } finally {
            setIsLoading(false);
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
                        onClick={confirmAndClose}
                        disabled={!selectedFromDate || !selectedToDate}
                    >
                        <>
                            {props.confirmButtonText}
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

export default DataRangeSelectionModal;
import { StatementItem } from "@derp/company-canister";
import {useState} from "react";
import {convertTransactionsToCSV, downloadCSVFromArray} from "../../utility/FileManagement";
import {Download} from "lucide-react";
import DataRangeSelectionModal from '../DateRangeSelectionModal/DateRangeSelectionModal';
import { useStatementItemsClient } from '../../pages/Stores/StoreProvider';



type Props = {
    statementItemByCategoryMap: Map<number | undefined, StatementItem[]>;
}


const ExportStatementItemsCSV = (props:Props)=> {
    const [isDateRangeSelectionOpen, setIsDateRangeSelectionOpen] = useState(false);

    const statementItemsClient = useStatementItemsClient();

    const toggleDateRangeSelectionModal = () => {
        setIsDateRangeSelectionOpen(!isDateRangeSelectionOpen);
    }

    const exportAllStatementItemsToCsv = async (fromDate:Date,toDate:Date) => {
        try {
            if(statementItemsClient.client === null) {
                console.error('StatementItemsClient is not available.');
                return;
            }

            if (props.statementItemByCategoryMap.size === 0) {
                console.warn('No statement items available to export.');
                return;
            }

            const allStatementItems = Array.from(props.statementItemByCategoryMap.values()).flat();
            if (allStatementItems.length === 0) {
                console.warn('No statement items found for export.');
                return;
            }

            const normalizedFromDate = new Date(fromDate);
            normalizedFromDate.setUTCHours(0, 0, 0, 0); // Normalize to start of day
            const normalizedToDate = new Date(toDate);
            normalizedToDate.setUTCHours(23, 59, 59, 999); // Normalize to end of day
            const csvData = [];
            for(const statementItem of allStatementItems) {
                for(let date = new Date(normalizedFromDate); date <= normalizedToDate; date.setDate(date.getDate() + 1)) {
                    const recordsAndTransactions = await statementItemsClient.client.getStatementItemRecordsWithTransactions(statementItem.id,date);
                    csvData.push(await convertTransactionsToCSV(recordsAndTransactions,statementItem));
                }
            }
            const csvDataWithoutUndefined:string[] = csvData.filter((data): data is string => data !== undefined && true &&  data !== '');
            console.log(csvDataWithoutUndefined);

            downloadCSVFromArray(csvDataWithoutUndefined);
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    }

    return (
        <>
            <button
                onClick={() => toggleDateRangeSelectionModal()}
                className="btn btn-ghost btn-circle mr-4"
                aria-label="Export CSV"
            >
                <Download className="h-5 w-5" />
            </button>
            <DataRangeSelectionModal
                title={"Export Statement Items"}
                isOpen={isDateRangeSelectionOpen}
                onClose={toggleDateRangeSelectionModal}
                onSubmit={exportAllStatementItemsToCsv}
                confirmButtonText={"Export CSV"}
            />
        </>
    );

}

export default ExportStatementItemsCSV;
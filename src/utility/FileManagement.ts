import { AccountingTransaction, AccountingTransactionWithTotals, DailyTransactionRecord } from "@derp/company-canister";
import {dispatchRulesClient, statementItemsClient} from "../api/icp";


export const downloadCSV = (csvContent: string, filename = 'transactions.csv'): void => {
    // Aggiungi BOM per il supporto UTF-8 in Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    // Crea un blob con il contenuto CSV
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });

    // Crea un URL temporaneo per il blob
    const url = URL.createObjectURL(blob);

    // Crea un elemento <a> temporaneo per il download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // Aggiungi al DOM, clicca e rimuovi
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Pulisci l'URL temporaneo
    URL.revokeObjectURL(url);
};

export const downloadCSVFromArray = (csvRows: string[], filename = 'transactions.csv'): void => {
    if (csvRows.length === 0) {
        console.warn('Array CSV vuoto, nessun file generato');
        return;
    }

    // Unisci tutte le righe con newline
    const csvContent = csvRows.join('\n');
    const header = CSV_COLUMNS.map(column => escapeCsvValue(column)).join(',');
    const finalCSV = header + '\n' + csvContent;
    // Riutilizza il metodo esistente
    downloadCSV(finalCSV, filename);
};

interface TransactionData {
    record: DailyTransactionRecord;
    transaction: AccountingTransaction;
}

// Tipo per una riga CSV
interface TransactionCSVRow {
    record_id: number;
    statement_item: string;
    record_date: string;
    issue_date: string;
    value_date: string;
    total: number;
    dlterp_id: string;
    txType: string;
    dispatch_rule_type: string | undefined;
    dispatch_rule_operation: string | undefined;
    currency: string;
    source: string;
    storeId: number;
    type_key: string;
    external_reference_number: string;
    description: string;
}

// Builder per costruire una riga CSV da TransactionData
class TransactionCSVRowBuilder {

    static async build(data: TransactionData): Promise<TransactionCSVRow> {
        const { record, transaction } = data;
        const header = transaction.Header;
        const statementItem = await statementItemsClient.getStatementItem(record.parentStatementItemId);
        let dispatchRule = null;
        if(record.originalRuleId !== undefined && record.originalRuleId !== null) {
            console.log(`Fetching dispatch rule for originalRuleId: ${record.originalRuleId}`);
            dispatchRule = await dispatchRulesClient.getDispatchRule(Number(record.originalRuleId));
        }
        const row: TransactionCSVRow = {
            // Campi da DailyTransactionRecord
            record_id: record.id,
            statement_item: statementItem.name,
            record_date: this.formatDate(record.date),
            issue_date: this.formatOptionalDate(header.IssueDate),
            value_date: this.formatOptionalDate(header.ValueDate),
            total: record.total,
            dlterp_id: record.transactionId,
            txType: record.txType,
            dispatch_rule_type: dispatchRule?.ruleType,
            dispatch_rule_operation: dispatchRule?.accountingOperation,
            currency: this.formatOptionalString(header.Currency),
            source: this.formatOptionalString(header.Source),
            storeId: header.StoreId,
            type_key: this.formatOptionalString(header.TypeKey),
            external_reference_number: this.formatOptionalString(header.ExternalReferenceNumber),
            description: this.formatOptionalString(header.Description),
        };

        return row;
    }

    private static formatDate(date: Date): string {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    private static formatOptionalDate(date: Date | null): string {
        return date ? this.formatDate(date) : '';
    }

    private static formatOptionalString(value: string | null): string {
        return value ?? '';
    }

}

// Funzione per convertire un valore in stringa sicura per CSV
export const escapeCsvValue = (value: any): string => {
    if (value === null || value === undefined) {
        return '';
    }

    let stringValue = String(value);

    // Se contiene virgole, virgolette o newline, racchiudi tra virgolette
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        // Escape delle virgolette interne raddoppiandole
        stringValue = stringValue.replace(/"/g, '""');
        stringValue = `"${stringValue}"`;
    }

    return stringValue;
};

// Definizione delle colonne del CSV nell'ordine desiderato
export const CSV_COLUMNS: (keyof TransactionCSVRow)[] = [
    "record_id",
    "statement_item",
    "record_date",
    "issue_date",
    "value_date",
    "total",
    "dlterp_id",
    "txType",
    "dispatch_rule_type",
    "dispatch_rule_operation",
    "currency",
    "source",
    "storeId",
    "type_key",
    "external_reference_number",
    "description",
];

export const convertTransactionsToCSV = async (data: TransactionData[]): Promise<string> => {
    if (data.length === 0) {
        return '';
    }

    // Costruisci le righe CSV usando il builder
    const csvRows = await Promise.all(data.map(item => TransactionCSVRowBuilder.build(item)));

    // Crea l'header del CSV
    // const csvHeader = CSV_COLUMNS.map(column => escapeCsvValue(column)).join(',');

    // Crea le righe dati del CSV
    const csvDataRows = csvRows.map(row => {
        return CSV_COLUMNS.map(column => escapeCsvValue(row[column])).join(',');
    });

    // Combina header e righe
    return [...csvDataRows].join('\n');
};
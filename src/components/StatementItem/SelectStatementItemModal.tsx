import { StatementItem } from "@derp/company-canister";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../Modal/Modal";
import { StatementItemSelector, useStatementItems } from "./StatementItemSelector";

interface Props {
    isOpen: boolean;
    title: string;
    description: string;
    multi?: boolean;
    onChangeOpen: (open: boolean) => void;
    onItemSelected?: (item: StatementItem | StatementItem[]) => void;
    externalLoading?: boolean;
    /** Initial value as StatementItem(s) */
    initialValue?: StatementItem | StatementItem[];
}

const SelectStatementItemModal = ({ 
    isOpen, 
    onChangeOpen, 
    onItemSelected, 
    title, 
    description, 
    multi = false, 
    externalLoading = false,
    initialValue
}: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.selectStatementItemModal' });
    const [hasSelection, setHasSelection] = useState(false);
    const [selectedItem, setSelectedItem] = useState<StatementItem | StatementItem[] | undefined>(initialValue);
    
    // Use the hook to fetch data once for the modal
    const { items, categories, loading: dataLoading } = useStatementItems();

    const handleItemSelected = (item: StatementItem | StatementItem[]) => {
        setSelectedItem(item);
    };

    const handleSubmit = () => {
        if (onItemSelected && selectedItem) {
            onItemSelected(selectedItem);
            onChangeOpen(false);
        }
    };

    const handleCancel = () => {
        if (!externalLoading) {
            setSelectedItem(initialValue);
            onChangeOpen(false);
        }
    };

    const handleModalOpenChange = (open: boolean) => {
        if (!externalLoading) {
            if (!open) {
                setSelectedItem(initialValue);
            }
            onChangeOpen(open);
        }
    };

    return (
        <Modal
            open={isOpen}
            onChangeOpen={handleModalOpenChange}
            closeButton={false}
        >
            <div className="modal-header">
                <h3 className="text-3xl font-light">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div className="modal-body mt-4">
                <StatementItemSelector
                    multi={multi}
                    value={selectedItem}
                    items={items}
                    categories={categories}
                    onItemSelected={handleItemSelected}
                    externalLoading={externalLoading || dataLoading}
                    onSelectionChange={setHasSelection}
                />
            </div>

            <div className="modal-action">
                <button 
                    className="btn btn-secondary" 
                    onClick={handleCancel}
                    disabled={externalLoading || dataLoading}
                >
                    {t('cancel')}
                </button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleSubmit}
                    disabled={externalLoading || dataLoading || !hasSelection}
                >
                    {t('submit')}
                </button>
            </div>
        </Modal>
    );
};

export default SelectStatementItemModal; 
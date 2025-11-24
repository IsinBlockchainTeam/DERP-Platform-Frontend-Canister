import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal } from "../../../../components/Modal/Modal"
import StatementItemForm, { StatementItemData } from "../../../../components/StatementItem/StatementItemForm"
import { StatementItem } from "@derp/company-canister"
import { useStatementItemsClient } from '../../../Stores/StoreProvider';

interface Props {
    isOpen: boolean
    onChangeOpen: (open: boolean) => void
    onItemCreated?: () => void // Optional callback for when item is successfully created
}

const AddItemModal = ({ isOpen, onChangeOpen, onItemCreated}: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.addItemModal' });
    const [loading, setLoading] = useState(false)

    const statementItemsClient = useStatementItemsClient();

    const onSubmit = async (data: StatementItemData) => {
        if (statementItemsClient.client === null){
            console.error("StatementItemsClient is not available.");
            return
        }
        setLoading(true)
        try {
            const statementItem = new StatementItem(
                parseInt(data.id),
                data.name,
                data.currency,
                data.category ? parseInt(data.category) : undefined,
            )
            await statementItemsClient.client.storeStatementItem(statementItem)
            
            // Only close modal and trigger callback after successful creation
            onItemCreated?.()
            onChangeOpen(false)
        } catch (error) {
            console.error(error)
            throw error // Re-throw to let the form handle it
        } finally {
            setLoading(false)
        }
    }

    const onCancel = () => {
        if (!loading) { // Prevent closing while loading
            onChangeOpen(false)
        }
    }

    return <Modal
        open={isOpen}
        onChangeOpen={(open) => {
            if (!loading) { // Prevent closing while loading
                onChangeOpen(open)
            }
        }}
        closeButton={false}
    >
        <StatementItemForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            loading={loading}
        />
    </Modal>
}

export default AddItemModal;

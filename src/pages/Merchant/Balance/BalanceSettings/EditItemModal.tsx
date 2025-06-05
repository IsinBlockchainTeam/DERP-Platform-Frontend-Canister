import { useState } from "react"
import { useTranslation } from "react-i18next"
import { statementItemsClient } from "../../../../api/icp"
import { Modal } from "../../../../components/Modal/Modal"
import StatementItemForm, { StatementItemData } from "../../../../components/StatementItem/StatementItemForm"
import { StatementItem } from "@derp/company-canister"

interface Props {
    isOpen: boolean
    onChangeOpen: (open: boolean) => void
    item: StatementItem | null
    onItemUpdated?: () => void // Optional callback for when item is successfully updated
}

const EditItemModal = ({ isOpen, onChangeOpen, item, onItemUpdated}: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.addItemModal' });
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: StatementItemData) => {
        if (!item) return
        
        setLoading(true)
        try {
            const updatedStatementItem = new StatementItem(
                parseInt(data.id),
                data.name,
                data.currency,
                data.category ? parseInt(data.category) : undefined,
            )

            console.log(updatedStatementItem)
            await statementItemsClient.updateStatementItem(item.id, updatedStatementItem)
            
            // Only close modal and trigger callback after successful update
            onItemUpdated?.()
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

    // Convert StatementItem to StatementItemData for the form
    const itemData: StatementItemData | undefined = item ? {
        category: item.category?.toString() || '',
        id: item.id.toString(),
        name: item.name,
        currency: item.currency,
    } : undefined

    return <Modal
        open={isOpen}
        onChangeOpen={(open) => {
            if (!loading) { // Prevent closing while loading
                onChangeOpen(open)
            }
        }}
        closeButton={false}
    >
        {item && (
            <StatementItemForm
                item={itemData}
                onSubmit={onSubmit}
                onCancel={onCancel}
                loading={loading}
            />
        )}
    </Modal>
}

export default EditItemModal;
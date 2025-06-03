import { StatementItemCategory } from "@derp/company-canister"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { statementItemsClient } from "../../api/icp"
import GenericForm, { GenericFormField, GenericFormData } from "./GenericForm"
import LoadingSpinner from "../Loading/LoadingSpinner"

export interface StatementItemData {
    category: string
    id: string
    name: string
    currency: string
}

interface Props {
    item?: StatementItemData
    onSubmit: (data: StatementItemData) => Promise<void> | void
    onCancel: () => void
    submitLabel?: string
    cancelLabel?: string
    loading?: boolean
}

const StatementItemForm = ({
    item,
    onSubmit,
    onCancel,
    submitLabel,
    cancelLabel,
    loading: externalLoading = false
}: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.addItemModal' });
    const [internalLoading, setInternalLoading] = useState(false)
    const [categories, setCategories] = useState<StatementItemCategory[]>([])
    const [formData, setFormData] = useState<GenericFormData>({
        category: '',
        id: '',
        name: '',
        currency: '',
    })
    const [genericFormColumns, setGenericFormColumns] = useState<GenericFormField[]>([])

    const isLoading = externalLoading || internalLoading

    const fetchCategories = async () => {
        try {
            setInternalLoading(true)
            const categories = await statementItemsClient.getStatementItemsCategories()
            setCategories(categories)

            const initialFormData: GenericFormData = item ? {
                category: item.category,
                id: item.id,
                name: item.name,
                currency: item.currency,
            } : {
                category: categories[0]?.id.toString() || '',
                id: '',
                name: '',
                currency: '',
            }
            
            setFormData(initialFormData)

            const isEditMode = !!item

            setGenericFormColumns([
                {
                    labelName: t('category'),
                    name: 'category',
                    typeNode: {
                        type: 'select',
                        typeNodeName: 'select',
                        options: categories.map(category => ({
                            key: category.id.toString(),
                            value: category.id.toString(),
                            label: category.name
                        })),
                        placeholder: t('category'),
                    },
                    isRequired: true
                },
                {
                    labelName: t('id'),
                    name: 'id',
                    typeNode: {
                        type: 'text',
                        typeNodeName: 'input',
                        placeholder: t('id'),
                        disabled: isEditMode,
                    },
                },
                {
                    labelName: t('name'),
                    name: 'name',
                    typeNode: {
                        type: 'text',
                        typeNodeName: 'input',
                        placeholder: t('name'),
                    },
                },
                {
                    labelName: t('currency'),
                    name: 'currency',
                    typeNode: {
                        type: 'text',
                        typeNodeName: 'input',
                        placeholder: t('currency'),
                    },
                },
            ]);

        } catch (e) {
            console.error(e)
        } finally {
            setInternalLoading(false)
        }
    }

    const handleSubmit = async (data: GenericFormData) => {
        try {
            setInternalLoading(true)
            // Convert GenericFormData to StatementItemData
            const statementItemData: StatementItemData = {
                category: data.category,
                id: data.id,
                name: data.name,
                currency: data.currency,
            }
            await onSubmit(statementItemData)
        } catch (error) {
            console.error(error)
        } finally {
            setInternalLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [item])

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
        </div>
    }

    return (
        <GenericForm
            initialData={formData}
            fields={genericFormColumns}
            submitLabel={submitLabel || t('submit')}
            cancelLabel={cancelLabel || t('cancel')}
            handleCancel={onCancel}
            handleSubmit={handleSubmit}
        />
    )
}

export default StatementItemForm 
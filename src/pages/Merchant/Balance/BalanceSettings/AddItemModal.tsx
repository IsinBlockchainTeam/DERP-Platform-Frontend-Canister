
import { StatementItemCategory } from "@derp/company-canister"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { statementItemsClient } from "../../../../api/icp"
import GenericForm, { GenericFormField } from "../../../../components/Form/GenericForm"
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner"
import { Modal } from "../../../../components/Modal/Modal"

interface Props {
    isOpen: boolean
    onChangeOpen: (open: boolean) => void
}

const AddItemModal = ({ isOpen, onChangeOpen}: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.addItemModal' });
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<StatementItemCategory[]>([])
    const [formData, setFormData] = useState({
        category: '',
        id: '',
        name: '',
        currency: '',
    })
    const [genericFormColumns, setGenericFormColumns] = useState<GenericFormField[]>([])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const categories = await statementItemsClient.getStatementItemsCategories()
            setCategories(categories)

            setFormData({
                category: categories[0].id.toString(),
                id: '',
                name: '',
                currency: '',
            })

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
            setLoading(false)
        }
    }

    const onSubmit = async (data: { category: string, id: string, name: string, currency: string }) => {
        try {
            setLoading(true)
            await statementItemsClient.storeStatementItem({
                category: parseInt(data.category),
                id: parseInt(data.id),
                name: data.name,
                currency: data.currency,
            } as any)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            onCancel()
        }
    }

    const onCancel = () => {
        setFormData({
            category: '',
            id: '',
            name: '',
            currency: '',
        })
        onChangeOpen(false)
    }

    useEffect(() => {
        if (isOpen) {
            fetchCategories()
        }
    }, [isOpen])

    return <Modal
        open={isOpen}
        onChangeOpen={onChangeOpen}
        closeButton={false}
    >
        {
            loading ?
                <LoadingSpinner />
                :
                <GenericForm
                    initialData={formData}
                    fields={genericFormColumns}
                    submitLabel={t('submit')}
                    cancelLabel={t('cancel')}
                    handleCancel={onCancel}
                    handleSubmit={(data) => onSubmit(data as any)}
                />
        }


    </Modal>
}

export default AddItemModal;

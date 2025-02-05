import { useState } from "react";
import { useTranslation } from "react-i18next";
import { statementItemsClient } from "../../../../api/icp";
import GenericForm, { GenericFormField } from "../../../../components/Form/GenericForm";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import { Modal } from "../../../../components/Modal/Modal"

interface Props {
    isOpen: boolean
    onChangeOpen: (open: boolean) => void
}

const AddCategoryModal = ({ isOpen, onChangeOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance.balanceSettings.addCategoryModal' });

    const [formData, setFormData] = useState({
        name: '',
    });

    const fields: GenericFormField[] = [
        {
            name: 'name',
            labelName: t('name'),
            typeNode: {
                type: 'text',
                typeNodeName: 'input',
                placeholder: t('name'),
                maxLength: 30
            },
            isRequired: true,
        },
    ]

    const onCancel = () => {
        setFormData({
            name: '',
        });
        onChangeOpen(false);
    }

    const onSubmit = async (data: { name: string }) => {
        try {
            setLoading(true);
            await statementItemsClient.storeStatementItemsCategory(data.name);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            onChangeOpen(false);
        }
    }

    return <Modal
        open={isOpen}
        onChangeOpen={onChangeOpen}
        closeButton={false}
    >
        {loading ? <LoadingSpinner /> :
            <div>
                <h1>{t('title')}</h1>
                <GenericForm
                    fields={fields}
                    submitLabel={t('submit')}
                    cancelLabel={t('cancel')}
                    handleCancel={onCancel}
                    initialData={formData}
                    handleSubmit={(data) => onSubmit(data as any)}
                />
            </div>
        }
    </Modal>
}

export default AddCategoryModal;

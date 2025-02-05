import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { interfacesService } from "../../../../api/services/Interfaces";
import { PencilIcon, TrashIcon } from "../../../../components/Icons/Icons";
import AssociationForm from "../../../../components/Interfaces/AssociationForm/AssociationForm";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import { Modal } from "../../../../components/Modal/Modal";
import GenericTable, { GenericTableAction, GenericTableColumn } from "../../../../components/Table/GenericTable";
import TabTitle from "../../../../components/Tabs/TabTitle";
import { AssociationResponseDto, CreateAssociationReqDto, InterfaceResponseDto, InterfaceType, UpdateAssociationReqDto } from "../../../../dto/ErpInterfacesDto";
import { useStoreUrl } from "../../../../utils";
import Handlebars from "handlebars";
import ConfirmationModal from "../../../../components/Modal/ConfirmationModal";
import { InterfaceAssociation } from "../../../../model/Interfaces";

const InterfacesHome = () => {
    const storeUrl = useStoreUrl();
    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInterfacesDashboard' });

    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [updateAssociation, setUpdateAssociation] = useState(false);

    const [associations, setAssociations] = useState<InterfaceAssociation[]>([]);
    const [availableInterfaces, setAvailableInterfaces] = useState<InterfaceResponseDto[]>([]);
    const [selectedAssociation, setSelectedAssociation] = useState<Partial<AssociationResponseDto>>({});
    const [toDelete, setToDelete] = useState<InterfaceAssociation | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);

    const { merchantId } = useParams<{ merchantId: string }>();
    const navigate = useNavigate();

    const columns: GenericTableColumn<InterfaceAssociation>[] = [
        {
            header: 'ID',
            accessor: 'id'
        },
        {
            header: t('associations.table.type'),
            accessor: 'interfaceType'
        },
        {
            header: t('associations.table.interface'),
            accessor: row => row.interface.name
        }
    ]

    const actions: GenericTableAction<InterfaceAssociation>[] = [
        {
            label: <div className="text-error"><TrashIcon size={6} /></div>,
            onClick: async (row) => {
                setToDelete(row);
                setDeleteModal(true);
            }
        },
        {
            label: <PencilIcon size={6} />,
            onClick: (row) => {
                setSelectedAssociation(row);
                console.log("row", row);
                setUpdateAssociation(true);
                setAddModalOpen(true);
            }
        }
    ]

    const onDeleteConfirm = async () => {
        await interfacesService.deleteAssociation(storeUrl, toDelete!.id);
        await fetchData();
        setDeleteModal(false);
    }

    const openAddModal = () => {
        setAddModalOpen(true)
    }

    const onGotoInterfaces = () => {
        navigate(`/merchant/${merchantId}/interfaces`);
    }

    const onCancelAdd = () => {
        setSelectedAssociation({});
        setUpdateAssociation(false);
        setAddModalOpen(false);
    }

    const onSubmitForm = async () => {
        const errors: string[] = [];
        if (!selectedAssociation.interfaceId) {
            errors.push(t('associations.form.errors.interfaceId'));
        }
        if (!selectedAssociation.interfaceType) {
            errors.push(t('associations.form.errors.type'));
        }

        // If the sub association is WOND or KUMO
        // Check that after the operation only one association of that type exists
        if (
            selectedAssociation.interfaceType &&
            [
                InterfaceType.WOND,
                InterfaceType.KUMO
            ].includes(selectedAssociation.interfaceType),
            selectedAssociation.interfaceType
        ) {
            if (updateAssociation) {
                // if we are updating an association, we need to exclude the current one
                const existing = associations.find(a => a.interfaceType === selectedAssociation.interfaceType && a.id !== selectedAssociation.id);
                if (existing) {
                    errors.push(Handlebars.compile(t('associations.form.errors.alreadyExists'))({ type: selectedAssociation.interfaceType }));
                }
            } else {
                // if we are creating a new association, we need to check if there is already one
                const existing = associations.find(a => a.interfaceType === selectedAssociation.interfaceType);
                if (existing) {
                    errors.push(Handlebars.compile(t('associations.form.errors.alreadyExists'))({ type: selectedAssociation.interfaceType }));
                }
            }

        }


        setErrors(errors);
        if (errors.length > 0)
            return;

        setErrors([]);
        if (updateAssociation) {
            await interfacesService.updateAssociation(storeUrl, selectedAssociation.id!, {
                ...selectedAssociation,
            } as UpdateAssociationReqDto)
        } else {
            await interfacesService.associate(storeUrl, {
                ...selectedAssociation
            } as CreateAssociationReqDto)
        }

        await fetchData();
        setUpdateAssociation(false);
        setSelectedAssociation({});
        setAddModalOpen(false);
    }

    const fetchData = async () => {
        setLoading(true);
        const numMerchantId = new Number(merchantId);
        if (!numMerchantId) {
            throw new Error("Cannot list interfaces without any merchant id")
        }

        try {
            const interfaces = await interfacesService.listByCompany(+numMerchantId);
            setAvailableInterfaces(interfaces);
            const associations = await interfacesService.getAssociations(storeUrl);
            const interfaceAssociations = associations.map(association => {
                const iface = interfaces.find(i => i.id === association.interfaceId);
                if (!iface)
                    throw new Error("An association references a not existing interface!")

                return {
                    ...association,
                    interface: iface
                };
            })

            setAssociations(interfaceAssociations);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setErrors([]);
        setSelectedAssociation({});
        fetchData()
    }, [])


    return <div className="flex flex-col">
        <TabTitle
            title={t("associations.title")}
            rightSlot={
                <button
                    disabled={loading || availableInterfaces.length === 0}
                    className="btn btn-primary"
                    onClick={() => openAddModal()}
                >
                    {t("associations.addBtn")}
                </button>
            }
        />
        {
            loading ? <LoadingSpinner></LoadingSpinner> :
                availableInterfaces.length === 0 ?
                    <div className="flex-row text-center">
                        <p>{t('associations.noInterface')} <a className="inline btn btn-sm btn-primary" onClick={onGotoInterfaces}>{t('associations.noInterfaceLinkText')}</a>.</p>
                    </div>
                    :
                    <>
                        <GenericTable
                            columns={columns}
                            actions={actions}
                            data={associations}
                        />

                        <Modal open={addModalOpen} onChangeOpen={setAddModalOpen} closeButton={false}
                            className="max-w-xl"

                        >
                            <AssociationForm
                                storeUrl={storeUrl}
                                merchantId={+merchantId!}
                                association={selectedAssociation}
                                onUpdateAssociation={setSelectedAssociation}
                            />

                            <div className="flex flex-col my-3">
                                {errors.map((error, index) => <p key={index} className="text-red-600">{error}</p>)}
                            </div>

                            <div className="flex flex-row justify-between">
                                <button className="btn" onClick={onCancelAdd}>
                                    {t('associations.form.cancel')}
                                </button>

                                <button className="btn btn-primary" onClick={onSubmitForm}>
                                    {updateAssociation ?
                                        t('associations.form.submitUpdate')
                                        :
                                        t('associations.form.submitCreate')
                                    }
                                </button>
                            </div>

                        </Modal>

                        <ConfirmationModal
                            open={deleteModal}
                            onChangeOpen={setDeleteModal}
                            onConfirm={onDeleteConfirm}
                            title={t('associations.delete.title')}
                            message={Handlebars.compile(t('associations.delete.message'))({ interfaceName: toDelete?.interface.name })}
                        />
                    </>
        }
    </div>
}

export default InterfacesHome;

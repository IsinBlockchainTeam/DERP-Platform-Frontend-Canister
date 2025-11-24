import Handlebars from 'handlebars';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { interfacesService } from '../../api/services/Interfaces';
import { PencilIcon, TrashIcon, WarningIcon } from '../../components/Icons/Icons';
import InterfaceForm from '../../components/Interfaces/InterfaceForm/InterfaceForm';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import { Modal } from '../../components/Modal/Modal';
import GenericTable, { GenericTableAction, GenericTableColumn } from '../../components/Table/GenericTable';
import TabTitle from '../../components/Tabs/TabTitle';
import { CreateInterfaceReqDto, InterfaceResponseDto, InterfaceStatus, InterfaceType, UpdateInterfaceReqDto } from '../../dto/ErpInterfacesDto';
import { AxiosError } from 'axios';
import PaginationIndicator from '../Pagination/PaginationIndicator';

export default function InterfacesDashboard() {
    const [loading, setLoading] = useState(false);
    const [loadingFinalize, setLoadingFinalize] = useState(false);
    const [interfaces, setInterfaces] = useState<InterfaceResponseDto[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [ebicsFinalizeModalOpen, setEbicsFinalizeModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedInterface, setSelectedInterface] = useState<Partial<InterfaceResponseDto>>({});
    const [updating, setUpdating] = useState(false);
    const [toDelete, setToDelete] = useState<InterfaceResponseDto | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [errorDeleteModal, setErrorDeleteModal] = useState(false);
    const { merchantId } = useParams<{ merchantId: string }>();

    const { t } = useTranslation(undefined, { keyPrefix: 'supplierInterfacesDashboard' });

    const fetchData = async () => {
        setLoading(true)

        try {
            const merchantIdNum = new Number(merchantId);
            if (!merchantIdNum) {
                throw new Error("No merchant ID given to page!")
            }

            const interfaces = await interfacesService.listByCompany(+merchantIdNum);
            setInterfaces(interfaces);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [merchantId]);

    const columns: GenericTableColumn<InterfaceResponseDto>[] = [
        {
            header: t('table.id'),
            accessor: 'id'
        },
        {
            header: t('table.type'),
            accessor: 'interfaceType'
        },
        {
            header: t('table.name'),
            accessor: 'name'
        },
    ];

    const actions: GenericTableAction<InterfaceResponseDto>[] = [
        {
            label: <div className='text-warning'><WarningIcon size={6} /></div>,
            show: (row) => row.status === InterfaceStatus.PENDING,
            onClick: (row) => onOpenFinalizeEbics(row)
        },
        {
            label: <PencilIcon size={6} />,
            show: (row) => row.interfaceType !== InterfaceType.EBICS,
            onClick: (iface) => {
                setSelectedInterface(iface);
                setUpdating(true);
                setAddModalOpen(true);
            }
        },
        {
            label: <div className='text-error'><TrashIcon size={6} /></div>,
            onClick: (iface) => {
                setToDelete(iface);
                setDeleteModal(true);
            }
        },
    ];

    const onCancelForm = () => {
        setSelectedInterface({});
        setUpdating(false);
        setErrors([]);
        setAddModalOpen(false);
    }

    const onSubmitForm = async () => {
        try {
            if (updating) {
                await interfacesService.update(+merchantId!, selectedInterface as UpdateInterfaceReqDto);
            } else {
                const response = await interfacesService.create(+merchantId!, selectedInterface as CreateInterfaceReqDto);
                setSelectedInterface(response);
            }

            if (selectedInterface.interfaceType === InterfaceType.EBICS) {
                setEbicsFinalizeModalOpen(true);
            } else {
                setSelectedInterface({});
                fetchData();
            }
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setErrors([
                    t('form.genericError.message'),
                    e.response?.data.message
                ]);

                return;
            }
        }

        setAddModalOpen(false);
        setErrors([]);
    }

    const onDeleteConfirm = async () => {
        if (toDelete) {
            try {
                await interfacesService.delete(toDelete.interfaceType!, toDelete.id);
                setToDelete(null);
                setDeleteModal(false);
                fetchData();
            } catch (e) {
                setToDelete(null);
                setDeleteModal(false);
                setErrorDeleteModal(true);
            }
        }
    }

    const onCloseErrorDeleteModal = async () => {
        setErrorDeleteModal(false);
        fetchData();
    }
    
    const onOpenFinalizeEbics = async (iface: InterfaceResponseDto) => {
        setSelectedInterface(iface);
        setEbicsFinalizeModalOpen(true);
    }

    const onFinalizeEbics = async () => {
        try {
            setLoadingFinalize(true);
            await interfacesService.finalizeEbics(selectedInterface.id!);
            setLoadingFinalize(false);
            setEbicsFinalizeModalOpen(false);
            fetchData();
        } catch (e) {
            setErrors([t('form.bank.confirmation.error')]);
            setLoadingFinalize(false);
        }
    }

    // const generateBankLetter = async () => {
    //     try {
    //         setLoadingFinalize(true);
    //         await interfacesService.generateBankLetter(selectedInterface.id!);
    //         setLoadingFinalize(false);
    //     } catch (e) {
    //         setErrors([t('form.bank.confirmation.error')]);
    //         setLoadingFinalize(false);
    //     }
    // }

    return loading ?
        <LoadingSpinner />
        :
        <div
            className="flex flex-col">
            <TabTitle title={t('title')} rightSlot={<>
                <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>{t('addBtn')}</button>
            </>} />
            <GenericTable columns={columns} data={interfaces} actions={actions} />

            <Modal open={addModalOpen} onChangeOpen={setAddModalOpen} closeButton={false}
                className='max-w-xl flex-col col justify-center justify-items-center items-center'
            >
                <InterfaceForm
                    updating={updating}
                    title={updating ? t('form.updateTitle') : t('form.createTitle')}
                    merchantId={+merchantId!}
                    iface={selectedInterface}
                    onChange={setSelectedInterface}
                />

                <div className="flex flex-col my-3">
                    {errors.map((error, index) => <p key={index} className="text-red-600">{error}</p>)}
                </div>

                <div className="flex flex-row justify-between">
                    <button className="btn" onClick={onCancelForm}>
                        {t('form.cancel')}
                    </button>

                    <button className="btn btn-primary" onClick={onSubmitForm}>
                        {updating ?
                            t('form.submitUpdate')
                            :
                            t('form.submitCreate')
                        }
                    </button>
                </div>

            </Modal>

            <ConfirmationModal
                title={t('delete.title')}
                message={Handlebars.compile(t('delete.message'))({ interfaceName: toDelete?.name })}
                open={deleteModal}
                onChangeOpen={setDeleteModal}
                onConfirm={onDeleteConfirm}
            />

            <Modal open={errorDeleteModal} onChangeOpen={setErrorDeleteModal} closeButton={true}>
                <h1 className='text-3xl font-light'>{t('delete.errorTitle')}</h1>
                <p className='text-lg mt-4'>{t('delete.errorMessage')}</p>
                <div className="flex flex-row col justify-center w-full mt-5">
                    <button className="btn btn-primary" onClick={onCloseErrorDeleteModal}>
                        OK
                    </button>
                </div>
            </Modal>

            {/* Modal for EBICS user finalization after bank response */}
            <Modal open={ebicsFinalizeModalOpen} onChangeOpen={setEbicsFinalizeModalOpen} closeButton>
                <h1 className="text-3xl font-light">{t('form.bank.confirmation.title')}</h1>
                {loadingFinalize ? <LoadingSpinner /> :
                    <>
                        <p className="mt-4">{t('form.bank.confirmation.message')}</p>
                        <p >{t('form.bank.confirmation.tutorialLine1')}</p>
                        <ol className='list-decimal list-inside ps-5'>
                            <li className='mt-2'>
                                {t('form.bank.confirmation.tutorialLine2')}
                                <div className="flex flex-row col justify-center w-full mt-5">
                                    <a className="btn btn-primary" download href={interfacesService.ebicsLetterUrl(selectedInterface.id!)}>
                                        {t('form.bank.downloadLetter.downloadBtn')}
                                    </a>
                                </div>
                            </li>

                            <li className='mt-2'>
                                {t('form.bank.confirmation.tutorialLine3')}
                            </li>
                            <li className='mt-2'>
                                {t('form.bank.confirmation.tutorialLine4')}
                            </li>
                        </ol>
                    </>
                }
                
                <p className='text-red-600 mt-4'>{errors.join('\n')}</p>

                <div className='flex flex-row col justify-between w-full mt-5'>
                    <button className="btn" onClick={() => setEbicsFinalizeModalOpen(false)}>
                        {t('form.bank.confirmation.cancelBtn')}
                    </button>
                    <button className="btn btn-primary" onClick={onFinalizeEbics}>
                        {t('form.bank.confirmation.finalizeBtn')}
                    </button>
                </div>
            </Modal>

        </div>
}
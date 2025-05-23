import { useTranslation } from "react-i18next";
import TabTitle from "../../../../components/Tabs/TabTitle"
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../../../components/Table/GenericTable";
import { useEffect, useState, useRef } from "react";
import { useStoreId } from "../../../../utils";
import { PosSyncJobDto, PosSyncJobDtoWithId } from "../../../../dto/PosSync";
import { posDataSynchronizationService } from "../../../../api/services/DataSynchronization";
import FormLoader from "../../../../components/Loading/FormLoader";
import { Modal } from "../../../../components/Modal/Modal";
import { Cron, DefaultLocale } from "react-js-cron";
import { parseExpression } from 'cron-parser';
import 'react-js-cron/dist/styles.css';
import i18next from "i18next";
import { LOCALE_EN } from "../../../../i18n/translations/cron_en";
import { LOCALE_IT } from "../../../../i18n/translations/cron_it";
import Handlebars from "handlebars";
import { interfacesService } from "../../../../api/services/Interfaces";
import { AssociationResponseDto, InterfaceType } from "../../../../dto/ErpInterfacesDto";

const defaultNewJob: Partial<PosSyncJobDtoWithId> = {
    cron: '* * * * *',
    enabled: true,
}

const DataSyncPosSync = () => {
    const { t } = useTranslation(undefined, { keyPrefix: "supplierDataSync.posSyncTab" });
    const storeId = useStoreId();
    const [loading, setLoading] = useState(false);
    const [configuredJobs, setConfiguredJobs] = useState<PosSyncJobDtoWithId[]>([]);
    const [associations, setAssociations] = useState<AssociationResponseDto[]>([]);
    const pollingIntervalRef = useRef<NodeJS.Timeout>();
    const POLLING_INTERVAL = 5000; // 5 seconds

    const [modalOpen, setModalOpen] = useState(false);
    const [formJob, setFormJob] = useState<Partial<PosSyncJobDtoWithId>>(defaultNewJob);
    const [createNew, setCreateNew] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [cronLocale, setCronLocale] = useState<DefaultLocale>(LOCALE_EN);

    const tableColumns: GenericTableColumn<PosSyncJobDtoWithId>[] = [
        {
            header: 'ID',
            accessor: 'id'
        },
        {
            header: t('tableHeaders.enabled'),
            accessor: (row) => row.enabled ?
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
        },
        {
            header: t('tableHeaders.cron'),
            accessor: 'cron'
        },
        {
            header: t('tableHeaders.nextRun'),
            accessor: (row) => row.cron ? parseExpression(row.cron).next().toDate().toLocaleString() : 'Never'
        },
        {
            header: t('tableHeaders.lastRun'),
            accessor: (row) => row.lastRun ? row.lastRun.toLocaleString() : 'Never ran'
        },
    ]

    const tableActions: GenericTableAction<PosSyncJobDtoWithId>[] = [
        {
            label: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>,
            onClick: (row: PosSyncJobDtoWithId) => onEdit(row)
        }
    ]

    const fetchData = async () => {
        try {
            const job = await posDataSynchronizationService.list(storeId);
            if (job) {
                setConfiguredJobs([job]);
            } else {
                setConfiguredJobs([]);
            }

            const associations = await interfacesService.getAssociations(storeId);
            setAssociations(associations);
        } catch (e) {
            console.error(e);
        }
    }

    const startPolling = () => {
        // Clear any existing interval
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        // Set up new polling interval
        pollingIntervalRef.current = setInterval(fetchData, POLLING_INTERVAL);
    }

    useEffect(() => {
        // Initial load with loading state
        setLoading(true);
        fetchData().finally(() => {
            setLoading(false);
            // Start polling after initial load
            startPolling();
        });

        // Cleanup on unmount
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        switch (i18next.resolvedLanguage) {
            case 'it':
                setCronLocale(LOCALE_IT);
                break;
            case 'en':
                setCronLocale(LOCALE_EN);
                break;
            default:
                console.error(`Unknown locale ${i18next.resolvedLanguage}`);
                setCronLocale(LOCALE_EN);
        }
    }, [i18next.resolvedLanguage])

    const onAdd = () => {
        setCreateNew(true);
        setFormJob(defaultNewJob);
        setModalOpen(true);
    }

    const onEdit = (job: PosSyncJobDtoWithId) => {
        setCreateNew(false);
        setFormJob(job);
        setModalOpen(true);
    }

    const onSubmitForm = async () => {
        const errors = [];
        if (!formJob.cron) {
            errors.push(t('form.errors.cron'));
        }

        if (errors.length > 0) {
            setErrors(errors);
            return;
        }

        try {
            if (createNew) {
                await posDataSynchronizationService.create(storeId, formJob as PosSyncJobDto);
            } else {
                await posDataSynchronizationService.update(storeId, formJob as PosSyncJobDtoWithId);
            }

            setModalOpen(false);
            setErrors([]);
            fetchData();
        } catch (e) {
            console.error(e);
            setErrors([t('form.errors.unknown')]);
        }
    }

    const hasPosInterface = () => {
        const posInterfaces = associations.filter(a => a.interfaceType === InterfaceType.POS);
        return posInterfaces.length > 0;
    }

    return <>
        <TabTitle
            title={t('title')}
            rightSlot={configuredJobs.length > 0 ? <></> : <button className="btn btn-primary" onClick={() => onAdd()}>{t('addBtn')}</button>}
        ></TabTitle >
        <p className="font-light mb-12">{t('subtitle')}</p>

        {
            loading ?
                <FormLoader /> :
                <GenericTable
                    data={configuredJobs}
                    actions={tableActions}
                    columns={tableColumns} />
        }

        {/* Modal for adding new job or editing existing job */}
        <Modal
            open={modalOpen}
            onChangeOpen={setModalOpen}
        >

            <div className="modal-header">
                <span className="text-2xl">{createNew ? t('addJobModalTitle') : t('editJobModalTitle')}</span>
            </div>
            <div className="modal-body">
                <div className="mt-5 flex flex-col">
                    <span className="text-xl mb-3">{t('form.cron')}</span>
                    <Cron
                        value={formJob?.cron || '* * * * *'}
                        locale={cronLocale}
                        setValue={(v: string) => setFormJob(old => ({ ...old, cron: v }))} />
                    <hr className="mt-3" />

                    <div className="form-control mt-5 max-w-xs">
                        <span className="text-xl mb-4">{t('form.enabled')}</span>
                        <label className="label cursor-pointer text-xl">
                            <span className="label-text">{t('form.enabledLabel')}</span>
                            <input type="checkbox" className="toggle toggle-primary"
                                disabled={!hasPosInterface()}
                                checked={hasPosInterface() ? formJob.enabled : false}
                                onChange={v => setFormJob(old => ({ ...old, enabled: v.target.checked }))}
                            />
                        </label>
                    </div>
                    {
                        hasPosInterface() ||
                        <span className="text-sm text-error mt-2">
                            {t('form.errors.interfaceMissing')}
                        </span>
                    }
                    <hr className="mt-3" />
                </div>

                <div className="modal-action flex flex-col col justify-center items-center w-full">
                    <div>
                        {formJob.cron &&
                            <span className={`italic font-bold text-primary text-center ${formJob.enabled ? '' : 'line-through'}`}>
                                <p>
                                    {
                                        t('form.nextTime')
                                    }:
                                </p>
                                {
                                    parseExpression(formJob.cron).next().toDate().toLocaleString()
                                }
                            </span>
                        }

                        <p className={`italic font-bold text-primary text-center ${formJob.enabled ? 'invisible' : ''}`}>
                            {
                                t('form.disabled')
                            }
                        </p>
                    </div>
                    {
                        errors.map((err, i) => <p key={i} className="text-error">{err}</p>)
                    }
                    <div className="mt-4">
                        <button className="btn" onClick={() => setModalOpen(false)}>{t('form.cancel')}</button>
                        <button className="ml-3 btn btn-primary" onClick={() => onSubmitForm()}>{
                            createNew ? t('form.submit') : t('form.update')
                        }</button>
                    </div>
                </div>
            </div>
        </Modal>
    </>
}

export default DataSyncPosSync; 
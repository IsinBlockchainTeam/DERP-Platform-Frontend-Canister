import { useTranslation } from "react-i18next";
import TabTitle from "../../../../components/Tabs/TabTitle"
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../../../components/Table/GenericTable";
import { useEffect, useState, useRef } from "react";
import { useStoreId } from "../../../../utils";
import { TransactionSyncJobDto, TransactionSyncJobDtoWithId, TransactionSyncJobType } from "../../../../dto/TransactionSyncJobDto";
import { transactionsDataSynchronizationService } from "../../../../api/services/DataSynchronization";
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
import CronEditor from "../../../../components/Cron/CronEditor";

const defaultNewJob: Partial<TransactionSyncJobDtoWithId> = {
    cron: '* * * * *',
    enabled: true,
    type: TransactionSyncJobType.ERP,
    dayRolloverTime: undefined,
}

const DataSyncAccountingTransactions = () => {
    const { t } = useTranslation(undefined, { keyPrefix: "supplierDataSync.accountingTransactionsTab" });
    const storeId = useStoreId();
    const [loading, setLoading] = useState(false);
    const [configuredJobs, setConfiguredJobs] = useState<TransactionSyncJobDtoWithId[]>([]);
    const [associations, setAssociations] = useState<AssociationResponseDto[]>([]);
    const [runningJobs, setRunningJobs] = useState<Record<string, 'loading' | 'success'>>({});
    const pollingIntervalRef = useRef<NodeJS.Timeout>();
    const POLLING_INTERVAL = 5000; // 5 seconds

    const [modalOpen, setModalOpen] = useState(false);
    const [formJob, setFormJob] = useState<Partial<TransactionSyncJobDtoWithId>>(defaultNewJob);
    const [createNew, setCreateNew] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [cronLocale, setCronLocale] = useState<DefaultLocale>(LOCALE_EN);
    const [isCronValid, setIsCronValid] = useState(true);

    const formatTimeToHHmm = (time: string): string | undefined => {
        if (!time) return undefined;
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const tableColumns: GenericTableColumn<TransactionSyncJobDtoWithId>[] = [
        {
            header: 'ID',
            accessor: 'id'
        },
        {
            header: t('tableHeaders.source'),
            accessor: (row) => {
                switch (row.type) {
                    case TransactionSyncJobType.ERP:
                        return t('tableHeaders.sources.erp');
                    case TransactionSyncJobType.INTERNAL:
                        return t('tableHeaders.sources.internal');
                    case TransactionSyncJobType.BANK:
                        return t('tableHeaders.sources.bank');
                    default:
                        return t('tableHeaders.sources.unknown')
                }
            }
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
            accessor: (row) => row.cron ? getNextRunTime(row.cron) : 'Never'
        },
        {
            header: t('tableHeaders.lastRun'),
            accessor: (row) => row.lastRun ? row.lastRun.toLocaleString() : 'Never ran'
        },
    ]

    const tableActions: GenericTableAction<TransactionSyncJobDtoWithId>[] = [
        {
            label: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>,
            onClick: (row: TransactionSyncJobDtoWithId) => onEdit(row)
        },
        {
            label: (row: TransactionSyncJobDtoWithId) => {
                const status = runningJobs[row.id];
                if (status === 'loading') {
                    return (
                        <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    );
                }
                if (status === 'success') {
                    return (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 text-success">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    );
                }
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                );
            },
            onClick: async (row: TransactionSyncJobDtoWithId) => {
                try {
                    setRunningJobs(prev => ({ ...prev, [row.id]: 'loading' }));
                    await transactionsDataSynchronizationService.runNow(row.id);
                    setRunningJobs(prev => ({ ...prev, [row.id]: 'success' }));
                    setTimeout(() => {
                        setRunningJobs(prev => {
                            const newState = { ...prev };
                            delete newState[row.id];
                            return newState;
                        });
                    }, 3000);
                } catch (e) {
                    console.error(e);
                    setRunningJobs(prev => {
                        const newState = { ...prev };
                        delete newState[row.id];
                        return newState;
                    });
                }
            }
        }
    ]

    const fetchData = async () => {
        try {
            const jobs = await transactionsDataSynchronizationService.list(storeId);
            setConfiguredJobs(jobs);

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

    const onEdit = (job: TransactionSyncJobDtoWithId) => {
        setCreateNew(false);
        setFormJob(job);
        setModalOpen(true);
    }

    const onSubmitForm = async () => {
        const errors = [];
        if (!formJob.cron) {
            errors.push(t('form.errors.cron'));
        }
        if (!isCronValid) {
            errors.push('Invalid cron expression');
        }
        if (!formJob.type) {
            errors.push(t('form.errors.source'));
        }

        if (errors.length > 0) {
            setErrors(errors);
            return;
        }

        if (createNew) {
            await transactionsDataSynchronizationService.create(storeId, formJob as TransactionSyncJobDto);
        } else {
            await transactionsDataSynchronizationService.update(storeId, formJob as TransactionSyncJobDtoWithId);
        }

        setModalOpen(false);
        fetchData();
    }

    const hasInterfaceForJob = (job: TransactionSyncJobDto) => {
        // Internal jobs can always be created even if no interface is available
        if (job.type === TransactionSyncJobType.INTERNAL) {
            return true;
        }

        const validInterfaces = associations.filter(a => {
            switch (job.type) {
                case TransactionSyncJobType.ERP:
                    return a.interfaceType === InterfaceType.KUMO;
                case TransactionSyncJobType.BANK:
                    return a.interfaceType === InterfaceType.EBICS;
                default:
                    return true
            }
        })

        return validInterfaces.length > 0;
    }

    const getNeededInterfaceForJob = (job: TransactionSyncJobDto) => {
        switch (job.type) {
            case TransactionSyncJobType.ERP:
                return InterfaceType.KUMO;
            case TransactionSyncJobType.BANK:
                return InterfaceType.EBICS;
            default:
                return InterfaceType.KUMO;
        }
    }

    // Safe cron parsing function
    const getNextRunTime = (cron: string): string => {
        try {
            return parseExpression(cron).next().toDate().toLocaleString();
        } catch {
            return 'Invalid expression';
        }
    };

    return <>
        <TabTitle
            title={t('title')}
            rightSlot={<button className="btn btn-primary" onClick={() => onAdd()}>{t('addBtn')}</button>}
        ></TabTitle>
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
                    <CronEditor
                        value={formJob?.cron || '* * * * *'}
                        onChange={(v: string) => setFormJob(old => ({ ...old, cron: v }))}
                        onValidationChange={setIsCronValid}
                        title={t('form.cron')}
                    />
                    <hr className="mt-3" />

                    <span className="text-xl mt-5 mb-3">{t('form.source')}</span>
                    <select className="select select-bordered w-full max-w-md mb-2"
                        value={formJob.type}
                        onChange={(e) => setFormJob(old => ({ ...old, type: e.target.value as TransactionSyncJobType }))}>
                        <option value={TransactionSyncJobType.ERP}>{t('form.sourceOptions.erp')}</option>
                        <option value={TransactionSyncJobType.INTERNAL}>{t('form.sourceOptions.internal')}</option>
                        <option value={TransactionSyncJobType.BANK}>{t('form.sourceOptions.bank')}</option>
                    </select>
                    {formJob.type === TransactionSyncJobType.ERP && (
                        <div className="mt-3">
                            <span className="text-xl mb-2 block">{t('form.dayRolloverTime')}</span>
                            <span className="text-sm text-gray-500 mb-3 block">{t('form.dayRolloverTimeDescription')}</span>
                            <input 
                                type="time" 
                                className="input input-bordered w-full max-w-md"
                                value={formJob.dayRolloverTime?.split(':').slice(0, 2).join(':') || ''}
                                onChange={(e) => setFormJob(old => ({ ...old, dayRolloverTime: formatTimeToHHmm(e.target.value) }))}
                                step="60"
                            />
                        </div>
                    )}
                    <hr className="mt-3" />

                    <div className="form-control mt-5 max-w-xs">
                        <span className="text-xl mb-4">{t('form.enabled')}</span>
                        <label className="label cursor-pointer text-xl">
                            <span className="label-text" >{t('form.enabledLabel')}</span>
                            <input type="checkbox" className="toggle toggle-primary"
                                disabled={!hasInterfaceForJob(formJob as TransactionSyncJobDto)}
                                checked={hasInterfaceForJob(formJob as TransactionSyncJobDto) ? formJob.enabled : false}
                                onChange={v => setFormJob(old => ({ ...old, enabled: v.target.checked }))}
                            />
                        </label>
                    </div>
                    {
                        hasInterfaceForJob(formJob as TransactionSyncJobDto) ||
                        <span className="text-sm text-error mt-2">
                            {
                                Handlebars.compile(t('form.errors.interfaceMissingTmpl'))({ type: getNeededInterfaceForJob(formJob as TransactionSyncJobDto) })
                            }
                        </span>
                    }
                    <hr className="mt-3" />
                </div>

                <div className="modal-action flex flex-col col justify-center items-center w-full">
                    <div>
                        {formJob.cron && isCronValid &&
                            <span className={`italic font-bold text-primary text-center ${formJob.enabled ? '' : 'line-through'}`}>
                                <p>
                                    {
                                        t('form.nextTime')
                                    }:
                                </p>
                                {
                                    getNextRunTime(formJob.cron)
                                }
                            </span>
                        }

                        {formJob.cron && !isCronValid &&
                            <span className="italic font-bold text-error text-center">
                                <p>Invalid cron expression</p>
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

export default DataSyncAccountingTransactions;
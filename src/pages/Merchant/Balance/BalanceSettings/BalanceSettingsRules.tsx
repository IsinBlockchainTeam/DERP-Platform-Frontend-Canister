import { useEffect, useState } from "react";
import { dispatchRulesClient, statementItemsClient } from "../../../../api/icp";
import { DispatchRule } from "@derp/company-canister";
import { useTranslation } from "react-i18next";
import { GenericTableAction, GenericTableColumn } from "../../../../components/Table/GenericTable";
import GenericTable from "../../../../components/Table/GenericTable";
import { StatementItem } from "@derp/company-canister/dist/src/models/types/statement-items/StatementItem";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import { EditIcon } from "lucide-react";
import DispatchRuleForm from "../../../../components/DispatchRule/DispatchRuleForm";
import { Modal } from "../../../../components/Modal/Modal";

export default function BalanceSettingsRules() {
    const { t } = useTranslation(undefined, { keyPrefix: "merchantBalance.balanceSettings" });
    const [isLoadingRules, setIsLoadingRules] = useState(true);
    const [isSubmittingRule, setIsSubmittingRule] = useState(false);
    const [statementItems, setStatementItems] = useState<Map<number, StatementItem>>(new Map());
    const [rules, setRules] = useState<DispatchRule[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [ruleModalOpen, setRuleModalOpen] = useState(false);
    const [rule, setRule] = useState<DispatchRule | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchRules = async () => {
        setIsLoadingRules(true);
        try {
            const rules = await dispatchRulesClient.getDispatchRules();
            setRules(rules);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingRules(false);
        }
    }

    const getFilteredRules = () => {
        if (!searchTerm.trim()) return rules;
        
        const lowercaseSearch = searchTerm.toLowerCase();
        return rules.filter(rule => {
            // Get translated values instead of raw values
            const ruleType = (t(`rulesForm.type.types.${rule.ruleType}.label` as any) as string).toLowerCase();
            const accountingOperation = (t(`rulesForm.accountingOperations.${rule.accountingOperation}` as any) as string).toLowerCase();
            const ruleId = rule.id?.toString() || '';
            const validFrom = rule.validFrom?.toLocaleDateString().toLowerCase() || '';
            const validTo = rule.validTo?.toLocaleDateString().toLowerCase() || '';
            
            // Search in statement item names
            const statementItemNames = [...rule.statementItemIDs]
                .map(id => statementItems.get(id)?.name?.toLowerCase() || '')
                .join(' ');
            
            return ruleType.includes(lowercaseSearch) || 
                   accountingOperation.includes(lowercaseSearch) ||
                   ruleId.includes(lowercaseSearch) ||
                   validFrom.includes(lowercaseSearch) ||
                   validTo.includes(lowercaseSearch) ||
                   statementItemNames.includes(lowercaseSearch);
        });
    };

    useEffect(() => {
        fetchRules();
    }, []);

    useEffect(() => {
        fetchStatementItems();
    }, []);

    const columns: GenericTableColumn<DispatchRule>[] = [
        {
            header: t('rulesTable.id'),
            accessor: 'id'
        },
        {
            header: t('rulesTable.type'),
            accessor: (row) => {
                return t(`rulesForm.type.types.${row.ruleType}.label` as any) as unknown as string;
            }
        },
        {
            header: t('rulesTable.statementItemIDs'),
            accessor: (row) => {
                return <div className="flex flex-row gap-2">
                    {[...row.statementItemIDs].map((id) => {
                        const item = statementItems.get(id);
                        if (item?.name) {
                            return <div key={id} className="badge h-auto whitespace-normal">{item?.name}</div>
                        }

                        return <div key={id} className="badge h-auto whitespace-normal flex flex-row gap-2 items-center justify-end">
                            {id}
                            <LoadingSpinner width={12} height={12} />
                        </div>
                    })}
                </div>
            }
        },
        {
            header: t('rulesTable.accountingOperation'),
            accessor: (row) => {
                return t(`rulesForm.accountingOperations.${row.accountingOperation}` as any) as unknown as string;
            }
        },
        {
            header: t('rulesTable.validDates'),
            accessor: (row) => {
                return <div>
                    {row.validFrom?.toLocaleDateString() || ' ~ '} - {row.validTo?.toLocaleDateString() || ' ~ '}
                </div>
            }
        }
    ]
    
    const actions: GenericTableAction<DispatchRule>[] = [
        {
            label: () => {
                return <EditIcon />
            },
            onClick: (row) => {
                setRule(row);
                setIsEditing(true);
                setRuleModalOpen(true);
            },
        }
    ]

    const fetchStatementItems = async () => {
        const categories = await statementItemsClient.getStatementItemsCategories();
        const itemsMap = new Map<number, StatementItem>();

        for (const category of categories) {
            const items = await statementItemsClient.getStatementItems(category.id);
            items.forEach(item => {
                itemsMap.set(item.id, item);
            });
        }
        
        const itemsWithoutCategory = await statementItemsClient.getStatementItems();
        itemsWithoutCategory.forEach(item => {
            itemsMap.set(item.id, item);
        });

        setStatementItems(itemsMap);
    }
    
    const handleSubmit = async (rule: DispatchRule) => {
        setIsSubmittingRule(true);
        try {
            if (isEditing) {
                await dispatchRulesClient.updateDispatchRule(rule);
            } else {
                await dispatchRulesClient.createDispatchRule(rule);
            }
            fetchRules();
            setRuleModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmittingRule(false);
        }
    }

    const handleAddRule = () => {
        setRule(null);
        setIsEditing(false);
        setRuleModalOpen(true);
    }

    const filteredRules = getFilteredRules();

    return (
        <div className="w-full">
            <div className="flex flex-row items-center gap-2 w-full mb-4">
                <input
                    type="text"
                    placeholder={t('searchRules')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered flex-1"
                />
                <button className="btn btn-primary" onClick={handleAddRule}>
                    {t('addRule') || 'Add Rule'}
                </button>
            </div>
            
            {isLoadingRules ? (
                <div className="flex justify-center items-center py-8">
                    <LoadingSpinner />
                </div>
            ) : (
                <GenericTable
                    data={filteredRules}
                    actions={actions}
                    columns={columns}
                />
            )}
            
            <Modal
                open={ruleModalOpen}
                onChangeOpen={(open) => {
                    if (!open) {
                        setRuleModalOpen(false);
                        setIsEditing(false);
                        setRule(null);
                    }
                }}
            >
                <DispatchRuleForm
                    rule={rule}
                    onCancel={() => {
                        setRuleModalOpen(false);
                        setIsEditing(false);
                    }}
                    onSubmit={handleSubmit}
                    submitLabel={isEditing ? t('rulesForm.submitUpdate') : t('rulesForm.submitCreate')}
                    cancelLabel={t('rulesForm.cancel')}
                    externalLoading={isSubmittingRule}
                />
            </Modal>
        </div>
    )
}
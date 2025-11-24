import {BarChart, Calendar, ChevronDown, ChevronRight, Download, Settings} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
    StatementItem,
    StatementItemAggregate,
    StatementItemCategory,
} from '@derp/company-canister';
import ExportStatementItemsModal from "../../../components/ExportStatementItemModal/ExportStatementItemsModal";
import { useStatementItemsClient, useStoreData } from '../../Stores/StoreProvider';

const CHART_COLORS = [
    '#d04b3d',  // primary
    '#b83d30',  // primary-focus
    '#ede333',  // secondary
    '#8b5cf6',  // accent
    '#737373',  // neutral
    '#22c55e',  // success
    '#f59e0b',  // warning
    '#ef4444',  // error
]


const BalanceTab = () => {
    const { merchantId, year } = useParams();
    const navigate = useNavigate();
    const statementItemsClient = useStatementItemsClient();
    const {store} = useStoreData();
    const [isLoading, setisLoading] = useState(true);
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance' })
    const [expandedCategory, setExpandedCategory] = useState<(number | undefined)[]>([]);
    const [selectedCategory, setSelectedCateogry] = useState<number | null | undefined>(null);
    const [categories, setCategories] = useState<(StatementItemCategory | { id: undefined, name: string })[]>([])
    const [statementItemsByCategoryMap, setStatementItemsByCategoryMap] = useState<Map<number | undefined, StatementItem[]>>(new Map());
    const [statementAggregatesByStatementItemMap, setStatementAggregatesByStatementItemMap] = useState<Map<number, StatementItemAggregate>>(new Map());

    const fetchData = async () => {
        if (!statementItemsClient.client) {
            console.log("StatementItemsClient is not initialized");
            return;
        }
        try {
            console.log('Fetching data for merchant:', merchantId, 'year:', year);
            setisLoading(true);
            const categories = await statementItemsClient.client.getStatementItemsCategories();
            const uncategorizedCategory = { id: undefined, name: t('uncategorized') }
            const allCategories = [...categories, uncategorizedCategory];
            setCategories(allCategories);

            const statementItemByCategoryMap = new Map<number | undefined, StatementItem[]>();
            await Promise.all(allCategories.map(async category => {
                try {
                    if (!statementItemsClient.client) {
                        console.log("StatementItemsClient is not initialized");
                        return;
                    }
                    const items = await statementItemsClient.client.getStatementItems(category.id);
                    statementItemByCategoryMap.set(category.id, items);
                } catch (error) {
                    console.log(error);
                    statementItemByCategoryMap.set(category.id, []);
                }
            }));

            const statementAggregatesByStatementItemMap = await getAllCategoriesAggregateData(allCategories, statementItemByCategoryMap);
            setStatementItemsByCategoryMap(statementItemByCategoryMap);
            setStatementAggregatesByStatementItemMap(statementAggregatesByStatementItemMap);
        } catch (error) {
            console.log(error);
        } finally {
            setisLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [merchantId, year, statementItemsClient.client]);


    const onChangeYear = (newYear: number) => {
        const currentPath = location.pathname;
        const updatedPath = currentPath.replace(/balance\/[^/]+/, `balance/${newYear}`);
        navigate(updatedPath);
    }

    const yearNumber = new Number(year).valueOf();

    const getAllCategoriesAggregateData = async (categories: (StatementItemCategory | { id: undefined, name: string })[], statementItemsMap: Map<number | undefined, StatementItem[]>) => {
        const finalMap = new Map<number, StatementItemAggregate>();
        const maps = await Promise.all(categories.map(category => getStatementItemAggregateDataMapByCategoryId(category.id, statementItemsMap)));

        maps.forEach(categoryMap => {
            categoryMap.forEach((value, key) => {
                finalMap.set(key, value);
            });
        });

        return finalMap;
    }

    const toggleCategory = async (groupId: number | undefined) => {

        setExpandedCategory(prev => {
            if (prev.includes(groupId)) {
                setSelectedCateogry(null);
                return prev.filter(id => id !== groupId)
            } else {
                setSelectedCateogry(groupId);
                return [...prev, groupId]
            }
        }
        );
    };

    const getStatementItemAggregateDataMapByCategoryId = async (categoryId: number | undefined, statementItemsMap: Map<number | undefined, StatementItem[]>): Promise<Map<number, StatementItemAggregate>> => {
        const aggregateValuesMap = new Map<number, StatementItemAggregate>();
        const statementItems = statementItemsMap.get(categoryId) || [];

        await Promise.all(
            statementItems.map(async (item) => {
                try {
                    if(statementItemsClient.client === null){
                        console.error("StatementItemsClient is not initialized");
                        return new Map<number, StatementItemAggregate>();

                    }
                    const aggregateValue = await statementItemsClient.client.getAggregateStatement(item.id, { year: yearNumber });
                    aggregateValuesMap.set(item.id, aggregateValue);
                } catch (error) {
                    console.error(`Error fetching aggregate value for statement item ${item.id}:`, error);
                    // aggregateValuesMap.set(item.id, new StatementItemAggregate(item.id, 0, yearNumber));
                }
            })
        );

        return aggregateValuesMap;
    }

    const goToMonthlyDetail = (statementId: number, categoryId: number | undefined) => {
        console.log('Navigate to monthly detail:', statementId);
        navigate(`/merchant/${merchantId}/stores/${store?.id}/balance/${year}/categories/${categoryId}/items/${statementId}/months`);
    };

    const calculateTotalByCategory = (categoryId: number | undefined) => {
        const statementItems = statementItemsByCategoryMap.get(categoryId) || [];
        return statementItems.reduce((acc, statement) => {
            return acc + Math.abs(statementAggregatesByStatementItemMap.get(statement.id)?.total || 0);
        }, 0);
    }

    const generateUniqueColors = (length: number) => {
        const colors = [...CHART_COLORS];
        const result = [];

        for (let i = 0; i < length; i++) {
            if (colors.length === 0) {
                // Se abbiamo esaurito i colori, ricominciamo dall'inizio
                colors.push(...CHART_COLORS);
            }
            const randomIndex = Math.floor(Math.random() * colors.length);
            result.push(colors[randomIndex]);
            colors.splice(randomIndex, 1); // Rimuoviamo il colore usato
        }

        return result;
    };

    const renderPieChart = () => {
        if (selectedCategory === null) return null;

        const statementItems = statementItemsByCategoryMap.get(selectedCategory) || [];

        const data = statementItems.map(statement => ({
            name: statement.name,
            value: Math.abs(statementAggregatesByStatementItemMap.get(statement.id)?.total || 0)
        })).filter(it => it.value !== 0);

        const pieColors = generateUniqueColors(data.length);
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                        outerRadius={120}
                        legendType='none'
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={pieColors[index % pieColors.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => `CHF ${Math.abs(Number(value)).toLocaleString('it-CH', { minimumFractionDigits: 2 })}`}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        );
    };



    return (
        <div className="min-h-screen bg-base-350">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Panoramica categorie</p>
                </div>
                <div>
                    <ExportStatementItemsModal
                        statementItemByCategoryMap={statementItemsByCategoryMap} />
                    <button
                        onClick={() => navigate(`/merchant/${merchantId}/stores/${store?.id}/balance/settings`)}
                        className="btn btn-ghost btn-circle mr-4"
                        aria-label="Impostazioni"
                    >
                        <Settings className="h-5 w-5"/>
                    </button>
                    <select
                        value={yearNumber}
                        onChange={(e) => onChangeYear(Number(e.target.value))}
                        className="select select-bordered w-32"
                    >
                        <option value={2023}>2023</option>
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-5 gap-6">
                {isLoading && <div className="justify-center loading loading-spinner loading-lg"></div>}
                {/* Groups and Accounts List */}
                {!isLoading && <div className="col-span-3 space-y-4">
                    {categories.map(category => (
                        <div
                            key={category.id ?? 'uncategorized'}
                            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all"
                        >
                            <div
                                className={`bg-primary p-4 rounded-t-2xl cursor-pointer`}
                                onClick={() => toggleCategory(category.id)}
                            >
                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center gap-2">
                                        {expandedCategory.includes(category.id) ?
                                            <ChevronDown className="w-5 h-5" /> :
                                            <ChevronRight className="w-5 h-5" />
                                        }
                                        <div>
                                            <h3 className="text-lg font-bold">{category.name}</h3>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold">
                                            CHF {Math.abs(calculateTotalByCategory(category.id)).toLocaleString('it-CH', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Accounts List */}
                            {expandedCategory.includes(category.id) && (
                                <div className="p-4 space-y-2">
                                    {statementItemsByCategoryMap.get(category.id)?.filter(statement => statementAggregatesByStatementItemMap.get(statement.id)?.total ?? 0 !== 0).map(statement => (
                                        <div
                                            key={statement.id}
                                            onClick={() => goToMonthlyDetail(statement.id, category.id)}
                                            className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <span className="font-medium">{statement.name}</span>
                                                    <span className="text-gray-500 text-sm ml-2">({statement.id})</span>
                                                </div>
                                            </div>
                                            <span className="font-semibold">
                                                CHF {Math.abs(statementAggregatesByStatementItemMap.get(statement.id)?.total || 0).toLocaleString('it-CH', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>}
                <div className="col-span-2 ">
                    <div className="card card-bordered border-2 bg-base-100 shadow-lg sticky top-6">
                        <div className="card-body">
                            <h3 className="card-title text-xl">
                                {selectedCategory !== null
                                    ? `Distribuzione ${categories.find(g => g.id === selectedCategory)?.name}`
                                    : 'Seleziona una categoria'
                                }
                            </h3>
                            <div className="h-96">
                                {selectedCategory !== null ? (
                                    renderPieChart()
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <div className="text-center">
                                            <BarChart className="w-16 h-16 mx-auto mb-4" />
                                            <p>Clicca su un gruppo per vederne la distribuzione</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}


export default BalanceTab;

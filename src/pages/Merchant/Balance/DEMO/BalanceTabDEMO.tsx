import { BarChart, Calendar, ChevronDown, ChevronRight, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { statementItemsClient } from '../../../../api/icp';
import { StatementItem, StatementItemAggregate, StatementItemCategory } from '@derp/company-canister';

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


const BalanceTabDEMO = () => {
    const { merchantId, year } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const { t } = useTranslation(undefined, { keyPrefix: 'merchantBalance' })
    const [expandedCategory, setExpandedCategory] = useState<number[]>([]);
    const [selectedCategory, setSelectedCateogry] = useState<number | null>(null);
    const [categories, setCategories] = useState<StatementItemCategory[]>([])
    const [statementItemsByCategoryMap, setStatementItemsByCategoryMap] = useState<Map<number,StatementItem[]>>(new Map());
    const [statementAggregatesByStatementItemMap, setStatementAggregatesByStatementItemMap] = useState<Map<number,StatementItemAggregate>>(new Map());


    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch data here
            const categories = await statementItemsClient.getStatementItemsCategories();
            console.log(categories);
            setCategories(categories);
            const statementItemByCategoryMap = new Map<number,StatementItem[]>();
            await Promise.all(categories.map(async category => {
                try{
                    const items = await statementItemsClient.getStatementItems(category.id);
                    statementItemByCategoryMap.set(category.id, items);
                }catch (error){
                    console.log(error);
                    statementItemByCategoryMap.set(category.id, []);
                }
            }));
            const statementAggregatesByStatementItemMap = await getAllCategoriesAggregateData(categories,statementItemByCategoryMap);
            setStatementItemsByCategoryMap(statementItemByCategoryMap);
            setStatementAggregatesByStatementItemMap(statementAggregatesByStatementItemMap);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [merchantId, year]);


    const onChangeYear = (newYear: number) => {
        const currentPath = location.pathname;
        const updatedPath = currentPath.replace(/balance\/[^/]+/, `balance/${newYear}`);
        navigate(updatedPath);
    }

    const yearNumber = new Number(year).valueOf();

    const getAllCategoriesAggregateData = async (categories: StatementItemCategory[],statementItemsMap: Map<number,StatementItem[]>) => {
        const finalMap = new Map<number, StatementItemAggregate>();
        const maps = await Promise.all(categories.map(category => getStatementItemAggregateDataMapByCategoryId(category.id,statementItemsMap)));

        maps.forEach(categoryMap => {
            categoryMap.forEach((value, key) => {
                finalMap.set(key, value);
            });
        });

        return finalMap;
    }

    const toggleCategory = async (groupId:number) => {

        setExpandedCategory(prev =>{
            if(prev.includes(groupId)){
                setSelectedCateogry(null);
                return prev.filter(id => id !== groupId)
            }else{
                setSelectedCateogry(groupId);
               return [...prev, groupId]
            }
        }
        );
    };

    const getStatementItemAggregateDataMapByCategoryId = async (categoryId:number, statementItemsMap:Map<number,StatementItem[]>) : Promise<Map<number,StatementItemAggregate>> =>{
        const aggregateValuesMap = new Map<number,StatementItemAggregate>();
        const statementItems = statementItemsMap.get(categoryId) || [];

        await Promise.all(
            statementItems.map(async (item) => {
                try {
                    const aggregateValue = await statementItemsClient.getAggregateStatement(item.id, { year: yearNumber });
                    aggregateValuesMap.set(item.id, aggregateValue);
                } catch (error) {
                    console.error(`Error fetching aggregate value for statement item ${item.id}:`, error);
                    aggregateValuesMap.set(item.id, new StatementItemAggregate(   item.id,0,yearNumber));
                }
            })
        );

        return aggregateValuesMap;
    }

    const goToMonthlyDetail = (statementId:number,categoryId:number) => {
        console.log('Navigate to monthly detail:', statementId);
        navigate(`/merchant/${merchantId}/balance/${year}/categories/${categoryId}/items/${statementId}/months`);
    };

    const calculateTotalByCategory = (categoryId:number) => {
        const statementItems = statementItemsByCategoryMap.get(categoryId) || [];
        return statementItems.reduce((acc, statement) => {
            return acc + Math.abs(statementAggregatesByStatementItemMap.get(statement.id)?.total || 0);
        }, 0);
    }

    const generateUniqueColors = (length:number) => {
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
        if (!selectedCategory) return null;

        const statementItems = statementItemsByCategoryMap.get(selectedCategory) || [];

        const data = statementItems.map(statement => ({
            name: statement.name,
            value: Math.abs(statementAggregatesByStatementItemMap.get(statement.id)?.total || 0)
        }));

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
                    <button
                        onClick={() =>  navigate(`/merchant/${merchantId}/balance/settings`)}
                        className="btn btn-ghost btn-circle mr-4"
                        aria-label="Impostazioni"
                    >
                        <Settings className="h-5 w-5" />
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
                {/* Groups and Accounts List */}
                <div className="col-span-3 space-y-4">
                    {categories.map(category => (
                        <div
                            key={category.id}
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
                                    {statementItemsByCategoryMap.get(category.id)?.map(statment => (
                                        <div
                                            key={statment.id}
                                            onClick={() => goToMonthlyDetail(statment.id,category.id)}
                                            className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <span className="font-medium">{statment.name}</span>
                                                    <span className="text-gray-500 text-sm ml-2">({statment.id})</span>
                                                </div>
                                            </div>
                                            <span className="font-semibold">
                        CHF {Math.abs(statementAggregatesByStatementItemMap.get(statment.id)?.total || 0).toLocaleString('it-CH', { minimumFractionDigits: 2 })}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="col-span-2 ">
                    <div className="card card-bordered border-2 bg-base-100 shadow-lg sticky top-6">
                        <div className="card-body">
                            <h3 className="card-title text-xl">
                                {selectedCategory
                                    ? `Distribuzione ${categories.find(g => g.id === selectedCategory)?.name}`
                                    : 'Seleziona una categoria'
                                }
                            </h3>
                            <div className="h-96">
                                {selectedCategory ? (
                                    renderPieChart()
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <div className="text-center">
                                            <BarChart className="w-16 h-16 mx-auto mb-4" />
                                            <p>Clicca su un gruppo per vedere la distribuzione</p>
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


export default BalanceTabDEMO;

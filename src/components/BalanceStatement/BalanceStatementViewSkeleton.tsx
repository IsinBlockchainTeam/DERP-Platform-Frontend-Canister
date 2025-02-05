import LoadingSpinner from "../Loading/LoadingSpinner";
import BalanceStatementLocation from "./BalanceStatementLocation";

export interface Props {
    merchantId: string;
    categoryId: string;
    year: number;
    item?: {
        id: number;
        label: string;
    }
    month?: number;
    day?: number;
    loading: boolean;
    leftSlot: JSX.Element;
    rightSlot: JSX.Element;
}

const BalanceStatementViewSkeleton = ({
    merchantId,
    categoryId,
    year,
    item,
    month,
    day,
    loading,
    leftSlot: table,
    rightSlot: chart
}: Props) => {
    return <div>
        {loading ? <LoadingSpinner /> :
            <div className="col flex flex-col">
                <BalanceStatementLocation
                    year={year}
                    merchantId={merchantId!}
                    categoryId={categoryId!}
                    month={month}
                    day={day}
                    item={item}
                />
                <div className="col flex flex-col lg:flex-row items-start justify-items-stretch justify-start">
                    <div className="flex-1 card card-bordered shadow-sm">
                        {table}
                    </div>
                    <div className="card card-bordered shadow-sm mx-8 px-4 sticky top-12">
                        {chart}
                    </div>
                </div>
            </div>
        }
    </div>
}

export default BalanceStatementViewSkeleton;

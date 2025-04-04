import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { interfacesService } from "../../../api/services/Interfaces";
import { storeService } from "../../../api/services/Store";
import AddTableForm from "../../../components/AddTableForm/AddTableForm";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { Modal } from "../../../components/Modal/Modal";
import QRViewer from "../../../components/QRViewer/QRViewer";
import GenericTable, { GenericTableAction, GenericTableColumn } from "../../../components/Table/GenericTable";
import TabTitle from "../../../components/Tabs/TabTitle";
import { CreateTableDto } from "../../../dto/CreateTableDto";
import { InterfaceType, PosAssociationResponseDto } from "../../../dto/ErpInterfacesDto";
import { StoreDto } from "../../../dto/stores/StoreDto";
import { TableDto } from "../../../dto/TableDto";
import { PosType } from "../../../model/PosType";
import { useStoreId } from "../../../utils";
import AssociatedPosFeatureGuard from "../../../components/HOC/AssociatedPosFeatureGuard";

const tableColumns: GenericTableColumn<TableDto>[] = [
    {
        header: "Name",
        accessor: "label",
    },
    {
        header: "ID",
        accessor: "id",
    }
]

const TablesTab = () => {
    const navigate = useNavigate();
    const [store, setStore] = useState<StoreDto>({} as StoreDto);
    const [posType, setPosType] = useState<PosType>();
    const [tables, setTables] = useState<TableDto[]>([]);
    const [addTableModalOpen, setAddTableModalOpen] = useState<boolean>(false);
    const [qrCodeShownTable, setQrCodeShownTable] = useState<TableDto | null>(
        null,
    );
    const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchParams] = useSearchParams();
    const [hasRequiredAssociations, setHasRequiredAssociations] = useState<boolean>(false);
    const [addingTable, setAddingTable] = useState<CreateTableDto>({
        label: "",
        tcposUsername: "",
        tcposPassword: "",
    });

    const storeId = useStoreId();
    const { merchantId } = useParams<{ merchantId: string }>();
    const { t } = useTranslation(undefined, { keyPrefix: "supplierTables" });

    if (!merchantId) throw new Error("No merchantId provided");
    const merchantIdNum = parseInt(merchantId);
    const tableActions: GenericTableAction<TableDto>[] = [
        {
            label: <>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                    />
                </svg>
            </>,
            onClick: (table) => showQrModal(table),
        }
    ]

    const fetchData = async (store: StoreDto) => {
        const tables = await storeService.listTables(store.id);
        const associations = await interfacesService.getAssociations(store.id);
        const wondAssociation = associations.find(a => a.interfaceType === InterfaceType.POS) as PosAssociationResponseDto;
        if (!wondAssociation) {
            setHasRequiredAssociations(false);
        } else {
            setHasRequiredAssociations(true);
        }

        setPosType(wondAssociation.posType);
        setTables(tables);
    };

    const hideQrModal = () => {
        setQrModalOpen(false);
    };

    const showQrModal = (table: TableDto) => {
        setQrCodeShownTable(table);
        setQrModalOpen(true);
    };

    const openAddModal = () => {
        setAddingTable({ label: "", tcposUsername: "", tcposPassword: "" });
        setAddTableModalOpen(true);
    }

    const onConfirmAddTable = async () => {
        setLoading(true);
        await storeService.createTable(storeId, addingTable);
        fetchData(store);
        setAddTableModalOpen(false);
        setLoading(false);
    }

    useEffect(() => {
        console.log("searchParams", searchParams.get("storeUrl"));
        setLoading(true);
        storeService.list(merchantId).then((stores) => {
            const store = stores.find(
                (s) => s.id === storeId
            );
            if (!store) return;

            setStore(store);
            fetchData(store).then(() => setLoading(false));
        });
    }, [merchantId, searchParams]);

    const goToAssociations = () => {
        navigate(`/merchant/${merchantId}/stores/store/interfaces?storeId=${store.id}`);
    }

    return (
        <div className="flex flex-col w-full">
            {loading ? (
                <div className="flex flex-row grow items-center justify-center">
                    <LoadingSpinner />{" "}
                </div>
            ) : (
                <>
                    <TabTitle
                        title={t("title")}
                        rightSlot={
                            <button
                                className="btn btn-primary"
                                onClick={() => openAddModal()}
                                disabled={!hasRequiredAssociations}
                            >
                                {t("addBtn")}
                            </button>
                        }
                    />
                    <div className="flex w-full flex-col" style={{ padding: '20px' }}>
                        <AssociatedPosFeatureGuard merchantId={merchantIdNum} storeId={store.id}>
                            <GenericTable data={tables} columns={tableColumns} actions={tableActions} />
                            {!hasRequiredAssociations &&
                                <span className="mt-4 flex flex-row self-stretch items-center justify-center">
                                    <span className="text-error text-center">
                                        {t("noRequiredAssociations")}
                                    </span>
                                    <button className="inline btn btn-primary btn-sm mx-2" onClick={() => goToAssociations()}>{t("hereLink")}</button>
                                </span>
                            }
                        </AssociatedPosFeatureGuard>
                    </div>

                </>
            )}

            {/* QR Code modal */}
            <Modal closeButton open={qrModalOpen} onChangeOpen={setQrModalOpen}>
                <QRViewer
                    table={qrCodeShownTable || undefined}
                    store={store}
                />
                <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn" onClick={() => hideQrModal()}>{t("closeBtn")}</button>
                </div>
            </Modal>

            {/* Add Table modal */}
            <Modal closeButton open={addTableModalOpen} onChangeOpen={setAddTableModalOpen}>
                <div className="flex flex-col">
                    <h1 className="text-2xl mb-2">{t("insertTableData")}</h1>
                    <AddTableForm
                        erpType={posType!}
                        label={addingTable.label}
                        username={addingTable.tcposUsername || ""}
                        password={addingTable.tcposPassword || ""}
                        onChangeLabel={(value: string) => setAddingTable({ ...addingTable, label: value })}
                        onChangeUsername={(value: string) => setAddingTable({ ...addingTable, tcposUsername: value })}
                        onChangePassword={(value: string) => setAddingTable({ ...addingTable, tcposPassword: value })}
                        onCancel={() => setAddTableModalOpen(false)}
                        onConfirm={() => onConfirmAddTable()}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default TablesTab;
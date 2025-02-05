import { useEffect, useState } from "react";
import { StoreDto } from "../../../dto/stores/StoreDto";
import { TableDto } from "../../../dto/TableDto";
import { storeService } from "../../../api/services/Store";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { CreateTcposTableDto } from "../../../dto/CreateTableDto";
import AddTableForm from "../../../components/AddTableForm/AddTableForm";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QRViewer from "../../../components/QRViewer/QRViewer";
import GenericTable, { GenericTableColumn, GenericTableAction } from "../../../components/Table/GenericTable";
import { Modal } from "../../../components/Modal/Modal";
import TabTitle from "../../../components/Tabs/TabTitle";
import { useStoreUrl } from "../../../utils";
import { interfacesService } from "../../../api/services/Interfaces";
import { AssociationResponseDto, InterfaceType, WondAssociationResponseDto } from "../../../dto/ErpInterfacesDto";
import { WondType } from "../../../model/WondType";

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

export default () => {
    const navigate = useNavigate();
    const [store, setStore] = useState<StoreDto>({} as StoreDto);
    const [tables, setTables] = useState<TableDto[]>([]);
    const [addTableModalOpen, setAddTableModalOpen] = useState<boolean>(false);
    const [qrCodeShownTable, setQrCodeShownTable] = useState<TableDto | null>(
        null,
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [searchParams] = useSearchParams();
    const [hasRequiredAssociations, setHasRequiredAssociations] = useState<boolean>(false);
    const [addingTable, setAddingTable] = useState<CreateTcposTableDto>({
        label: "",
        credentials: {
            password: "",
            username: "",
        }
    });

    const storeUrl = useStoreUrl();
    const { merchantId } = useParams<{ merchantId: string }>();
    const { t } = useTranslation(undefined, { keyPrefix: "supplierTables" });

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
        const tables = await storeService.listTables(store.url);
        const associations = await interfacesService.getAssociations(store.url);
        const wondAssociations = associations.filter(a => a.interfaceType === InterfaceType.WOND) as WondAssociationResponseDto[];
        const tcposAssociation = wondAssociations.find(a => a.wondType === WondType.TCPOS);
        if (!tcposAssociation) {
            setHasRequiredAssociations(false);
        } else {
            setHasRequiredAssociations(true);
        }

        setTables(tables);
    };

    const hideQrModal = () => {
        window.location.hash = "";
    };

    const showQrModal = (table: TableDto) => {
        setQrCodeShownTable(table);
        window.location.hash = "show-qrcode-modal";
    };

    const openAddModal = () => {
        setAddingTable({ label: "", credentials: { password: "", username: "" } });
        setAddTableModalOpen(true);
    }

    const onConfirmAddTable = async () => {
        setLoading(true);
        await storeService.createTcposTable(storeUrl, addingTable);
        fetchData(store);
        setAddTableModalOpen(false);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        storeService.list(merchantId).then((stores) => {
            const store = stores.find(
                (s) => s.url === searchParams.get("storeUrl"),
            );
            if (!store) return;

            setStore(store);
            fetchData(store).then(() => setLoading(false));
        });
    }, []);

    const goToAssociations = () => {
        navigate(`/merchant/${merchantId}/stores/store/interfaces?storeUrl=${encodeURIComponent(store.url)}`);
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
                        <GenericTable data={tables} columns={tableColumns} actions={tableActions} />
                        {!hasRequiredAssociations &&
                            <span className="mt-4 flex flex-row self-stretch items-center justify-center">
                                <span className="text-error text-center">
                                    {t("noRequiredAssociations")}
                                </span>
                                <button className="inline btn btn-primary btn-sm mx-2" onClick={() => goToAssociations()}>{t("hereLink")}</button>
                            </span>
                        }
                    </div>

                </>
            )}

            {/* QR Code modal */}
            <div id="show-qrcode-modal" className="modal">
                <div className="modal-box relative">
                    <form method="dialog">
                        <QRViewer
                            table={qrCodeShownTable || undefined}
                            store={store}
                        />
                        <div className="modal-action">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn" onClick={() => hideQrModal()}>{t("closeBtn")}</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Add Table modal */}
            <Modal closeButton open={addTableModalOpen} onChangeOpen={setAddTableModalOpen}>
                <div className="flex flex-col">
                    <h1 className="text-2xl mb-2">{t("insertTableData")}</h1>
                    <AddTableForm
                        erpType={store.erpType}
                        label={addingTable.label}
                        username={addingTable.credentials.username}
                        password={addingTable.credentials.password}
                        onChangeLabel={(value: string) => setAddingTable({ ...addingTable, label: value })}
                        onChangeUsername={(value: string) => setAddingTable({ ...addingTable, credentials: { ...addingTable.credentials, username: value } })}
                        onChangePassword={(value: string) => setAddingTable({ ...addingTable, credentials: { ...addingTable.credentials, password: value } })}
                        onCancel={() => setAddTableModalOpen(false)}
                        onConfirm={() => onConfirmAddTable()}
                    />
                </div>
            </Modal>
        </div>
    );
};

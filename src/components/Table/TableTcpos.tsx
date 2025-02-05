import {
    CreateTcposInterfaceReqDto,
    InterfaceType,
    TcposInterfaceResponseDto,
    WondInterfaceResponseDto
} from '../../dto/ErpInterfacesDto';
import { WondType } from '../../model/WondType';
import React, { useEffect, useState } from 'react';
import { interfacesService } from '../../api/services/Interfaces';
import { useParams } from 'react-router';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { CheckIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

type EditableRow = TcposInterfaceResponseDto & { isEditing: boolean, showPassword: boolean };

const emptyRow: TcposInterfaceResponseDto = {
    id: 0,
    name: '',
    url: '',
    username: '',
    password: '',
    interfaceType: InterfaceType.WOND,
    wondType: WondType.TCPOS
};

export default function TableTcpos() {
    const [rows, setRows] = useState<EditableRow[] | undefined>(undefined);
    const [headers, setHeaders] = useState<string[] | undefined>(undefined);
    const [showNewRowPassword, setShowNewRowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { merchantId } = useParams<{ merchantId: string }>();
    const {t} = useTranslation(undefined, {keyPrefix: 'supplierInterfacesDashboard'})

    const getTableRows = (interfaces: TcposInterfaceResponseDto[]) => {
        const mappedRows = interfaces.map((row) => ({
            ...row,
            isEditing: false,
            showPassword: false,
        }));

        setRows(mappedRows);
    }

    const init = async () => {
        try {
            if (!merchantId)
                throw new Error("Merchant ID is null!");

            setLoading(true);
            const interfaces = (await interfacesService.listByCompany(+merchantId) as WondInterfaceResponseDto[])
                .filter((i: WondInterfaceResponseDto) => i.interfaceType === InterfaceType.WOND)
                .filter(i => i.wondType === WondType.TCPOS) as TcposInterfaceResponseDto[];

            if (interfaces?.length)
                getTableRows(interfaces);
        }catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        init().then();
    }, []);

    useEffect(() => {
        setHeaders([
            t('interfaceName'),
            t('interfaceServerUrl'),
            t('interfaceUsername'),
            t('interfacePassword'),
            ""
        ]);
    }, []);

    const [newRow, setNewRow] = useState<CreateTcposInterfaceReqDto>({
        url: '',
        username: '',
        password: '',
        wondType: WondType.TCPOS,
        interfaceType: InterfaceType.WOND
    } as any);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewRow((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddRow = async () => {
        if (newRow.url && newRow.username && newRow.password) {
            try {
                if (!merchantId)
                    throw new Error("Merchant ID is null!");

                await interfacesService.create(+merchantId, newRow);
                await init();

                setNewRow({
                    url: '',
                    username: '',
                    password: '',
                    wondType: WondType.TCPOS,
                    interfaceType: InterfaceType.WOND
                } as any);
                setShowNewRowPassword(false);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleModifyRow = async (index: number, isEditing: boolean) => {
        if (isEditing) {
            try {
                if (!merchantId)
                    throw new Error("Merchant ID is null!");

                console.log(rows);
                if (rows && rows[index])
                    await interfacesService.update(+merchantId, rows[index]);
            } catch (e) {
                console.error(e);
            }
        }

        setRows((prevRows) =>
            (prevRows ?? []).map((row, i) =>
                i === index ? { ...row, isEditing: !row.isEditing } : row
            )
        );
    };

    const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        setRows((prevRows) =>
            (prevRows ?? []).map((row, i) =>
                i === index ? { ...row, [name]: value } : row
            )
        );
    };

    const toggleShowPassword = (index: number) => {
        setRows((prevRows) =>
            (prevRows ?? []).map((row, i) =>
                i === index ? { ...row, showPassword: !row.showPassword } : row
            )
        );
    };

    const toggleShowNewRowPassword = () => {
        setShowNewRowPassword((old) => !old);
    };

    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead className="sticky top-0 bg-white z-10">
                    <tr>
                        {
                            headers?.map((header) => (
                                <th key={header} className="text-base text-left">{header}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr className="sticky top-[3rem] bg-white z-10">
                        <td>
                            <input
                                type="text"
                                name="name"
                                value={newRow.name}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                placeholder={t('interfaceName')}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="url"
                                value={newRow.url}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                placeholder={t('interfaceServerUrl')}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="username"
                                value={newRow.username}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                placeholder={t('interfaceUsername')}
                            />
                        </td>
                        <td className="relative">
                            <input
                                type={showNewRowPassword ? 'text' : 'password'}
                                name="password"
                                value={newRow.password}
                                onChange={handleInputChange}
                                className="input input-bordered w-full pr-10"
                                placeholder={t('interfacePassword')}
                            />
                            {newRow.password && (
                                <button
                                    onClick={toggleShowNewRowPassword}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 mr-5"
                                >
                                    {showNewRowPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            )}
                        </td>
                        <td>
                            <button
                                onClick={handleAddRow}
                                className="btn btn-primary w-full flex justify-center items-center"
                            >
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                    {
                        rows?.length ?
                            rows?.map((row, index) => (
                                <tr key={index}>
                                    <td className="max-w-[200px] truncate">
                                        {
                                            row.isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={row.name}
                                                    onChange={(e) => handleRowChange(e, index)}
                                                    className="input input-bordered w-full"
                                                />
                                            ) : (
                                                <span className="block overflow-hidden whitespace-nowrap text-ellipsis">
                                                    {row.name}
                                                </span>
                                            )
                                        }
                                    </td>
                                    <td className="max-w-[200px] truncate">
                                        {
                                            row.isEditing ? (
                                                <input
                                                    type="text"
                                                    name="url"
                                                    value={row.url}
                                                    onChange={(e) => handleRowChange(e, index)}
                                                    className="input input-bordered w-full"
                                                />
                                            ) : (
                                                <span className="block overflow-hidden whitespace-nowrap text-ellipsis">
                                                    {row.url}
                                                </span>
                                            )
                                        }
                                    </td>
                                    <td className="max-w-[150px] truncate">
                                        {
                                            row.isEditing ? (
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={row.username}
                                                    onChange={(e) => handleRowChange(e, index)}
                                                    className="input input-bordered w-full"
                                                />
                                            ) : (
                                                <span className="block overflow-hidden whitespace-nowrap text-ellipsis">
                                                    {row.username}
                                                </span>
                                            )
                                        }
                                    </td>
                                    <td className="max-w-[150px] truncate relative">
                                        {
                                            row.isEditing ? (
                                                <input
                                                    type="text"
                                                    name="password"
                                                    value={row.password}
                                                    onChange={(e) => handleRowChange(e, index)}
                                                    className="input input-bordered w-full pr-10"
                                                />
                                            ) : (
                                                <span className="block overflow-hidden whitespace-nowrap text-ellipsis">
                                                    {row.showPassword ? row.password : '•'.repeat(row.password.length)}
                                                </span>
                                            )
                                        }
                                        {row.password && !row.isEditing && (
                                            <button
                                                onClick={() => toggleShowPassword(index)}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                            >
                                                {row.showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5 text-gray-500" />
                                                )}
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleModifyRow(index, row.isEditing)}
                                            className="btn btn-secondary w-full flex justify-center items-center"
                                            disabled={!row.url || !row.username || !row.password }
                                        >
                                            {
                                                row.isEditing ? (
                                                    <CheckIcon className="h-5 w-5" />
                                                ) : (
                                                    <PencilIcon className="h-5 w-5" />
                                                )
                                            }
                                        </button>
                                    </td>
                                </tr>
                            ))
                            :
                            <tr>
                                <td colSpan={4}>
                                    <p className="text-center">No rows</p>
                                </td>
                            </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

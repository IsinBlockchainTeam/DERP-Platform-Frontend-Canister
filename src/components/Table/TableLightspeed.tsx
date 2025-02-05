import React, { useEffect, useState } from 'react';
import { PencilIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/solid';
import { WondType } from '../../model/WondType';
import { interfacesService } from '../../api/services/Interfaces';
import { LightspeedInterfaceResponseDto } from '../../dto/ErpInterfacesDto';

type EditableRow = LightspeedInterfaceResponseDto & { isEditing: boolean };

// const emptyRow: LightspeedInterfaceResponseDto = {
//     id: 0,
//     url: '',
//     wondType: WondType.LIGHTSPEED,
//     apiKey: ''
// };

export default function TableLightSpeed() {
    // const [rows, setRows] = useState<EditableRow[] | undefined>(undefined);
    // const [headers, setHeaders] = useState<string[] | undefined>(undefined);
    //
    // useEffect(() => {
    //     const mappedRows = tableRows.map((row) => ({
    //         ...row,
    //         isEditing: false
    //     }));
    //
    //     setRows(mappedRows);
    // }, [tableRows]);
    //
    // useEffect(() => {
    //     setHeaders(Object.keys(emptyRow).filter(key => key !== 'type' && key !== 'id'));
    // }, []);
    //
    // const [newRow, setNewRow] = useState<LightspeedInterfaceResponseDto>({
    //     id: 0,
    //     url: '',
    //     wondType: WondType.LIGHTSPEED,
    //     apiKey: ''
    // });
    //
    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setNewRow((prev: LightspeedInterfaceResponseDto) => ({ ...prev, [name]: value }));
    // };
    //
    // const handleAddRow = async () => {
    //     if (newRow.url) {
    //         try {
    //             await erpInterfacesService.create(merchantId, newRow);
    //             setRows((prevRows) => [
    //                 ...(prevRows ?? []),
    //                 { ...newRow, isEditing: false }
    //             ]);
    //             setNewRow({
    //                 id: 0,
    //                 url: '',
    //                 wondType: WondType.LIGHTSPEED,
    //                 apiKey: ''
    //             });
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    // };
    //
    // const handleModifyRow = (index: number) => {
    //     setRows((prevRows) =>
    //         (prevRows ?? []).map((row, i) =>
    //             i === index ? { ...row, isEditing: !row.isEditing } : row
    //         )
    //     );
    // };
    //
    // const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    //     const { name, value } = e.target;
    //     setRows((prevRows) =>
    //         (prevRows ?? []).map((row, i) =>
    //             i === index ? { ...row, [name]: value } : row
    //         )
    //     );
    // };
    //
    // return (
    //     <div className="h-[63rem] overflow-y-auto">
    //         <table className="table w-full">
    //             {/* head */}
    //             <thead className="sticky top-0 bg-white z-10">
    //             <tr>
    //                 {headers?.map((header) => (
    //                     <th key={header}>{header}</th>
    //                 ))}
    //                 <th>Action</th>
    //             </tr>
    //             </thead>
    //             <tbody>
    //             {/* Input row for new entries */}
    //             <tr className="sticky top-[3rem] bg-white z-10">
    //                 <td>
    //                     <input
    //                         type="text"
    //                         name="url"
    //                         value={newRow.url}
    //                         onChange={handleInputChange}
    //                         className="input input-bordered w-full"
    //                         placeholder="URL"
    //                     />
    //                 </td>
    //                 <td>
    //                     <button
    //                         onClick={handleAddRow}
    //                         className="btn btn-primary w-full flex justify-center items-center"
    //                     >
    //                         <PlusIcon className="h-5 w-5" />
    //                     </button>
    //                 </td>
    //             </tr>
    //             {/* Existing rows */}
    //             {rows?.map((row, index) => (
    //                 <tr key={index}>
    //                     <td className="max-w-[200px] truncate">
    //                         {row.isEditing ? (
    //                             <input
    //                                 type="text"
    //                                 name="url"
    //                                 value={row.url}
    //                                 onChange={(e) => handleRowChange(e, index)}
    //                                 className="input input-bordered w-full"
    //                             />
    //                         ) : (
    //                             <span className="block overflow-hidden whitespace-nowrap text-ellipsis">
    //                                 {row.url}
    //                             </span>
    //                         )}
    //                     </td>
    //                     <td>
    //                         <button
    //                             onClick={() => handleModifyRow(index)}
    //                             className="btn btn-secondary w-full flex justify-center items-center"
    //                         >
    //                             {row.isEditing ? (
    //                                 <CheckIcon className="h-5 w-5" />
    //                             ) : (
    //                                 <PencilIcon className="h-5 w-5" />
    //                             )}
    //                         </button>
    //                     </td>
    //                 </tr>
    //             ))}
    //             </tbody>
    //         </table>
    //     </div>
    // );
    return <div></div>;
}

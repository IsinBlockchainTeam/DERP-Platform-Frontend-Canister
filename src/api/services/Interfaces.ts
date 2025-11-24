import {
    AssociationResponseDto,
    CreateAssociationReqDto,
    CreateInterfaceReqDto,
    InterfaceResponseDto,
    InterfaceType,
    UpdateAssociationReqDto,
    UpdateInterfaceReqDto
} from '../../dto/ErpInterfacesDto';
import api from '../api';
import { auth } from '../auth';

export const interfacesService = {
    listInterfaceTypes: async (): Promise<string[]> => {
        const res = await api.get('/interfaces/interface-types', {
            headers: await auth.authenticatedHeaders()
        });

        if (res.status !== 200)
            throw new Error('Error listing interface types');

        return res.data;
    },

   listByCompany: async (merchantId: number): Promise<InterfaceResponseDto[]> => {
        const res = await api.get('/interfaces', {
            headers: await auth.authenticatedHeaders(),
            params: {
                merchantId
            }
        });

        if (res.status !== 200)
            throw new Error('Error listing interfaces');

        return res.data;
   },

    create: async (merchantId: number, interfaceToCreate: CreateInterfaceReqDto) => {
        const res = await api.post<InterfaceResponseDto>('/interfaces', interfaceToCreate, {
            headers: await auth.authenticatedHeaders(),
            params: {
                merchantId
            }
        });

        if (res.status !== 201)
            throw new Error('Error creating interface of type ' + interfaceToCreate.interfaceType);
        
        return res.data;
    },

    update: async (merchantId: number, interfaceToUpdate: UpdateInterfaceReqDto) => {
        const res = await api.put(`/interfaces`, interfaceToUpdate, {
            headers: await auth.authenticatedHeaders(),
            params: {
                merchantId
            }
        });

        if (res.status !== 200)
            throw new Error('Error updating interface of type ' + interfaceToUpdate.interfaceType);
    },
    
    delete: async (type: InterfaceType, id: number) => {
        const res = await api.delete(`/interfaces/${id}`, {
            headers: await auth.authenticatedHeaders(),
            params: {
                type
            }
        });

        if (res.status !== 200)
            throw new Error('Error deleting interface');
    },

    associate: async (storeId: number, associationData: CreateAssociationReqDto) => {
        const res = await api.post<AssociationResponseDto>('/interfaces/associations', associationData, {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeId
            },
        });

        if (res.status !== 201)
            throw new Error('Error associating ERP interface');
        
        return res.data;
    },

    getAssociations: async (storeId: number):Promise<AssociationResponseDto[]> => {
        const res = await api.get('/interfaces/associations', {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeId
            }
        });

        if (res.status !== 200)
            throw new Error('Error getting association');

        return res.data;
    },

    updateAssociation: async (storeId: number, id: number, associationToUpdate: UpdateAssociationReqDto) => {
        const res = await api.patch(`/interfaces/associations/${id}`, associationToUpdate, {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeId
            }
        });

        if (res.status !== 200)
            throw new Error('Error updating interface of type ' + associationToUpdate.interfaceType);
    },
    
    deleteAssociation: async (storeId: number, id: number) => {
        const res = await api.delete(`/interfaces/associations/${id}`, {
            headers: await auth.authenticatedHeaders(),
            params: {
                storeId
            }
        });

        if (res.status !== 200)
            throw new Error('Error deleting association');
    },

    generateBankLetter: async (interfaceId: number): Promise<Blob> => {
        const res = await api.get(`/ebics-interfaces/${interfaceId}/bank-letter`, {
            headers: await auth.authenticatedHeaders(),
            responseType: 'blob'
        });

        console.log(res);
        if (res.status !== 200)
            throw new Error('Error generating EBICS bank letter');

        return res.data;
    },
    
    ebicsLetterUrl: (interfaceId: number) => {
        return `/ebics-interfaces/${interfaceId}/bank-letter`
    },

    finalizeEbics: async (interfaceId: number) => {
        const res = await api.post(`/ebics-interfaces/${interfaceId}/finalize`, {}, {
            headers: await auth.authenticatedHeaders()
        });

        if (res.status !== 201)
            throw new Error('Error finalizing EBICS interface');
    }
}

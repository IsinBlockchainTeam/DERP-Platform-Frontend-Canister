import {CompleteOrderLineDto, CompleteOrderLineStatus} from '../../dto/CompleteOrderLineDto';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

export interface ExpandedOrderItemsState {
    expandedOrderItems: CompleteOrderLineDto[];
}

const initialState: ExpandedOrderItemsState = {
    expandedOrderItems: []
};

export const expandedOrderItemsSlice = createSlice({
    name: 'expandedOrderItems',
    initialState,
    reducers: {
        initExpandedOrderItems: (state: ExpandedOrderItemsState, action: { type: string, payload: any }) => ({ expandedOrderItems: action.payload }),

        changeExpandedOrderItemStatus: (state: ExpandedOrderItemsState, action: { type: string, payload: any }) => {
            const { orderLine, status, oldStatus, payerSseId } = action.payload;
            const index = state.expandedOrderItems.findIndex(eoi => eoi.offerId === orderLine.offerId && eoi.offerLineId === orderLine.offerLineId && eoi.status === oldStatus)

            if (index >= 0 && index <= state.expandedOrderItems.length -1){
                state.expandedOrderItems[index].status = status;
                state.expandedOrderItems[index].payerSseId = payerSseId;
            }

            return state;
        },

        markOrderItemAsPaid: (state: ExpandedOrderItemsState, action: { type: string, payload: any }) => {
            const { orderLine } = action.payload;
            const index = state.expandedOrderItems.findIndex(eoi => eoi.offerId === orderLine.offerId && eoi.offerLineId === orderLine.offerLineId && eoi.status !== CompleteOrderLineStatus.PAID);

            if (index >= 0 && index <= state.expandedOrderItems.length -1)
                state.expandedOrderItems[index].status = CompleteOrderLineStatus.PAID;

            return state;
        },

        toggleChecked: (state, action: { type: string, payload: number }) => {
            const index = action.payload;

            if (index >= 0 && index <= state.expandedOrderItems.length - 1){
                state.expandedOrderItems[index].checked = !state.expandedOrderItems[index].checked;
                state.expandedOrderItems[index].status = state.expandedOrderItems[index].checked ? CompleteOrderLineStatus.SELECTED_BY_ME : CompleteOrderLineStatus.SELECTABLE;
            }

            return state;
        },

        setChecked: (state: ExpandedOrderItemsState, action: { type: string, payload: {index: number, checked: boolean}}) => {
            if (action.payload.index >= 0 && action.payload.index  <= state.expandedOrderItems.length - 1){
                state.expandedOrderItems[action.payload.index ].checked = action.payload.checked;
                state.expandedOrderItems[action.payload.index ].status = action.payload.checked ? CompleteOrderLineStatus.SELECTED_BY_ME : CompleteOrderLineStatus.SELECTABLE;
            }

            return state;
        }
    },
});


export const { initExpandedOrderItems, changeExpandedOrderItemStatus, toggleChecked, setChecked, markOrderItemAsPaid } = expandedOrderItemsSlice.actions;

export const selectExpandedOrderItems = (state: RootState) => state.expandedOrderItems;
// export const selectExpandedOrderItem = (state: RootState) => state.expandedOrderItems[0];

export default expandedOrderItemsSlice.reducer;
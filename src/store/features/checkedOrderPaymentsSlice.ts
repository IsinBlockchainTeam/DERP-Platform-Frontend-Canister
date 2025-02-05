import {BcStatus, CheckedOrderPayment} from '../../dto/CheckedOrderPayment';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

export interface CheckedOrderPaymentsState {
    checkedOrderPayments: CheckedOrderPayment[];
}

const initialState: CheckedOrderPaymentsState = {
    checkedOrderPayments: []
};

export const checkedOrderPaymentsSlice = createSlice({
    name: 'checkedOrderPayments',
    initialState,
    reducers: {
        initCheckedOrderPayments: (state: CheckedOrderPaymentsState, action: {type: string, payload: CheckedOrderPayment[]}) => ({ checkedOrderPayments: action.payload }),

        changeBcStatus: (state: CheckedOrderPaymentsState, action: {type: string, payload: { transactionId: string, status: BcStatus }}) => {
           const {transactionId, status} = action.payload;
           const index = state.checkedOrderPayments.findIndex(cop => cop.transactionId === transactionId);

           if (index >= 0 && index <= state.checkedOrderPayments.length - 1)
               state.checkedOrderPayments[index].bcStatus = status;

           return state;
        }
    }
});

export const {initCheckedOrderPayments, changeBcStatus} = checkedOrderPaymentsSlice.actions;

export const selectCheckedOrderPayments = (state: RootState) => state.checkedOrderPayments;
export default checkedOrderPaymentsSlice.reducer;
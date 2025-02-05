import { configureStore } from '@reduxjs/toolkit';
import expandedOrderItemsReducer from './features/expandedOrderItemsSlice';
import checkedOrderPaymentsReducer from './features/checkedOrderPaymentsSlice';

const store = configureStore({
    reducer: {
        expandedOrderItems: expandedOrderItemsReducer,
        checkedOrderPayments: checkedOrderPaymentsReducer
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
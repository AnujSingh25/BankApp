import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '../../types/expense';

interface ExpenseState {
    transactions: Expense[];
}

const initialState: ExpenseState = {
    transactions: [],
};

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        addExpense: (state, action: PayloadAction<Expense>) => {
            state.transactions.unshift(action.payload)
        },
        deleteExpense: (state, action: PayloadAction<string>) => {
            state.transactions = state.transactions.filter(e => e.id !== action.payload)
        },
        resetExpenses: (state) => {
            state.transactions = [];
        },
    },
});

export const { addExpense, deleteExpense, resetExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
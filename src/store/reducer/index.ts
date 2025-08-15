import { combineReducers } from "@reduxjs/toolkit";
import expenseReducer from '../slices/expenseSlice';

export const rootReducer = combineReducers({
    expenses: expenseReducer
})

export type RootState = ReturnType<typeof rootReducer>

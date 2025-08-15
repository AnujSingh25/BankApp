import SQLite from 'react-native-sqlite-storage'
import { AppDispatch } from '../store'
import { addExpense } from '../store/slices/expenseSlice'
import { Expense } from '../types/expense'

const db = SQLite.openDatabase({ name: 'expenses.db', location: 'default' }, () => { }, error => console.error(error))

export const createTable = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL,
        category TEXT,
        notes TEXT,
        date TEXT,
        type TEXT,
        source TEXT
      )`
        )
    })
}

export const insertExpense = (expense: Expense) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO expenses (id, amount, category, notes, date, type, source) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [expense.id, expense.amount, expense.category, expense.notes, expense.date, expense.type, expense.source]
        )
    })
}

export const getAllExpenses = (dispatch: AppDispatch) => {
    db.transaction(tx => {
        tx.executeSql('SELECT * FROM expenses', [], (tx, results) => {
            const rows = results.rows
            for (let i = 0; i < rows.length; i++) {
                dispatch(addExpense(rows.item(i) as Expense))
            }
        })
    })
}

export const fetchAllExpenses = (): Promise<Expense[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM expenses ORDER BY date DESC',
                [],
                (tx, results) => {
                    const rows = results.rows
                    const expenses: Expense[] = []
                    for (let i = 0; i < rows.length; i++) {
                        expenses.push(rows.item(i) as Expense)
                    }
                    resolve(expenses)
                },
                (_, error) => {
                    reject(error)
                    return false
                }
            )
        })
    })
}

export const getLastFiveExpenses = (): Promise<Expense[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM expenses ORDER BY date DESC LIMIT 5',
                [],
                (tx, results) => {
                    const rows = results.rows
                    const expenses: Expense[] = []
                    for (let i = 0; i < rows.length; i++) {
                        expenses.push(rows.item(i) as Expense)
                    }
                    resolve(expenses)
                },
                (_, error) => {
                    reject(error)
                    return false
                }
            )
        })
    })
}

export const deleteExpense = (id: string) => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM expenses WHERE id = ?', [id])
    })
}

export const clearAllExpenses = () => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM expenses')
    })
}

export default db
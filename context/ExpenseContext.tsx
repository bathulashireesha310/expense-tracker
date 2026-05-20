import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPENSE_KEY = '@expense_tracker_persistent_data';
const BUDGET_KEY = '@expense_tracker_budget_limit';

export interface Expense {
  id: string;
  title: string;
  amount: string; 
  category: string;
  date: string;
  paymentMethod: 'UPI' | 'Cash' | 'Card'; // New tracked parameter
}

interface ExpenseContextType {
  expenses: Expense[];
  budgetLimit: number; 
  currency: string;
  addExpense: (title: string, amount: string, category: string, paymentMethod: 'UPI' | 'Cash' | 'Card') => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  updateBudgetLimit: (limit: number) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetLimit, setBudgetLimit] = useState<number>(50000); 
  const currency = '₹'; 

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem(EXPENSE_KEY);
        const storedBudget = await AsyncStorage.getItem(BUDGET_KEY);

        if (storedExpenses !== null) setExpenses(JSON.parse(storedExpenses));
        if (storedBudget !== null) setBudgetLimit(parseFloat(storedBudget));
      } catch (error) {
        console.error("Error fetching storage parameters:", error);
      }
    };
    loadSavedData();
  }, []);

  const addExpense = async (title: string, amount: string, category: string, paymentMethod: 'UPI' | 'Cash' | 'Card') => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      title,
      amount, 
      category,
      date: new Date().toLocaleDateString(),
      paymentMethod,
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    try {
      await AsyncStorage.setItem(EXPENSE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to compile item insert:", error);
    }
  };

  const deleteExpense = async (id: string) => {
    const filtered = expenses.filter(item => item.id !== id);
    setExpenses(filtered);
    try {
      await AsyncStorage.setItem(EXPENSE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to dismiss record row:", error);
    }
  };

  const clearAllData = async () => {
    setExpenses([]);
    try {
      await AsyncStorage.removeItem(EXPENSE_KEY);
    } catch (error) {
      console.error("Error flushing expense array logs:", error);
    }
  };

  const updateBudgetLimit = async (limit: number) => {
    setBudgetLimit(limit);
    try {
      await AsyncStorage.setItem(BUDGET_KEY, limit.toString());
    } catch (error) {
      console.error("Error locking in budget changes:", error);
    }
  };

  return (
    <ExpenseContext.Provider value={{ 
      expenses, budgetLimit, currency, 
      addExpense, deleteExpense, clearAllData, updateBudgetLimit 
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be wrapped within an ExpenseProvider architecture');
  }
  return context;
}
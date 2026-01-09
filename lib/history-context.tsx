import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  title: string;
  products: Array<{
    label: string;
    price: number;
    weight: number;
    pricePerGram: number;
  }>;
  cheapestLabel: string;
}

interface HistoryContextType {
  history: HistoryEntry[];
  saveEntry: (entry: Omit<HistoryEntry, "id" | "timestamp">) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  loadHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = "@gram_price_history";
const MAX_HISTORY = 100;

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // 履歴を読み込む
  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  // 履歴を保存
  const saveEntry = async (
    entry: Omit<HistoryEntry, "id" | "timestamp">
  ) => {
    try {
      const newEntry: HistoryEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };

      const updated = [newEntry, ...history].slice(0, MAX_HISTORY);
      setHistory(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  // 履歴を削除
  const deleteEntry = async (id: string) => {
    try {
      const updated = history.filter((entry) => entry.id !== id);
      setHistory(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to delete history:", error);
    }
  };

  // 初期化時に履歴を読み込む
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <HistoryContext.Provider
      value={{
        history,
        saveEntry,
        deleteEntry,
        loadHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within HistoryProvider");
  }
  return context;
}

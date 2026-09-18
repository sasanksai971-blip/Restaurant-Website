import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderType, Store } from '../types';

interface OrderFlowState {
  orderingMode: OrderType;
  selectedStore: Store | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  tableGuests: number;
  setOrderingMode: (mode: OrderType) => void;
  setSelectedStore: (store: Store | null) => void;
  setSchedule: (date: string, time: string) => void;
  setTableGuests: (count: number) => void;
  clearSchedule: () => void;
}

export const useOrderStore = create<OrderFlowState>()(
  persist(
    (set) => ({
      orderingMode: 'delivery',
      selectedStore: null,
      scheduledDate: null,
      scheduledTime: null,
      tableGuests: 2,
      setOrderingMode: (mode) => set({ orderingMode: mode }),
      setSelectedStore: (store) => set({ selectedStore: store }),
      setSchedule: (date, time) =>
        set({ scheduledDate: date, scheduledTime: time, orderingMode: 'scheduled' }),
      setTableGuests: (guests) => set({ tableGuests: guests }),
      clearSchedule: () => set({ scheduledDate: null, scheduledTime: null }),
    }),
    {
      name: 'order-flow-storage',
    }
  )
);

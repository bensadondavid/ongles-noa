import { create } from "zustand"
import { persist } from 'zustand/middleware'

type Prestation = {
  name: string
  price: number
}

type BookingOption = {
  name: string
  price: number
}

type BookingStore = {
  prestation: Prestation | null
  setPrestation: (prestation: Prestation) => void
  options: BookingOption[]
  setOptions: (options: BookingOption[])=> void
  toggleOption: (option: BookingOption) => void
  date: string | null
  setDate: (date: string | null) => void
  time: string | null, 
  setTime: (time: string | null) => void
}

export const useBookingStore = create<BookingStore>()(
    persist(
        (set) => ({
            prestation: null,
            setPrestation: (prestation) => set({ prestation }),
            options: [],
            setOptions: (options)=>set({ options }),
            date: null,
            setDate: (date)=>set({ date }),
            time: null, 
            setTime: (time)=>set({ time }),
            toggleOption: (option) =>
              set((state) => {
                const exists = state.options.some((o) => o.name === option.name)
                if (exists) {
                  return {
                    options: state.options.filter((o) => o.name !== option.name),
                  }
                }
                return {
                  options: [...state.options, option],
                }
              })
            }),
            {name: 'booking-storage'}
        )
    )
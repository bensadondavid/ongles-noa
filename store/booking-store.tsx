import { create } from "zustand"
import { persist } from 'zustand/middleware'

export type BookingPrestation = {
  name: string
  price: number
}

export type BookingOption = {
  name: string
  price: number
}

type BookingStore = {
  prestations: BookingPrestation[]
  setPrestations: (prestations: BookingPrestation[]) => void
  togglePrestation: (prestation: BookingPrestation) => void
  options: BookingOption[]
  setOptions: (options: BookingOption[])=> void
  toggleOption: (option: BookingOption) => void
  date: string | null
  setDate: (date: string | null) => void
  time: string | null, 
  setTime: (time: string | null) => void
  message : string | null
  setMessage: (message: string | null)=>void
}

export const useBookingStore = create<BookingStore>()(
    persist(
        (set) => ({
            prestations: [],
            setPrestations: (prestations) => set({ prestations }),
            options: [],
            setOptions: (options)=>set({ options }),
            date: null,
            setDate: (date)=>set({ date }),
            time: null, 
            setTime: (time)=>set({ time }),
            message: null,
            setMessage: (message)=>set({ message }),
            togglePrestation: (prestation) =>
              set((state) => {
                const exists = state.prestations.some((p) => p.name === prestation.name)
                if (exists) {
                  return {
                    prestations: state.prestations.filter((p) => p.name !== prestation.name),
                  }
                }
                return {
                  prestations: [...state.prestations, prestation],
                }
              }),
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
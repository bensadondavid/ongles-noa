import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState : string[] = []

const prestationsSlice = createSlice({
    name : 'prestations',
    initialState,
    reducers : {
        addPrestation : (state, action: PayloadAction<string>)=>{
           const newPrestation = action.payload
           if(state.includes(newPrestation)){
            return state
           }
            state.push(newPrestation)
        },
        deletePrestation : (state, action : PayloadAction<string>)=>{
            return state.filter(presta => presta !== action.payload)
        }
    }
})

export const {addPrestation, deletePrestation} = prestationsSlice.actions
export default prestationsSlice.reducer
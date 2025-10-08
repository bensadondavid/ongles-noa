import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Prestation{
    id : null | string, 
    type : null | string,
    duration : null | number
}

const initialState : Prestation[] = []

const prestationSlice = createSlice({
    name : 'prestation',
    initialState,
    reducers : {
        addPrestation : (state, action: PayloadAction<Prestation>)=>{
           const newPrestation = action.payload
            state.push(newPrestation)
        },
        deletePrestation : (state, action : PayloadAction<Prestation>)=>{
            return state.filter(presta => presta.id !== action.payload.id)
        }
    }
})

export const {addPrestation, deletePrestation} = prestationSlice.actions
export default prestationSlice.reducer
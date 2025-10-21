import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState : string[] = []

const optionsSlice = createSlice({
    name : 'options',
    initialState,
    reducers : {
        addOption : (state, action: PayloadAction<string>)=>{
           const newOption = action.payload
           if(state.includes(newOption)){
            return state
           }
            state.push(newOption)
        },
        deleteOption : (state, action : PayloadAction<string>)=>{
            return state.filter(opt => opt !== action.payload)
        }
    }
})

export const {addOption, deleteOption} = optionsSlice.actions
export default optionsSlice.reducer
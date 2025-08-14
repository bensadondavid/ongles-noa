import { createSlice } from "@reduxjs/toolkit";

const initialState = 'french'

const languageSlice = createSlice({
    name : 'languageSlice',
    initialState : initialState,
    reducers : {
        changeLanguage : (state, action)=>{
           return state = action.payload
        }
    }
})

export const { changeLanguage } = languageSlice.actions
export default languageSlice.reducer
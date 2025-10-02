import { createSlice } from "@reduxjs/toolkit";

interface User{
    id : string | null, 
    name : string | null
    email : string | null,
    connected : boolean
}

const initialState: User = {
  id: null,
  name : null,
  email: null,
  connected : false
};


const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        addUser : (state, action)=>{
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.connected = true
        },
        clearUser : ()=>{
            return initialState
        }
    }
})

export const { addUser, clearUser } = userSlice.actions
export default userSlice.reducer
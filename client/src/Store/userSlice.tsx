import { createSlice } from "@reduxjs/toolkit";

interface User{
    id : string | null, 
    email : string | null,
    accessToken : string | null
}

const initialState: User = {
  id: null,
  email: null,
  accessToken: null,
};


const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        addUser : (state, action)=>{
            return { ...action.payload}
        },
        clearUser : ()=>{
            return {
                id: null,
                email: null,
                accessToken: null,
            };
        }
    }
})

export const { addUser, clearUser } = userSlice.actions
export default userSlice.reducer
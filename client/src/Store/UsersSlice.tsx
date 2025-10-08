import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User{
    id : string | null, 
    lastName : string | null
    name : string | null
    email : string | null,
}

const initialState: User = {
  id: null,
  lastName : null,
  name : null,
  email: null,
};


const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        addUser : (state, action : PayloadAction<User>)=>{
            state.id = action.payload.id;
            state.lastName = action.payload.lastName;
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
        clearUser : ()=>{
            return initialState
        }
    }
})

export const { addUser, clearUser } = userSlice.actions
export default userSlice.reducer
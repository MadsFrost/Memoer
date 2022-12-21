import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types/user';

interface ClientState {
  user?: User;
  isMenuOpen: boolean;
  notification?: 'today' | 'tomorrow' | 'week' | 'never';
}

const user = localStorage.getItem('user');
const menu = localStorage.getItem('menu');

const initialState: ClientState = {
  user: user ? JSON.parse(user) : undefined,
  isMenuOpen: menu ? menu === 'open' : false
}

export const clientSlice = createSlice({
  name: 'client',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setClient: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    setMenu: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload
        if (action.payload) {
            localStorage.setItem('menu', 'open')
        } else {
            localStorage.setItem('menu', 'closed')
        }
    }
  },
})

export const { setClient, setMenu } = clientSlice.actions


export default clientSlice.reducer
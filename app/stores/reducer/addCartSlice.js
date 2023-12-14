'use client';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    carts: [],
    isLoading: false,
    error: null
}

const addCartSlice = createSlice({
    name: 'addCart',
    initialState,
    reducers: {
        addCart: (state, action) => {
            state.carts.push(...action.payload)
        },
        clearCart: (state) => {
            state.carts = []
        }
    }
})

export const { addCart, clearCart } = addCartSlice.actions;
export default addCartSlice;
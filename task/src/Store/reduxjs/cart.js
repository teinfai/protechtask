// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const cartSlice = createSlice({
    name: "cart", // Name of the slice
    initialState: {
        value: [], // Initial state with a "value" field
    },
    reducers: {
        UpdateCart: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Extract the action creators from the counterSlice
export const { UpdateCart } = cartSlice.actions;

// Export the reducer function from the counterSlice
export default cartSlice.reducer;

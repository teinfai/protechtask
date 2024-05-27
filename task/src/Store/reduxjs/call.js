// features/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice using createSlice from Redux Toolkit
const callSlice = createSlice({
    name: "call", // Name of the slice
    initialState: {
        value: false, // Initial state with a "value" field
    },
    reducers: {
        showCall: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Extract the action creators from the counterSlice
export const { showCall } = callSlice.actions;

// Export the reducer function from the counterSlice
export default callSlice.reducer;

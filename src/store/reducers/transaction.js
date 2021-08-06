import { createSlice } from "@reduxjs/toolkit";

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    all: [],
  },
  reducers: {
    addTransaction: (state, action) => {
      state.all.push(action.payload);
    },
    updateTransaction: (state, action) => {
      const { transactionHash, status } = action.payload;
      const tx = state.all.find((t) => t.transactionHash === transactionHash);
      tx && (tx.status = status);
    },
  },
});

export const { addTransaction, updateTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;

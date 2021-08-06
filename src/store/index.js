import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducers/auth";
import transaction from "./reducers/transaction";

export const store = configureStore({
  reducer: {
    auth,
    transaction,
  },
});

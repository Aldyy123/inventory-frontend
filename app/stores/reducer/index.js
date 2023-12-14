'use client';

import { combineReducers } from "redux";
import addOrderSlice from "./addOrderSlice";
import addCartSlice from "./addCartSlice";

export default combineReducers({
  [addOrderSlice.name]: addOrderSlice.reducer,
    [addCartSlice.name]: addCartSlice.reducer
});

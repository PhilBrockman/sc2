import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import upgradeReducer from '../features/upgrade/upgradeSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    upgrade: upgradeReducer,
  },
});
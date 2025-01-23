import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  notificationCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.notificationCount += 1;
      console.log(state.notificationCount)
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.notificationCount = 0;
    },
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

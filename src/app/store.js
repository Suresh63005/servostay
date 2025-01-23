import { configureStore } from '@reduxjs/toolkit'
import notificationReducers from '../features/notification/NotificationSlice'

export const store = configureStore({
  reducer: {
    notifications:notificationReducers
  },
})

export default store;
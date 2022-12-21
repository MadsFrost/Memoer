import { configureStore } from '@reduxjs/toolkit'
import clientSlice from './interface/client/clientSlice'
import todoSlice from './interface/client/todoSlice'
export const store = configureStore({
    reducer: {
        client: clientSlice,
        todo: todoSlice
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

const seedPosts = [
  { id: 'p-101', platform: 'Instagram', status: 'Published', title: 'A quieter kind of momentum', content: 'Small rituals become big habits when the story is worth sharing.', date: '2026-07-21', color: 'coral' },
  { id: 'p-102', platform: 'LinkedIn', status: 'Scheduled', title: 'The craft behind the launch', content: 'A behind-the-scenes look at how our team turns a rough idea into a useful product.', date: '2026-07-23', color: 'blue' },
  { id: 'p-103', platform: 'X', status: 'Draft', title: 'Three signals to watch', content: 'A short field note for people building products in public.', date: '2026-07-26', color: 'gold' },
  { id: 'p-104', platform: 'Threads', status: 'Published', title: 'Make room for the edit', content: 'The strongest version is usually hiding one thoughtful revision away.', date: '2026-07-29', color: 'mint' },
];

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.date.localeCompare(b.date),
});

const initialState = postsAdapter.getInitialState({
  loading: 'idle',
  error: null,
  lastSynced: null,
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  await new Promise((resolve) => setTimeout(resolve, 650));
  return seedPosts;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: postsAdapter.addOne,
    updatePost: postsAdapter.updateOne,
    deletePost: postsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.lastSynced = new Date().toISOString();
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Could not load posts.';
      });
  },
});

export const { addPost, updatePost, deletePost } = postsSlice.actions;
export const { selectAll: selectAllPosts, selectById: selectPostById } = postsAdapter.getSelectors((state) => state.posts);
export const selectPostStatus = (state) => state.posts.loading;
export const selectPostError = (state) => state.posts.error;
export const selectPostMetrics = createSelector([selectAllPosts], (posts) => ({
  total: posts.length,
  scheduled: posts.filter((post) => post.status === 'Scheduled').length,
  published: posts.filter((post) => post.status === 'Published').length,
  drafts: posts.filter((post) => post.status === 'Draft').length,
}));
export const selectUpcomingPosts = createSelector([selectAllPosts], (posts) => posts.filter((post) => post.status !== 'Published').slice(0, 3));

export default postsSlice.reducer;

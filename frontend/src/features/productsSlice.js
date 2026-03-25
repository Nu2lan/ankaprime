import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/products', { params })
        return data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch products')
    }
})

export const fetchFeatured = createAsyncThunk('products/featured', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/products/featured')
        return data.products
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured')
    }
})

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        featured: [],
        pagination: { page: 1, pages: 1, total: 0 },
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.loading = true })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.products;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })
            .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload })
    },
})

export default productsSlice.reducer

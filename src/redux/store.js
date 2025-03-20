import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './editorSlice';
import currencyReducer from '../layouts/layout01/store/slices/currency-slice';
import compareReducer from '../layouts/layout01/store/slices/compare-slice';
import cartReducer from '../layouts/layout01/store/slices/cart-slice';
import wishlistReducer from '../layouts/layout01/store/slices/wishlist-slice';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    currency: currencyReducer,
    compare: compareReducer,
    cart: cartReducer,
    wishlist: wishlistReducer
  },
});

export default store;
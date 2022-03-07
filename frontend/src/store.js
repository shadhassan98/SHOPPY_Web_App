import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  newProductReducer,
  newReviewReducer,
  productDetailreducer,
  productReducer,
  productReviewsReducer,
  productsReducer,
} from "./reducers/productReducer";
import {
  allUsersReducer,
  profileReducer,
  userReducer,
} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { myOrdersReducer, newOrderReducer } from "./reducers/orderReducer";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailreducer,
  user: userReducer,
  profile: profileReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducer,
  product: productReducer,
  allUsers: allUsersReducer,
  productReviews: productReviewsReducer,
});

const middleware = [thunk];

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: {},
  },
};

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

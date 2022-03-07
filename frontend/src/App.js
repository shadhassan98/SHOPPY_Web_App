import "./App.css";
import Sidebar from "./component/Admin/Sidebar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./component/layout/Header/header";
import Footer from "./component/layout/Footer/footer";
import Products from "./component/Product/Products";
import Home from "./component/Home/Home";
import store from "./store";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductDetails from "./component/Product/ProductDetails";
import WebFont from "webfontloader";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/userOptions";
import Profile from "./component/User/Profile";
import LoginSignUp from "./component/User/loginSignUp";
import Cart from "./component/Cart/Cart";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import OrderList from "./component/Admin/OrderList";
import UsersList from "./component/Admin/UsersList";
import NotFound from "./component/layout/Not Found/NotFound";
import { useSelector } from "react-redux";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import Dashboard from "./component/Admin/Dashboard";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products/:keyword" component={Products} />

        <Route exact path="/login" component={LoginSignUp} />
        <Route exact path="/cart" component={Cart} />

        <ProtectedRoute exact path="/success" component={OrderSuccess} />
        <ProtectedRoute exact path="/orders" component={MyOrders} />
        <ProtectedRoute exact path="/account" component={Profile} />

        <ProtectedRoute
          exact
          path="/admin/dashboard"
          isAdmin={true}
          component={Dashboard}
        />

        <ProtectedRoute
          exact
          path="/admin/products"
          isAdmin={true}
          component={ProductList}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/product"
          component={NewProduct}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/orders"
          component={OrderList}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/users"
          component={UsersList}
        />

        <Route
          component={
            window.location.pathname === "/process/payment" ? null : (
              <NotFound />
            )
          }
        />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;

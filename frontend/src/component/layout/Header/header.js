import React, { useState, Fragment } from "react";
import "./header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";

const Header = () => {
  const [keyword, setKeyword] = useState("");

  const history = useHistory();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/products/${keyword}`);
    } else {
      history.push("/products");
    }
  };

  return (
    <div className="topnav">
      <div className="left">
        <a className="active" href="/">
          Home
        </a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="/products">All Products</a>
      </div>
      <div className="right">
        <a href="#myorders">My Orders</a>
        <a href="/login">Login</a>
        <a href="/cart">My Cart</a>
      </div>
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search.."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default Header;

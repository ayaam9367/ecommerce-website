import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom"
import WebFont from "webfontloader";
import React from "react";
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import Home from "./component/Home/Home.js"; 
import Loader from './component/layout/Loader/Loader.js';
import ProductDetails from './component/Product/ProductDetails.js'
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'

function App() {
  React.useEffect(()=> {
    WebFont.load({
      google : {
        families : ["Roboto", "Droid Sans", "Chilank"], 
      },
    });
  }, []);
  return (
  <Router>
    <Header />
    <Route exact path = "/" component = {Home} />
    <Route exact path = "/product/:id" component = {ProductDetails} />
    <Route exact path = "/products" component = {Products} />
    <Route exact path = "/search" component = {Search} />
    <Footer />
  </Router> 
  );
}

export default App;

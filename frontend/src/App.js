import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom"
import WebFont from "webfontloader";
import React from "react";
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import Home from "./component/Home/Home.js"; 
import Loader from './component/layout/Loader/Loader.js';

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
    <Footer />
  </Router> 
  );
}

export default App;

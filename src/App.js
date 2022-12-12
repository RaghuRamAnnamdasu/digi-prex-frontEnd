import logo from './logo.svg';
import './App.css';
import { Login } from './Login';
import { SignUp } from './Signup';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { BookingOrder } from './BookingOrder';
import { useEffect, useState } from 'react';
import { API } from './global';

function App() {

  var userDetails = localStorage.getItem("user");
  userDetails = userDetails && JSON.parse(userDetails);


  const [cart,setCart] = useState([]);
  const [cartItems, setCartItems] = useState(userDetails.cart);


  useEffect(()=>{
    addItemsToCart(cartItems);
  },[cartItems]);

    useEffect(()=>{
      window.addEventListener("beforeunload", function (event) {
        sendNotification();
      })
    },[]);

  async function addItemsToCart(data){
    const addDataToCart = await fetch(`${API}/items/updateCartItem/${userDetails.userId}`,{
        method: "PUT",
        body: JSON.stringify(data),
        headers: {"content-type": "application/json"}
    });
    const result = await addDataToCart.json();
  }

  

  async function sendNotification(){
    await fetch(`${API}/items/sendNotification/${userDetails?.email}`).then((data)=>data.json());
}

  return (
    <div className="App">
      <Routes>
        <Route path = "/" element = {<Login/>} />
        <Route path = "/login" element = {<Login/>} />
        <Route path = "/signup" element = {<SignUp/>} />
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
        <Route path="/reset-password/:id/:token" element={<ResetPassword />}/>
        <Route path="/home" element={<NavigateHomeComponent cart={cart} setCart={setCart} cartItems={cartItems} setCartItems={setCartItems}/>} addItemsToCart={addItemsToCart}/>
        <Route path="/bookOrder" element={<NavigateBookingOrderComponent cart={cart} setCart={setCart} setCartItems={setCartItems} cartItems={cartItems} addItemsToCart={addItemsToCart}/>}/>
        <Route path="/bookOrder/fromLink" element={<Login />}/>
      </Routes>
    </div>
  );
}

export function NavigateHomeComponent({cart,setCart,cartItems,setCartItems,addItemsToCart}) {
  return (
    localStorage.getItem("user") ? <Home cart={cart} setCart={setCart} cartItems={cartItems} setCartItems={setCartItems} addItemsToCart={addItemsToCart}/> : <Navigate to="/login" />
  );
}

export function NavigateBookingOrderComponent({cart,setCart,setCartItems, cartItems, addItemsToCart}) {
  return (
    localStorage.getItem("user") ? <BookingOrder cart={cart} setCart={setCart} setCartItems={setCartItems} cartItems={cartItems} addItemsToCart={addItemsToCart}/> : <Navigate to="/login" />
  );
}
export default App;

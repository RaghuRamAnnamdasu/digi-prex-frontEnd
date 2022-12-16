import logo from './logo.svg';
import './App.css';
import { Login } from './Login';
import { SignUp } from './Signup';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Home } from './Home';
import { BookingOrder } from './BookingOrder';
import { useEffect, useState } from 'react';
import { API } from './global';

function App() {

  var userDetails = localStorage.getItem("user");
  userDetails = userDetails && JSON.parse(userDetails);


  const [cart,setCart] = useState([]);
  const [cartItems, setCartItems] = useState(userDetails? userDetails.cart : []);


  useEffect(()=>{
    userDetails && addItemsToCart(cartItems);
  },[cartItems]);


  useEffect(()=>{
    window.addEventListener("beforeunload", function (event) {
      // var isReload = window.performance.getEntriesByType('navigation').map((nav) => nav.type);
      // if(!isReload.includes('reload')){
      //   sendNotification();
      // }
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
    await fetch(`${API}/items/sendNotification/${userDetails?.email}/${userDetails?.userId}`).then((data)=>data.json());
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
        <Route path="/bookOrder/fromLink/:userId" element={<RouteTOBookings cart={cart} setCart={setCart} setCartItems={setCartItems} cartItems={cartItems} addItemsToCart={addItemsToCart}/>}/>
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


export function RouteTOBookings({cart,setCart,setCartItems, cartItems, addItemsToCart}){

  const[isLocalStorageSet, updateIsLocalStorageSet] = useState(false);

  const {userId} = useParams();
  async function getUserDetails(){
    let result = await fetch(`${API}/users/getUserDetails/${userId}`).then((data)=>data.json());
    localStorage.setItem("user",JSON.stringify({userName: result.userName, userId : result._id, email: result.email, type: result.type, cart: result.cart}));
    updateIsLocalStorageSet(true);
    setCartItems(result.cart);
  }

  useEffect(()=>{
    getUserDetails();
  },[]);

  return(
    isLocalStorageSet && <BookingOrder cart={cart} setCart={setCart} setCartItems={setCartItems} cartItems={cartItems} addItemsToCart={addItemsToCart}/>
  )
}
export default App;

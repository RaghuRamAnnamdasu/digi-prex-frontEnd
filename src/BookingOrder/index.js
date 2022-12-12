import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { API } from "../global";
import { NavBar } from "../NavBar";
import "./bookingOrder.css";


export function BookingOrder({cart,setCart, setCartItems, cartItems,addItemsToCart, getCart}){

    const navigate = useNavigate();
    const [sumPrice, setSumPrice] = useState(0);

    var userDetails = localStorage.getItem("user");
    userDetails = userDetails && JSON.parse(userDetails);

    useEffect(()=>{
        getCart();
    },[]);
    

    async function getCart(){
        let result = await fetch(`${API}/items/getCart/${userDetails?.userId}`).then((data)=>{
          console.log("data++++++++", data);
          return data.json();
        });
        console.log("result..........",result)
        setCart(result);
    }

    console.log("in cart items", cart);

   
    useEffect(()=>{
        let totalPrice = 0;
        cart.map((value)=>{
            totalPrice = totalPrice + value.cost;
        })
        setSumPrice(totalPrice);
    },[cart]);

    const goToPreviousPage = ()=>{
        navigate("/home");
    }

    const onToken = async (token)=>{
        // console.log("token",token);
        const orderData = {
            userId : userDetails.userId,
            bookedTime : new Date(),
            cartItems : cart,
            totalAmount : sumPrice+50,
            token : token
       }
       const result = await fetch(`${API}/items/bookOrder`,{
            method : "POST",
            body: JSON.stringify(orderData),
            headers: {"content-type": "application/json"}
        }).then((data)=> {
            addItemsToCart([]);
            setCartItems([]);
            navigate("/home");
            return data.json();
        });
    }

    return(
        <div className = "orderBookingContainer">
            <NavBar cart={cart} cartItems={cartItems}/>
            <div className = "ordersEnclosure">
                {
                    cart.length?
                    <>
                        {cart.map((cartItem)=>
                        <div className = "ordersPageItemEnclosure">
                            <img className = "ordersPageItemImage" src = {cartItem.poster} alt ={cartItem.name} />
                            <h2 className = "ordersPageItemName">{cartItem.name}</h2>
                            <h4 className = "ordersPageItemRent">Price : INR {cartItem.cost}</h4>
                        </div>)}
                    </>:
                    <div className = "emptyCartEnclosure">
                        The Cart is Empty. Please select some items.
                    </div>
                }
            </div>
            <div className = "BillingDetailsEnclosure">
                <div className = "cummulativeSumWrapper">Cummulative price of cart items 
                    <span>: INR {sumPrice}
                    </span>
                </div>
                <div className = "deliveryChargeWrapper">
                    Delivery Charges
                    <span> : INR 50</span>
                </div>
                <div className = "totalPriceWrapper">
                    Total Bill Amount
                    <span> : INR {sumPrice+50}</span>
                </div>
            </div>
            <div className = "ordersPageButtonEnclosure">
                <Button variant = "contained" color = "primary" onClick = {goToPreviousPage}>Previous Page</Button>
                <StripeCheckout
                        token={onToken}
                        shippingAddress
                        amount = {(sumPrice+50)*100}
                        currency = "INR"
                        stripeKey="pk_test_51LSahvSIYNroY1eRLubvuTbArLwtZy7HT5kRlMcX58eOavkNideJU57lRVohE0UYLzilN82K2SimiSvlvyockqar00dFxuc0Ti"
                    >
                        <Button variant="contained" color = "primary">Proceed To Payment</Button>
                </StripeCheckout>
                {/* <Button variant = "contained" color = "primary" onClick = {proceedToPayment}>Proceed To Payment</Button> */}
            </div>
        </div>
    );
}
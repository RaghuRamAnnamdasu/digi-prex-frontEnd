import { Button, Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../global";
import { NavBar } from "../NavBar";
import "./home.css";


export function Home({cart,setCart,cartItems,setCartItems,addItemsToCart}){

    const [itemsList, setItemsList] = useState([]);    

    useEffect(()=>{
        getItems();
    },[]);

    var userDetails = localStorage.getItem("user");
    userDetails = userDetails && JSON.parse(userDetails);

    async function getItems(){
        const result = await fetch(`${API}/items/getAllItems`).then((data)=>data.json());
        setItemsList(result);
    }

    return(
        <div className = "home">
            <NavBar cartItems={cartItems} cart={cart}/>
            <div className = "homePage">
                {itemsList.map((value,index)=>{
                    return(<ItemCard itemData={value} key={index} userDetails={userDetails} cartItems={cartItems} setCartItems={setCartItems} addItemsToCart={addItemsToCart}/>);
                })}
            </div>
        </div>
    );
}

function ItemCard({itemData, userDetails, cartItems, setCartItems, addItemsToCart}){
    
    const [isItemAdded, setIsItemAdded] = useState(false);

    

    useEffect(()=>{
        setIsItemAdded(cartItems.includes(itemData._id) ? true : false);
    },[cartItems]);

   
    const navigate = useNavigate();

    const addToCart = ()=>{
        setCartItems([...cartItems,itemData._id]);
        let loggedInUserDetails = JSON.parse(localStorage.getItem("user"));
        loggedInUserDetails.cart = [...cartItems,itemData._id];
        localStorage.setItem("user", JSON.stringify(loggedInUserDetails));
        setIsItemAdded(true);
    }

    const removeFromCart = ()=>{
        let tempData = cartItems.filter((cartItemId) => cartItemId !== itemData._id);
        setCartItems(tempData);
        let loggedInUserDetails = JSON.parse(localStorage.getItem("user"));
        loggedInUserDetails.cart = tempData;
        localStorage.setItem("user", JSON.stringify(loggedInUserDetails));
        setIsItemAdded(false);
    }

    return(
        <Card className = "cardWrapper">
            <img className = "itemImage" src = {itemData.poster} alt ={itemData.name} />
            <CardContent className = "contentWrapper">
                <div className = "content">
                    <h2 className = "itemName">{itemData.name}</h2>
                    <h4 className = "itemRent">Price : INR {itemData.cost}</h4>
                </div>
                <Button variant="outlined" onClick = {isItemAdded ? removeFromCart : addToCart}>{isItemAdded ? "Remove From Cart" : "Add to Cart"}</Button>
            </CardContent>
        </Card>
    );
}
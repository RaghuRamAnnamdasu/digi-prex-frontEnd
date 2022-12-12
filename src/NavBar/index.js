import { Badge, Button, IconButton } from "@mui/material";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";

import "./navbar.css";
import { API } from "../global";

export function NavBar({cartItems,cart}){

    const navigate = useNavigate();
    var userDetails = localStorage.getItem("user");
    userDetails = userDetails && JSON.parse(userDetails);
    

    async function sendNotification(){
        await fetch(`${API}/items/sendNotification/${userDetails?.email}`).then((data)=>data.json());
    }

    const signOut = () => {
        sendNotification();
        localStorage.clear();
        navigate("/login");
    };

    const seeNotifications = ()=>{

    };

    const goToCart = ()=>{
        navigate("/bookOrder");
    };


    return(
        <div className="navbarEnclosure">
            <div className = "userNameInNavbar">Welcome <span>{userDetails?.userName}</span>...!!!!</div>
            {/* <IconButton className = "notificationButton" onClick = {()=>seeNotifications()}>
                <NotificationsIcon />
            </IconButton> */}
            <Badge badgeContent = {cartItems?.length} color = "primary">
                <IconButton className = "cartButton" onClick = {()=>goToCart()}>
                    <ShoppingCartIcon />
                </IconButton>
            </Badge>
            
            <IconButton className = "signOutButton" onClick = {()=>signOut()}>
                <PowerSettingsNewIcon />
            </IconButton>
        </div>
    );
}
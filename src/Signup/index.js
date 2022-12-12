import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../global";

import "../Login/login.css";

export function SignUp() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[userName, setUserName] = useState("");
    const[emailError, setEmailError] = useState("");
    const[passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const onEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const onUserNameChange = (e) => {
        setUserName(e.target.value);
    }

    function isEmailValid() {
        const emailRegexp = new RegExp(
          /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
        );
        if(!emailRegexp.test(email)) {
            setEmailError("Enter a Valid Email Address");
        } else {
            setEmailError("");
        }
    }

    function isPasswordValid() {
         
        if(password.length < 8) {
            const err = "Password should be minimum of 8 characters";
            setPasswordError(err);
        } else {
            setPasswordError("");
        }
    }

    const onSignUp = async (e) => {
        e.preventDefault();
        var data = [{
            email: email,
            password: password,
            userName: userName
        }];
        const result = await fetch(`${API}/users/signup`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"content-type": "application/json"}
            }).then(response => {
                return response.json();
                }).catch (error => {
                    console.log(error)
                    })

        if(result.emailError){
        setEmailError(result.message);
        } else if(result.passwordError){
            setPasswordError(result.message);
        }else {
         navigate("/login");
        }

        
        
    };

    return (
        <div className="signup">
            <form className="signupContent" onSubmit={(e) => onSignUp(e)}>
                <div className="logo">
                    <h3 className="logoText">
                        SIGN UP
                    </h3>
                </div>
                <div className="displayNameWrapper">
                    <label htmlFor="display">User Name</label>
                    <input id="display" type="text" onChange={(e) => onUserNameChange(e)} required/>
                </div>
                <div className="emailWrapper">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" onChange={(e) => onEmailChange(e)} onBlur={isEmailValid} className={emailError ? "redBorderInput" : ""} required/>
                    <div className="emailError">{emailError}</div>
                </div>
                <div className="passwordWrapper">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" onChange={(e) => onPasswordChange(e)} onBlur={isPasswordValid} className={passwordError ? "redBorderInput" : ""} required/>
                    <div className="passwordError">{passwordError}</div>
                </div>
                <Button type="submit" variant="contained">Sign up</Button>
                <div className="accountExists">Already have an account? <span onClick={() => navigate("/login")}>&nbsp;Login</span></div>
            </form>
            {/* <div className="signUpRightWrapper">
                <div>
                    <h2>Sign Up</h2>
                    <div>We do not share your details with anyone</div>
                </div>
                <div className="portalDescription">"The ultimate guide to choosing the best online training platforms for Web Development"</div>
            </div> */}
      </div>
    );
}
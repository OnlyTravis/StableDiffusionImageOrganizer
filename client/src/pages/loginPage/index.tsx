import { ChangeEvent, FC, useEffect, useState } from "react";
import axios from "axios";

import InputContainer from "../../components/InputContainer";
import TextButton from "../../components/TextButton";
import { useNavigate } from "react-router-dom";

import m_styles from "./mobile.module.css"

const LoginPage:FC = () => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/is_loggedIn").then((responce) => {
            if (responce.data.logged_in) {
                navigate("/home");
            }
        });
    }, [])

    const button_handleLogin = async () => {
        if (username === "") {
            setErrorMessage("Please Enter a valid username");
            return;
        }
        if (password === "") {
            setErrorMessage("Please Enter a valid password");
            return
        }

        await axios.post("/login", {
            username,
            password
        }).then((responce) => {
            if (responce.data.status === "failed") {
                setErrorMessage(responce.data.message);
            } else {
                navigate("/home");
            }
        }).catch((err) => {
            setErrorMessage(`${err}`);
        });
    }

    return (
        <div className={m_styles.main_page}>
            <div className={m_styles.login_container}>
                <div className={m_styles.welcome_text}>SD_UI Login</div>
                <input type="text" placeholder="Username" onChange={(e: ChangeEvent) => setUsername((e.target as HTMLInputElement).value)} />
                <br />
                <input type="text" placeholder="Password" onChange={(e: ChangeEvent) => setPassword((e.target as HTMLInputElement).value)} />
                <br />
                <TextButton className={m_styles.login_button} onClick={button_handleLogin}>Login</TextButton>
                <br />
                { errorMessage?<div className={m_styles.error_message}>* { errorMessage }</div>:<></> }
            </div>
            <div className={m_styles.background}></div>
        </div>
    );
}

export default LoginPage;
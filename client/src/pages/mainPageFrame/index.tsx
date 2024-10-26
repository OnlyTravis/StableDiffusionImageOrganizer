import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import m_styles from "./mobile.module.css"
import ImageButton from "../../components/ImageButton";
import PageList from "./list";

interface MainPageFrameProp {
    children?: JSX.Element | JSX.Element[],
    className?: string,
}

const MainPageFrame:FC<MainPageFrameProp> = ({ children, className }: MainPageFrameProp) => {
    const [ toggleSideBar, setToggleSideBar ] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get("/is_loggedIn").then((responce) => {
            if (!responce.data.logged_in) {
                navigate("/login");
            }
        });
    }, []);

    const button_toggleSideBar = () => {
        setToggleSideBar(!toggleSideBar);
    }

    return (
        <div className={m_styles.main_page}>
            <div className={m_styles.top_bar}>
                <img src="/images/logo.png" alt="/images/logo.png"/>
                <div className={m_styles.title}>SD-UI</div>
                <ImageButton className={m_styles.sidebar_button} src="/images/menu.png" onClick={button_toggleSideBar}/>
            </div>
            { toggleSideBar? 
            <div className={m_styles.side_menu_container} hidden={!toggleSideBar}>
                <div className={m_styles.side_menu}>
                    <ImageButton className={m_styles.close_side_menu_button} src="/images/cross.png" onClick={button_toggleSideBar}/>
                    <PageList />
                </div>
                <div className={m_styles.side_menu_backdrop} onClick={button_toggleSideBar}></div>
            </div>
            :<></>}
            <div className={`${m_styles.main_container} ${className}`}>
                { children }
            </div>
        </div>
    );
}

export default MainPageFrame;
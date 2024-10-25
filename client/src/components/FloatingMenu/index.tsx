import { FC, MouseEventHandler } from "react";

import styles from "./index.module.css";

interface FloatingMenuProp {
    title?: string,
    children?: JSX.Element | JSX.Element[] | string,
    className?: string,
    onclose?: MouseEventHandler,
}
const FloatingMenu:FC<FloatingMenuProp> = ({ title="", children="", className="", onclose=()=>{} }) => {
    return (
        <div className={`${styles.floating_menu_container} ${className}`}>
            <div className={styles.floating_menu_top_bar}>
                <div className={styles.floating_menu_title}>{ title }</div>
                <button className={styles.close_button} onClick={onclose}>X</button>
            </div>
            <div className={styles.floating_menu}>{ children }</div>
        </div>
    );
}

export default FloatingMenu;
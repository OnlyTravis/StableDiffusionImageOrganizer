import { FC, ReactElement } from 'react';
import styles from './index.module.css';

interface TextButtonProp {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    className?: string,
    animation?: string,
    children?: string|ReactElement
}
// animation: "", expand, brighten, darken

const TextButton:FC<TextButtonProp> = ({onClick, className="", animation="", children}: TextButtonProp) => {
    return (
        <button onClick={onClick} className={ `${styles.text_button} ${className} ${animation?styles[animation]:""}` }>{ children }</button>  
    );
}

export default TextButton;
import { FC } from 'react';
import styles from './input_container.module.css';

interface InputContainerProp {
    label: string,
    type: string,
    id?: string,
    onchange?: any,
    className?: string,
    defaultValue?: any,
    placeholder?: any
}

const InputContainer:FC<InputContainerProp> = ({ label, type, id, className="", defaultValue="", placeholder="", onchange=()=>{}}: InputContainerProp) => {
    return (
        <div className={styles.input_container+className}>
            <label>{label}</label>
            <input type={type} id={id} defaultValue={defaultValue} placeholder={placeholder} onChange={onchange}/>
        </div>
    );
}
export default InputContainer;
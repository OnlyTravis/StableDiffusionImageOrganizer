import { FC } from "react";

import FloatingMenu from "../../../components/FloatingMenu";
import InputContainer from "../../../components/InputContainer";

import styles from "./createFolderMenu.module.css";

interface createFolderMenuProp {
    className?: string
    onclose: Function
}
const CreateFolderMenu:FC<createFolderMenuProp> = ({ className="", onclose }) => {
    return (
        <FloatingMenu className={className} onclose={() => { onclose(""); }} title="Create New Folder">
            <InputContainer label="Folder Name" type="text"/>
            <InputContainer label="Use Image Prefix?" type="checkbox" />
            <InputContainer label="Image Prefix" type="text"/>
            <button className={styles.create_button}>Create</button>
        </FloatingMenu>
    );
}

export default CreateFolderMenu;
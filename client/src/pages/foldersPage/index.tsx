import { FC, useEffect, useState } from "react";
import axios from "axios";

import MainPageFrame from "../mainPageFrame";
import InputContainer from "../../components/InputContainer";
import ImageButton from "../../components/ImageButton";
import m_styles from "./mobile.module.css";
import FloatingMenu from "../../components/FloatingMenu";
import CreateFolderMenu from "./menu/createFolderMenu";

// Folder
interface FolderProp {
    folder_name: string,
    folder_path: string,
    disabled: boolean,
}
const Folder:FC<FolderProp> = ({ folder_name, folder_path }: FolderProp, disabled) => {
    return (
        <div className={m_styles.folder_container}>
            <a href={`/folder${folder_path}`} className={disabled?"disabled":""}>
                <img className={m_styles.folder_icon} src="/images/folder.png" alt="/images/folder.png"/>
            </a>
            <div className={m_styles.folder_name}>{ folder_name }</div>
        </div>
    )
}

// Main Page
const FoldersPage:FC = () => {
    const [ foldersList, setFolderList ] = useState([]);
    const [ toggleEditMode, setToggleEditMode ] = useState(false);
    const [ floatingMenu, setFloatingMenu ] = useState("");

    useEffect(() => {
        axios.get("/folder_list").then((response) => {
            setFolderList(response.data);
        });
    }, []);

    const renderFloatingMenu = (menu: string) => {
        switch (menu) {
            case "CREATE_FOLDER":
                return <CreateFolderMenu className={m_styles.floating_menu} onclose={setFloatingMenu} />;
            default: 
                return <></>;
        }
    }

    return (
        <MainPageFrame className={m_styles.main_page}>
            <>
            { foldersList.map((folder) => Folder(folder, toggleEditMode)) }

            {toggleEditMode?<ImageButton className={m_styles.create_folder_button} animation="expand" src="/images/plus.png" onClick={() => {setFloatingMenu("CREATE_FOLDER")}}/>:<></>}

            <ImageButton className={m_styles.toggle_edit_button} animation="expand" src="/images/edit.png" onClick={() => {setToggleEditMode(!toggleEditMode)}}/>

            {floatingMenu?
            <div className={m_styles.floating_menu_container}>
                { renderFloatingMenu(floatingMenu) }
                <div className={m_styles.floating_menu_backdrop} onClick={() => {setFloatingMenu("");}}></div>
            </div>
            :<></>}
            </>
        </MainPageFrame>
    );
}

export default FoldersPage;
import { FC, useEffect, useState } from "react";
import MainPageFrame from "../mainPageFrame";

import m_styles from "./mobile.module.css"
import axios from "axios";

interface FolderProp {
    folder_name: string,
    folder_path: string,
}
const Folder:FC<FolderProp> = ({ folder_name, folder_path }: FolderProp) => {
    return (
        <div className={m_styles.folder_container}>
            <a href={`/folder/${folder_path}`}>
                <img className={m_styles.folder_icon} src="/images/folder.png" alt="/images/folder.png"/>
            </a>
            <div className={m_styles.folder_name}>{ folder_name }</div>
        </div>
    )
}

const FoldersPage:FC = () => {
    const [ foldersList, setFolderList ] = useState([]);

    useEffect(() => {
        axios.get("/folder_list").then((response) => {
            setFolderList(response.data);
        });
    }, []);

    return (
        <MainPageFrame className={m_styles.main_page}>
            <>{ foldersList.map((folder) => Folder(folder)) }</>
        </MainPageFrame>
    );
}

export default FoldersPage;
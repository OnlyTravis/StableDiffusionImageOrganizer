import { FC, MouseEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import MainPageFrame from "../mainPageFrame";
import InputContainer from "../../components/InputContainer";
import ImageButton from "../../components/ImageButton";
import m_styles from "./mobile.module.css";

// Folder Icon
interface FolderResponse {
    folder_name: string,
    image_count: number
}
interface FolderProp {
    folder_name: string,
    image_count?: number,
    edit_mode: boolean,
}

// Main Page
const FoldersPage:FC = () => {
    const [ foldersList, setFolderList ] = useState<FolderResponse[]>([]);
    const [ toggleEditMode, setToggleEditMode ] = useState(false);
    const [ selectedItems, setSelectedItems ] = useState<string[]>([]);

    const updateFolder = () => {
        axios.get("/folder_list").then((response) => {
            setFolderList(response.data);
        });
    }

    const button_selectFolder = (e: MouseEvent) => {
        const folder_name = (e.target as HTMLElement).id;

        if (selectedItems.findIndex((selected) => selected === folder_name) === -1) {
            setSelectedItems([...selectedItems, folder_name]);
        } else {
            setSelectedItems(selectedItems.filter((selected) => selected !== folder_name));
        }
    }

    const button_toggleEditMode = () => {
        if (toggleEditMode) {
            setSelectedItems([]);
        }
        setToggleEditMode(!toggleEditMode);
    }

    const button_createFolder = () => {
        axios.post("/create_folder").then((response) => {
            updateFolder();
        });
    }

    const button_renameFolder = () => {
        const new_name = window.prompt(`Rename Folder "${selectedItems[0]}" to :`);

        if (!new_name) return;
        if (foldersList.findIndex((folder) => folder.folder_name === new_name) !== -1) {
            window.alert("A folder with that name already exists.");
            return;
        }

        axios.post("/rename_folder", {
            from: selectedItems[0],
            to: new_name
        }).then((response) => {
            setSelectedItems([]);
            updateFolder();
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                window.alert(err.response.data.message);
            } else {
                window.alert(err);
            }
        });
    }

    const button_deleteFolder = () => {
        const confirmation = window.confirm(`Are you sure you want delete the folder/s :\n ${selectedItems.join('\n')}?`)
        if (!confirmation) return;

        axios.post("/delete_folder", {
            folders: selectedItems,
        }).then((response) => {
            setSelectedItems([]);
            updateFolder();
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                window.alert(err.response.data.message);
            } else {
                window.alert(err);
            }
        })
    }

    const ToolBar:FC = () => {
        return (
            <div className={m_styles.toolbar}>
                <ImageButton className={m_styles.tool} animation="brighten" tooltip="Create Folder" src="/images/add_folder.png" onClick={ button_createFolder }/>
                {selectedItems.length == 1?
                <ImageButton className={m_styles.tool} animation="brighten" tooltip="Rename Folder" src="/images/rename.png" onClick={ button_renameFolder }/>
                :<></>}
                {selectedItems.length > 0?
                <ImageButton className={m_styles.tool} animation="brighten" tooltip="Delete Folder" src="/images/delete.png" onClick={ button_deleteFolder }/>
                :<></>}
            </div>
        );
    }

    const Folder:FC<FolderProp> = ({ folder_name, image_count=0, edit_mode }: FolderProp) => {
        const selected = selectedItems.findIndex((selected) => selected === folder_name) !== -1;
        return (
            <div className={`${m_styles.folder_container} ${selected?m_styles.selected:""}`}>
                {edit_mode?
                <button onClick={button_selectFolder} id={folder_name}>
                    <img className={m_styles.folder_icon} id={folder_name} src="/images/folder.png" alt="/images/folder.png"/>
                </button>
                :
                <a href={`/folder/${folder_name}`}>
                    <img className={m_styles.folder_icon} src="/images/folder.png" alt="/images/folder.png"/>
                </a>
                }
                <div className={m_styles.folder_name}>{ folder_name }</div>
                {edit_mode?
                <input type="checkbox" checked={selected} className={m_styles.selected_icon} />
                :<></>}
            </div>
        )
    }

    useEffect(() => {
        updateFolder();
    }, []);

    return (
        <MainPageFrame>
            {toggleEditMode?
            <ToolBar />
            :<></>}

            <div className={m_styles.main_page}>
                { foldersList.map((folder) => <Folder folder_name={folder.folder_name} edit_mode={toggleEditMode}/>) }
                <ImageButton className={m_styles.toggle_edit_button} animation="expand" src="/images/edit.png" onClick={button_toggleEditMode}/>
            </div>
        </MainPageFrame>
    );
}

export default FoldersPage;
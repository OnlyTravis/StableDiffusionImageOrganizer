import { FC, MouseEvent, useEffect, useState } from "react";
import axios from "axios";

import MainPageFrame from "../mainPageFrame";
import ImageButton from "../../components/ImageButton";

import m_styles from "./mobile.module.css"

interface ImageIconProp {
    image_name: string,
    edit_mode: boolean,
}

const FolderPage:FC = () => {
    const folder_name = window.location.pathname.slice(8);

    const [ images, setImages ] = useState<string[]>([]);
    const [ toggleEditMode, setToggleEditMode ] = useState(false);
    const [ selectedItems, setSelectedItems ] = useState<string[]>([]);

    const button_selectImage = (e: MouseEvent) => {
        const image_name = (e.target as HTMLElement).id;

        if (selectedItems.findIndex((selected) => selected === image_name) === -1) {
            setSelectedItems([...selectedItems, image_name]);
        } else {
            setSelectedItems(selectedItems.filter((selected) => selected !== image_name));
        }
    }

    const button_toggleEditMode = () => {
        if (toggleEditMode) {
            setSelectedItems([]);
        }
        setToggleEditMode(!toggleEditMode);
    }

    const ToolBar:FC = () => {
        return (
            <div className={m_styles.toolbar}>

            </div>
        );
    }

    const ImageIcon:FC<ImageIconProp> = ({ image_name, edit_mode }) => {
        const selected = selectedItems.findIndex((selected) => selected === image_name) !== -1;
        return (
            <div className={`${m_styles.image_container} ${selected?m_styles.selected:""}`}>
                {edit_mode?
                <button onClick={button_selectImage} id={image_name}>
                    <img className={m_styles.image_icon} id={image_name} src={`/folders/${folder_name}/${image_name}`} alt={`/folders/${folder_name}/${image_name}`} />
                </button>
                :
                <a href={`/folders/${folder_name}/${image_name}`}>
                    <img className={m_styles.image_icon} src={`/folders/${folder_name}/${image_name}`} alt={`/folders/${folder_name}/${image_name}`}/>
                </a>
                }
                <div className={m_styles.image_name}>{ image_name }</div>
                {edit_mode?
                <input type="checkbox" checked={selected} className={m_styles.selected_icon} />
                :<></>}
            </div>
        )
    }

    useEffect(() => {
        axios.get(`/images?folder=${folder_name}`).then((responce) => {
            setImages(responce.data);  
        });
    }, []);

    return (
        <MainPageFrame>
            {toggleEditMode?
            <ToolBar />
            :<></>}

            <div className={m_styles.main_page}>
                { images.map((image) => <ImageIcon image_name={image} edit_mode={toggleEditMode}/>) }
                <ImageButton className={m_styles.toggle_edit_button} animation="expand" src="/images/edit.png" onClick={button_toggleEditMode}/>
            </div>
        </MainPageFrame>
    );
}

export default FolderPage;
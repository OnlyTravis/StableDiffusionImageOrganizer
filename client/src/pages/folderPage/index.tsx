import { FC, MouseEvent, useEffect, useState } from "react";
import axios from "axios";

import MainPageFrame from "../mainPageFrame";
import ImageButton from "../../components/ImageButton";
import MoveImageMenu from "./moveImageMenu";

import m_styles from "./mobile.module.css"

export interface Folder {
    folder_name: string,
    image_count: number
}
interface ImageIconProp {
    image_name: string,
    edit_mode: boolean,
}

const FolderPage:FC = () => {
    const [ images, setImages ] = useState<string[]>([]);
    const [ folderList, setFolderList ] = useState<Folder[]>([]);

    const [ toggleEditMode, setToggleEditMode ] = useState(false);
    const [ floatingMenu, setFloatingMenu ] = useState("");
    const [ openedImage, setOpenedImage ] = useState("");

    const [ selectedItems, setSelectedItems ] = useState<string[]>([]);

    const folder_name = window.location.pathname.slice(8);

    const updateImages = () => {
        axios.get(`/images?folder=${folder_name}`).then((responce) => {
            setImages(responce.data);  
        });
    }

    const onFinish = () => {
        setSelectedItems([]);
        updateImages();
    }

    const errorHandling = (err: any) => {
        if (err.response && err.response.data) {
            window.alert(err.response.data);
        } else {
            window.alert(err);
        }
    }

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

    const button_renameImage = () => {
        let new_name = window.prompt(selectedItems.length == 1?
            `Rename Image "${selectedItems[0]}" to :\n(No need to add file extension)`:
            `Rename Images to :\n(No need to add file extension)\nUse "%n(start,length,increment)" for counter`);
        if (new_name === null) return;
        if (!new_name) {
            window.alert("Please Enter A Valid Name");
            return;
        }

        if (selectedItems.length == 1) {
            if (images.findIndex((image) => image === new_name) !== -1) {
                window.alert("A folder with that name already exists.");
                return;
            }
    
            const tmp = selectedItems[0].split('.');
            const extension = tmp[tmp.length-1];
            new_name += `.${extension}`;
    
            axios.post("/rename_image", {
                folder: folder_name,
                from: selectedItems[0],
                to: new_name
            }).then((response) => {
                onFinish();
            }).catch(errorHandling);
        } else {
            if (!new_name.match(/(%n\(\d+,\d+,\d+\))+/)) {
                alert("Please use atleast one counter to avoid file name conflict.");
                return;
            }

            axios.post("/rename_images", {
                folder: folder_name,
                images: selectedItems,
                to: new_name
            }).then((response) => {
                onFinish();
            }).catch(errorHandling);
        }
    }

    const button_deleteImage = () => {
        const confirmation = window.confirm(`Are you sure you want delete the images/s :\n ${selectedItems.join('\n')}?`)
        if (!confirmation) return;

        axios.post("/delete_image", {
            folder: folder_name,
            images: selectedItems,
        }).then((response) => {
            onFinish();
        }).catch(errorHandling);
    }

    const button_openImage = (e: MouseEvent) => {
        const image_name = (e.target as HTMLElement).id;
        setOpenedImage(image_name);
    }

    const ToolBar:FC = () => {
        return (
            <div className={m_styles.toolbar}>
                {selectedItems.length > 0?<>
                    <ImageButton className={m_styles.tool} animation="brighten" tooltip="Rename Image" src="/images/rename.png" onClick={ button_renameImage }/>
                    <ImageButton className={m_styles.tool} animation="brighten" tooltip="Delete Images" src="/images/delete.png" onClick={ button_deleteImage }/>
                    <ImageButton className={m_styles.tool} animation="brighten" tooltip="Move Images" src="/images/move_image.png" onClick={ () => {setFloatingMenu("MOVE_IMAGE");} }/>
                </>:<></>}
            </div>
        );
    }

    const ImageIcon:FC<ImageIconProp> = ({ image_name, edit_mode }) => {
        const selected = selectedItems.findIndex((selected) => selected === image_name) !== -1;
        return (
            <div className={`${m_styles.image_container} ${selected?m_styles.selected:""}`}>
                {edit_mode?<>
                <button onClick={button_selectImage} id={image_name}>
                    <img className={m_styles.image_icon} id={image_name} src={`/folders/${folder_name}/${image_name}`} alt={`/folders/${folder_name}/${image_name}`} />
                </button>
                <input type="checkbox" checked={selected} className={m_styles.selected_icon} />
                </>:
                <button onClick={button_openImage} id={image_name}>
                    <img className={m_styles.image_icon} id={image_name} src={`/folders/${folder_name}/${image_name}`} alt={`/folders/${folder_name}/${image_name}`}/>
                </button>
                }
                <div className={m_styles.image_name}>{ image_name }</div>
            </div>
        )
    }

    const FloatingMenuOnClose = () => {setFloatingMenu("")}
    const FloatingMenu:FC = (floatingMenu) => {
        switch (floatingMenu) {
            case "MOVE_IMAGE": 
                return <MoveImageMenu 
                current_folder={folder_name} 
                className={m_styles.floating_menu} 
                images={selectedItems} 
                folder_list={folderList} 
                onfinish={onFinish} 
                onclose={FloatingMenuOnClose} />;
            default :
                return <></>;
        }
    }

    document.addEventListener("fullscreenchange", (e) => {
        if (!document.fullscreenElement) {
            setOpenedImage("");
        }
    });
    const FullScreenImage:FC = () => {
        useEffect(() => {
            const index = images.findIndex((image) => image === openedImage);

            const ele = document.querySelector("#fullscreen_image");
            if (!ele) {
                setOpenedImage("");
                return;
            }
            ele.requestFullscreen();
            ele.scrollLeft = window.innerWidth*index;

        }, []);

        return (
            <div className={m_styles.full_image_container} id="fullscreen_image">
                { images.map((image) => 
                <div className={m_styles.full_image}>
                    <img src={`/folders/${folder_name}/${image}`} />
                </div>) 
                }
            </div>
        );
    }

    useEffect(() => {
        updateImages();
        axios.get("/folder_list").then((response) => {
            setFolderList(response.data);
        });
    }, []);

    return (
        <MainPageFrame>
            <div className={m_styles.topbar}>
                <div className={m_styles.page_title}> { folder_name } </div>
                {toggleEditMode?
                <div className={m_styles.selected_count}> Selected : {selectedItems.length} </div>
                :<></>}
            </div>

            {toggleEditMode?
            <ToolBar />
            :<></>}

            <div className={m_styles.main_page} style={{maxHeight: `${toggleEditMode?"86dvh":"90dvh"}`}}>
                { images.map((image) => <ImageIcon image_name={image} edit_mode={toggleEditMode}/>) }
                <ImageButton className={m_styles.toggle_edit_button} animation="expand" src="/images/edit.png" onClick={button_toggleEditMode}/>
            </div>

            {floatingMenu?
            <div className={m_styles.floating_menu_container}>
                { FloatingMenu(floatingMenu) }
                <div className={m_styles.floating_menu_backdrop} onClick={() => {setFloatingMenu("")}}></div>
            </div>
            :<></>}

            {openedImage? <FullScreenImage /> :<></>}
        </MainPageFrame>
    );
}

export default FolderPage;
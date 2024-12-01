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
    // Image List & Folders List
    const [ images, setImages ] = useState<string[]>([]);
    const [ folderList, setFolderList ] = useState<Folder[]>([]);

    // For Display
    const [ itemPerPage, setItemPerPage ] = useState(3*Math.floor((0.9*window.innerHeight - 20)/(window.innerWidth/3)));
    const [ page, setPage ] = useState(0);
    const [ floatingMenu, setFloatingMenu ] = useState("");

    // Fullscreen
    const [ fullscreen, setFullscreen ] = useState(false);
    const [ viewingImage, setViewingImage ] = useState(-1);

    // Edit Mode
    const [ toggleEditMode, setToggleEditMode ] = useState(false);
    const [ selectedItems, setSelectedItems ] = useState<string[]>([]);

    const folder_name = window.location.pathname.slice(8);

    const updateImages = () => {
        console.log(`updateImages: ${folder_name}`);
        axios.get(`/images?folder=${folder_name}`).then((responce) => {
            console.log(responce.data)
            setImages(responce.data);  
        });
    } // Update images by fetching image list from server

    const onFinish = () => {
        setSelectedItems([]);
        setToggleEditMode(false);
        updateImages();
    } // Resets selected items, turn off edit mode, update folder

    const errorHandling = (err: any) => {
        if (err.response && err.response.data) {
            window.alert(err.response.data);
        } else {
            window.alert(err);
        }
    } // To handle axios error and invalid requests

    const button_toggleEditMode = () => {
        setItemPerPage(3*Math.floor(((toggleEditMode?0.9:0.86)*window.innerHeight - 20)/(window.innerWidth/3)));
        if (toggleEditMode) {
            setSelectedItems([]);
        }
        setToggleEditMode(!toggleEditMode);
    } // Toggles edit mode (allows user to rename, delete, move images)
    
    const button_selectImage = (e: MouseEvent) => {
        const image_name = (e.target as HTMLElement).id;

        if (selectedItems.findIndex((selected) => selected === image_name) === -1) {
            setSelectedItems([...selectedItems, image_name]);
        } else {
            setSelectedItems(selectedItems.filter((selected) => selected !== image_name));
        }
    } // Allows user to select images (only in edit mode)

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
            axios.post("/rename_images", {
                folder: folder_name,
                images: selectedItems,
                to: new_name
            }).then((response) => {
                onFinish();
            }).catch(errorHandling);
        }
    } // Allows user to rename images

    const button_deleteImage = () => {
        const confirmation = window.confirm(`Are you sure you want delete the images/s :\n ${selectedItems.join('\n')}?`)
        if (!confirmation) return;

        axios.post("/delete_image", {
            folder: folder_name,
            images: selectedItems,
        }).then((response) => {
            onFinish();
        }).catch(errorHandling);
    } // Allows user to delete selected images

    const button_openImage = (e: MouseEvent) => {
        const image_name = (e.target as HTMLElement).id;
        setFullscreen(true);
        setViewingImage(images.findIndex((image) => image === image_name));
    } // Allows user to view image in fullscreen

    const button_setPage = () => {
        const response = prompt(`Which page would you like to skip to?\n(1 to ${Math.ceil(images.length/itemPerPage)})`);
        if (!response) return;

        const target_page = parseInt(response);
        if (!target_page || target_page < 1 || target_page > Math.ceil(images.length/itemPerPage)) {
            alert("Please Enter A Valid Page Number.");
            return;
        }
        setPage(target_page - 1);
    } // Allows user to set to a certain page

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
                    <img className={m_styles.image_icon} id={image_name} src={`/folders/${folder_name}/${image_name}?compress=true`} alt={`/folders/${folder_name}/${image_name}`} />
                </button>
                <input type="checkbox" checked={selected} className={m_styles.selected_icon} />
                </>:
                <button onClick={button_openImage} id={image_name}>
                    <img className={m_styles.image_icon} id={image_name} src={`/folders/${folder_name}/${image_name}?compress=true`} alt={`/folders/${folder_name}/${image_name}`}/>
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
            setFullscreen(false);
            setViewingImage(-1);
        }
    });

    useEffect(() => {
        updateImages();
        axios.get("/folder_list").then((response) => {
            setFolderList(response.data);
        });
    }, []);

    useEffect(() => {
        const ele = document.querySelector("#fullscreen_image");
        if (!ele) {
            setFullscreen(false);
            setViewingImage(-1);
            return;
        }
        ele.requestFullscreen();
    }, [fullscreen]);

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
                { images.slice(page*itemPerPage, (page+1)*itemPerPage).map((image) => <ImageIcon image_name={image} edit_mode={toggleEditMode}/>) }
                <div className={m_styles.page_bar}>
                    {page > 0?<>
                        <button onClick={() => setPage(0)}>{"<<"}</button>
                        <button onClick={() => setPage(page-1)}>{"<"}</button>
                    </>:<></>}
                    <button onClick={() => {}}>{ page+1 }</button>
                    {page < Math.ceil(images.length/itemPerPage-1)?<>
                        <button onClick={() => setPage(page+1)}>{">"}</button>
                        <button onClick={() => setPage(Math.ceil(images.length/itemPerPage)-1)}>{">>"}</button>
                    </>:<></>}
                </div>
                <ImageButton className={m_styles.toggle_edit_button} animation="expand" src="/images/edit.png" onClick={button_toggleEditMode}/>
                <ImageButton className={m_styles.refresh_button} animation="expand" src="/images/refresh.png" onClick={updateImages}/>
            </div>

            {floatingMenu?
            <div className={m_styles.floating_menu_container}>
                { FloatingMenu(floatingMenu) }
                <div className={m_styles.floating_menu_backdrop} onClick={() => {setFloatingMenu("")}}></div>
            </div>
            :<></>}

            {fullscreen? 
            <div className={m_styles.full_image_container} id="fullscreen_image">
                <div className={m_styles.full_image}>
                    <img src={`/folders/${folder_name}/${images[viewingImage]}`} />
                </div>
                <div className={m_styles.full_image_name}>{ images[viewingImage] }</div>
                <button className={m_styles.move_left_button} onClick={() => setViewingImage((viewingImage-1+images.length)%images.length)} />
                <button className={m_styles.move_right_button} onClick={() => setViewingImage((viewingImage+1)%images.length)} />
            </div>
            :<></>}
        </MainPageFrame>
    );
}

export default FolderPage;
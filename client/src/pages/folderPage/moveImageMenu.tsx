import { ChangeEvent, FC, FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";
import axios from "axios";

import FloatingMenu from "../../components/FloatingMenu";
import { Folder } from ".";

interface MoveImageMenuProp {
    current_folder: string,
    folder_list: Folder[],
    images: string[],
    className: string,
    onfinish: Function,
    onclose: Function
}
const MoveImageMenu:FC<MoveImageMenuProp> = ({ current_folder, folder_list, images, className, onfinish, onclose }) => {
    images.sort((a, b) => a>b?1:-1);

    const [ destination, setDestination ] = useState(folder_list[0].folder_name);

    function form_onSubmit(e: FormEvent) {
        e.preventDefault();
        axios.post("/move_image", {
            folder: current_folder,
            destination: destination,
            images: images
        }).then((response) => {
            onfinish();
            onclose();
        }).catch((err) => {
            if (err.response && err.response.data) {
                window.alert(err.response.data);
            } else {
                window.alert(err);
            }
        })
    }
    function handleChange(e: ChangeEvent) { 
        setDestination((e.target as HTMLSelectElement).value);  
    } 

    return (
        <FloatingMenu title="Move Images" onclose={ onclose as MouseEventHandler } className={className}>
            <form onSubmit={ form_onSubmit }>
                <label>Move To Folder : </label>
                <select name="destination" onChange={ handleChange }>
                    {folder_list.map((folder) => <option>{folder.folder_name}</option>)}
                </select>
                <button type="submit">Move</button>
            </form>
            <div>
                Images : 
                { images.map((image_name) => <div>{ image_name }</div>) }
            </div>
        </FloatingMenu>  
    );
}

export default MoveImageMenu;
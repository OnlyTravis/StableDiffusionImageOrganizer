import { FC, useEffect, useState } from "react";

import styles from "./list.module.css";
import axios from "axios";

interface PageListObj {
    page_name : string,
    path: string,
    expandable: boolean,
    contents?: PageListObj[]
}

const makeLi = (items: PageListObj[], layer: number) => {
    return items.map((item) => {
        if (!item.expandable) {
            return (
                <li className={styles.page_item} style={{fontSize:`calc(1.3em - ${layer}*0.5em)`}}>
                    <a href={item.path}>{item.page_name}</a>
                </li>
            )
        } else {
            return (PageItem(item, layer));
        }
    });
}

const PageItem:FC<PageListObj> = (item: PageListObj, layer: number) => {
    const [ expanded, setExpanded ] = useState(false);
    if (!item.contents) return (<></>);

    return (
        <li className={styles.page_item} style={{fontSize:`calc(1.3em - ${layer}*0.5em)`}}>
            <div>
                <a href={item.path}>{item.page_name}</a>
                <button onClick={() => {setExpanded(!expanded)}}>
                    <svg height="25" width="25">
                        <path d={expanded?"M 14 5 L 14 19 L 5 12 L 14 5":"M 5 5 L 5 20 L 14 12 L 5 5"} fill="black"/>
                    </svg>
                </button>
            </div>
            {expanded?
                <ul>{ makeLi(item.contents, layer+1) }</ul>
            :<></>}
        </li>
    );
}

const PageList:FC = () => {
    const [ pageList, setPageList ] = useState(require("./page_list.json"));

    useEffect(() => {
        axios.get("/folder_list").then((response) => {
            const index = pageList.findIndex((page: any) => page.page_name === "Folders");
            setPageList((page_list: any) => {
                page_list[index].contents = response.data.map((folder: any) => {return {
                    page_name : `${folder.folder_name}`,
                    path : `/folder/${folder.folder_name}`,
                    expandable : false
                };});
                return page_list;
            });
        });
    }, []);

    return (
        <ul className={styles.list}>{ makeLi(pageList, 0) }</ul>
    );
}

export default PageList
import express from 'express';

import folder_list from "../../data/folders_list.json";

const router = express.Router();

router.get("/folder_list", (req, res) => {
    res.json(folder_list);
});

export default router;
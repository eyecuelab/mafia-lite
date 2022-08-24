import roleControllers from "../Controllers/role";
import express from "express";

const router = express.Router();


router.get('/role', roleControllers.getRoles);
router.get('/role/:id', roleControllers.getSingleRole);

router.post('/role', roleControllers.createRole);

export default router; 
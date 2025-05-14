import { authenticateToken } from "../middlewares/auth";
import { Router } from "express";
import * as CatController from "../controllers/cats/cat.controller";


const router = Router();

router.post("/", authenticateToken, CatController.createCat);
router.get("/:id", authenticateToken, CatController.getCatById);
router.get("/:userId", authenticateToken, CatController.getCatsByUserId);
router.get("/", authenticateToken, CatController.getCats); // todos os gatos do user autenticado // gatos de um user específico
router.put("/:id", authenticateToken, CatController.updateCat);
router.delete("/:id", authenticateToken, CatController.deleteCat);
export default router;
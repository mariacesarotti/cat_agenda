import { authenticateToken } from "../middlewares/auth";
import { Router } from "express";
import * as LitterController from "../controllers/litter/litterConfig.controller";

const router = Router();

router.post("/", authenticateToken, LitterController.createLitterConfig);
router.patch("/:id", authenticateToken, LitterController.updateLitterConfig);
router.get("/:userId", authenticateToken, LitterController.getLitterConfigByUser);
router.get("/calculation/:user_id", authenticateToken, LitterController.getLitterCalculation);
router.get("/", authenticateToken, LitterController.getAllLitterConfigs);

export default router;
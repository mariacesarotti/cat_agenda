import { authenticateToken } from "../middlewares/auth";
import { Router } from "express";
import * as FoodController from "../controllers/food/food.controller";

const router = Router();

router.post("/", authenticateToken, FoodController.createFoodConfig);
router.patch("/:id", authenticateToken, FoodController.updateFoodConfig);
router.get("/:userId", authenticateToken,FoodController.getFoodConfigByUser);
router.get("/calculate", authenticateToken, FoodController.getFoodCalculation);

export default router;
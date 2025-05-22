import { Router } from "express";
import * as UserController from "../controllers/user/user.controller";

const router = Router();

router.post("/", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUser);
router.patch("/:id", UserController.updateUser);

export default router;

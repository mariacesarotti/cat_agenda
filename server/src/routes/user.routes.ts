import { Router } from "express";
import * as UserController from "../controllers/user/user.controller";

const router = Router();

router.post("/users", UserController.createUser);
router.post("/users/login", UserController.loginUser);
router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUserById);
router.delete("/users/:id", UserController.deleteUser);
router.patch("/users/:id", UserController.updateUser);

export default router;

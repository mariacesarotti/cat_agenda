import { Router } from "express";
import * as VaccineController from "../controllers/vaccines/vaccines.controller";

const router = Router();

router.post("/", VaccineController.createVaccineConfig);
router.patch("/:id", VaccineController.updateVaccineConfig);
// router.get("/user/:user_id", VaccineController.getVaccinesByUserId);
router.get("/cat/:cat_id", VaccineController.getVaccinesByCatId);
router.get("/calculation/:cat_id", VaccineController.calculateVaccine);
router.get("/", VaccineController.getVaccines);

export default router;
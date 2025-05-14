import { authenticateToken} from '../middlewares/auth';
import { Router } from 'express';
import * as MedicationController from '../controllers/medication/medication.controller';


const router = Router();

router.post('/', authenticateToken, MedicationController.createMedicationConfig);
router.get('/:userId', authenticateToken, MedicationController.getMedicationConfigByUser);
router.patch('/:id', authenticateToken, MedicationController.updateMedicationConfig);
router.get('/:cat_id', authenticateToken, MedicationController.getMedicationConfigByCatId);
router.get('/calculation/:cat_id', authenticateToken, MedicationController.calculateMedication);
router.get('/', authenticateToken, MedicationController.getMedicationConfig);

export default router;

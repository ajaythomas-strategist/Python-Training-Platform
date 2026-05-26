import express from 'express';
import multer from 'multer';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    deleteUsersBulk,
    bulkUploadUsers,
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllUsers);

router.use(protect); // authentication for modifying routes
router.use(authorizeRoles('SuperAdmin', 'Admin'));

router.post('/bulk', upload.single('file'), bulkUploadUsers);
router.delete('/bulk', deleteUsersBulk);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

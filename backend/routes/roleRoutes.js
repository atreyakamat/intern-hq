const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', roleController.getRoles);
router.post('/', roleController.createRole);
router.get('/:id', validateObjectId('id'), roleController.getRoleById);
router.put('/:id', validateObjectId('id'), roleController.updateRole);
router.delete('/:id', validateObjectId('id'), roleController.deleteRole);

module.exports = router;

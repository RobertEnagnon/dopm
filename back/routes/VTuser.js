const router = require('express').Router();
const userCtrl = require('../controllers/user');

router.post('/', userCtrl.createUser);
router.get('/', userCtrl.getAllUsers);
router.get('/:id', userCtrl.getOneUser);
// router.put('/:id', userCtrl.updateUser);
// router.delete('/:id', userCtrl.deleteUser);
module.exports = router;

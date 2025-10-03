const express = require('express');
const adminAuth = require('../../middlewares/adminAuth.js');
const profileMasterController = require('../../controllers/admin/profileMasterController.js');
const upload = require('../../middlewares/upload.js');

const router = express.Router();

// List all profile masters
router.get('/', adminAuth, profileMasterController.getList);

// Create new profile master (with optional file uploads if needed)
router.post(
  '/',
  adminAuth,
  upload.fields([{ name: "images", maxCount: 10 }, { name: "image", maxCount: 1 }]),
  profileMasterController.storeData
);

// Form to create profile master
router.get('/create', adminAuth, profileMasterController.create);

// Get detail of a specific profile master
router.get('/:id', adminAuth, profileMasterController.getDetail);

// Update a profile master
router.put(
  '/:id',
  adminAuth,
  upload.fields([{ name: "images", maxCount: 10 }, { name: "image", maxCount: 1 }]),
  profileMasterController.updateData
);

// Form to edit profile master
router.get('/edit/:id', adminAuth, profileMasterController.edit);

// Get data for datatable or AJAX
router.post('/data', adminAuth, profileMasterController.getData);

// Delete a profile master
router.delete('/:id', adminAuth, profileMasterController.deleteRecord);

module.exports = router;

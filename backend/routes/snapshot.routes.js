const express = require('express');

const {
  createSnapshot,
  getLatestSnapshot,
  getSnapshotChanges,
} = require('../controllers/snapshot.controller');

const router = express.Router();

router.post('/', createSnapshot);

router.get('/latest', getLatestSnapshot);

router.get('/changes', getSnapshotChanges);

module.exports = router;
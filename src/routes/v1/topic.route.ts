import express from 'express';

import {
  getTopics,
  addTopic,
  removeTopic,
  generateTopics,
  markUsed,
} from '../../controllers/topic.controller';
const router = express.Router();

router.get('', getTopics);
router.post('', addTopic);
router.delete('/:id', removeTopic);
router.put('/:id/used', markUsed);
router.get('/generate', generateTopics);
export default router;

import express from 'express';

import {
  getTopics,
  addTopic,
  removeTopic,
  generateTopics,
  markUsed,
  deleteTopic
} from '../../controllers/topic.controller';
const router = express.Router();

router.delete('/delete/:id', deleteTopic);
router.get('', getTopics);
router.post('', addTopic);
router.delete('/:id', removeTopic);
router.put('/:id/used', markUsed);
router.get('/generate', generateTopics);
// router.delete('/delete/:id', deleteTopic);

export default router;

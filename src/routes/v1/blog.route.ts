import express from 'express';

const router = express.Router();
import {
  getAllPosts,
  getPostContent,
  generateBlogPost,
  approveBlogPost,
  publishBlogPost,
  rejectBlogPost,
  updateBlogPost,
  getApprovedPosts,
} from '../../controllers/blog.controller';

// Blog post routes
router.get('', getAllPosts);
router.get('/approved', getApprovedPosts);
router.get('/generate', generateBlogPost);
router.get('/approve/:id', approveBlogPost);
router.get('/publish/:id', publishBlogPost);
router.get('/reject/:id', rejectBlogPost);
router.get('/:id', getPostContent);
router.post('/update/:id', updateBlogPost);

export default router;

import express from 'express';

import blogRoute from './blog.route';
import topicRoute from './topic.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/blogs',
    route: blogRoute,
  },
  {
    path: '/topics',
    route: topicRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;

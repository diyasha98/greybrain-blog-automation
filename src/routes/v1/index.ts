import express from 'express';

import authRoute from './auth.routes';
import blogRoute from './blog.route';
import topicRoute from './topic.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
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
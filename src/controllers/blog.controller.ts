import { PostStatus } from '@prisma/client';

import { prisma } from '../db';
import ApiResponse from '../utils/ApiResponse';
import catchAsync from '../utils/catchAsync';
import AIService from '../services/ai.service';

export const getAllPosts = catchAsync(async (req, res) => {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: {
        in: [PostStatus.PENDING, PostStatus.APPROVED, PostStatus.PUBLISHED],
      },
    },
  });

  const pendingPosts = posts.filter(
    (post) => post.status === PostStatus.PENDING,
  );
  const approvedPosts = posts.filter(
    (post) => post.status === PostStatus.APPROVED,
  );
  const publishedPosts = posts.filter(
    (post) => post.status === PostStatus.PUBLISHED,
  );

  ApiResponse.success(
    res,
    {
      pending: pendingPosts,
      approved: approvedPosts,
      published: publishedPosts,
    },
    'API Successfull',
    200,
  );
});

export const getApprovedPosts = catchAsync(async (req, res) => {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: {
        in: [PostStatus.APPROVED],
      },
    },
  });

  ApiResponse.success(
    res,
    {
      posts,
    },
    'API Successfull',
    200,
  );
});

export const getPostContent = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return ApiResponse.error(res, null, 'Blog Id is required', 400);
  }

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  ApiResponse.success(res, post, 'API Successfull', 200);
});

export const generateBlogPost = catchAsync(async (req, res) => {
  const { topicId } = req.query;
  console.log({ topicId });
  if (!topicId || typeof topicId !== 'string' || topicId.trim() === '') {
    return ApiResponse.error(res, null, 'Topic is required', 400);
  }
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
  });
  if (!topic) {
    return ApiResponse.error(res, null, 'Topic not found', 404);
  }
  if (topic.status !== 'AVAILABLE') {
    return ApiResponse.error(
      res,
      null,
      'Topic is not available for post generation',
      400,
    );
  }
  const content = await AIService.generateBlogPost(topic.name);
  if (!content) {
    return ApiResponse.error(res, null, 'Failed to generate blog post', 500);
  }
  const newPost = await prisma.blogPost.create({
    data: {
      title: topic.name,
      content,
      status: PostStatus.PENDING,
      topicId: topicId,
    },
  });
  ApiResponse.success(res, newPost, 'Blog post generated', 200);
});

export const approveBlogPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return ApiResponse.error(res, null, 'Blog Id is required', 400);
  }

  await prisma.blogPost.update({
    where: { id },
    data: { status: PostStatus.APPROVED },
  });

  ApiResponse.success(res, null, 'Blog post approved', 200);
});

export const publishBlogPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return ApiResponse.error(res, null, 'Blog Id is required', 400);
  }

  await prisma.blogPost.update({
    where: { id },
    data: { status: PostStatus.PUBLISHED },
  });

  ApiResponse.success(res, null, 'Blog post published', 200);
});

export const rejectBlogPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return ApiResponse.error(res, null, 'Blog Id is required', 400);
  }

  await prisma.blogPost.update({
    where: { id },
    data: { status: PostStatus.REJECTED },
  });

  ApiResponse.success(res, null, 'Blog post rejected', 200);
});

export const updateBlogPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return ApiResponse.error(res, null, 'Blog Id is required', 400);
  }
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return ApiResponse.error(res, null, 'Content is required', 400);
  }

  await prisma.blogPost.update({
    where: { id },
    data: { content },
  });

  ApiResponse.success(res, null, 'Blog post updated', 200);
});

export const deleteBlogPost = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    return ApiResponse.error(res, null, "Blog Id is required", 400);
  }

  await prisma.blogPost.delete({
    where: { id },
  });

  ApiResponse.success(res, null, "Blog post deleted successfully", 200);
});

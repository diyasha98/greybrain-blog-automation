import { TopicSource, TopicStatus } from '@prisma/client';

import { prisma } from '../db';
import ApiResponse from '../utils/ApiResponse';
import catchAsync from '../utils/catchAsync';
import AIService from '../services/ai.service';

export const getTopics = catchAsync(async (req, res) => {
  const { status, size = 0 } = req.query;

  let topicToUse;
  if (status === 'active') {
    topicToUse = TopicStatus.AVAILABLE;
  } else if (status === 'inactive') {
    topicToUse = TopicStatus.ARCHIVED;
  } else if (status === 'used') {
    topicToUse = TopicStatus.USED;
  } else {
    topicToUse = TopicStatus.AVAILABLE;
  }
  const topics = await prisma.topic.findMany({
    where: { status: topicToUse },
    take: size ? parseInt(size as string) : undefined,
    orderBy: {
      createdAt: 'desc',
    },
  });
  // Respond with success
  ApiResponse.success(res, topics, 'Topics Fetched Successfully', 200);
});

export const addTopic = catchAsync(async (req, res) => {
  const { topic } = req.body;
  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    return ApiResponse.error(res, null, 'Topic is required', 400);
  }
  // Create a new topic
  const newTopic = await prisma.topic.create({
    data: {
      name: topic,
      status: TopicStatus.AVAILABLE,
      source: TopicSource.CUSTOM,
    },
  });

  ApiResponse.success(res, newTopic, 'Topics Added Successfully', 200);
});

export const removeTopic = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return ApiResponse.error(res, null, 'Topic id is required', 400);
  }
  // Create a new topic
  await prisma.topic.update({
    where: {
      id,
    },
    data: {
      status: TopicStatus.ARCHIVED,
    },
  });
  // Respond with success
  ApiResponse.success(res, null, 'Topics Removed Successfully', 200);
});

export const markUsed = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return ApiResponse.error(res, null, 'Topic id is required', 400);
  }
  // Create a new topic
  await prisma.topic.update({
    where: {
      id,
    },
    data: {
      status: TopicStatus.USED,
    },
  });
  // Respond with success
  ApiResponse.success(res, null, 'Topics Marked Used Successfully', 200);
});

export const generateTopics = catchAsync(async (req, res) => {
  const newTopics = await AIService.generateTopics();

  for (const topic of newTopics) {
    const existingTopic = await prisma.topic.findFirst({
      where: {
        name: topic,
      },
    });
    if (!existingTopic) {
      await prisma.topic.create({
        data: {
          name: topic,
          status: TopicStatus.AVAILABLE,
          source: TopicSource.GENERATED,
        },
      });
    }
  }
  // Respond with success
  ApiResponse.success(res, null, 'Topics Generated Successfully', 200);
});

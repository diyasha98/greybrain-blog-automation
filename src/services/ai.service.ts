/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

import { env } from '../config/envConfig';

import config from './config.json';

export default class AIService {
  public static getAIClient() {
    const provider = config.ai_providers.primary;

    if (provider === 'groq' && env.GROQ_API_KEY) {
      return {
        baseURL: 'https://api.groq.com/openai/v1',
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      };
    } else if (provider === 'openrouter' && env.OPENROUTER_API_KEY) {
      return {
        baseURL: 'https://openrouter.ai/api/v1',
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      };
    } else if (provider === 'together' && env.TOGETHER_API_KEY) {
      return {
        baseURL: 'https://api.together.xyz/v1',
        headers: {
          Authorization: `Bearer ${env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      };
    } else {
      // Fallback
      const fallbackProvider = config.ai_providers.fallback;
      if (fallbackProvider === 'openrouter' && env.OPENROUTER_API_KEY) {
        return {
          baseURL: 'https://openrouter.ai/api/v1',
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
        };
      }
    }

    throw new Error('No valid AI provider configuration found');
  }

  public static async generateBlogPost(topic: string) {
    try {
      const client = AIService.getAIClient();
      const prompt = `
          Write a comprehensive blog post about "${topic}" for a healthcare AI company called ${
            config.personal_info.company
          }.
          
          Use these keywords where appropriate: ${config.content_strategy.primary_keywords.join(
            ', ',
          )}.
          
          The blog post should be informative, professional, and about 1000-1500 words.
          
          Format in clean html with <h1> for title, <h2> for sections and <p> for paragraphs and <ul> for lists and do not use any inline or external styles, and include:
          - Introduction
          - 3-4 main sections with detailed content
          - A conclusion
          - 5 relevant tags as a comma-separated list at the end
          `;

      const response = await axios.post(
        `${client.baseURL}/chat/completions`,
        {
          model: 'llama3-70b-8192', // Use a reasonable default model
          messages: [
            {
              role: 'system',
              content:
                'You are an expert blog writer specializing in healthcare AI topics.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        },
        { headers: client.headers },
      );

      const content = response.data.choices[0].message.content;
      return content;
    } catch (error: any) {
      console.error(`Error generating blog post: ${error.message}`);
      throw error;
    }
  }

  public static async generateTopics(count = 5) {
    const newTopics = [];

    for (let i = 0; i < count; i++) {
      const theme = AIService.getRandomThemeTopic();
      if (theme) {
        const topic = await AIService.generateTopicFromTheme(theme);
        newTopics.push(topic);
      }
    }

    return newTopics;
  }

  public static getRandomThemeTopic() {
    const { main_themes } = config.content_strategy.topics;
    if (!main_themes || main_themes.length === 0) {
      return null;
    }

    // Get a random theme
    const randomIndex = Math.floor(Math.random() * main_themes.length);
    return main_themes[randomIndex];
  }

  public static async generateTopicFromTheme(theme: string) {
    try {
      // If we're using an AI provider to generate topic variations
      const apiKey =
        env.GROQ_API_KEY || env.OPENROUTER_API_KEY || env.TOGETHER_API_KEY;
      if (!apiKey) {
        return theme; // Just use the theme as is if no AI provider
      }

      // Determine which API to use
      let baseURL, headers;
      if (env.GROQ_API_KEY) {
        baseURL = 'https://api.groq.com/openai/v1';
        headers = { Authorization: `Bearer ${env.GROQ_API_KEY}` };
      } else if (env.OPENROUTER_API_KEY) {
        baseURL = 'https://openrouter.ai/api/v1';
        headers = { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` };
      } else if (env.TOGETHER_API_KEY) {
        baseURL = 'https://api.together.xyz/v1';
        headers = { Authorization: `Bearer ${env.TOGETHER_API_KEY}` };
      }

      // Generate a specific topic based on the theme
      const prompt = `
      Generate a specific, engaging blog post topic for a healthcare AI company based on the general theme: "${theme}".
      
      The topic should:
      1. Be specific enough to write a focused 1000-1500 word blog post
      2. Include at least one of these keywords if relevant: ${config.content_strategy.primary_keywords.join(
        ', ',
      )}
      3. Be relevant to healthcare professionals and technology decision-makers
      4. Be presented as a clear, concise title (max 10 words)
      
      Return ONLY the topic title, nothing else.
      `;

      const response = await axios.post(
        `${baseURL}/chat/completions`,
        {
          model: 'llama3-8b-8192', // Use a smaller model for efficiency
          messages: [
            {
              role: 'system',
              content:
                'You are a healthcare content strategist who creates focused blog topics.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 50,
        },
        { headers: { ...headers, 'Content-Type': 'application/json' } },
      );

      let topic = response.data.choices[0].message.content.trim();

      // Remove quotes if present
      if (
        (topic.startsWith('"') && topic.endsWith('"')) ||
        (topic.startsWith("'") && topic.endsWith("'")) ||
        (topic.startsWith('`') && topic.endsWith('`'))
      ) {
        topic = topic.substring(1, topic.length - 1);
      }

      return topic;
    } catch (error: any) {
      console.error('Error generating topic:', error.message);
      return theme; // Fallback to the original theme
    }
  }
}

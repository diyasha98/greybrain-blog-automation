/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { env } from "../config/envConfig";
import config from "./config.json";

function sanitize(str: string) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
    .trim();
}

export default class AIService {
  public static getAIClient() {
    const provider = config.ai_providers.primary;

    if (provider === "groq" && env.GROQ_API_KEY) {
      return {
        baseURL: "https://api.groq.com/openai/v1",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      };
    }

    if (provider === "openrouter" && env.OPENROUTER_API_KEY) {
      return {
        baseURL: "https://openrouter.ai/api/v1",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      };
    }

    if (provider === "together" && env.TOGETHER_API_KEY) {
      return {
        baseURL: "https://api.together.xyz/v1",
        headers: {
          Authorization: `Bearer ${env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      };
    }

    throw new Error("No valid AI provider configuration found");
  }

  // --------------------------------------------------------
  //  BLOG GENERATION
  // --------------------------------------------------------
  public static async generateBlogPost(topic: string) {
    try {
      const client = AIService.getAIClient();
      const safeTopic = sanitize(topic);

      const prompt = [
        `Write a comprehensive blog post about "${safeTopic}" for a healthcare AI company called ${config.personal_info.company}.`,
        ``,
        `Use these keywords where relevant: ${config.content_strategy.primary_keywords.join(", ")}.`,
        ``,
        `Requirements:`,
        `- 1200 to 1500 words`,
        `- Use <h1>, <h2>, <p>, <ul> only`,
        `- No external styles`,
        ``,
        `Sections:`,
        `1. Introduction`,
        `2. Key Insights`,
        `3. Real-world Impact`,
        `4. Conclusion`,
        ``,
        `At the end, include: <p><strong>Tags:</strong> tag1, tag2, tag3</p>`
      ].join("\n");

      const response = await axios.post(
        `${client.baseURL}/chat/completions`,
        {
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are an expert healthcare AI blog writer." },
            { role: "user", content: prompt },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        },
        { headers: client.headers }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error("🚨 Error generating blog post:", error?.response?.data || error.message);
      throw error;
    }
  }

  // --------------------------------------------------------
  //  TOPIC GENERATION
  // --------------------------------------------------------
  public static async generateTopics(count = 5) {
    const topics: string[] = [];

    for (let i = 0; i < count; i++) {
      const theme = AIService.getRandomThemeTopic();
      if (theme) {
        topics.push(await AIService.generateTopicFromTheme(theme));
      }
    }

    return topics;
  }

  public static getRandomThemeTopic() {
    const { main_themes } = config.content_strategy.topics;
    if (!main_themes || main_themes.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * main_themes.length);
    return main_themes[randomIndex];
  }

  public static async generateTopicFromTheme(theme: string) {
    try {
      const client = AIService.getAIClient();

      const prompt = [
        `Generate 1 focused blog topic based on the theme: "${sanitize(theme)}".`,
        ``,
        `Requirements:`,
        `1. Maximum 10 words`,
        `2. Must be specific and relevant to healthcare AI`,
        `3. Include one of these keywords if possible: ${config.content_strategy.primary_keywords.join(", ")}`,
        ``,
        `Return ONLY the topic text.`
      ].join("\n");

      const response = await axios.post(
        `${client.baseURL}/chat/completions`,
        {
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a healthcare content strategist."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 40,
        },
        { headers: client.headers }
      );

      let topic = response.data.choices[0].message.content.trim();
      topic = topic.replace(/^["'`]|["'`]$/g, ""); // Remove quotes

      return topic;
    } catch (error: any) {
      console.error("🚨 Error generating topic:", error?.response?.data || error.message);
      return theme;
    }
  }
}

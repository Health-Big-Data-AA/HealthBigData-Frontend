import axios from 'axios';

const deepSeekApiClient = axios.create({
  baseURL: 'https://api.siliconflow.cn/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
  }
});

export const getAiResponse = (messages, tools) => {
  return deepSeekApiClient.post('/chat/completions', {
    model: 'deepseek-ai/DeepSeek-V3',
    messages: messages,
    tools: tools,
    tool_choice: 'auto'
  });
};

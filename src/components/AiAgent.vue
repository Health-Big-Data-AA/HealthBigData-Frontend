<template>
  <div class="ai-agent-container">
    <el-button
      type="primary"
      circle
      class="agent-trigger-button"
      @click="toggleChat"
      size="large"
    >
      <el-icon :size="24"><ChatDotRound /></el-icon>
    </el-button>

    <teleport to="body">
      <el-card v-if="isChatOpen" class="chat-window">
        <template #header>
          <div class="chat-header">
            <span>AI 智能助手</span>
            <el-icon @click="toggleChat" class="close-icon"><Close /></el-icon>
          </div>
        </template>

        <div class="messages-container" ref="messagesContainer">
          <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
            <div class="message-content">
              <template v-if="message.role === 'assistant' && message.tool_calls">
                正在为您执行操作...
              </template>
              <template v-else>
                {{ message.content }}
              </template>
            </div>
          </div>
        </div>

        <div class="input-container">
          <el-input
            v-model="userInput"
            placeholder="你好，请问有什么可以帮您？"
            @keyup.enter="sendMessage"
            :disabled="isLoading"
          >
            <template #append>
              <el-button @click="sendMessage" :loading="isLoading">
                <el-icon><Promotion /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </el-card>
    </teleport>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ChatDotRound, Close, Promotion } from '@element-plus/icons-vue';
import { getAiResponse } from '@/api/ai';
import { healthNews } from '@/data/newsData';
import { healthVideos } from '@/data/videoData';

const router = useRouter();
const isChatOpen = ref(false);
const isLoading = ref(false);
const userInput = ref('');
const messagesContainer = ref(null);
const messages = ref([
  { role: 'assistant', content: '你好！我是您的智能助手，可以帮您查找资讯或跳转页面。' }
]);

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const pageRoutes = {
  'home': '/',
  'dashboard': '/dashboard',
  'users': '/users',
  'roles': '/roles',
  'permissions': '/permissions',
  'data': '/data',
  'tags': '/tags',
  'statistics': '/statistics',
  'logs': '/logs',
  'account': '/account'
};

const tools = [
  {
    type: 'function',
    function: {
      name: 'navigateTo',
      description: 'Navigate to a specific page in the application.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            description: 'The name of the page to navigate to. Available pages are: ' + Object.keys(pageRoutes).join(', ')
          }
        },
        required: ['page']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'searchContent',
      description: 'Search for health news and videos based on a query.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search term for news or videos.'
          }
        },
        required: ['query']
      }
    }
  }
];

const availableTools = {
  navigateTo: ({ page }) => {
    if (pageRoutes[page]) {
      router.push(pageRoutes[page]);
      toggleChat();
      return JSON.stringify({ success: true, message: `Navigated to ${page}.` });
    }
    return JSON.stringify({ success: false, message: `Page not found: ${page}` });
  },
  searchContent: ({ query }) => {
    const lowerCaseQuery = query.toLowerCase();
    const newsResults = healthNews.filter(item => item.title.toLowerCase().includes(lowerCaseQuery));
    const videoResults = healthVideos.filter(item => item.title.toLowerCase().includes(lowerCaseQuery));
    if (newsResults.length === 0 && videoResults.length === 0) {
      return JSON.stringify({ found: false, results: 'No content found matching the query.' });
    }
    return JSON.stringify({
      found: true,
      results: {
        news: newsResults.map(n => ({ title: n.title, source: n.source })),
        videos: videoResults.map(v => ({ title: v.title, uploader: v.uploader }))
      }
    });
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const userMessage = { role: 'user', content: userInput.value };
  messages.value.push(userMessage);
  userInput.value = '';
  scrollToBottom();

  isLoading.value = true;
  
  try {
    const apiMessages = messages.value.filter(m => m.role !== 'tool'); // Exclude tool responses from chat history for cleaner context
    const response = await getAiResponse(apiMessages, tools);
    const assistantMessage = response.data.choices[0].message;

    if (assistantMessage.tool_calls) {
      messages.value.push(assistantMessage);
      const toolCall = assistantMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      if (availableTools[functionName]) {
        const toolResult = availableTools[functionName](functionArgs);
        
        const toolResponseMessage = {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResult
        };
        messages.value.push(toolResponseMessage);
        
        // Send tool result back to the model for a final summary
        const finalResponse = await getAiResponse(messages.value.filter(m => m.role !== 'tool'), tools);
        const finalMessage = finalResponse.data.choices[0].message;
        messages.value.push(finalMessage);
      }
    } else {
      messages.value.push(assistantMessage);
    }
  } catch (error) {
    console.error('AI response error:', error);
    messages.value.push({ role: 'assistant', content: '抱歉，我的大脑暂时无法连接，请稍后再试。' });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};
</script>

<style scoped lang="scss">
.ai-agent-container {
  position: relative;
}

.agent-trigger-button {
  width: 50px;
  height: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.chat-window {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  height: 500px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  border-radius: 12px;

  :deep(.el-card__header) {
    padding: 10px 15px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-card__body) {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;

  .close-icon {
    cursor: pointer;
  }
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
}

.message {
  display: flex;
  margin-bottom: 10px;

  .message-content {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.5;
  }

  &.user {
    justify-content: flex-end;
    .message-content {
      background-color: var(--el-color-primary);
      color: white;
    }
  }

  &.assistant {
    justify-content: flex-start;
    .message-content {
      background-color: var(--el-fill-color-light);
    }
  }
}

.input-container {
  padding: 10px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>

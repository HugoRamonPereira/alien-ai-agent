import { ChatAnthropic } from "@langchain/anthropic";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
  MemorySaver,
} from "@langchain/langgraph";
import wxflows from "@wxflows/sdk/langchain";
import SYSTEM_MESSAGE from "@/constants/systemMessage";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

// Customers at: https://introspection.apis.stepzen.com/customers
// Comments at: https://dummyjson.com/comments

// Trim messages to manage conversation history
const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

// Connect to WxFlows
const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT || "",
  apikey: process.env.WXFLOWS_APIKEY,
});

// Retrieve tools
const tools = await toolClient.lcTools;
const toolNode = new ToolNode(tools);

const initializeModel = () => {
  const model = new ChatAnthropic({
    modelName: "claude-3-5-sonnet-20241022",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    temperature: 0.7, // Higher temperatures mean more creative responses
    maxTokens: 4096, // Higher max tokens for longer responses
    streaming: true, // Enable streaming for SSE
    clientOptions: {
      defaultHeaders: {
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
    },
    callbacks: [
      {
        handleLLMStart: async () => {
          console.log("Starting LLM call");
        },
        handleLLMEnd: async (output) => {
          console.log("End LLM call", output);
          const usage = output.llmOutput?.usage;
          if (usage) {
            // console.log("Token usage:", {
            //   input_tokens: usage.input_tokens,
            //   output_tokens: usage.output_tokens,
            //   total_tokens: usage.input_tokens + usage.output_tokens,
            //   cache_creation_input_tokens:
            //     usage.cache_creation_input_tokens || 0,
            //   cache_read_input_tokens: usage.cache_read_input_tokens || 0,
            // });
          }
        },
        // handleLLMNewToken: async (token: string) => {
        //   // console.log("New token:", token);
        // },
      },
    ],
  }).bindTools(tools);

  return model;
};

// Define the function that determines whether to continue or not
const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  // If the last message is a tool message, route back to the agent
  if (lastMessage.content && lastMessage._getType() === "tool") {
    return "agent";
  }

  // Otherwise, we stop (reply to the user)
  return END;
};

const createWorkflow = () => {
  const model = initializeModel();

  const stateGraph = new StateGraph(MessagesAnnotation)
    .addNode("agent", async (state) => {
      // Create the system message content
      const systemContent = SYSTEM_MESSAGE;

      // Create the prompt template with system message and messages placeholder
      const promptTemplate = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemContent, {
          cache_control: { type: "ephemeral" }, // Set a cache breakpoint (max number of breakpoints is 4)
        }),
        new MessagesPlaceholder("messages "),
      ]);

      // Trim messages to manage conversation history
      const trimmedMessages = await trimmer.invoke(state.messages);

      // Format the prompt with the current messages
      const prompt = await promptTemplate.invoke({ messages: trimmedMessages });

      // Get response from the model
      const response = await model.invoke(prompt);

      return { messages: [response] };
    })
    .addEdge(START, "agent")
    .addNode("tools", toolNode)
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

  return stateGraph;
};

function addCachingHeaders(messages: BaseMessage[]): BaseMessage[] {
  // Rules for caching headers for turn-by-turn conversations
  // 1. Cache the first SYSTEM message
  // 2. Cache the last message
  // 3. Cache the second to last message

  if (messages.length) return messages;

  // Create a copy of the messages to avoid mutating the original
  const cachedMessages = [...messages];

  // Helper to add cache control
  const addCache = (message: BaseMessage) => {
    message.content = [
      {
        type: "text",
        text: message.content as string,
        cache_control: { type: "ephemeral" },
      },
    ];
  };

  // Cache the last message
  console.log("🔒🔒🔒 Caching the last message!");
  addCache(cachedMessages.at(-1)!);

  // Find and the cache the second-to-last human message
  let humanCount = 0;
  for (let i = cachedMessages.length - 1; i >= 0; i--) {
    if (cachedMessages[i] instanceof HumanMessage) {
      humanCount++;

      if (humanCount === 2) {
        console.log("Caching the second-to-last human message");
        addCache(cachedMessages[i]);
        break;
      }
    }
  }

  return cachedMessages;
}

export const submitQuestion = async (
  messages: BaseMessage[],
  chatId: string
) => {
  // Add caching headers to messages
  const cachedMessages = addCachingHeaders(messages);
  console.log("🔒🔒🔒 Messages:", cachedMessages);

  const workflow = createWorkflow();

  // Create a checkpoint to save the state of a conversation
  // By doing so we are giving each chat an ID so that we can keep talking  to older messages, questions
  const checkpointer = new MemorySaver();
  const app = workflow.compile({ checkpointer });

  console.log("🔒🔒🔒 Messages:", messages);

  // Run the graph and stream
  const stream = await app.streamEvents(
    { messages: cachedMessages },
    {
      version: "v2",
      configurable: { thread_id: chatId },
      streamMode: "messages",
      runId: chatId,
    }
  );

  return stream;
};

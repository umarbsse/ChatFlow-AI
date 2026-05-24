export const openAIModelOptions = [
  "gpt-5.5",
  "gpt-5.1",
  "gpt-5-mini",
  "gpt-5-nano",

  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",

  "gpt-4o",
  "gpt-4o-mini",

  "o3",
  "o3-mini",
  "o4-mini",
];

export const openAIToolTypeOptions = [
  "web_search",
  "file_search",
];

export const initialOpenAIConfigFormData = {
  OPENAI_API_KEY: "",
  OPENAI_MODEL: "",
  OPENAI_TITLE_MODEL: "",
  CHATGPT_ROLE: "",
  CHATGPT_ROLE_CONTENT: "",
  CHATGPT_TEMPERATURE: "",
  CHATGPT_TITLE_TEMPERATURE: "",
  CHATGPT_TITLE_MAX_TOKENS: "",
  CHATGPT_HISTORY_LIMIT: "",
  CHATGPT_SEND_MSG_FOR_REFERENCE: "",
  CHATGPT_TOOL_TYPE: "",
  CHATGPT_SEARCH_CONTEXT_SIZE: "",
  CHATGPT_CURL_TIMEOUT: "",
  OPENAI_FILE_PURPOSE: "",
};

export const openAIConfigFields = [
  {
    name: "OPENAI_API_KEY",
    label: "OpenAI API Key",
    type: "password",
    icon: "fa-solid fa-key",
    placeholder: "Enter OpenAI API key",
  },
  {
    name: "OPENAI_MODEL",
    label: "OpenAI Model",
    type: "select",
    icon: "fa-solid fa-robot",
    options: openAIModelOptions,
  },
  {
    name: "OPENAI_TITLE_MODEL",
    label: "OpenAI Title Model",
    type: "select",
    icon: "fa-solid fa-heading",
    options: openAIModelOptions,
  },
  {
    name: "CHATGPT_ROLE",
    label: "ChatGPT Role",
    type: "text",
    icon: "fa-solid fa-user-shield",
    placeholder: "system",
  },
  {
    name: "CHATGPT_TEMPERATURE",
    label: "ChatGPT Temperature",
    type: "number",
    icon: "fa-solid fa-temperature-half",
    placeholder: "0.2",
    step: "0.1",
  },
  {
    name: "CHATGPT_TITLE_TEMPERATURE",
    label: "Title Temperature",
    type: "number",
    icon: "fa-solid fa-temperature-half",
    placeholder: "0.2",
    step: "0.1",
  },
  {
    name: "CHATGPT_TITLE_MAX_TOKENS",
    label: "Title Max Tokens",
    type: "number",
    icon: "fa-solid fa-hashtag",
    placeholder: "20",
  },
  {
    name: "CHATGPT_HISTORY_LIMIT",
    label: "History Limit",
    type: "number",
    icon: "fa-solid fa-clock-rotate-left",
    placeholder: "15",
  },
  {
    name: "CHATGPT_SEND_MSG_FOR_REFERENCE",
    label: "Reference Message Limit",
    type: "number",
    icon: "fa-solid fa-link",
    placeholder: "0",
  },
  {
    name: "CHATGPT_TOOL_TYPE",
    label: "Tool Type",
    type: "select",
    icon: "fa-solid fa-screwdriver-wrench",
    options: openAIToolTypeOptions,
  },
  {
    name: "CHATGPT_SEARCH_CONTEXT_SIZE",
    label: "Search Context Size",
    type: "select",
    icon: "fa-solid fa-magnifying-glass",
    options: ["low", "medium", "high"],
  },
  {
    name: "CHATGPT_CURL_TIMEOUT",
    label: "cURL Timeout Seconds",
    type: "number",
    icon: "fa-solid fa-stopwatch",
    placeholder: "120",
  },
  {
    name: "OPENAI_FILE_PURPOSE",
    label: "OpenAI File Purpose",
    type: "text",
    icon: "fa-solid fa-file",
    placeholder: "assistants",
  },
];

export function normalizeOpenAIConfigResponse(responseData) {
  return responseData?.data?.config || responseData?.config || {};
}
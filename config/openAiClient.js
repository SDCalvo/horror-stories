import { Configuration, OpenAIApi } from "openai";

function openAi(temperature) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: temperature,
  });
  const openaiClient = new OpenAIApi(configuration);
  return openaiClient;
}

export default openAi;

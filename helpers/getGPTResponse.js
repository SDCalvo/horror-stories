import openAI from "../config/openAiClient.js";
import { logConsoleMessage } from "./misc.js";

async function getGPTReponse(prompt, temperature = 0) {
  try {
    const openai = openAI(temperature);
    logConsoleMessage("Generating Response");
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
    });
    logConsoleMessage("Response Generated");

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error.response.data);
  }
}
export default getGPTReponse;

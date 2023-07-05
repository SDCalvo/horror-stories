import { Router } from "express";
import {
  generateFirstInstructionPrompt,
  generateReviewPrompt,
  generateReviseStoryPrompt,
} from "../prompts/storyPrompts.js";
import parseMessageContent from "../helpers/parsers.js";
import getGPTReponse from "../helpers/getGPTResponse.js";
import { logConsoleMessage } from "../helpers/misc.js";
const router = Router();

router.post("/", async (req, res) => {
  const {
    genre,
    characters,
    setting,
    mood,
    theme,
    language,
    temperature,
    generations,
  } = req.body;

  if (!temperature || !generations) {
    res.status(400).send("temperature and generations are required parameters");
    return;
  }

  try {
    const finalResponse = [];
    const firstInstructionPrompt = generateFirstInstructionPrompt(
      genre,
      characters,
      setting,
      mood,
      theme,
      language
    );
    const firstInstructionResponse = await getGPTReponse(
      firstInstructionPrompt,
      temperature
    );
    console.log(firstInstructionResponse);
    const { first: story, second: writerNotes } = parseMessageContent(
      firstInstructionResponse
    );

    const tempObject = {
      tempStory: story,
      tempNotes: writerNotes,
      tempReview: "",
      tempInstructions: "",
    };

    let indexes = Array.from({ length: generations }, (_, i) => i); // [0, 1, 2, ..., generations - 1]
    finalResponse.push({
      firstStory: story,
      firstNotes: writerNotes,
    });
    for (let i of indexes) {
      logConsoleMessage(`Generation ${i + 1}`);
      const reviseReviewPrompt = generateReviewPrompt(
        genre,
        characters,
        setting,
        mood,
        theme,
        language,
        tempObject.tempStory,
        tempObject.tempNotes
      );

      const reviseReviewResponse = await getGPTReponse(
        reviseReviewPrompt,
        temperature
      );
      console.log(reviseReviewResponse);
      const { first: revisedReview, second: revisedInstructions } =
        parseMessageContent(reviseReviewResponse);
      finalResponse.push({
        [`instructions${i + 1}`]: revisedInstructions,
        [`review${i + 1}`]: revisedReview,
      });
      tempObject.tempReview = revisedReview;
      tempObject.tempInstructions = revisedInstructions;

      const reviseStoryPrompt = generateReviseStoryPrompt(
        genre,
        characters,
        setting,
        mood,
        theme,
        language,
        tempObject.tempStory,
        tempObject.tempReview,
        tempObject.tempInstructions
      );

      const reviseStoryResponse = await getGPTReponse(
        reviseStoryPrompt,
        temperature
      );
      console.log(reviseStoryResponse);
      const { first: revisedStory, second: revisedNotes } =
        parseMessageContent(reviseStoryResponse);
      finalResponse.push({
        [`notes${i + 1}`]: revisedNotes,
        [`story${i + 1}`]: revisedStory,
      });
      tempObject.tempStory = revisedStory;
      tempObject.tempNotes = revisedNotes;
    }
    const formatedFinalResponse = formatFinalResponse(finalResponse);
    res.send(formatedFinalResponse);
    logConsoleMessage("Response sent");
  } catch (error) {
    console.log(error);
  }
});

function formatFinalResponse(responseArray) {
  let finalResponseObject = {};

  responseArray.forEach((item, index) => {
    for (const [key, value] of Object.entries(item)) {
      finalResponseObject[key] = value;
    }
  });

  return JSON.stringify(finalResponseObject);
}

export default router;

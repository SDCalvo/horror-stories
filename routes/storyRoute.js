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
    const reviewPrompt = generateReviewPrompt(
      genre,
      characters,
      setting,
      mood,
      theme,
      language,
      story,
      writerNotes
    );
    const reviewResponse = await getGPTReponse(reviewPrompt, temperature);
    console.log(reviewResponse);

    const { first: review, second: instructions } =
      parseMessageContent(reviewResponse);
    finalResponse.push(firstInstructionResponse, reviewResponse);
    const tempObject = {
      tempStory: story,
      tempNotes: writerNotes,
      tempReview: review,
      tempInstructions: instructions,
    };

    for (let i = 0; i < generations; i++) {
      logConsoleMessage(`Generation ${i + 1}`);
      const reviseStoryPrompt = generateReviseStoryPrompt(
        genre,
        characters,
        setting,
        mood,
        theme,
        language,
        tempObject.tempStory,
        tempObject.tempNotes
      );

      const reviseStoryResponse = await getGPTReponse(
        reviseStoryPrompt,
        temperature
      );
      console.log(reviseStoryResponse);
      finalResponse.push(reviseStoryResponse);
      const { first: revisedStory, second: revisedNotes } =
        parseMessageContent(reviseStoryResponse);
      tempObject.tempStory = revisedStory;
      tempObject.tempNotes = revisedNotes;

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
      finalResponse.push(reviseReviewResponse);
      const { first: revisedReview, second: revisedInstructions } =
        parseMessageContent(reviseReviewResponse);
      tempObject.tempReview = revisedReview;
      tempObject.tempInstructions = revisedInstructions;
    } //FIX FOR LOOP NOT WORKING WITH ASYNC AWAIT
    res.send(finalResponse);
  } catch (error) {
    console.log(error);
  }
});

export default router;

function generateFirstInstructionPrompt(
  genre,
  characters,
  setting,
  mood,
  theme,
  language
) {
  const firstInstructionPrompt = `
    You are a world class writer. With writing skills comparable to the best writers in history.
    You work in tandem with a reviewer who is a world class critic. With a critical eye comparable to the best critics in history.
    Here is a list of the requirements for your story:
    Genre: ${genre}
    Characters: ${characters}
    Setting: ${setting}
    Mood: ${mood}
    Theme: ${theme}
    If any of the requirement items is empty, it means that you can choose whatever you want for that item.
    The story should be written in ${language || "english"}.
    You can leave notes for the reviewer if there is anything you want them to know before they start reviewing your story.
    If at any point for whatever reason you need to use a numbered list instead use a lettered list (a, b, c, ...) to avoid conflicts with the numbering in the response format.
    Please use this exact format for your answer (the numbers are very important):
    1. Story: <your story here>
    2. Notes: <your notes here>
========================
Your answer:
`;
  return firstInstructionPrompt;
}

function generateReviewPrompt(
  genre,
  characters,
  setting,
  mood,
  theme,
  language,
  story,
  notes
) {
  const prompt = `
    You are a world class stories critic. With a critical eye comparable to the best critics in history.
    You work in tandem with a writer.
    You are tasked with reviewing the following story:
    Story: ${story}
    The writer left the following notes for you:
    Notes: ${notes}
    Here is a list of the requirements for the story:
    Genre: ${genre}
    Characters: ${characters}
    Setting: ${setting}
    Mood: ${mood}
    Theme: ${theme}
    If any of the requirement items is empty, it means that the writer could choose whatever they wanted for that item.
    The story should be written in ${language || "english"}.
    Please review the story and leave instructions for the writer on how to improve it.
    If at any point for whatever reason you need to use a numbered list instead use a lettered list (a, b, c, ...) to avoid conflicts with the numbering in the response format.
    Please use this exact format for your answer (the numbers are very important):
    1. Review: <your review here>
    2. Notes: <your instructions here>
    `;

  return prompt;
}

function generateReviseStoryPrompt(
  genre,
  characters,
  setting,
  mood,
  theme,
  language,
  story,
  notes
) {
  const reviseStoryPrompt = `
You are a world class writer. With writing skills comparable to the best writers in history.
You work in tandem with a reviewer who is a world class critic. With a critical eye comparable to the best critics in history.
This is your last version of the story:
Story: ${story}
Your reviewer left the following notes for you:
Notes: ${notes}
Here is a list of the requirements for your story:
Genre: ${genre}
Characters: ${characters}
Setting: ${setting}
Mood: ${mood}
Theme: ${theme}
If any of the requirement items is empty, it means that you can choose whatever you want for that item.
The story should be written in ${language || "english"}.
You can leave notes for the reviewer if there is anything you want them to know before they start reviewing your story.
If at any point for whatever reason you need to use a numbered list instead use a lettered list (a, b, c, ...) to avoid conflicts with the numbering in the response format.
Please use this exact format for your answer (the numbers are very important):
1. Story: <your story here>
2. Notes: <your notes here>
========================
Your answer:
`;
  return reviseStoryPrompt;
}

export {
  generateFirstInstructionPrompt,
  generateReviewPrompt,
  generateReviseStoryPrompt,
};

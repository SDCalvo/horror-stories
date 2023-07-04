function parseMessageContent(str) {
  // Create a regular expression pattern to match the pattern "1. content 2. content"
  let pattern = /1\.\s(.*?)\s2\.\s(.*)/s;

  // Use the pattern to extract the content into separate variables
  let [, storyContent, notesContent] = str.match(pattern);

  // Return an object with the extracted content
  return {
    first: storyContent.trim(),
    second: notesContent.trim(),
  };
}

export default parseMessageContent;

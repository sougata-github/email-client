"use server";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";

export async function generate(input: string) {
  const stream = createStreamableValue("");

  console.log("input", input);
  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-pro-latest"),
      prompt: `
          ALWAYS RESPOND IN PLAIN TEXT, no html or markdown.
          You are a helpful AI embedded in a email client app that is used to autocomplete sentences, similar to google gmail autocomplete
          The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
          AI is a well-behaved and well-mannered individual.
          AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
          I am writing a piece of text in a notion text editor app.
          Help me complete my train of thought here: <input>${input}</input>
          keep the tone of the text consistent with the rest of the text.
          keep the response short and sweet. Act like a copilot, finish my sentence if need be, but don't try to generate a whole new paragraph.
          Do not add fluff like "I'm here to help you" or "I'm a helpful AI" or anything like that.

          Example:
          Dear Alice, I'm sorry to hear that you are feeling down.

          Output: Unfortunately, I can't help you with that.

          Your output is directly concatenated to the input, so do not add any new lines or formatting, just plain text.

          Also do not repeat what I write.
          `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
/* call this function whenever we press cmd+j */

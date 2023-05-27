// pages/api/chat.js
import { Configuration, OpenAIApi } from "openai";

export default async (req, res) => {
  const { refine_goal, initial_text, previous_text } = req.body;

  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }));

  console.log("debug server: send request")
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "Rewrite a given text to make a further improvement. Your goal to aim for: " + refine_goal + ".\n Only return the raw refined text. Do not add quotations, brackets, arrows, translations and anything extra."},
      // {role: "user", content: "Initial Text: \n\"\"\"\n"
      //     + initial_text + "\n"
      //     + "\"\"\"\n"
      //     + "Improved Text: \n\"\"\"\n"
      //     + previous_text + "\n"
      //     + "\"\"\"\n"
      //     + "Rewrite the text above to make a further improvement. Your goal to aim for: " + refine_goal + ".\n Only return the raw refined text. Do not add quotations, brackets, arrows, translations and anything extra."},
      {role: "user", content: previous_text},
      //{role: "assistant", content: previous_text},
    ],
  });
  console.log("debug server: response received")

  res.status(200).json(response.data);
};

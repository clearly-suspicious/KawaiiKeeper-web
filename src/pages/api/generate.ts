import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function generate(req: any, res: any) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const prompt = req.body.prompt;
  const personality = req.body.personality;

  try {
    const completion = await openai.createCompletion({
      model: "text-curie-001",
      prompt: generatePrompt(prompt, personality),
      max_tokens: 300,
      temperature: 0.9,
    });
    // console.log(completion);
    res.status(200).json({ result: completion.data.choices[0]?.text });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
function generatePrompt(prompt: string, personality: string) {
  const finalPrompt =
    "You are an " +
    personality +
    " person. Reply to the following message based on your personality. Message: " +
    prompt;

  // const finalPrompt =
  //   'Reply to "' + prompt + ' " in an ' + personality + " way.";

  console.log(finalPrompt);
  return finalPrompt;
}

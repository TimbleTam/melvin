import { Configuration, OpenAIApi } from "openai";
import { rage_average } from "./ragechecker";

let conversation_history = "";

function add_user_line(line_from) {
  const message = "\n You: " + line_from;

  conversation_history = conversation_history + message;
  console.log("conversation history: " + conversation_history);
}

function add_melvin_line(line_from) {
  const message = "\n Melvin: " + line_from;

  conversation_history = conversation_history + message;
}

export {add_user_line, add_melvin_line};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a response",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.5,
      max_tokens: 60,
      top_p: 0.3,
      frequency_penalty: 0.8,
      presence_penalty: 0,
      best_of: 5,
      stop: "You: "

    });
    //add_melvin_line(completion.data.choices[0].text.toString());
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
  
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();

    const hist = conversation_history;

    let mood = "He is happy";
    if ( rage_average < 20) {
      mood = "He is happy";
    } else if (rage_average < 40) {
      mood = "He is slightly angry"
    } else if (rage_average < 60) {
      mood = "He is angry"
    } else if (rage_average < 80) {
      mood = "He is very angry"
    } else {
      mood = "He is extremely angry"
    }

    console.log(hist);
  
    return `Melvin is a customer in a shop, ${mood} and wants a refund.
    ${hist}
    You: ${capitalizedAnimal}
    Melvin: `;
  
}

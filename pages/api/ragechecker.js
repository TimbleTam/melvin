import { clear_history, melvin_says } from "../index";

import { Configuration, OpenAIApi } from "openai";

export let rage_average = Math.random() * 100;

let my_melvin = "";

let rage_container = [];

let rage_counter = 3;

export async function new_check() {

    const configuration = new Configuration({
        apiKey: "YOUR SECOND KEY HERE",
    });
    const openai = new OpenAIApi(configuration);

        const newcomp = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt_melv(),
            temperature: 0.7,
        });

        console.log(Number(newcomp.data.choices[0].text));
        if(rage_container.length < rage_counter) {
            if(Number(newcomp.data.choices[0].text) != null && Number(newcomp.data.choices[0].text) != NaN)
            {
                rage_container.push(Number(newcomp.data.choices[0].text));
            } else {
                rage_counter = rage_counter - 1;
            }
            
        }

        if(rage_container.length >= rage_counter) {

            let rage_gross = 0;

            for(var i = 0; i < rage_container.length; i++) {
                rage_gross = rage_gross + rage_container[i];
            }

            rage_average = (rage_gross / rage_counter);

            console.log("average rage: " + rage_average);
            rage_counter = 3;
            rage_container = new Array();
            clear_history();
        }



        return newcomp.data.choices[0].text;
    
}

function generatePrompt_melv() {
    try {
        my_melvin = melvin_says.toString();
    } catch (err) {
        my_melvin = "";
    }

    return `Extract a number between 0 and 100 of how angry melvin is in this conversation:
    ${my_melvin}
    `;
}

// export default async function (req, res) {
//     if (!configuration.apiKey) {
//       res.status(500).json({
//         error: {
//           message: "OpenAI API key not configured, please follow instructions in README.md",
//         }
//       });
//       return;
//     }

//     const animal = req.body.animal || '';
//     if (animal.trim().length === 0) {
//       res.status(400).json({
//         error: {
//           message: "Please enter a valid animal",
//         }
//       });
//       return;
//     }

//     try {
//       const completion = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: generatePrompt(animal),
//         temperature: 0.7,
//       });
//       res.status(200).json({ result: completion.data.choices[0].text });
//     } catch(error) {
//       // Consider adjusting the error handling logic for your use case
//       if (error.response) {
//         console.error(error.response.status, error.response.data);
//         res.status(error.response.status).json(error.response.data);
//       } else {
//         console.error(`Error with OpenAI API request: ${error.message}`);
//         res.status(500).json({
//           error: {
//             message: 'An error occurred during your request.',
//           }
//         });
//       }
//     }

//   }

// async function ask_for_update() {
//     const configuration = new Configuration({
//         apiKey: ,
//     });
//     const openai = new OpenAIApi(configuration);

//     try {
//         const rageresponse = await openai.createCompletion({
//             model: "text-davinci-003",
//             prompt: generatePrompt_melv(),
//             temperature: 0.7,
//         });
//         res.status(200).json({ result: completion.data.choices[0].text });
//         const data = await rageresponse.json();
//         if (rageresponse.status !== 200) {
//             return null;
//         }

//         return data.result;
//     } catch (error) {
//         // Consider implementing your own error handling logic here
//         console.error(error);
//     }
// }

//export {ask_for_update};

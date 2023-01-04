require('@tensorflow/tfjs');
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { new_check, rage_average } from "./api/ragechecker";
import { add_user_line, add_melvin_line } from "./api/generate";


export let melvin_says = [];

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();



  async function onSubmit(event) {
    add_user_line(animalInput.toString());
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
      console.log(data.result);
      add_melvin_line(data.result.toString());
      melvin_says.push(data.result.toString());
      
      check_level();
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      
    }
    
  }

  var scope = {
    splitterStyle: {
        width: 100
    }
  };



const colorBetween = require('color-between');

  return (
    <div>
      <Head>
        <title>Melvin</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        
        <h3>Melvin the angry Customer</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Respond to melvin"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Talk to Melvin" />
        </form>
        <p className={styles.result}>{result}</p>
        <br />
        <h1>Rage-o-meter</h1>
        <div className={styles.rage}>
          <div style={{"width" : rage_average + "%", "background-color" : colorBetween('#55e620', '#e62020', rage_average / 100, 'hex')}} className={styles.nerd}></div>
        </div>
      </main>
    </div>
  );
}

// function check_level() {
//   //generatePrompt_melv();
//   console.log(ask_for_update());
//   //console.log(rageresponse);

// }

async function check_level(event) {
  //event.preventDefault();
  try {
    const response = await fetch(new_check());

    const data = await response;
    // if (response.status !== 200) {
    //   throw data.error || new Error(`Request failed with status ${response.status}`);
    // }

    console.log("rage said: " + data);

  } catch(error) {
    // Consider implementing your own error handling logic here
    console.error(error);
    alert(error.message);
    
  }
  
}

export function clear_history() {
  melvin_says = new Array();
}
import { useState } from "react";
import CONFIG from "../config";
import Buttons from "./Buttons/Buttons";
import { HomeAwaySwitch, NumericalInput, Select } from "./Form";
import Scoreboard from "./Scoreboard";

export default function Main() {
  const [buttons, setButtons] = useState([]);
  const [homeAway, setHomeAway] = useState("away");
  const [awayScore, setAwayScore] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [periods, setPeriods] = useState(2);
  const [currentPeriod] = useState(1);
  const [minutes, setMinutes] = useState(15);

  return (
    <main className="flex flex-col items-center gap-y-4 ">
      <Select
        id="sport-select"
        options={CONFIG.map((sport) => sport.sport)}
        handleChange={(e) => {
          const selectedSport = CONFIG.find(
            (sport) => sport.sport === e.target.value
          );
          setButtons(selectedSport.buttons);
        }}
      />

      <NumericalInput
        id="periods"
        placeholder="Number of Periods"
        defaultValue={periods}
        handleBlur={(e) => {
          setPeriods(e.target.value);
        }}
      />

      <NumericalInput
        id="time"
        placeholder="Time per period? (minutes)"
        defaultValue={minutes}
        handleBlur={(e) => {
          setMinutes(e.target.value);
        }}
      />

      <HomeAwaySwitch
        handleToggle={() => {
          setHomeAway((prev) => (prev === "home" ? "away" : "home"));
        }}
      />

      <Buttons
        buttons={buttons}
        handleClick={(e) => {
          if (homeAway === "home") {
            setHomeScore((prev) => prev + Number(e.target.dataset.count));
          } else {
            setAwayScore((prev) => prev + Number(e.target.dataset.count));
          }
        }}
      />

      <Scoreboard
        homeScore={homeScore}
        awayScore={awayScore}
        minutes={minutes}
        currentPeriod={currentPeriod}
      />
    </main>
  );
}

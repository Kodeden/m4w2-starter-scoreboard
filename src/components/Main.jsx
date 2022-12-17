import { useEffect, useState } from "react";
import CONFIG from "../config";
import Button from "./Buttons/Button";
import Buttons from "./Buttons/Buttons";
import { HomeAwaySwitch, NumericalInput, Select } from "./Form";
import Scoreboard from "./Scoreboard";

export default function Main() {
  const [buttons, setButtons] = useState([]);
  const [homeAway, setHomeAway] = useState("away");
  const [awayScore, setAwayScore] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [periods, setPeriods] = useState(0);
  const [timePerPeriod, setTimePerPeriod] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      const id = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(id);
      };
    }
  }, [timeRemaining, isTimerRunning]);

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
        handleChange={(e) => {
          setPeriods(Math.floor(Number(e.target.value)));
        }}
      />

      <NumericalInput
        id="time"
        placeholder="Time per period? (minutes)"
        defaultValue={timeRemaining / 60}
        handleChange={(e) => {
          setTimePerPeriod(Number(e.target.value));
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
        time={timeRemaining}
        currentPeriod={currentPeriod}
      />

      <div className="flex gap-x-8">
        <Button
          colorClass="bg-green-500"
          text="Start"
          handleClick={() => {
            if (timeRemaining === 0) setTimeRemaining(timePerPeriod * 60);
            setIsTimerRunning(true);
          }}
        />
        <Button
          colorClass="bg-orange-500"
          text="Stop"
          handleClick={() => {
            setIsTimerRunning(false);
          }}
        />

        <Button
          colorClass="bg-yellow-700"
          text="Next Period"
          handleClick={() => {
            setCurrentPeriod((prev) => (prev < periods ? prev + 1 : prev));
            setTimeRemaining(timePerPeriod * 60);
          }}
        />
      </div>
    </main>
  );
}

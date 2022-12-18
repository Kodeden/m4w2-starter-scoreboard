import PropTypes from "prop-types";
import { useState } from "react";
import Button from "../components/Buttons/Button";
import Buttons from "../components/Buttons/Buttons";
import { HomeAwaySwitch } from "../components/Form";
import Scoreboard from "../components/Scoreboard";
import useTimer from "../hooks/useTimer";

export default function Display({ buttons, periods, timePerPeriod }) {
  const [homeAway, setHomeAway] = useState("away");
  const [awayScore, setAwayScore] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(1);

  const [timeRemaining, setTimeRemaining, setIsTimerRunning] = useTimer(
    timePerPeriod * 60
  );

  return (
    <>
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

        <Button
          colorClass="bg-red-500"
          text="Reset Board"
          handleClick={() => {
            window.location.reload(false);
          }}
        />
      </div>
    </>
  );
}

Display.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.number).isRequired,
  periods: PropTypes.number.isRequired,
  timePerPeriod: PropTypes.number.isRequired,
};

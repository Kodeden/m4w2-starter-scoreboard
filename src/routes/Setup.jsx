import PropTypes from "prop-types";
import CONFIG from "../config";
import { NumericalInput, Select } from "../components/Form";
import Button from "../components/Buttons/Button";

export default function Setup({
  setButtons,
  setPeriods,
  setTimePerPeriod,
  setGameOn,
}) {
  return (
    <>
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
        handleChange={(e) => {
          setPeriods(Math.floor(Number(e.target.value)));
        }}
      />

      <NumericalInput
        id="time"
        placeholder="Time per period? (minutes)"
        handleChange={(e) => {
          setTimePerPeriod(Number(e.target.value));
        }}
      />

      <Button
        colorClass="bg-green-500"
        text="Go!"
        handleClick={() => {
          setGameOn(true);
        }}
      />
    </>
  );
}

Setup.propTypes = {
  setButtons: PropTypes.func.isRequired,
  setPeriods: PropTypes.func.isRequired,
  setTimePerPeriod: PropTypes.func.isRequired,
  setGameOn: PropTypes.func.isRequired,
};

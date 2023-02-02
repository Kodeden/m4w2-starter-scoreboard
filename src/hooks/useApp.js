import { useState } from "react";

export default function useApp() {
  const [gameOn, setGameOn] = useState(false);
  const [buttons, setButtons] = useState([]);
  const [periods, setPeriods] = useState(1);
  const [timePerPeriod, setTimePerPeriod] = useState(0);

  return [
    gameOn,
    setGameOn,
    buttons,
    setButtons,
    periods,
    setPeriods,
    timePerPeriod,
    setTimePerPeriod,
  ];
}

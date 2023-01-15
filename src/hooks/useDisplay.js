import { useState } from "react";

export default function useDisplay() {
  const [homeAway, setHomeAway] = useState("away");
  const [awayScore, setAwayScore] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(1);

  return [
    homeAway,
    setHomeAway,
    awayScore,
    setAwayScore,
    homeScore,
    setHomeScore,
    currentPeriod,
    setCurrentPeriod,
  ];
}

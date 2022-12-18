import React from "react";

export default function useTimer(initTime) {
  const [timeRemaining, setTimeRemaining] = React.useState(initTime);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  React.useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      const id = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(id);
      };
    }
  }, [timeRemaining, isTimerRunning]);

  return [timeRemaining, setTimeRemaining, setIsTimerRunning];
}

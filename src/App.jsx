import useApp from "./hooks/useApp";
import Display from "./routes/Display";
import Setup from "./routes/Setup";

function App() {
  const [
    gameOn,
    setGameOn,
    buttons,
    setButtons,
    periods,
    setPeriods,
    timePerPeriod,
    setTimePerPeriod,
  ] = useApp();

  return (
    // Using shorthand for a React Fragment
    <>
      <h1 className="my-4 text-center text-3xl font-extrabold">
        Scoreboard App
      </h1>

      <main className="flex flex-col items-center gap-y-4">
        {!gameOn ? (
          <Setup
            setButtons={setButtons}
            setPeriods={setPeriods}
            setTimePerPeriod={setTimePerPeriod}
            setGameOn={setGameOn}
          />
        ) : (
          <Display
            buttons={buttons}
            periods={periods}
            timePerPeriod={timePerPeriod}
          />
        )}
      </main>
    </>
  );
}

export default App;

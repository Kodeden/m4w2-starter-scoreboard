import PropTypes from "prop-types";

export default function Scoreboard({
  homeScore,
  awayScore,
  minutes,
  currentPeriod,
}) {
  return (
    <section className="flex flex-row gap-x-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl">Home</h2>
        <p className="text-4xl" data-testid="home-score">
          {homeScore}
        </p>
      </div>

      <div className="flex flex-col items-center gap-y-4">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl">Period</h2>
          <p className="text-4xl" data-testid="period">
            {currentPeriod}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl">Time</h2>
          <p className="text-4xl" data-testid="time">
            {minutes}:00
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-2xl">Away</h2>
        <p className="text-4xl" data-testid="away-score">
          {awayScore}
        </p>
      </div>
    </section>
  );
}

Scoreboard.propTypes = {
  homeScore: PropTypes.number,
  awayScore: PropTypes.number,
  minutes: PropTypes.number,
  currentPeriod: PropTypes.number,
};

Scoreboard.defaultProps = {
  homeScore: 0,
  awayScore: 0,
  minutes: 15,
  currentPeriod: 1,
};

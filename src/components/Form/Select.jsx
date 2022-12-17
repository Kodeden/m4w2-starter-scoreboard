import PropTypes from "prop-types";

export default function Select({ id, options, handleChange }) {
  return (
    <>
      <label htmlFor="sport-select" className="sr-only">
        Choose a sport:
      </label>
      <select id={id} onChange={handleChange}>
        <option value="">--Please choose your sport--</option>

        {/* ⚠️ ASSUMPTION: 'option' doesn't have spaces - single words only */}
        {options.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired,
};

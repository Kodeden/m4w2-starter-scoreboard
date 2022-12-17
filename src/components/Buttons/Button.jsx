import PropTypes from "prop-types";

export default function Button({ text, handleClick }) {
  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 text-white"
      data-count={text}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
};

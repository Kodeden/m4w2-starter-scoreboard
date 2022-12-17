import PropTypes from "prop-types";

export default function Button({ colorClass, text, handleClick }) {
  return (
    <button
      className={`rounded ${colorClass} px-4 py-2 text-white`}
      data-count={text}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  colorClass: PropTypes.string,
  text: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  colorClass: "bg-blue-500",
};

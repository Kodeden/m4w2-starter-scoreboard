import PropTypes from "prop-types";

export default function NumericalInput({
  id,
  placeholder,
  defaultValue,
  handleBlur,
}) {
  return (
    <>
      <label htmlFor={id}>{placeholder}</label>
      <input
        id={id}
        type="number"
        className="rounded-md border border-gray-300 p-2"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onBlur={handleBlur}
      />
    </>
  );
}

NumericalInput.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  defaultValue: PropTypes.number,
  handleBlur: PropTypes.func.isRequired,
};

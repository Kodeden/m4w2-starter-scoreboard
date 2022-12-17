import PropTypes from "prop-types";

export default function NumericalInput({
  id,
  placeholder,
  defaultValue,
  handleChange,
}) {
  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={id}>{placeholder}</label>
      <input
        id={id}
        type="number"
        className="rounded-md border border-gray-300 p-2"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={handleChange}
      />
    </div>
  );
}

NumericalInput.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  defaultValue: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
};

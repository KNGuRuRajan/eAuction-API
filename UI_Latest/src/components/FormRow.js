const FormRow = ({ type, name, value, handleChange, labelText, disabled, placeHolder, minLength, maxLength }) => {
  return (
    <div className='form-row'>
      <label htmlFor={name} className='form-label'>
        {labelText || name}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className='form-input'
        disabled = {disabled}
        placeholder ={placeHolder}
        minLength={minLength}
        maxLength={maxLength}
      />
    </div>
  );
};
export default FormRow;

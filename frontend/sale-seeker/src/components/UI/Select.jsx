export default function Select({ label, id, error, options, value, ...props }) {
  return (
    <>
      <label className="block text-sm font-bold" htmlFor={id}>
        {label}
      </label>
      <select id={id} name={id} defaultValue={value?.toLowerCase()} {...props}>
        <option value="">-- Select an option --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </>
  );
}

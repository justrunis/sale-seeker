export default function Input({ label, id, error, ...props }) {
  return (
    <>
      <label className="block text-sm font-bold" htmlFor={id}>
        {label}
      </label>
      <input id={id} name={id} {...props} />
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </>
  );
}

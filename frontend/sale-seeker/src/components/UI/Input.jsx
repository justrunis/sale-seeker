export default function Input({ label, id, error, isTextArea, ...props }) {
  return (
    <>
      <label className="block text-sm font-bold" htmlFor={id}>
        {label}
      </label>
      {isTextArea ? (
        <textarea id={id} name={id} {...props} />
      ) : (
        <input id={id} name={id} {...props} />
      )}
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </>
  );
}

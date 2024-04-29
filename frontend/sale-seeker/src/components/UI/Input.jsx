import TextareaAutosize from "react-textarea-autosize";

export default function Input({
  label,
  id,
  error,
  isTextArea,
  value,
  ...props
}) {
  return (
    <>
      <label className="block text-sm font-bold" htmlFor={id}>
        {label}
      </label>
      {isTextArea ? (
        <TextareaAutosize
          id={id}
          name={id}
          value={value}
          {...props}
          style={{ height: value ? "fit-content" : "initial" }}
        />
      ) : (
        <input id={id} name={id} value={value} {...props} />
      )}
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </>
  );
}

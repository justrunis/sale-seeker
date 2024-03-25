import { useState } from "react";

export function useInput(defaultValue, validationFn) {
  const [value, setValue] = useState(defaultValue);
  const [isTouched, setIsTouched] = useState(false);

  const isValid = validationFn(value);
  const hasError = isTouched && !isValid;

  function valueChangeHandler(event) {
    setValue(event.target.value);
  }

  function inputBlurHandler() {
    setIsTouched(true);
  }

  function reset() {
    setValue(defaultValue);
    setIsTouched(false);
  }

  return {
    value,
    isValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
}

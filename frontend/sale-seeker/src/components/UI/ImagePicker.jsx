import { useRef, useState } from "react";

export default function ImagePicker({ label, name, value, onChange }) {
  const [pickedImage, setPickedImage] = useState();
  const imageInput = useRef();

  function handlePickClick() {
    imageInput.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
    onChange(file);
  }

  return (
    <div className="flex flex-col items-start">
      <label htmlFor={name} className="text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        accept=".jpg,.jpeg,.png"
        ref={imageInput}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <div className="relative w-40 h-40 mb-5">
        <img
          src={pickedImage || value}
          alt="Pick an image"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-bl-md"
          onClick={handlePickClick}
        >
          Pick Image
        </button>
      </div>
    </div>
  );
}

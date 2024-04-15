import ErrorBlock from "./UI/ErrorBlock";
import Input from "./UI/Input";
import LoadingIndicator from "./UI/LoadingIndicator";
import Select from "./UI/Select";
import { useState } from "react";

export default function ItemForm({
  item,
  onSubmit,
  onClose,
  isPending,
  isError,
  error,
}) {
  const inputClasses =
    "mt-1 p-2 block w-full border border-secondary rounded-md shadow-sm focus:outline-none mb-5";

  const selectOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "books", label: "Books" },
    { value: "furniture", label: "Furniture" },
    { value: "toys", label: "Toys" },
    { value: "sports", label: "Sports" },
    { value: "beauty", label: "Beauty" },
    { value: "food", label: "Food" },
    { value: "jewelry", label: "Jewelry" },
    { value: "tools", label: "Tools" },
    { value: "music", label: "Music" },
    { value: "clothing", label: "Clothing" },
    { value: "pets", label: "Pets" },
    { value: "home", label: "Home" },
    { value: "garden", label: "Garden" },
    { value: "health", label: "Health" },
    { value: "movies", label: "Movies" },
    { value: "games", label: "Games" },
    { value: "art", label: "Art" },
    { value: "collectibles", label: "Collectibles" },
    { value: "other", label: "Other" },
  ];

  const [editingItem, setEditingItem] = useState({
    title: item?.title || "",
    price: item?.price || "",
    image: item?.image || "",
    description: item?.description || "",
    category: item?.category || "",
  });

  function handleSubmit(event, item) {
    event.preventDefault();
    if (item) {
      onSubmit(editingItem, item.id);
    } else {
      onSubmit(editingItem);
    }
  }

  return (
    <form className="p-20" onSubmit={() => handleSubmit(event, item)}>
      {item ? (
        <h2 className="text-xl font-semibold mb-5">Edit Item</h2>
      ) : (
        <h2 className="text-xl font-semibold mb-5">Add Item</h2>
      )}
      <Input
        label="Title"
        value={editingItem?.title}
        onChange={(e) =>
          setEditingItem({ ...editingItem, title: e.target.value })
        }
        required
        className={inputClasses}
      />
      <Input
        label="Price"
        value={editingItem?.price}
        onChange={(e) => {
          const price = parseFloat(e.target.value);
          setEditingItem({ ...editingItem, price });
        }}
        required
        type="number"
        className={inputClasses}
      />
      <Input
        label="Image URL"
        value={editingItem?.image}
        onChange={(e) =>
          setEditingItem({ ...editingItem, image: e.target.value })
        }
        required
        className={inputClasses}
      />
      <Input
        label="Description"
        value={editingItem?.description}
        onChange={(e) =>
          setEditingItem({ ...editingItem, description: e.target.value })
        }
        required
        isTextArea={true}
        className={inputClasses}
      />
      <div className="mb-4">
        <Select
          id="category"
          name="category"
          label="Category"
          value={item?.category}
          onChange={(e) =>
            setEditingItem({ ...editingItem, category: e.target.value })
          }
          defaultValue={editingItem?.category.toLowerCase()}
          options={selectOptions}
          className="mt-1 p-2 block w-full border border-secondary rounded-md shadow-sm focus:outline-none"
        />
      </div>
      {isError && (
        <ErrorBlock
          title="An error occurred!"
          message={error.info?.message || "Failed to create item."}
        />
      )}
      {isPending && <LoadingIndicator />}
      <div className="mb-4">
        <button
          disabled={isPending}
          type="submit"
          className="w-full bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter"
        >
          {item ? "Edit" : "Add"}
        </button>
      </div>
      <div className="mb-4">
        <button
          disabled={isPending}
          onClick={onClose}
          className="w-full bg-red-400 hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white dark:bg-primary-dark dark:hover:bg-primary-darker dark:focus:ring-primary-lighter"
        >
          Close
        </button>
      </div>
    </form>
  );
}

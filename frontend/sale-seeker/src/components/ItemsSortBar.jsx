export default function ItemsSortBar({ setSortBy, items }) {
  const selectOptions = [
    { value: "title", label: "Title" },
    { value: "price", label: "Price" },
    { value: "category", label: "Category" },
  ];

  return (
    <div className="">
      <p className="text-lg font-bold">Sort by:</p>
      <select
        className="p-2 border border-secondary rounded-md shadow-sm focus:outline-none"
        onChange={(event) => setSortBy(event.target.value)}
      >
        {selectOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button className="btn btn-primary">Find</button>
    </div>
  );
}

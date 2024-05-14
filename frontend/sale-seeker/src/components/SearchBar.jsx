import Select from "../components/UI/Select";
import Input from "../components/UI/Input";

export default function SearchBar({ handleSearch, handlePriceSort }) {
  return (
    <div className="bg-primary py-4 text-neutral-content flex flex-col justify-between p-5 gap-2 border-t">
      <Input
        label="Search"
        labelClass="text-white"
        id="search"
        placeholder="Search for items..."
        className="input input-bordered text-base-content"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}

import Header from "../Header";
import ItemsList from "../ItemsList";

export default function MyItems() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-10 bg-secondary h-100 flex-grow">
        <h1 className="text-3xl font-bold mb-4 text-center mt-5">My Items</h1>
        <div className="menu bg-base-100 w-100 rounded-box py-8">
          <ItemsList showMyItems={true} />
        </div>
      </div>
    </div>
  );
}

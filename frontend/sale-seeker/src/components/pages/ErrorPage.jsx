import Header from "../Header";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse flex-grow lg:flex-row md:gap-28 gap-16 bg-secondary">
        <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
          <h1 className="my-2 text-gray-800 font-bold text-2xl">
            Looks like you've found the doorway to the great nothing
          </h1>
          <p className="my-2 text-gray-800 mb-5">
            Sorry about that! Please visit our homepage to get where you need to
            go.
          </p>
          <Link to="/home" className="btn btn-primary">
            Take me there!
          </Link>
        </div>
        <div>
          <img
            src="https://i.ibb.co/ck1SGFJ/Group.png"
            alt="404 illustration"
          />
        </div>
      </div>
    </div>
  );
}

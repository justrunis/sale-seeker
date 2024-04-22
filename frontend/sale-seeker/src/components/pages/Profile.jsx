import Header from "../Header";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, queryClient } from "../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import ProfileInformation from "../ProfileInformation";
import UserOrders from "../UserOrders";
import { getToken, getUserId } from "../../auth/auth";

export default function Profile() {
  const token = getToken();
  const userId = getUserId(token);

  console.log(userId);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", { id: userId }],
    queryFn: ({ signal }) => fetchUser({ signal, id: userId }),
  });

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center container mx-auto p-10 bg-secondary h-100">
        <h1 className="text-3xl font-bold mb-4 text-center mt-5">Profile</h1>
        {isError && (
          <div className="flex justify-center">
            <ErrorBlock
              title="An error occurred"
              message={
                error.message || "An error occurred while fetching the user."
              }
            />
          </div>
        )}
        {isLoading && (
          <div className="mt-8 flex justify-center">
            <LoadingIndicator />
          </div>
        )}
        {!isLoading && !isError && (
          <div className="mt-8 flex flex-col">
            <ProfileInformation user={user} />
            <UserOrders userId={userId} />
          </div>
        )}
      </div>
    </>
  );
}

import Header from "../Header";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, queryClient } from "../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import ProfileInformation from "../ProfileInformation";
import UserOrders from "../UserOrders";
import { getToken, getUserId } from "../../auth/auth";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const token = getToken();
  const userId = getUserId(token);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", { id: userId }],
    queryFn: ({ signal }) => fetchUser({ signal, id: userId }),
  });

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-10 bg-secondary h-100 flex-grow">
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
            <Tabs onSelect={(index) => setSelectedTabIndex(index)}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <TabList className="flex bg-base-100 p-2 rounded-t-md gap-5">
                  <Tab
                    className={
                      selectedTabIndex === 0
                        ? "btn btn-primary"
                        : "btn btn-secondary"
                    }
                  >
                    Profile
                  </Tab>
                  <Tab
                    className={
                      selectedTabIndex === 1
                        ? "btn btn-primary"
                        : "btn btn-secondary"
                    }
                  >
                    My Orders
                  </Tab>
                </TabList>
              </motion.div>
              <TabPanel>
                <ProfileInformation user={user} />
              </TabPanel>
              <TabPanel>
                <UserOrders userId={userId} />
              </TabPanel>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

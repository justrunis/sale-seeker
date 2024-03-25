import { useState, useEffect, useCallback } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || "Something went wrong, failed to send request!"
    );
  }
  return resData;
}

export default function useHttp(url, config, initialData) {
  const [error, setError] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  function clearData() {
    setData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      setError(undefined);
      try {
        const resData = await sendHttpRequest(url, { ...config, body: data });
        setData(resData);
        setIsLoading(false);
        return { data: resData };
      } catch (error) {
        setError(error.message || "Something went wrong!");
        setIsLoading(false);
        return { error: error.message || "Something went wrong!" };
      }
    },
    [url, config]
  );

  useEffect(() => {
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData,
  };
}

import axiosInstance from "@/config/axios";
import { useState, useCallback } from "react";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (config) => {
    try {
      setLoading(true);
      setError(null);

      const configWithTimeout = {
        ...config,
        timeout: config.timeout || 60000,
      };

      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => {
        timeoutController.abort();
      }, configWithTimeout.timeout);

      try {
        let signal = timeoutController.signal;
        if (config.signal) {
          signal = combineSignals(timeoutController.signal, config.signal);
        }

        const response = await axiosInstance({
          ...configWithTimeout,
          signal,
        });

        clearTimeout(timeoutId);
        return response.data;
      } catch (err) {
        clearTimeout(timeoutId);

        // Check if the request was aborted (either by timeout or manually)
        if (
          err.name === "AbortError" ||
          err.code === "ECONNABORTED" ||
          err.code === "ERR_CANCELED"
        ) {
          // Only throw timeout error if it was our timeout that triggered
          if (timeoutController.signal.aborted) {
            throw new Error("Request timed out");
          }
          // For manual cancellation, throw a specific error
          throw new Error("REQUEST_CANCELLED");
        }
        throw err;
      }
    } catch (err) {
      // Don't set error state or show error message for cancelled requests
      if (err.message === "REQUEST_CANCELLED") {
        setError(null); // Clear any existing errors
        throw err;
      }

      let errorMessage = "Something went wrong";
      if (err.message === "Request timed out") {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendRequest, loading, error };
};

// Utility function to combine multiple abort signals
function combineSignals(...signals) {
  const controller = new AbortController();

  if (signals.some((signal) => signal.aborted)) {
    controller.abort();
    return controller.signal;
  }

  const cleanup = signals.map((signal) =>
    signal.addEventListener("abort", () => controller.abort())
  );

  controller.signal.addEventListener("abort", () => {
    cleanup.forEach((removeListener) => removeListener());
  });

  return controller.signal;
}

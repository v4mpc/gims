import { putItem } from "../utils.jsx";
import { useMutation } from "@tanstack/react-query";

export function useServiceMutation({ successCallBack, errorCallBack }) {
  const { mutate, isLoading } = useMutation({
    mutationFn: putItem,
    onSuccess: (response) => {
      if (successCallBack) {
        successCallBack(response);
      }
    },
    onError: (error) => {
      if (errorCallBack) {
        errorCallBack(error);
      }
    },
  });
  return { mutate, isLoading };
}

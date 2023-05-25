import { useContext } from "react";
import { RoleContext } from "../DWN/provider";

export const useErrorHandler = (error) => {
  const RoleCtx = useContext(RoleContext);
  const { setError } = useContext(RoleCtx);

  const handleError = (error) => {
    setError(error);
    console.log("setError", error);
  };
  return handleError;
};

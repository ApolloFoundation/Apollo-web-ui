import { useCallback } from "react";
import { useDispatch } from "react-redux"
import { formatTimestamp } from "../helpers/util/time";

export const useFormatTimestamp = () => {
  const dispatch = useDispatch();

  return useCallback((timestamp) => dispatch(formatTimestamp(timestamp)));
}

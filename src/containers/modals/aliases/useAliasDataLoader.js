import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getModalDataSelector } from "../../../selectors";
import { getAliasAction } from "../../../actions/aliases";

export const useAliasDataLoader = () => {
  const dispatch = useDispatch();
  const modalData = useSelector(getModalDataSelector);
  const [alias, setAlias] = useState(null);
  
  const getAlias = useCallback(async () => {
    const aliasResponse = await dispatch(getAliasAction({ alias: modalData }));

    if (aliasResponse) {
        setAlias(aliasResponse);
    }
  }, [dispatch]);

  useEffect(() => {
    getAlias();
  }, [getAlias]);

  return alias;
}

import qs from "qs";
import { useHistory } from "react-router-dom";

export function useQueryController() {
  const history = useHistory();
  const queryParams = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });

  const setParams = (field: string, params: string | string[]): void => {
    queryParams[field] = Array.isArray(params) ? params.join(",") : params;
    history.push(`?${qs.stringify(queryParams)}`);
  };

  const addParam = (field: string, param: string): void => {
    if (!queryParams[field]) {
      queryParams[field] = param;
    } else {
      queryParams[field] = [queryParams[field], param].join(",");
    }
    history.push(`?${qs.stringify(queryParams)}`);
  };

  const toggleParam = (field: string, param: string): void => {
    if (!queryParams[field]) {
      queryParams[field] = param;
    } else {
      const params = (queryParams[field] as string).split(",");
      if (params.includes(param)) {
        params.splice(params.indexOf(param), 1);
      } else {
        params.push(param);
      }

      if (params.length === 0) {
        delete queryParams[field];
      } else {
        queryParams[field] = params.join(",");
      }
    }
    history.push(`?${qs.stringify(queryParams)}`);
  };

  const removeParams = (field: string, params: string | string[]): void => {
    if (!queryParams[field]) return;

    const filteredParams = (queryParams[field] as string)
      .split(",")
      .filter((param: string) => {
        if (Array.isArray(params)) {
          return !params.includes(param);
        }
        return param !== params;
      });
    if (!filteredParams.length) {
      delete queryParams[field];
    } else {
      queryParams[field] = filteredParams.join(",");
    }
    history.push(`?${qs.stringify(queryParams)}`);
  };

  const getValues = (field: string): string[] => {
    if (!queryParams[field]) {
      return [];
    }

    return (queryParams[field] as string).split(",");
  };

  const removeField = (field: string) => {
    delete queryParams[field];
    history.push(`?${qs.stringify(queryParams)}`);
  };

  return {
    setParams,
    addParam,
    toggleParam,
    removeParams,
    getValues,
    removeField,
  };
}

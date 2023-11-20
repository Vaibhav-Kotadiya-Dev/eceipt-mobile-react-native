
import { useQuery } from "react-query";

const useCustomQuery = (...options) => {
  const query = useQuery(...options);
  return query;
};

export default useCustomQuery;
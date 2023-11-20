import { useMutation } from "react-query";

const useCustomMutation = (...options) => {
    const mutation = useMutation(...options);
    return mutation;
};

export default useCustomMutation;
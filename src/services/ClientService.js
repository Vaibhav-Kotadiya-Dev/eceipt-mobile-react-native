import { API_URL } from '../../config';
import Api from '../contexts/Api';
import { useQueryClient } from 'react-query';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';
import { QUERY } from '../common/Constants';
import { GetAuthHeader } from '../common/functions';

const DEFAULT_ALL_RECORD_PAGE_SIZE = 1000;
const BASE_URL = API_URL.BE_URL;

const deleteHelper = (id) => {
  return Api.POST(BASE_URL + `client/delete?id=${id}`, null, { headers: GetAuthHeader() });
}

const createHelper = (element) => {
  return Api.POST(BASE_URL + 'client/create', element, { headers: GetAuthHeader() });
}

const updateHelper = (element) => {
  return Api.POST(BASE_URL + 'client/update', element, { headers: GetAuthHeader() });
}

const getAllHelper = (page, pageSize) => {
  return Api.GET(BASE_URL + `client/getall?page=${page}&pageSize=${pageSize}`, { headers: GetAuthHeader() });
}

export const useAllClient = (onSuccess, onError, page, pageSize, sortBy) => {
  return useCustomQuery([QUERY.ALL_CLIENT, page, pageSize, sortBy], () => getAllHelper(page, pageSize, sortBy), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
}

export const useAllClientNoPaging = (onSuccess, onError) => {
  return useCustomQuery([QUERY.ALL_CLIENT_NP], () => getAllHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE), {
      onSuccess,
      onError,
      select: (data) => { return data?.data },
  })
}


export const useDeleteClient = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(deleteHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_CLIENT)
      }
  })
}

export const useCreateClient = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(createHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_CLIENT)
      }
  })
}

export const useUpdateClient = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_CLIENT)
      }
  })
}

// Code for dynamic scroll list

// import { API_URL } from '../../config';
// import Api from '../contexts/Api';
// import { useQueryClient, useInfiniteQuery } from 'react-query';
// import useCustomMutation from '../hooks/useCustomMutation';
// import useCustomQuery from '../hooks/useCustomQuery';
// import { QUERY } from '../common/Constants';
// import { GetAuthHeader } from '../common/functions';

// const DEFAULT_ALL_RECORD_PAGE_SIZE = 1000;
// const BASE_URL = API_URL.BE_URL;

// const deleteHelper = (id) => {
//   return Api.POST(BASE_URL + `client/delete?id=${id}`, null, { headers: GetAuthHeader() });
// }

// const createHelper = (element) => {
//   return Api.POST(BASE_URL + 'client/create', element, { headers: GetAuthHeader() });
// }

// const updateHelper = (element) => {
//   return Api.POST(BASE_URL + 'client/update', element, { headers: GetAuthHeader() });
// }

// const getAllHelper = (page, pageSize) => {
//   return Api.GET(BASE_URL + `client/getall?page=${page}&pageSize=${pageSize}`, { headers: GetAuthHeader() });
// }

// const getAllClientHelper = async ({ pageParam = 0 }) => {
//   const res = await Api.GET(BASE_URL + `client/getall?page=${pageParam}&pageSize=10`, { headers: GetAuthHeader() });
//   return {
//     data: res?.data?.data?.data,
//     nextPage: pageParam + 1,
//   };
// }

// export const useAllClient = (onSuccess, onError, page, pageSize, sortBy) => {
//   return useInfiniteQuery([QUERY.ALL_CLIENT], getAllClientHelper, {
//     getNextPageParam: (lastPage) => {
// 			if (lastPage.data?.data?.length < 10) return undefined;
//       return lastPage.nextPage;
//     },
//   });
// }

// export const useAllClientNoPaging = (onSuccess, onError) => {
//   return useCustomQuery([QUERY.ALL_CLIENT_NP], () => getAllHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE, "name,asc"), {
//       onSuccess,
//       onError,
//       select: (data) => { return data?.data },
//   })
// }


// export const useDeleteClient = (onSuccess, onError) => {
//   const queryClient = useQueryClient()
//   return useCustomMutation(deleteHelper, {
//       onSuccess,
//       onError,
//       onSettled: () => {
//           queryClient.invalidateQueries(QUERY.ALL_CLIENT)
//       }
//   })
// }

// export const useCreateClient = (onSuccess, onError) => {
//   const queryClient = useQueryClient()
//   return useCustomMutation(createHelper, {
//       onSuccess,
//       onError,
//       onSettled: () => {
//           queryClient.invalidateQueries(QUERY.ALL_CLIENT)
//       }
//   })
// }

// export const useUpdateClient = (onSuccess, onError) => {
//   const queryClient = useQueryClient()
//   return useCustomMutation(updateHelper, {
//       onSuccess,
//       onError,
//       onSettled: () => {
//           queryClient.invalidateQueries(QUERY.ALL_CLIENT)
//       }
//   })
// }
import { API_URL } from '../../config';
import Api from '../contexts/Api';
import { useQueryClient, useInfiniteQuery } from 'react-query';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';
import { QUERY } from '../common/Constants';
import { GetAuthHeader } from '../common/functions';

const DEFAULT_ALL_RECORD_PAGE_SIZE = 1000;
const BASE_URL = API_URL.BE_URL;

const getAllUomHelper = (page, pageSize, sortBy) => {
  var params = {
      sortBy: sortBy,
      page: page,
      pageSize: pageSize
  }
  return Api.GET(BASE_URL + 'uom/getall', { headers: GetAuthHeader(), params: params });
};

const getAllCurrencyHelper = (page, pageSize, sortBy) => {
  var params = {
      sortBy: sortBy,
      page: page,
      pageSize: pageSize
  }
  return Api.GET(BASE_URL + 'currency/getall', { headers: GetAuthHeader(), params: params });
};

const createHelper = (element) => {
  return Api.POST(BASE_URL + 'product/create', element, { headers: GetAuthHeader() });
};

const getAllProductsHelper = (page, pageSize) => {
  return Api.GET(BASE_URL + `product/getall?page=${page}&pageSize=${pageSize}`, { headers: GetAuthHeader() });
}

const deleteHelper = (id) => {
  return Api.POST(BASE_URL + `product/delete?id=${id}`, null, { headers: GetAuthHeader() });
};

const getByIdHelper = (id) => {
  return Api.GET(BASE_URL + `product/get?id=${id}`, { headers: GetAuthHeader()});
};

const updateHelper = (element) => {
  return Api.POST(BASE_URL + 'product/update', element, { headers: GetAuthHeader() });
};

export const useUpdateProduct = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_PRODUCT)
      }
  })
};

export const useFindProductById = (onSuccess, onError, id) => {
  return useCustomQuery([QUERY.SINGLE_PRODUCT, id], () => getByIdHelper(id), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      enabled: id !== null
  })
};

export const useDeleteProduct = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(deleteHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_PRODUCT)
      }
  })
};

export const useAllProduct = (onSuccess, onError, page, pageSize) => {
  return useCustomQuery([QUERY.ALL_PRODUCT, page, pageSize], () => getAllProductsHelper(page, pageSize), {
    onSuccess,
    onError,
    select: (data) => { return data.data },
    keepPreviousData: true
  });
};

export const useAllUomNoPaging = (onSuccess, onError) => {
  return useCustomQuery([QUERY.ALL_UOM_NP], () => getAllUomHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE, "uom,asc"), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
};

export const useAllCurrencyNoPaging = (onSuccess, onError) => {
  return useCustomQuery([QUERY.ALL_CURRENCY_NP], () => getAllCurrencyHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE, "currency,asc"), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
};

export const useCreateProduct = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(createHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_PRODUCT)
      }
  })
};


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

// const getAllUomHelper = (page, pageSize, sortBy) => {
//   var params = {
//       sortBy: sortBy,
//       page: page,
//       pageSize: pageSize
//   }
//   return Api.GET(BASE_URL + 'uom/getall', { headers: GetAuthHeader(), params: params });
// };

// const getAllCurrencyHelper = (page, pageSize, sortBy) => {
//   var params = {
//       sortBy: sortBy,
//       page: page,
//       pageSize: pageSize
//   }
//   return Api.GET(BASE_URL + 'currency/getall', { headers: GetAuthHeader(), params: params });
// };

// const createHelper = (element) => {
//   return Api.POST(BASE_URL + 'product/create', element, { headers: GetAuthHeader() });
// };

// const getAllProductsHelperNoPaging = (page, pageSize) => {
//   return Api.GET(BASE_URL + `product/getall?page=${page}&pageSize=${pageSize}`, { headers: GetAuthHeader() });
// }

// const getAllProductHelper = async ({ pageParam = 0 }) => {
//   const res = await Api.GET(BASE_URL + `product/getall?page=${pageParam}&pageSize=10`, { headers: GetAuthHeader() });
//   return {
//     data: res?.data?.data?.data,
//     nextPage: pageParam + 1,
//   };
// };

// const deleteHelper = (id) => {
//   return Api.POST(BASE_URL + `product/delete?id=${id}`, null, { headers: GetAuthHeader() });
// };

// const getByIdHelper = (id) => {
//   return Api.GET(BASE_URL + `product/get?id=${id}`, { headers: GetAuthHeader()});
// };

// const updateHelper = (element) => {
//   return Api.POST(BASE_URL + 'product/update', element, { headers: GetAuthHeader() });
// };

// export const useUpdateProduct = (onSuccess, onError) => {
//   const queryClient = useQueryClient()
//   return useCustomMutation(updateHelper, {
//       onSuccess,
//       onError,
//       onSettled: () => {
//           queryClient.invalidateQueries(QUERY.ALL_PRODUCT)
//       }
//   })
// };

// export const useFindProductById = (onSuccess, onError, id) => {
//   return useCustomQuery([QUERY.SINGLE_PRODUCT, id], () => getByIdHelper(id), {
//       onSuccess,
//       onError,
//       select: (data) => { return data.data },
//       enabled: id !== null
//   })
// };

// export const useDeleteProduct = (onSuccess, onError) => {
//   const queryClient = useQueryClient()
//   return useCustomMutation(deleteHelper, {
//       onSuccess,
//       onError,
//       onSettled: () => {
//           queryClient.invalidateQueries(QUERY.ALL_PRODUCT)
//       }
//   })
// };

// export const useAllProduct = () => {
//   return useInfiniteQuery([QUERY.ALL_PRODUCT], getAllProductHelper, {
//     getNextPageParam: (lastPage) => {
// 			if (lastPage.data?.data?.length < 10) return undefined;
//       return lastPage.nextPage;
//     },
//   });
// };

// export const useAllProductNoPaging = (onSuccess, onError, page, pageSize) => {
//   return useCustomQuery([QUERY.ALL_PRODUCT, page, pageSize], () => getAllProductsHelperNoPaging(page, pageSize), {
//       onSuccess,
//       onError,
//       select: (data) => { return data.data },
//       keepPreviousData: true
//   })
// }

// export const useAllUomNoPaging = (onSuccess, onError) => {
//   return useCustomQuery([QUERY.ALL_UOM_NP], () => getAllUomHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE, "uom,asc"), {
//       onSuccess,
//       onError,
//       select: (data) => { return data.data },
//       keepPreviousData: true
//   })
// };

// export const useAllCurrencyNoPaging = (onSuccess, onError) => {
//   return useCustomQuery([QUERY.ALL_CURRENCY_NP], () => getAllCurrencyHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE, "currency,asc"), {
//       onSuccess,
//       onError,
//       select: (data) => { return data.data },
//       keepPreviousData: true
//   })
// };

// export const useCreateProduct = (onSuccess, onError) => {
//   const queryClient = useQueryClient()
//   return useCustomMutation(createHelper, {
//       onSuccess,
//       onError,
//       onSettled: () => {
//           queryClient.invalidateQueries(QUERY.ALL_PRODUCT)
//       }
//   })
// };

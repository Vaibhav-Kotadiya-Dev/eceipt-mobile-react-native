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
  return Api.POST(BASE_URL + `category/delete?id=${id}`, null, { headers: GetAuthHeader() });
}

const createHelper = (element) => {
  return Api.POST(BASE_URL + 'category/create', element, { headers: GetAuthHeader() });
}

const updateHelper = (element) => {
  return Api.POST(BASE_URL + 'category/update', element, { headers: GetAuthHeader() });
}

const getAllHelper = (page, pageSize) => {
  return Api.GET(BASE_URL + `category/getall?page=${page}&pageSize=${pageSize}`, { headers: GetAuthHeader() });
}

export const useAllCategory = (onSuccess, onError, page, pageSize, sortBy) => {
  return useCustomQuery([QUERY.ALL_CATEGORY, page, pageSize, sortBy], () => getAllHelper(page, pageSize, sortBy), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
}

export const useAllCategoryNoPaging = (onSuccess, onError) => {
  return useCustomQuery([QUERY.ALL_CATEGORY_NP], () => getAllHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE, "name,asc"), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
}

export const useDeleteCategory = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(deleteHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_CATEGORY)
      }
  })
}

export const useCreateCategory = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(createHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_CATEGORY)
      }
  })
}

export const useUpdateCategory = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_CATEGORY)
      }
  })
}

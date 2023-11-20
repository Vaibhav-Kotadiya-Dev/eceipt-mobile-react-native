import { API_URL } from '../../config';
import Api from '../contexts/Api';
import { useQueryClient } from 'react-query';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';
import { QUERY } from '../common/Constants';
import { GetAuthHeader } from '../common/functions';

const BASE_URL = API_URL.BE_URL;
const DEFAULT_ALL_RECORD_PAGE_SIZE = 1000;

const deleteHelper = (id) => {
  return Api.POST(BASE_URL + `termtype/delete?id=${id}`, null, { headers: GetAuthHeader() });
}

const createHelper = (element) => {
  return Api.POST(BASE_URL + 'termtype/create', element, { headers: GetAuthHeader() });
}

const updateHelper = (element) => {
  return Api.POST(BASE_URL + 'termtype/update', element, { headers: GetAuthHeader() });
}

const getAllHelper = (page, pageSize) => {
  return Api.GET(BASE_URL + `termtype/getall?&page=${page}&pageSize=${pageSize}`, { headers: GetAuthHeader() });
}

export const useAllTermType = (onSuccess, onError, page, pageSize) => {
  return useCustomQuery([QUERY.ALL_TERMS_TYPE, page, pageSize], () => getAllHelper(page, pageSize), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
}

export const useAllTermTypeNoPaging = (onSuccess, onError) => {
  return useCustomQuery([QUERY.ALL_TERMS_TYPE_NP], () => getAllHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE), {
      onSuccess,
      onError,
      select: (data) => { return data?.data },
  })
}

export const useDeleteTermType = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(deleteHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_TERMS_TYPE)
      }
  })
}

export const useCreateTermType = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(createHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_TERMS_TYPE)
      }
  })
}

export const useUpdateTermType = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_TERMS_TYPE)
      }
  })
}
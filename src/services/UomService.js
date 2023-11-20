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
  return Api.POST(BASE_URL + `uom/delete?id=${id}`, null, { headers: GetAuthHeader() });
}

const createHelper = (element) => {
  return Api.POST(BASE_URL + 'uom/create', element, { headers: GetAuthHeader() });
}

const updateHelper = (element) => {
  return Api.POST(BASE_URL + 'uom/update', element, { headers: GetAuthHeader() });
}

const getAllHelper = (page, pageSize) => {
  return Api.GET(BASE_URL + `uom/getall?page=${page}&pageSize=${pageSize}`, { headers: GetAuthHeader() });
}

export const useAllUom = (onSuccess, onError, page, pageSize, sortBy) => {
  return useCustomQuery([QUERY.ALL_UOM, page, pageSize, sortBy], () => getAllHelper(page, pageSize, sortBy), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
}

export const useAllUomNoPaging = (onSuccess, onError) => {
  return useCustomQuery([QUERY.ALL_UOM_NP], () => getAllHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE, "uom,asc"), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
}

export const useDeleteUom = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(deleteHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_UOM)
      }
  })
}

export const useCreateUom = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(createHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_UOM)
      }
  })
}

export const useUpdateUom = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_UOM)
      }
  })
}
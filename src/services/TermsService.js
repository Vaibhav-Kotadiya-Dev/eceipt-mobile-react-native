import { API_URL } from '../../config';
import Api from '../contexts/Api';
import { useQueryClient } from 'react-query';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';
import { QUERY } from '../common/Constants';
import { GetAuthHeader } from '../common/functions';

const BASE_URL = API_URL.BE_URL;
const DEFAULT_ALL_RECORD_PAGE_SIZE = 1000;

const createHelper = (element) => {
  return Api.POST(BASE_URL + 'terms/create', element, { headers: GetAuthHeader() });
};

const getAllHelper = (page, pageSize) => {
  return Api.GET(BASE_URL + `terms/getall?&page=${page}&pageSize=${pageSize}`, { headers: GetAuthHeader() });
};

const deleteHelper = (id) => {
  return Api.POST(BASE_URL + `terms/delete?id=${id}`, null, { headers: GetAuthHeader() });
};

const updateHelper = (element) => {
  return Api.POST(BASE_URL + 'terms/update', element, { headers: GetAuthHeader() });
};

export const useCreateTerms = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(createHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_TERMS)
      }
  })
};

export const useAllTerms = (onSuccess, onError, page, pageSize) => {
  return useCustomQuery([QUERY.ALL_TERMS, page, pageSize], () => getAllHelper(page, pageSize), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
};

export const useAllTermsNoPaging = (onSuccess, onError, page, pageSize) => {
  return useCustomQuery([QUERY.ALL_TERMS_NP, page, pageSize], () => getAllHelper(0, DEFAULT_ALL_RECORD_PAGE_SIZE), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
};

export const useDeleteTerms = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(deleteHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_TERMS)
      }
  })
};

export const useUpdateTerms = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_TERMS)
      }
  })
};

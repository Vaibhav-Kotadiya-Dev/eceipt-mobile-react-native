import { API_URL } from '../../config';
import Api from '../contexts/Api';
import { useQueryClient } from 'react-query';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';
import { QUERY } from '../common/Constants';
import { GetAuthHeader } from '../common/functions';

const BASE_URL = API_URL.BE_URL;

export const saveSettings = (element) => {
  return Api.POST(BASE_URL + 'settings/save', element, { headers: GetAuthHeader() });
}

export const getAllSettings = () => {
  return Api.GET(BASE_URL + 'settings/get', { headers: GetAuthHeader() });
}

const createHelper = (element) => {
  return Api.POST(BASE_URL + 'settings/save', element, { headers: GetAuthHeader() });
};

const getAllHelper = () => {
  return Api.GET(BASE_URL + 'settings/get', { headers: GetAuthHeader() });
};

export const useSetting = (onSuccess, onError) => {
  return useCustomQuery([QUERY.ALL_SETTINGS], getAllHelper, {
      onSuccess,
      onError,
      select: (data) => { return data.data },
  })
};

export const useSaveSetting = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(createHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_SETTINGS)
      }
  })
};
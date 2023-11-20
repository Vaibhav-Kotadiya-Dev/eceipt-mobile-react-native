import { API_URL } from '../../config';
import Api from '../contexts/Api';
import { useQueryClient } from 'react-query';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';
import { QUERY } from '../common/Constants';
import { GetAuthHeader, GetAuthHeaderForFileUpload } from '../common/functions';

const BASE_URL = API_URL.AAS_URL;

const getTenantInfoHelper = () => {
  return Api.GET(BASE_URL + 'aas/tenant/gettenantinfo', { headers: GetAuthHeader() });
};

const updateOwnTenantInfoHelper = (data) => {
  return Api.POST(BASE_URL + 'aas/tenant/updatetenantinfo', data, { headers: GetAuthHeader() });
};

const updateTenantlogoHelper = (file) => {
  const data = new FormData();
  data.append("image", file);
  return Api.POST(BASE_URL + 'aas/tenant/updatetenantlogo', data, { headers: GetAuthHeaderForFileUpload() });
};

export const useTenantInfo = (onSuccess, onError) => {
  return useCustomQuery([QUERY.TENANT_INFO], getTenantInfoHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data }
  })
};

export const useUpdateOwnTenantInfo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateOwnTenantInfoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.TENANT_INFO)
    }
  })
};

export const useUpdateTenantlogo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateTenantlogoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.TENANT_INFO)
    }
  })
};
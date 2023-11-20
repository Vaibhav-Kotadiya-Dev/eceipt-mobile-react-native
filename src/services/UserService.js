import { useQueryClient } from 'react-query';
import { GetAuthHeader } from '../common/functions';
import useCustomQuery from '../hooks/useCustomQuery';
import useCustomMutation from '../hooks/useCustomMutation';
import { API_URL } from '../../config';
import { QUERY } from '../common/Constants';
import Api from '../contexts/Api';

const BASE_URL = API_URL.AAS_URL;

export const getOwnInfo = () => {
  return Api.GET(BASE_URL + 'aas/user/getowninfo');
}

const updateTenantUserinfoHelper = (data) => {
  return Api.POST(BASE_URL + 'aas/tenant/updateuserinfo', data, { headers: GetAuthHeader() });
}

const getAllTenantUserHelper = () => {
  return Api.GET(BASE_URL + 'aas/tenant/gettenantuser', { headers: GetAuthHeader() });
}

export const useAllTenantUser = (onSuccess, onError) => {
  return useCustomQuery([QUERY.ALL_TENANT_USER], getAllTenantUserHelper, {
    onSuccess,
    onError,
    select: (data) => { return data.data }
  })
}


export const useUpdateTenantUserinfo = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(updateTenantUserinfoHelper, {
    onSuccess,
    onError,
    onSettled: () => {
      queryClient.invalidateQueries(QUERY.ALL_TENANT_USER)
    }
  })
}



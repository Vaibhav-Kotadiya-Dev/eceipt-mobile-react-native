import { API_URL } from '../../config';
import Api from '../contexts/Api';
import useCustomMutation from '../hooks/useCustomMutation';
import { GetAuthHeader } from '../common/functions';

const BASE_URL = API_URL.BE_URL;

const sendSupportEmailHelper = (element) => {
  return Api.POST(BASE_URL + 'support/send', element, { headers: GetAuthHeader() });
}

export const useSendSupportEmail = (onSuccess, onError) => {
  return useCustomMutation(sendSupportEmailHelper, {
      onSuccess,
      onError,
  })
}
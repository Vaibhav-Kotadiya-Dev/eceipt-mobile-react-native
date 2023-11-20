import { API_URL } from '../../config';
import Api from '../contexts/Api';
import useCustomQuery from '../hooks/useCustomQuery';
import { QUERY } from '../common/Constants';
import { GetAuthHeader } from '../common/functions';

const BASE_URL = API_URL.BE_URL;

const getOutstandingDoHelper = () => {
  return Api.GET(BASE_URL + 'dashboard/dooutstanding', { headers: GetAuthHeader() });
};

const getOutstandingInvoiceHelper = () => {
  return Api.GET(BASE_URL + 'dashboard/invooutstanding', { headers: GetAuthHeader() });
};

const getDoHistorySummaryHelper = () => {
  return Api.GET(BASE_URL + 'dashboard/dohistory', { headers: GetAuthHeader() });
}

const getInvoiceHistorySummaryHelper = (id) => {
  return Api.GET(BASE_URL + 'dashboard/invohistory', { headers: GetAuthHeader() });
}

export const useGetOutstandingDo = (onSuccess, onError) => {
  return useCustomQuery([QUERY.DASHBOARD_OUTSTANDING_DO], getOutstandingDoHelper, {
      onSuccess,
      onError,
      select: (data) => { return data.data }
  })
};

export const useGetOutstandingInvoice = (onSuccess, onError) => {
  return useCustomQuery([QUERY.DASHBOARD_OUTSTANDING_INVOICE], getOutstandingInvoiceHelper, {
      onSuccess,
      onError,
      select: (data) => { return data.data }
  })
};

export const useGetDoHistory = (onSuccess, onError) => {
  return useCustomQuery([QUERY.DASHBOARD_DO_HISTORY], getDoHistorySummaryHelper, {
      onSuccess,
      onError,
      select: (data) => { return data.data }
  })
};

export const useGetInvoiceHistory = (onSuccess, onError) => {
  return useCustomQuery([QUERY.DASHBOARD_INVOICE_HISTORY], getInvoiceHistorySummaryHelper, {
      onSuccess,
      onError,
      select: (data) => { return data.data }
  })
}

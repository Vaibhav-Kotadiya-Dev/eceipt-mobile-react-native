import { useQueryClient } from 'react-query';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';
import { API_URL } from '../../config';
import { QUERY } from '../common/Constants';
import { GetAuthHeader } from '../common/functions';
import Api from '../contexts/Api';

const BASE_URL = API_URL.BE_URL;

const getInvoiceHelper = (id) => {
  return Api.GET(BASE_URL + `invoice/get?id=${id}`, { headers: GetAuthHeader() });
}

const getInvoiceByNumberHelper = (orderNumber) => {
  return Api.GET(BASE_URL + `invoice/getbynumber?orderNumber=${orderNumber}`, { headers: GetAuthHeader() });
}

const getInvoiceNumberListHelper = () => {
  var params = {
      sortBy: 'createdDate,desc',
      page: 0,
      pageSize: 1000
  }
  return Api.GET(BASE_URL + 'invoice/getorderlist', { headers: GetAuthHeader(), params: params });
}

const saveHelper = (element) => {
  return Api.POST(BASE_URL + 'invoice/save', element, { headers: GetAuthHeader() });
}

const finalizeHelper = (id) => {
  return Api.POST(BASE_URL + `invoice/finalize?id=${id}`, null, { headers: GetAuthHeader() });
}

const reviseHelper = (id) => {
  return Api.POST(BASE_URL + `invoice/revise?id=${id}`, null, { headers: GetAuthHeader() });
}

const invoiceHelper = (id) => {
  return Api.POST(BASE_URL + `invoice/invoice?id=${id}`, null, { headers: GetAuthHeader() });
}

const paidHelper = (id) => {
  return Api.POST(BASE_URL + `invoice/paid?id=${id}`, null, { headers: GetAuthHeader() });
}

const cancelHelper = ({ id, status }) => {
  return Api.POST(BASE_URL + `invoice/cancel?id=${id}&status=${status}`, null, { headers: GetAuthHeader() });
}

const getAllHelper = (page, pageSize, sortBy, status, orderNumber) => {
  return Api.GET(BASE_URL + `invoice/getall?page=${page}&pageSize=${pageSize}&status=${status}&sortBy=${sortBy}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`, { headers: GetAuthHeader() });
}

const regeneratePDF = ({ id }) => {
  var params = {}
  return Api.POST(BASE_URL + 'invoice/retrygeneratepdf?id=' + id, null, { headers: GetAuthHeader(), params: params });
}

const getPDF = ({ id }) => {
  return Api.GET(BASE_URL + 'invoice/getpdf?id=' + id, { headers: GetAuthHeader() });
}

const previewPDF = ({ id }) => {
  return Api.GET(BASE_URL + 'invoice/previewpdf?id=' + id, { headers: GetAuthHeader() });
}

const resendEmail = ({ id, receiverAddress }) => {
  var params = {
      id: id,
      receiverAddress: receiverAddress,
  }
  return Api.POST(BASE_URL + 'invoice/resend', params, { headers: GetAuthHeader(), params: {} });
}

export const useAllInvoice = (onSuccess, onError, page, pageSize, sortBy, status, orderNumber) => {
  return useCustomQuery([QUERY.ALL_INVOICE, page, pageSize, sortBy, status, orderNumber], () => getAllHelper(page, pageSize, sortBy, status, orderNumber), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
}

export const useGetInvoiceNumberList = (onSuccess, onError) => {
  return useCustomQuery([QUERY.OPEN_INVOICE_NUMBER], () => getInvoiceNumberListHelper(), {
      onSuccess,
      onError,
      select: (data) => { return data.data }
  })
}

export const useQueryInvoiceByOrderNumber = (onSuccess, onError, orderNumber) => {
  return useCustomQuery([QUERY.INVOICE, orderNumber], () => getInvoiceByNumberHelper(orderNumber), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      enabled: orderNumber !== null
  })
}

export const useGetInvoiceById = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(getInvoiceHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.INVOICE)
      }
  })
}

export const useGetInvoiceByOrderNumber = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(getInvoiceByNumberHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.INVOICE)
      }
  })
}

export const useSaveInvoice = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(saveHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.INVOICE)
      }
  })
}

export const useFinalizeInvoice = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(finalizeHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_INVOICE)
      }
  })
}

export const useReviseInvoice = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(reviseHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_INVOICE)
      }
  })
}

export const useInvoiceInvoice = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(invoiceHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_INVOICE)
      }
  })
}

export const usePaidInvoice = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(paidHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_INVOICE)
      }
  })
}

export const useCancelInvoice = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(cancelHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_INVOICE)
      }
  })
}

export const useRegeneratePDF = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(regeneratePDF, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_INVOICE)
      }
  })
}

export const useGetPDF = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(getPDF, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_INVOICE)
      }
  })
}

export const usePreviewPDF = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(previewPDF, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_INVOICE)
      }
  })
}

export const useResendEmail = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(resendEmail, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_INVOICE)
      }
  })
}




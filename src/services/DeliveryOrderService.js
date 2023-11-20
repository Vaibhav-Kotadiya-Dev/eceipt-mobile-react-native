import { useQueryClient } from 'react-query';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';
import { API_URL } from '../../config';
import { QUERY } from '../common/Constants';
import { GetAuthHeader } from '../common/functions';
import Api from '../contexts/Api';

const BASE_URL = API_URL.BE_URL;

const getHelper = (id) => {
  return Api.GET(BASE_URL + `do/get?id=${id}`, { headers: GetAuthHeader() });
}

const getDoByInvoiceNumberHelper = (invoiceNumber) => {
  var params = { invoiceNumber: invoiceNumber }
  return Api.GET(BASE_URL + 'do/getbyinvoicenr', { headers: GetAuthHeader(), params: params });
}

const saveHelper = (element) => {
  return Api.POST(BASE_URL + 'do/save', element, { headers: GetAuthHeader() });
}

const finalizeHelper = (id) => {
  return Api.POST(BASE_URL + `do/finalize?id=${id}`, null, { headers: GetAuthHeader() });
}

const reviseHelper = (id) => {
  return Api.POST(BASE_URL + `do/revise?id=${id}`, null, { headers: GetAuthHeader() });
}

const shipHelper = (id) => {
  return Api.POST(BASE_URL + `do/ship?id=${id}`, null, { headers: GetAuthHeader() });
}

const receiveHelper = (id) => {
  return Api.POST(BASE_URL + `do/received?id=${id}`, null, { headers: GetAuthHeader() });
}

const cancelHelper = ({ id, status }) => {
  return Api.POST(BASE_URL + `do/cancel?id=${id}&status=${status}`, null, { headers: GetAuthHeader() });
}

const getAllHelper = (page, pageSize, sortBy, status, orderNumber) => {
  return Api.GET(BASE_URL + `do/getall?page=${page}&pageSize=${pageSize}&status=${status}&sortBy=${sortBy}${orderNumber ? `&orderNumber=${orderNumber}` : ''}`, { headers: GetAuthHeader() });
}

const regeneratePDF = ({ id }) => {
  var params = {}
  return Api.POST(BASE_URL + 'do/retrygeneratepdf?id=' + id, null, { headers: GetAuthHeader(), params: params });
}

const getPDF = ({ id }) => {
  return Api.GET(BASE_URL + 'do/getpdf?id=' + id, { headers: GetAuthHeader() });
}

const previewPDF = ({ id }) => {
  return Api.GET(BASE_URL + 'do/previewpdf?id=' + id, { headers: GetAuthHeader() });
}


const resendEmail = ({ id, receiverAddress }) => {
  var params = {
      id: id,
      receiverAddress: receiverAddress,
  }
  return Api.post(BASE_URL + 'do/resend', params, { headers: GetAuthHeader(), params: {} });
}

export const useAll = (onSuccess, onError, page, pageSize, sortBy, status, orderNumber) => {
  return useCustomQuery([QUERY.ALL_DELIVERY_ORDER, page, pageSize, sortBy, status, orderNumber], () => getAllHelper(page, pageSize, sortBy, status, orderNumber), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      keepPreviousData: true
  })
}

export const useGetById = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(getHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.DELIVERY_ORDER)
      }
  })
}

export const useGetDoByInvoiceNumber = (onSuccess, onError, invoiceNumber) => {
  return useCustomQuery([QUERY.CHECK_LINKED_DELIVERY_ORDER, invoiceNumber], () => getDoByInvoiceNumberHelper(invoiceNumber), {
      onSuccess,
      onError,
      select: (data) => { return data.data },
      enabled: invoiceNumber !== null
  })
}

export const useSave = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(saveHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.DELIVERY_ORDER)
      }
  })
}

export const useFinalize = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(finalizeHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
      }
  })
}

export const useRevise = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(reviseHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
      }
  })
}

export const useShip = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(shipHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
      }
  })
}

export const useReceive = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(receiveHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
      }
  })
}

export const useCancel = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(cancelHelper, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
      }
  })
}

export const useRegeneratePDF = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(regeneratePDF, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
      }
  })
}

export const useGetPDF = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(getPDF, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
      }
  })
}

export const usePreviewPDF = (onSuccess, onError) => {
  const queryClient = useQueryClient()
  return useCustomMutation(previewPDF, {
      onSuccess,
      onError,
      onSettled: () => {
          queryClient.invalidateQueries(QUERY.ALL_DELIVERY_ORDER)
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





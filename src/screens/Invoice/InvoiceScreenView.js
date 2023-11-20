import React, {useState, useEffect} from "react";
import {View, StyleSheet, ScrollView, BackHandler, Dimensions} from "react-native";
import ZModal from "../../components/ZModal";
import {
  COLORS,
  TEXT_SIZE,
  ORDER_STATUS,
} from "../../common/Constants";
import strings from "../../i18n/i18n";
import ZText from "../../components/ZText";
import ZLoading from "../../components/ZLoading";
import ZButton from "../../components/ZButton";
import {
  isStringEmpty,
  shareOrderPDF,
  toastMsg,
} from "../../common/functions";
import { useGetInvoiceById, useCancelInvoice, usePaidInvoice, useInvoiceInvoice, useGetPDF, useRegeneratePDF } from "../../services/InvoiceService";
import ReactNativeBlobUtil from 'react-native-blob-util';
import { API_URL } from "../../../config";
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function InvoiceScreenView({route, navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState("");
  const [noData, setNoData] = useState(false);
  const [orderData, setOrderData] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const [client, setClient] = useState("");
  const [productList, setProductList] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [termsList, setTermsList] = useState([]);
  const [openShareViewer, setOpenShareViewer] = useState(false);

  const { mutate: getInvoice, isLoading: fetchingLoader } = useGetInvoiceById(
    (response) => {
        if (response.data.code === "SUCCESS") {
            const res = response.data?.data;
            setOrderData(res);
            setCompanyProfile(res?.company);
            setClient(res.clients?.[0]);
            setProductList(res?.items);
            setTermsList(res?.terms)
            setIsLoading(false);
        } else {
          setNoData(true);
          setIsLoading(false);
          toastMsg(response.data.message);
        }
  }, () => { toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN) });

  const { mutate: cancel, isLoading: cancelLoading } = useCancelInvoice(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setIsLoading(false);
          navigation.navigate("InvoiceMain");
        } else {
          setIsLoading(false);
          toastMsg(response.data.message)
        }
    }, () => {
        setIsLoading(false);
        toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN)
  });

  const { mutate: invoice, isLoading: invoiceLoading } = useInvoiceInvoice(
    (response) => {
        if (response.data.code === "SUCCESS") {
          getInvoice(id);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toastMsg(response.data.message);
        }
    }, () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN)
  });
  
  const { mutate: paid, isLoading: paidLoading } = usePaidInvoice(
    (response) => {
        if (response.data.code === "SUCCESS") {
          getInvoice(id);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toastMsg(response.data.message);
        }
    }, () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
  });

  const { mutate: regeneratePDF, isLoading: regenerateLoading } = useRegeneratePDF(
    (response) => {
        if (response.data.code === "SUCCESS") {
            toastMsg(strings.GENERATED?.toUpperCase());
        } else {
          toastMsg(response.data.message)
        }
    }, (error) => {
      toastMsg(error.message)
  });

  const { mutate: getPDF, isLoading: getPDFLoading } = useGetPDF(
    (response) => {
      ReactNativeBlobUtil.fetch('GET', API_URL.BE_URL + "download/" + response.data.data)
        .then(res => {
          setPdfUrl(`data:application/pdf;base64,${res.base64()}`)
        })
        .catch(e =>{
          setOpenPdfViewer(false);
        });
    }, (error) => {
      setOpenPdfViewer(false);
      toastMsg(error.message)
  });

  const { mutate: sharePDF, isLoading: sharePdfLoading } = useGetPDF(
    (response) => {
      ReactNativeBlobUtil.fetch('GET', API_URL.BE_URL + "download/" + response.data.data)
        .then(res => {
          setOpenShareViewer(false);
          shareOrderPDF(res.base64(), orderData?.orderNumber);
        })
        .catch(() =>{
          setOpenShareViewer(false);
          toastMsg(strings.PDF_NOT_EXIST_MSG)
        });
    }, () => {
      setOpenShareViewer(false);
      toastMsg(strings.PDF_NOT_EXIST_MSG)
  });

  const handleBackButtonClick = () => {
    navigation.navigate("InvoiceMain");
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    setId(route.params.id);
    getInvoice(route.params.id);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );
    };
  }, []);

  const handleDelete = async () => {
    setModalVisible(false);
    setIsLoading(true);
    var obj = {
      id: orderData?.id,
      status: orderData?.status
    };
    cancel(obj);
  };

  const handleRegeneratePDF = async () => {
    regeneratePDF({
      id: orderData?.id
    })
  };

  const handleOpenPDF = () => {
    setOpenPdfViewer(true);
    getPDF({
      id: orderData?.id
    });
  };

  const handleSharePDF = () => {
    setOpenShareViewer(true);
    sharePDF({
      id: orderData?.id
    });
  };


  const handleUpdateStatusToPaid = async () => {
    setIsLoading(true);
    paid(id);
  };

  const handleUpdateStatusToInvoice = async () => {
    setIsLoading(true);
    invoice(id);
  };

  return (
    <View style={{flex: 1}}>
      <ZLoading isLoading={isLoading || fetchingLoader || cancelLoading || invoiceLoading || paidLoading || regenerateLoading || getPDFLoading || sharePdfLoading} />
      <ZModal
        title={strings.DELETE_DO}
        okButton={false}
        deleteText={strings.DELETE}
        cancelText={strings.CANCEL}
        visible={modalVisible}
        onPressDelete={() => handleDelete()}
        onPressCancel={() => setModalVisible(false)}
        onPressOutside={() => setModalVisible(false)}
      />

      {noData ? (
        <ZText color={COLORS.ERRORRED} text={strings.NO_DO_MSG} />
      ) : (
        <View style={{backgroundColor: COLORS.YELLOW, flexDirection: "row"}}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: "row"}}>
              <ZText
                text={orderData?.orderNumber}
                size={TEXT_SIZE.NORMAL}
                fontWeight={"bold"}
              />
              <ZText text={strings.CREATED_ON} size={TEXT_SIZE.SMALL} />
              <ZText text={new Date(orderData?.createdDate).toLocaleDateString()} size={TEXT_SIZE.SMALL} />
            </View>
            <View style={{flexDirection: "row"}}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: "row"}}>
                  <ZText text={strings.INVOICE_DATE} size={TEXT_SIZE.SMALL} />
                  <ZText
                    text={new Date(orderData?.invoiceDate).toLocaleDateString()}
                    size={TEXT_SIZE.SMALL}
                    fontWeight={"bold"}
                  />
                  <ZText
                    text={strings.PAYMENT_DUE_DATE}
                    size={TEXT_SIZE.SMALL}
                  />
                  <ZText
                    text={new Date(orderData?.paymentDueDate).toLocaleDateString()}
                    size={TEXT_SIZE.SMALL}
                    fontWeight={"bold"}
                  />
                </View>
                <View style={{flexDirection: "row"}}>
                  <ZText text={strings.DELIVERY_DATE} size={TEXT_SIZE.SMALL} />
                  <ZText
                    text={new Date(orderData?.deliveryDate).toLocaleDateString()}
                    size={TEXT_SIZE.SMALL}
                    fontWeight={"bold"}
                  />
                  <View
                    style={{flex: 1, alignItems: "flex-end", paddingRight: 10}}>
                    <ZText
                      text={orderData?.status}
                      size={TEXT_SIZE.SMALL}
                      color={
                        orderData?.status === ORDER_STATUS.SETTLED
                          ? COLORS.GREEN
                          : orderData?.status === ORDER_STATUS.INVOICED
                          ? COLORS.ORANGE
                          : orderData?.status === ORDER_STATUS.GENERATED
                          ? COLORS.LIGHTBLUE
                          : COLORS.ERRORRED
                      }
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      fontWeight={"bold"}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
            <Icon
              name={'file-pdf-box'}
              size={26}
              disabled={openPdfViewer}
              color={COLORS.DARK_BLUE}
              backgroundColor={COLORS.YELLOW}
              style={styles.topButton}
              onPress={handleOpenPDF}      
            />
            <Icon
              name={'share-variant'}
              size={26}
              disabled={openShareViewer}
              color={COLORS.DARK_BLUE}
              backgroundColor={COLORS.YELLOW}
              style={styles.topButton}
              onPress={handleSharePDF}      
            />
          </View>
        </View>
      )}

      {openPdfViewer ? (
        <>
          <View style={styles.crossButtonContainer}>
            <Icon
              name={'close'}
              size={26}
              onPress={() => setOpenPdfViewer(false)}      
            />
          </View>
          <View style={{flex:1}}>
            <Pdf
              showsVerticalScrollIndicator={false}
              source={{uri: pdfUrl}}
              style={{
                flex:1,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                alignItems: 'center',
              }}
            />
          </View>
        </>
      ) : (
        orderData === "" ? null : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 30}}>
            <ZText text={strings.FROM + ":"} size={TEXT_SIZE.NORMAL} />
            <View
              style={{
                width: "100%",
                alignItems: "center",
                borderTopWidth: 1,
                borderBottomWidth: 1,
              }}>
              <ZText
                text={companyProfile?.name}
                size={TEXT_SIZE.SMALL}
                fontWeight={"bold"}
              />
              {companyProfile?.addr1 === "" ? null : (
                <ZText text={companyProfile?.addr1} size={TEXT_SIZE.SMALL} />
              )}
              {companyProfile?.addr2 === "" ? null : (
                <ZText text={companyProfile?.addr2} size={TEXT_SIZE.SMALL} />
              )}
              {companyProfile?.addr3 === "" ? null : (
                <ZText text={companyProfile?.addr3} size={TEXT_SIZE.SMALL} />
              )}
              {companyProfile?.addr4 === "" ? null : (
                <ZText text={companyProfile?.addr4} size={TEXT_SIZE.SMALL} />
              )}
              <View style={{flexDirection: "row"}}>
                {companyProfile?.country === "" ? null : (
                  <ZText text={companyProfile?.country} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.postCode === "" ? null : (
                  <ZText text={companyProfile?.postCode} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {companyProfile?.contactNumber === "" ? null : (
                  <ZText text={strings.PHONE + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.contactNumber === "" ? null : (
                  <ZText text={companyProfile?.contactNumber} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.fax === "" ? null : (
                  <ZText text={" " + strings.FAX + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.fax === "" ? null : (
                  <ZText text={companyProfile?.fax} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {companyProfile?.email === "" ? null : (
                  <ZText text={strings.EMAIL + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.email === "" ? null : (
                  <ZText text={companyProfile?.email} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {companyProfile?.brn === "" ? null : (
                  <ZText text={strings.BRN + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.brn === "" ? null : (
                  <ZText text={companyProfile?.brn} size={TEXT_SIZE.SMALL} />
                )}
              </View>
            </View>
  
            <ZText text={strings.TO + ":"} size={TEXT_SIZE.SMALL} />
            <View
              style={{
                width: "100%",
                alignItems: "center",
                borderTopWidth: 1,
                borderBottomWidth: 1,
              }}>
              <ZText
                text={client?.name}
                size={TEXT_SIZE.SMALL}
                fontWeight={"bold"}
              />
              {client?.addr1 === "" ? null : (
                <ZText text={client?.addr1} size={TEXT_SIZE.SMALL} />
              )}
              {client?.addr2 === "" ? null : (
                <ZText text={client?.addr2} size={TEXT_SIZE.SMALL} />
              )}
              {client?.addr3 === "" ? null : (
                <ZText text={client?.addr3} size={TEXT_SIZE.SMALL} />
              )}
              {client?.addr4 === "" ? null : (
                <ZText text={client?.addr4} size={TEXT_SIZE.SMALL} />
              )}
              <View style={{flexDirection: "row"}}>
                {client?.country === "" ? null : (
                  <ZText text={client?.country} size={TEXT_SIZE.SMALL} />
                )}
                {client?.postCode === "" ? null : (
                  <ZText text={client?.postCode} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {client?.contactNumber === "" ? null : (
                  <ZText text={strings.PHONE + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {client?.contactNumber === "" ? null : (
                  <ZText text={client?.contactNumber} size={TEXT_SIZE.SMALL} />
                )}
                {client?.fax === "" ? null : (
                  <ZText text={" " + strings.FAX + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {client?.fax === "" ? null : (
                  <ZText text={client?.fax} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {client?.email === "" ? null : (
                  <ZText text={strings.EMAIL + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {client?.email === "" ? null : (
                  <ZText text={client?.email} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {client?.remark === "" ? null : (
                  <ZText text={strings.ATTN_TO + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {client?.remark === "" ? null : (
                  <ZText text={client?.remark} size={TEXT_SIZE.SMALL} />
                )}
              </View>
            </View>
  
            <View style={{borderBottomWidth: 1}}>
              <View style={{flexDirection: "row", marginLeft: 5, marginRight: 5}}>
                <View style={{flex: 1, alignItems: "center"}}>
                  <ZText text={strings.NO} size={TEXT_SIZE.SMALL} />
                </View>
                <View style={{flex: 4, alignItems: "flex-start"}}>
                  <ZText
                    text={strings.PRODUCT_NUMBER}
                    size={TEXT_SIZE.SMALL}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  />
                </View>
                <View style={{flex: 2, alignItems: "flex-start"}}>
                  <ZText
                    text={strings.QUANTITY}
                    size={TEXT_SIZE.SMALL}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  />
                </View>
                <View style={{flex: 2, alignItems: "flex-start"}}>
                  <ZText
                    text={strings.UNIT_PRICE_SYMBOL}
                    size={TEXT_SIZE.SMALL}
                  />
                </View>
                <View style={{flex: 2, alignItems: "flex-start"}}>
                  <ZText text={strings.TOTAL_PRICE} size={TEXT_SIZE.SMALL} />
                </View>
              </View>
              {productList?.map((value, key) => (
                <View key={key}>
                  <View
                    style={{flexDirection: "row", marginLeft: 5, marginRight: 5}}>
                    <View style={{flex: 1, alignItems: "center"}}>
                      <ZText text={key + 1} size={TEXT_SIZE.SMALL} />
                    </View>
                    <View style={{flex: 4, alignItems: "flex-start"}}>
                      <ZText
                        text={value?.name}
                        size={TEXT_SIZE.SMALL}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      />
                    </View>
                    <View style={{flex: 2, alignItems: "flex-start"}}>
                      <ZText
                        text={value?.quantity + value?.uom}
                        size={TEXT_SIZE.SMALL}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      />
                    </View>
                    <View style={{flex: 2, alignItems: "flex-start"}}>
                      <ZText
                        text={value?.currency + " " + value?.unitprice}
                        size={TEXT_SIZE.SMALL}
                      />
                    </View>
                    <View style={{flex: 2, alignItems: "flex-start"}}>
                      <ZText
                        text={value?.currency + " " + value?.totalPrice}
                        size={TEXT_SIZE.SMALL}
                      />
                    </View>
                  </View>
                  {isStringEmpty(value?.remark) ? null : (
                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: 5,
                        marginRight: 5,
                      }}>
                      <View style={{flex: 1, alignItems: "flex-start"}}></View>
                      <View style={{flex: 2, alignItems: "flex-start"}}>
                        <ZText
                          text={strings.REMARKS}
                          size={TEXT_SIZE.SMALL}
                          color={COLORS.GREY}
                        />
                      </View>
                      <View style={{flex: 8, alignItems: "flex-start"}}>
                        <ZText
                          text={value?.remark}
                          size={TEXT_SIZE.SMALL}
                          color={COLORS.GREY}
                        />
                      </View>
                    </View>
                  )}
                </View>
              ))}
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 5,
                  marginRight: 5,
                  borderTopWidth: 1,
                  borderTopColor: COLORS.GREY,
                }}>
                <View style={{flex: 5, alignItems: "flex-start"}}>
                  <ZText
                    text={strings.TOTAL}
                    size={TEXT_SIZE.SMALL}
                    fontWeight={"bold"}
                  />
                </View>
                <View style={{flex: 4, alignItems: "flex-start"}}>
                  <ZText
                    text={orderData?.totalQuantity}
                    size={TEXT_SIZE.SMALL}
                    fontWeight={"bold"}
                  />
                </View>
                <View style={{flex: 2, alignItems: "flex-start"}}>
                  <ZText
                    text={(orderData?.currency || '') + " " + orderData?.totalPrice}
                    size={TEXT_SIZE.SMALL}
                    fontWeight={"bold"}
                  />
                </View>
              </View>
            </View>
  
            <View style={{borderBottomWidth: 1}}>
              {termsList?.length === 0 ? null : (
                termsList?.map((term, index) => (
                  <View
                    key={index}
                    style={[{
                      flexDirection: "row",
                      marginLeft: 5,
                      marginRight: 5,
                      borderTopColor: COLORS.GREY,
                    }, (termsList?.length - 1 === index) ? {borderBottomWidth: 0} : {borderBottomWidth: 1}]}>
                    <ZText
                      text={term?.name + ":"}
                      size={TEXT_SIZE.SMALL}
                      fontWeight={"bold"}
                    />
                    <ZText style={{width: '70%'}} text={term?.description} size={TEXT_SIZE.SMALL} />
                  </View>
                ))
              )}
            </View>
  
            {(orderData?.status === ORDER_STATUS.GENERATED || orderData?.status === ORDER_STATUS.INVOICED) ? (
            <>
              <View style={{flexDirection: "row"}}>
                <View style={{flex: 1}}>
                  <ZButton
                    text={strings.REGENERATE_PDF}
                    icon={"replay"}
                    onPress={handleRegeneratePDF}
                  />
                </View>
                <View style={{flex: 1}}>
                  {orderData?.status === ORDER_STATUS.GENERATED ? (
                    <ZButton
                      text={strings.INVOICE}
                      icon={"stop"}
                      color={COLORS.ORANGE}
                      onPress={handleUpdateStatusToInvoice}
                    />
                  ) : (
                    <ZButton
                      text={strings.PAID}
                      icon={"play"}
                      color={COLORS.GREEN}
                      onPress={handleUpdateStatusToPaid}
                    />
                  )}
                </View>
              </View>
  
              <ZButton
                text={strings.DELETE}
                icon={"close"}
                color={COLORS.ERRORRED}
                onPress={() => setModalVisible(true)}
              />
            </>
            ) : null}
  
          </ScrollView>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerTitle: {
    height: 40,
    width: "95%",
    alignSelf: "center",

    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 5,
    margin: 5,
    backgroundColor: COLORS.YELLOW,
  },
  topTitle: {
    textAlign: "center",
    height: "100%",
    width: "100%",
  },
  topButton: {
    padding: 0,
  },
  crossButtonContainer: {
    marginTop: 10,
    marginBottom: 5,
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  }
});

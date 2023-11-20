import React, {useEffect, useState} from "react";
import {View, StyleSheet, BackHandler, ScrollView, Dimensions} from "react-native";
import ZModal from "../../components/ZModal";

import {COLORS, TEXT_SIZE} from "../../common/Constants";
import strings from "../../i18n/i18n";
import ZText from "../../components/ZText";
import ZButton from "../../components/ZButton";
import {
  isStringEmpty,
  shareOrderPDF,
  toastMsg,
} from "../../common/functions";
import ZLoading from "../../components/ZLoading";
import { API_URL } from "../../../config";
import { useFinalize, usePreviewPDF } from "../../services/DeliveryOrderService";
import ReactNativeBlobUtil from 'react-native-blob-util';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DeliveryOrderScreenPreview({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [doData, setDoData] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [companyProfile, setCompanyProfile] = useState(null);
  const [client, setClient] = useState([]);
  const [productList, setProductList] = useState([]);
  const [termsList, setTermsList] = useState([]);
  const [id, setId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [openShareViewer, setOpenShareViewer] = useState(false);

  const { mutate: finalize, isLoading: finalizeLoading } = useFinalize(
    (response) => {
        if (response.data.code === "SUCCESS") {
            setModalVisible(false);
            setDoData("");
            setOrderNumber("");
            setDeliveryDate("");
            setCompanyProfile(null);
            setClient([]);
            setProductList([]);
            setTermsList([]);
            navigation.navigate("DeliveryOrderMain");
        } else {
          setModalVisible(false);
          toastMsg("Order creation fail.");
        }
    }, () => {
      setModalVisible(false);
      toastMsg("Order creation fail.");
  });

  const { mutate: previewPdf, isLoading: previewPDFLoading } = usePreviewPDF(
    (response) => {
      ReactNativeBlobUtil.fetch('GET', API_URL.BE_URL + "download/preview/" + response.data.data)
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

  const { mutate: sharePDF, isLoading: sharePdfLoading } = usePreviewPDF(
    (response) => {
      ReactNativeBlobUtil.fetch('GET', API_URL.BE_URL + "download/" + response.data.data)
        .then(res => {
          setOpenShareViewer(false);
          shareOrderPDF(res.base64());
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
    navigation.navigate("DeliveryOrderAddScreenTab");
    return true;
  };

  useEffect(() => {
    const onFocus = () => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);

      setDoData(global.previewData);
      setOrderNumber(global.previewData?.orderNumber);
      setDeliveryDate(global.previewData?.deliveryDate);
      setCompanyProfile(global.previewData?.company);
      setClient(global.previewData?.clients);
      setProductList(global.previewData?.items);
      setTermsList(global.previewData?.terms);
      setId(global.previewData?.id);
    };

    const onBlur = () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );
    };

    const unsubscribeFocus = navigation.addListener("focus", onFocus);
    const unsubscribeBlur = navigation.addListener("blur", onBlur);

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, []);

  const createDeliveryOrder = async () => {
    finalize(id);
  };

  const handleOpenPDF = async () => {
    setOpenPdfViewer(true);
    previewPdf({
      id: id
    });
  };

  const handleSharePDF = () => {
    setOpenShareViewer(true);
    sharePDF({
      id: id
    });
  };

  return (
    <View style={{flex: 1}}>
      <ZLoading isLoading={finalizeLoading || previewPDFLoading || sharePdfLoading} />
      <ZModal
        title={strings.CREATE_DELIVERY_ORDER + "?"}
        deleteButton={false}
        okText={strings.OK}
        cancelText={strings.CANCEL}
        visible={modalVisible}
        onPressOK={createDeliveryOrder}
        onPressCancel={() => setModalVisible(false)}
        onPressOutside={() => setModalVisible(false)}
      />

      <View style={{backgroundColor: COLORS.YELLOW, height: 40}}>
        <View style={{flex: 1, justifyContent: 'space-between', alignItems: "center", flexDirection: "row"}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ZText text={strings.DELIVERY_DATE} size={TEXT_SIZE.SMALL} />
            <ZText
              text={new Date(deliveryDate).toLocaleDateString()}
              size={TEXT_SIZE.NORMAL}
              fontWeight={"bold"}
            />
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
      </View>
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
        doData == "" ? null : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 30}}>
            <ZText text={strings.FROM + ":"} size={TEXT_SIZE.NORMAL} />
            <View
              style={{
                width: "100%",
                alignItems: "center",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                paddingVertical: 5,
              }}>
              <ZText
                text={companyProfile?.tenantName}
                size={TEXT_SIZE.SMALL}
                fontWeight={"bold"}
              />
              {companyProfile.addr1 == "" ? null : (
                <ZText text={companyProfile?.addr1} size={TEXT_SIZE.SMALL} />
              )}
              {companyProfile.addr2 == "" ? null : (
                <ZText text={companyProfile?.addr2} size={TEXT_SIZE.SMALL} />
              )}
              {companyProfile.addr3 == "" ? null : (
                <ZText text={companyProfile?.addr3} size={TEXT_SIZE.SMALL} />
              )}
              {companyProfile.addr4 == "" ? null : (
                <ZText text={companyProfile?.addr4} size={TEXT_SIZE.SMALL} />
              )}
              <View style={{flexDirection: "row"}}>
                {companyProfile.country == "" ? null : (
                  <ZText text={companyProfile?.country} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile.postCode == "" ? null : (
                  <ZText text={companyProfile?.postCode} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {companyProfile?.contactNumber == "" ? null : (
                  <ZText text={strings.PHONE + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.contactNumber == "" ? null : (
                  <ZText text={companyProfile?.contactNumber} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.fax == "" ? null : (
                  <ZText text={" " + strings.FAX + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.fax == "" ? null : (
                  <ZText text={companyProfile?.fax} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {companyProfile?.email == "" ? null : (
                  <ZText text={strings.EMAIL + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile.email == "" ? null : (
                  <ZText text={companyProfile?.email} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {companyProfile?.brn == "" ? null : (
                  <ZText text={strings.BRN + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {companyProfile?.brn == "" ? null : (
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
                paddingVertical: 5, 
              }}>
              <ZText
                text={client?.[0]?.name}
                size={TEXT_SIZE.SMALL}
                fontWeight={"bold"}
              />
              {client?.[0]?.addr1 == "" ? null : (
                <ZText text={client?.[0].addr1} size={TEXT_SIZE.SMALL} />
              )}
              {client?.[0]?.addr2 == "" ? null : (
                <ZText text={client?.[0]?.addr2} size={TEXT_SIZE.SMALL} />
              )}
              {client?.[0]?.addr3 == "" ? null : (
                <ZText text={client?.[0]?.addr3} size={TEXT_SIZE.SMALL} />
              )}
              {client?.[0]?.addr4 == "" ? null : (
                <ZText text={client?.[0]?.addr4} size={TEXT_SIZE.SMALL} />
              )}
              <View style={{flexDirection: "row"}}>
                {client?.[0]?.country == "" ? null : (
                  <ZText text={client?.[0]?.country} size={TEXT_SIZE.SMALL} />
                )}
                {client?.[0]?.postCode == "" ? null : (
                  <ZText text={client?.[0]?.postCode} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {client?.[0]?.contactNumber == "" ? null : (
                  <ZText text={strings.PHONE + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {client?.[0]?.contactNumber == "" ? null : (
                  <ZText text={client?.[0]?.contactNumber} size={TEXT_SIZE.SMALL} />
                )}
                {client?.[0]?.fax == "" ? null : (
                  <ZText text={" " + strings.FAX + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {client?.[0]?.fax == "" ? null : (
                  <ZText text={client?.[0]?.fax} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {client?.[0]?.email == "" ? null : (
                  <ZText text={strings.EMAIL + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {client?.[0]?.email == "" ? null : (
                  <ZText text={client?.[0]?.email} size={TEXT_SIZE.SMALL} />
                )}
              </View>
              <View style={{flexDirection: "row"}}>
                {client?.[0]?.remark == "" ? null : (
                  <ZText text={strings.ATTN_TO + ":"} size={TEXT_SIZE.SMALL} />
                )}
                {client?.[0]?.remark == "" ? null : (
                  <ZText text={client?.[0]?.remark} size={TEXT_SIZE.SMALL} />
                )}
              </View>
            </View>

            <View style={{borderBottomWidth: 1, paddingVertical: 5}}>
              <View style={{flexDirection: "row", marginLeft: 5, marginRight: 5}}>
                <View style={{flex: 1, alignItems: "center"}}>
                  <ZText text={"No"} size={TEXT_SIZE.SMALL} />
                </View>
                <View style={{flex: 3, alignItems: "flex-start"}}>
                  <ZText
                    text={strings.PRODUCT_NUMBER}
                    size={TEXT_SIZE.SMALL}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  />
                </View>
                <View style={{flex: 4, alignItems: "flex-start"}}>
                  <ZText
                    text={strings.DESCRIPTION}
                    size={TEXT_SIZE.SMALL}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  />
                </View>
                <View style={{flex: 2, alignItems: "flex-end"}}>
                  <ZText text={strings.QUANTITY} size={TEXT_SIZE.SMALL} />
                </View>
              </View>
              {productList?.map((value, key) => (
                <View key={key}>
                  <View
                    style={{flexDirection: "row", marginLeft: 5, marginRight: 5}}>
                    <View style={{flex: 1, alignItems: "center"}}>
                      <ZText
                        text={key + 1}
                        size={TEXT_SIZE.SMALL}
                        fontWeight={"bold"}
                      />
                    </View>
                    <View style={{flex: 3, alignItems: "flex-start"}}>
                      <ZText
                        text={value?.name}
                        size={TEXT_SIZE.SMALL}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      />
                    </View>
                    <View style={{flex: 4, alignItems: "flex-start"}}>
                      <ZText
                        text={value?.description}
                        size={TEXT_SIZE.SMALL}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      />
                    </View>
                    <View style={{flex: 2, alignItems: "flex-end"}}>
                      <ZText
                        text={value?.quantity + value?.uom}
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
                      <View style={{flex: 3, alignItems: "flex-start"}}>
                        <ZText
                          text={strings.REMARKS}
                          size={TEXT_SIZE.SMALL}
                          color={COLORS.GREY}
                        />
                      </View>
                      <View style={{flex: 6, alignItems: "flex-start"}}>
                        <ZText
                          text={value?.remark || ''}
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
                  paddingVertical: 5,
                }}>
                <View style={{alignItems: "flex-start"}}>
                  <ZText
                    text={strings.TOTAL}
                    size={TEXT_SIZE.SMALL}
                    fontWeight={"bold"}
                  />
                </View>
                <View style={{flex: 7, alignItems: "flex-start"}}></View>
                <View style={{flex: 2, alignItems: "center"}}>
                  <ZText
                    text={doData.totalQuantity}
                    size={TEXT_SIZE.SMALL}
                    fontWeight={"bold"}
                  />
                </View>
              </View>
            </View>

            <View style={{borderBottomWidth: 1, paddingVertical: 5}}>
              {termsList?.length === 0 ? null : (
                  termsList?.map((term, index) => (
                    <View
                      key={index}
                      style={[
                        {
                          flexDirection: "row",
                          marginLeft: 5,
                          marginRight: 5,
                          borderTopColor: COLORS.GREY,
                        },
                        (termsList?.length - 1 === index) ? {borderBottomWidth: 0} : {borderBottomWidth: 1},
                      ]}>
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

            <ZButton
              text={strings.CREATE_DELIVERY_ORDER}
              icon={"plus"}
              onPress={() => setModalVisible(true)}
            />
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
    paddingLeft: 5,
    paddingRight: 5,
  },
  crossButtonContainer: {
    marginTop: 10,
    marginBottom: 5,
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  }
});

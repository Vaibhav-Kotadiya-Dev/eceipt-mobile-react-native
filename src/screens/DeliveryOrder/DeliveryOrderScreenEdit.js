import React, {useState, useEffect} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  TEXT_SIZE,
  COLORS,
} from "../../common/Constants";
import strings from "../../i18n/i18n";
import ZButton from "../../components/ZButton";
import ZText from "../../components/ZText";
import ZIcon from "../../components/ZIcon";
import ZAccordionPicker from "../../components/ZAccordionPicker";
import ZProductList from "../../components/ZProductList";
import ZProductModal from "../../components/ZProductModal";
import ZModal from "../../components/ZModal";
import ZLoading from "../../components/ZLoading";
import {dateToStr, isStringEmpty, toastMsg, randomNumberInRange} from "../../common/functions";
import { useAllClientNoPaging } from "../../services/ClientService";
import { useTenantInfo } from "../../services/CompanyProfileService";
import ZTermsModal from "../../components/ZTermsModal";
import ZTermsList from "../../components/ZTermsList";
import { useSave, useGetById } from "../../services/DeliveryOrderService";

export default function DeliveryOrderScreenAdd({navigation, route}) {
  const [companyProfile, setCompanyProfile] = useState("");
  const [companyProfileModal, setCompanyProfileModal] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [selClientName, setSelClientName] = useState("");
  const [selClient, setSelClient] = useState("");
  const [selProductList, setSelProductList] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState(dateToStr(new Date()));
  const [addProductmodalVisible, setAddProductmodalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTermList, setSelectedTermList] = useState([]);
  const [id, setId] = useState(null);
  const [addTermsmodalVisible, setAddTermsmodalVisible] = useState(false);
  const { mutate: createObj, isLoading: createLoading } = useSave(
    (response) => {
        if (response.data.code === "SUCCESS") {
            global.previewData.id = response.data.data?.id;
            navigation.navigate("DeliveryOrderPreviewScreenTab");
        } else {
          toastMsg("Order creation fail.");
          global.previewData = {};
        }
    }, () => {
        toastMsg("Order creation fail.");
        global.previewData = {};
  });

  const { isFetching } = useAllClientNoPaging(
    (response) => {
        if (response.code === "SUCCESS") {
          setClientList(response.data?.data);
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    },
    () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
    }
  );

  const { isLoading: fetchingCompanyProfile } = useTenantInfo(
    (response) => {
        if (response.code === "SUCCESS") {
            setCompanyProfile(response?.data);
        } else {
          setCompanyProfileModal(true);
        }
  }, () => { setCompanyProfileModal(true); });

  const { mutate: getOrder, isLoading: fetchingLoader } = useGetById(
    (response) => {
        if (response.data.code === "SUCCESS") {
          const res = response.data?.data;
          setCompanyProfile(res?.company);
          setSelClientName(res.clients?.[0]?.shortname);
          setSelClient(res.clients?.[0]);
          setSelProductList(res?.items);
          setSelectedTermList(res?.terms)
          setDeliveryDate(dateToStr(new Date(res?.deliveryDate)));
        } else {
          toastMsg(response.data.message)
        }
  }, () => { toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN) });

  const handleBackButtonClick = () => {
    navigation.navigate("DeliveryOrderMain");
    return true;
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    });
    setId(route?.params?.id);
    getOrder(route?.params?.id);

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );
    };
  }, []);

  const updateDeliveryDate = value => {
    setDeliveryDate(dateToStr(value));
    setShowDatePicker(false);
  };

  const toPreview = async () => {
    if (isStringEmpty(selClient)) {
      toastMsg(strings.NO_CLIENT_SEL);
      return;
    }
    if (selProductList.length === 0) {
      toastMsg(strings.NO_PRODUCT_SEL);
      return;
    }

    let exitFlag = false;

    selProductList?.map(value => {
      if (
        isNaN(value.quantity) ||
        isStringEmpty(value.quantity) ||
        value.quantity === 0
      ) {
        toastMsg(strings.QTY_MUST_BE_NUMBER);
        exitFlag = true;
      }
    });

    if (exitFlag) {
      return;
    }

    const productList = [];
    let totalQty = 0;
    var totalPrice = 0
    selProductList?.map((value, key) => {
      const product = {
        category: value?.category,
        code: value?.code,
        currency: value?.currency,
        description: value?.description,
        id: null,
        key: value?.id + '' + randomNumberInRange(10000, 50000),
        name: value?.name,
        orgId: value?.id,
        quality: 0,
        quantity: value?.quantity,
        safetyStockLevel: value?.safetyStockLevel || null,
        selected: true,
        sequence: key,
        totalPrice: value?.quantity * value?.unitprice,
        unitprice: value?.unitprice,
        uom: value?.uom,
        remark: value?.remark,
      };
      totalQty = totalQty + Number(value?.quantity);
      totalPrice += value?.quantity * value?.unitprice
      productList.push(product);
    });
    const previewData = {
      id: id,
      invoiceNumber: null,
      orderNumber: null,
      deliveryDate: new Date(deliveryDate).getTime(),
      clientName: selClient?.name,
      company: companyProfile,
      totalProduct: selProductList?.length,
      totalQuantity: totalQty,
      totalPrice: totalPrice,
      items: productList,
      clients: [selClient],
      terms: selectedTermList || [],
      withInvTrans: true
    };
    global.previewData = previewData;
    createObj(previewData);
  };

  const updateProductList = lst => {
    setSelProductList(lst);
  };

  const updateTermsList = lst => {
    setSelectedTermList(lst);
  };

  const handleSelectProduct = item => {
    setAddProductmodalVisible(false);
    const tempProduct = {
      category: item?.category,
      code: item?.code,
      currency: item?.currency,
      description: item?.description,
      id: item?.id,
      name: item?.name,
      quantity: "1",
      remark: null,
      unitprice: item?.unitprice,
      uom: item.uom,
    };

    const tempList = JSON.parse(JSON.stringify(selProductList || []));
    tempList.push(tempProduct);
    setSelProductList(tempList);
  };

  const handleSelectTerms = item => {
    setAddTermsmodalVisible(false);
    const obj = JSON.parse(JSON.stringify(item));
    // eslint-disable-next-line no-prototype-builtins
    if (!obj?.hasOwnProperty('sequence')) {
      obj.id = null;
    }
    const tempList = JSON.parse(JSON.stringify(selectedTermList || []));
    tempList.push(obj);
    setSelectedTermList(tempList);
  };

  return (
    <View style={{flex: 1}}>
      <ZLoading isLoading={isFetching || fetchingCompanyProfile || createLoading || fetchingLoader} />
      <ZModal
        title={strings.PROFILE_NOT_FOUND}
        deleteButton={false}
        cancelButton={false}
        okText={strings.OK}
        cancelText={strings.CANCEL}
        visible={companyProfileModal}
        onPressOK={() =>
          setCompanyProfileModal(false, navigation.navigate("CompanyProfile"))
        }
      />

      <ZProductModal
        title={strings.ADD_PRODUCT}
        okText={strings.ADD}
        cancelText={strings.CANCEL}
        visible={addProductmodalVisible}
        onPressItem={handleSelectProduct}
        onPressCancel={() => setAddProductmodalVisible(false)}
      />

      <ZTermsModal
        title={strings.ADD_TERMS}
        okText={strings.ADD}
        cancelText={strings.CANCEL}
        visible={addTermsmodalVisible}
        onPressItem={handleSelectTerms}
        onPressCancel={() => setAddTermsmodalVisible(false)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 30}}>
        <View style={{justifyContent: "center"}}>
          <ZText text={strings.DELIVERY_DATE} textSize={TEXT_SIZE.NORMAL} />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setShowDatePicker(true);
            }}>
            <View style={styles.pickerTextbox}>
              <View style={{flex: 1, paddingRight: 5}}>
                <ZText text={deliveryDate} />
              </View>

              <View style={{padding: 5}}>
                <ZIcon icon={"calendar-month-outline"} />
              </View>
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2030, 0, 1)}
              onChange={(event, date) => updateDeliveryDate(date)}
            />
          )}
        </View>

        <ZAccordionPicker
          title={strings.SELECT_CLIENT}
          data={clientList?.map(value => value?.shortname)}
          value={selClientName}
          onSelect={value => {
            setSelClientName(value);
            setSelClient(
              clientList?.filter(
                v => v?.shortname === value,
              )[0],
            );
          }}
        />

        <View
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.LIGHTGREY,
          }}>
          <ZText text={strings.PRODUCT} />
          <ZProductList data={selProductList} updateList={updateProductList} />
          <ZButton
            text={strings.ADD_PRODUCT}
            color={COLORS.LIGHTBLUE}
            onPress={() => setAddProductmodalVisible(true)}
          />
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.LIGHTGREY,
            paddingTop: 10,
          }}>
          <ZText text={strings.TERMS} />
          <ZTermsList data={selectedTermList} updateList={updateTermsList} />
          <ZButton
            text={strings.ADD_TERMS}
            color={COLORS.LIGHTBLUE}
            onPress={() => setAddTermsmodalVisible(true)}
          />
        </View>
        <ZButton text={strings.PREVIEW} onPress={() => toPreview()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerTextbox: {
    flex: 1,
    flexDirection: "row",
    height: 60,
    paddingLeft: 5,
    paddingRight: 5,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GREY,
    alignItems: "center",
  },
});

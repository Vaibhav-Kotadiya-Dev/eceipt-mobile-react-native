import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, BackHandler } from 'react-native';
import strings from '../../i18n/i18n'
import { isStringEmpty, toastMsg } from '../../common/functions';
import ZTextInput from '../../components/ZTextInput';
import ZButton from '../../components/ZButton';
import ZAccordionPicker from '../../components/ZAccordionPicker';
import ZLoading from '../../components/ZLoading'
import ZModal from '../../components/ZModal'
import { useAllUomNoPaging, useAllCurrencyNoPaging, useCreateProduct } from '../../services/ProductService';
import { useAllCategoryNoPaging } from '../../services/CategoryService';

const ProductScreenAddNew = (props) => {  
  const [companyProfileModal, setCompanyProfileModal] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [UOM, setUOM] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencyList, setCurrencyList] = useState([]);
  const [umoList, setUmoList] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [safetyStock, setSafetyStock] = useState('');

  const { isFetching } = useAllCategoryNoPaging(
    (response) => {
        if (response.code === "SUCCESS") {
          setCategoryList(response?.data?.data);
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    },
    () => {
      toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
  });

  const { isLoading: fetchingUom } = useAllUomNoPaging(
    (response) => {
        if (response.code === "SUCCESS") {
          setUmoList(response?.data?.data);
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    }, () => { toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN); }
  );

  const { isLoading: fetchingCurrency } = useAllCurrencyNoPaging(
    (response) => {
        if (response.code === "SUCCESS") {
          setCurrencyList(response?.data?.data)
        } else {
          toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
        }
    }, () => { toastMsg(strings.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN); }
  );

  const { mutate: createObj, isLoading: createLoading } = useCreateProduct(
    (response) => {
        if (response.data.code === "SUCCESS") {
          setCategoryList([]);
          setCategory('');
          setDescription('');
          setUOM('');
          setUnitPrice('');
          setCurrency('');
          setCurrencyList([]);
          setUmoList([]);
          setName('');
          setCode('');
          setSafetyStock('');
          setTimeout(() => {
            props.navigation.navigate("ProductList")
          }, 100);
        } else {
          toastMsg(strings.SAVING_FAILED);
        }
    }, () => { toastMsg(strings.SAVING_FAILED); });

  const handleBackButtonClick = () => {
    props.navigation.navigate('ProductList')
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () => backHandler.remove();
  }, []);

  const saveProduct = async () => {
    var obj = {
      id: null,
      code: code,
      name: name,
      description: description,
      uom: UOM,
      unitprice: unitPrice,
      currency: currency,
      category: category,
      saftyStockLevel: safetyStock
    }
    createObj(obj);
  }

  const handleSaveProduct = () => {
    if (isStringEmpty(category) || isStringEmpty(name)
      || isStringEmpty(description) || isStringEmpty(UOM)
      || isStringEmpty(unitPrice) || isStringEmpty(currency)
      || isStringEmpty(code) || isStringEmpty(safetyStock)
    ) {
      toastMsg(strings.NEED_COMPLETE_ALL_FIELD)
      return
    }

    if (isNaN(unitPrice)) {
      toastMsg(strings.UNIT_PRICE + strings.MUST_BE_NUMBER)
      return;
    }

    saveProduct()
  }

  return (
    <View style={styles.container} >
      <ZLoading isLoading={isFetching || fetchingUom || fetchingCurrency || createLoading} />

      <ZModal
        title={strings.PROFILE_NOT_FOUND}
        deleteButton={false}
        cancelButton={false}
        okText={strings.OK}
        cancelText={strings.CANCEL}
        visible={companyProfileModal}
        onPressOK={() => {
          setCompanyProfileModal(false);
          props.navigation.navigate("CompanyProfile");
        }}
      />

      <ScrollView>
        <ZTextInput title={strings.NAME} value={name}
          onChangeText={(value) => setName(value)} />
        <ZTextInput title={strings.DESCRIPTION} value={description}
          onChangeText={(value) => setDescription(value)} />
        <ZTextInput title={strings.CODE} value={code}
          onChangeText={(value) => setCode(value)} />
        <ZAccordionPicker
          title={strings.SELECT_CATEGORY}
          data={categoryList?.map(value => value?.name)}
          value={category}
          onSelect={(value) => setCategory(value)}
        />
        <View style={{ flex: 1 }}>
          <ZAccordionPicker
            title={strings.SELECT_UOM}
            data={umoList?.map(value => value?.uom)}
            value={UOM}
            onSelect={(value) => setUOM(value)}
          />
          </View>
          <View style={{ flex: 1 }}>
            <ZAccordionPicker
              title={strings.SELECT_CURRENCY}
              data={currencyList?.map(value => value?.currency)}
              value={currency}
              onSelect={(value) => setCurrency(value)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ZTextInput title={strings.UNIT_PRICE} value={unitPrice} keyboardType={'numeric'}
              onChangeText={(value) => setUnitPrice(value)} 
              rightText={currency}/>
          </View>
        <ZTextInput title={strings.SAFTYSTOCK} value={safetyStock} keyboardType={'numeric'}
          onChangeText={(value) => setSafetyStock(value)}/>
        <ZButton text={strings.SAVE} icon={'content-save-outline'} onPress={handleSaveProduct} />
      </ScrollView>
    </View>
  );
}

export default ProductScreenAddNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


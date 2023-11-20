import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ScrollView, BackHandler, Dimensions } from 'react-native';
import { COLORS, TEXT_SIZE, ASYNC_DATA_KEY, ASYNC_DATA_TYPE } from '../../common/Constants';
import { storeData, getData } from '../../services/AsyncStorageService';
import strings from '../../i18n/i18n'
import ZCard from '../../components/ZCard'
import ZText from '../../components/ZText'
import ZIconButton from '../../components/ZIconButton';
import ZLabel from '../../components/ZLabel';
import ZLoading from '../../components/ZLoading'
import { toastMsg } from '../../common/functions';
import InAppReview from 'react-native-in-app-review';
import { useGetOutstandingDo, useGetOutstandingInvoice, useGetDoHistory, useGetInvoiceHistory } from '../../services/OverviewService';
// import {
//   LineChart,
// } from 'react-native-chart-kit';

// const monthAbbreviations = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// ];

// const { width } = Dimensions.get('window');

const OverviewScreenOrder = (props) => {
  const [clickcount, setClickcount] = useState(0);
  const [doOutstanding, setDoOutstanding] = useState(0);
  const [invoiceOutstanding, setInvoiceOutstanding] = useState(0);
  const [invoiceOutstandingTotal, setInvoiceOutstandingTotal] = useState(0)
  // const [graphDataValues, setGraphDataValues] = useState([]);
  // const [invoiceGraphDataValues, setInvoiceGraphDataValues] = useState([]);
  // const [options, setOptions] = useState([])
  // const [invoiceOptions, setInvoiceOptions] = useState([])

  // const chartData = {
  //   labels: options,
  //   datasets: [
  //     {
  //       data: graphDataValues,
  //     },
  //   ],
  // };

  // const invoiceChartData = {
  //   labels: invoiceOptions,
  //   datasets: [
  //     {
  //       data: invoiceGraphDataValues,
  //     },
  //   ],
  // };
  
  // const chartConfig = {
  //   decimalPlaces: 0,
  //   color: () => '#EFBE3F',
  //   labelColor: () => '#2B323B',
  //   backgroundGradientFromOpacity: 0,
  //   backgroundGradientToOpacity: 0,
  //   fillShadowGradientFrom: '#EFBE3F',
  //   fillShadowGradientFromOpacity: 1,
  //   fillShadowGradientToOpacity: 1,
  //   propsForVerticalLabels: {
  //     rotation: 0,
  //     textAnchor: 'middle',
  //   },
  // };

  const { isLoading: loadingOutstanding } = useGetOutstandingDo(
    (response) => {
      if (response?.code === "SUCCESS") {
        setDoOutstanding(response?.data?.[0]?.orderCount ?? 0);
      }
  }, () => { });

  const { isLoading: loadingInvoiceOutstanding } = useGetOutstandingInvoice(
    (response) => {
      if (response?.code === "SUCCESS") {
        setInvoiceOutstanding(response?.data?.[0]?.orderCount ?? 0);
        setInvoiceOutstandingTotal(response?.data?.[0]?.totalAmount ?? 0);
      }
  }, () => { });

  // const { isLoading } = useGetDoHistory(
  //   (response) => {
  //     if (response.code === "SUCCESS") {
  //         const optionsArr = response.data?.map(i => {
  //           const dateObj = new Date(i?.date);
  //           return `${monthAbbreviations[dateObj.getMonth()]}'${dateObj.getFullYear().toString().slice(-2)}`;
  //         })
  //         setOptions(optionsArr)

  //         const orderCount = response.data?.map(i => {
  //           return i?.orderCount
  //         })
  //         setGraphDataValues(orderCount)
  //     }
  //   }, () => { })

  // const { isLoading: fetchingInvoiceHistory } = useGetInvoiceHistory(
  //   (response) => {
  //       if (response.code === "SUCCESS") {
  //         const optionsArr = response.data?.map(i => {
  //           const dateObj = new Date(i?.date);
  //           return `${monthAbbreviations[dateObj.getMonth()]}'${dateObj.getFullYear().toString().slice(-2)}`;
  //         })
  //         setInvoiceOptions(optionsArr)

  //         const orderAmount = response.data?.map(i => {
  //           return i?.orderAmount
  //         })
  //         setInvoiceGraphDataValues(orderAmount)
  //       }
  //   }, () => { })

  const check = () => {
    if (clickcount < 2) {
      toastMsg(strings.PRESS_EXIT_MSG)
      setTimeout(() => {
        setClickcount(0);
      }, 2000);
    } else if (clickcount == 2) {
      BackHandler.exitApp()
    }
  }

  const handleBackButtonClick = () => {
    setClickcount(clickcount + 1);
    check();
    return true
  }

  const reateInAndroid = async () => {
    if (InAppReview.isAvailable()) {
      console.log('version of device supported to rate app')
      InAppReview.RequestInAppReview()
        .then((hasFlowFinishedSuccessfully) => {
          // when return true in android it means user finished or close review flow
          console.log('InAppReview in android ', hasFlowFinishedSuccessfully);
          // 1- you have option to do something ex: (navigate Home page) (in android).
          // 2- you have option to do something,
          // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

          // 3- another option:
          return hasFlowFinishedSuccessfully
          // if (hasFlowFinishedSuccessfully) {
          //   // do something for android
          //   return hasFlowFinishedSuccessfully
          // }
        })
        .catch((error) => {
          // console.log('InAppReview in android Error');
          console.log(error);
          return null
        });
    } else {
      console.log('version of device does not supported to rate app')
    }
  }


  const checkAndPromptToRate = async () => {
    var appOpenCount = await getData(ASYNC_DATA_KEY.APP_OPEN_COUNT, ASYNC_DATA_TYPE.VALUE)

    if (appOpenCount != null) {
      appOpenCount = parseInt(appOpenCount) + 1
      await storeData(ASYNC_DATA_KEY.APP_OPEN_COUNT, appOpenCount + '', ASYNC_DATA_TYPE.VALUE)
    } else {
      appOpenCount = 1
      await storeData(ASYNC_DATA_KEY.APP_OPEN_COUNT, appOpenCount + '', ASYNC_DATA_TYPE.VALUE)
    }

    if (appOpenCount == 20) {
      console.log('first time rate')
      reateInAndroid()
    }

    if (appOpenCount == 40) {
      console.log('second time rate')
    }

    if (appOpenCount == 100) {
      console.log('third time rate')
      reateInAndroid()
    }
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    checkAndPromptToRate();
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ZLoading isLoading={loadingOutstanding || loadingInvoiceOutstanding} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
        <ZCard>
          <View style={styles.card}>
            <View style={styles.title}>
              <View style={{ flex: 1 }}>
                <ZText text={strings.DELIVERY_ORDER} size={TEXT_SIZE.TITLE} fontWeight={'bold'} />
              </View>
              <View >
                <ZIconButton icon={'arrow-right'} backgroundColor={COLORS.WHITE} color={COLORS.YELLOW} onPress={() => { props.navigation.navigate("DeliveryOrder") }} />
              </View>
            </View>
            <View style={styles.cardItem}>
              <ZText text={strings.BIG_DOT} color={COLORS.ORANGE} />
              <View style={{ flex: 1 }}>
                <ZText text={strings.OUTSTANDING_ORDERS} />
              </View>
              <ZLabel text={doOutstanding} size={TEXT_SIZE.BIG} fontWeight={'bold'} color={COLORS.WHITE} backgroundColor={COLORS.ORANGE} />
            </View>
          </View>
        </ZCard>

        <ZCard>
          <View style={styles.card}>
            <View style={styles.title}>
              <View style={{ flex: 1 }}>
                <ZText text={strings.INVOICE} size={TEXT_SIZE.TITLE} fontWeight={'bold'} />
              </View>
              <View >
                <ZIconButton icon={'arrow-right'} backgroundColor={COLORS.WHITE} color={COLORS.YELLOW} onPress={() => { props.navigation.navigate("Invoice") }} />
              </View>
            </View>
            <View style={styles.cardItem}>
              <ZText text={strings.BIG_DOT} color={COLORS.ORANGE} />
              <View style={{ flex: 1 }}>
                <ZText text={strings.OUTSTANDING_INVOICE} />
              </View>
              <ZLabel text={invoiceOutstanding} size={TEXT_SIZE.BIG} fontWeight={'bold'} color={COLORS.WHITE} backgroundColor={COLORS.ORANGE} />
            </View>

            <View style={styles.cardItem}>
              <ZText text={strings.BIG_DOT} color={COLORS.GREEN} />
              <View style={{ flex: 1 }}>
                <ZText text={strings.OUTSTANDING_AMOUNT} />
              </View>
              <ZLabel text={invoiceOutstandingTotal} size={TEXT_SIZE.BIG} fontWeight={'bold'} color={COLORS.WHITE} backgroundColor={COLORS.GREEN} />
            </View>
          </View>
        </ZCard>

        {/* {(setGraphDataValues?.length !== 0 && !isLoading) ? (
          <View style={styles.chart}>
            <View style={styles.chartText}>
              <ZText fontWeight='bold' text={strings.DELIVERY_ORDER_HISTORY} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
            </View>
            <LineChart
              data={chartData}
              width={width}
              height={279}
              yAxisLabel=""
              chartConfig={chartConfig}
              verticalLabelRotation={16}
              withInnerLines={false}
              fromZero
            />
          </View>
        ) : null}

        {(invoiceGraphDataValues?.length !== 0 && !fetchingInvoiceHistory) ? (
          <View style={styles.chart}>
            <View style={styles.chartText}>
              <ZText fontWeight='bold' text={strings.INVOICE_HISTORY} size={TEXT_SIZE.BIG} ellipsizeMode='tail' numberOfLines={1} />
            </View>
            <LineChart
              data={invoiceChartData}
              width={width}
              height={279}
              yAxisLabel=""
              chartConfig={chartConfig}
              verticalLabelRotation={16}
              withInnerLines={false}
              fromZero
            />
          </View>
        ) : null} */}
      </ScrollView>
    </View>
  );
}

export default OverviewScreenOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  card: {
    margin: 5
  },
  title: {
    flexDirection: 'row',
    marginLeft: 5,
    height: 50,
    alignItems: 'center',
  },
  cardItem: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHTGREY
  },
  chart: {
    paddingVertical: 16,
  },
  chartText: {
    paddingLeft: 16,
    paddingBottom: 16,
  }
});


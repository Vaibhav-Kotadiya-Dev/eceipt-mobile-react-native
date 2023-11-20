// import React from 'react';
// import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
// import {
//   getProductCount, getClientCount, getGeneralTermsCount,
//   getDeliveryTermsCount, getPaymentTermsCount
// } from '../../database/OverviewService'
// import { COLORS, TEXT_SIZE, DATABASE } from '../../common/Constants';
// import strings from '../../i18n/i18n'

// import ZCard from '../../components/ZCard'
// import ZText from '../../components/ZText'
// import ZIconButton from '../../components/ZIconButton';
// import ZLabel from '../../components/ZLabel';
// import ZLoading from '../../components/ZLoading'

// export default class OverviewScreenOthers extends React.Component {
//   constructor(props) {
//     super(props)
//     this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
//     this.state = {
//       isLoading: false,

//       totalProduct: '',
//       totalClient: '',
//       totalGeneralTerms: '',
//       totalDeliveryTerms: '',
//       totalPaymentTerms: '',
//     }
//   }
//   componentDidMount() {
//     this.getData()
//     this.props.navigation.addListener('focus', (playload) => {
//       BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
//       this.getData()
//     });
//     this.props.navigation.addListener('blur', (playload) => {
//       BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
//     });
//   }

//   handleBackButtonClick() {
//     this.props.navigation.navigate('OverviewOrder')
//     return true;
//   };

//   getData = async () => {
//     this.setState({ isLoading: true })
//     var product = await getProductCount(DATABASE.TENANT_ID, DATABASE.USER_ID)
//     var client = await getClientCount(DATABASE.TENANT_ID, DATABASE.USER_ID)
//     var generalTerms = await getGeneralTermsCount(DATABASE.TENANT_ID, DATABASE.USER_ID)
//     var deliveryTerms = await getDeliveryTermsCount(DATABASE.TENANT_ID, DATABASE.USER_ID)
//     var paymentTerms = await getPaymentTermsCount(DATABASE.TENANT_ID, DATABASE.USER_ID)

//     this.setState({
//       totalProduct: product,
//       totalClient: client,
//       totalGeneralTerms: generalTerms,
//       totalDeliveryTerms: deliveryTerms,
//       totalPaymentTerms: paymentTerms,

//       isLoading: false
//     })


//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         <ZLoading isLoading={this.state.isLoading} />
//         <ScrollView>
//           <ZCard>
//             <View style={styles.card}>
//               <View style={styles.title}>
//                 <View style={{ flex: 1 }}>
//                   <ZText text={strings.PRODUCT} size={TEXT_SIZE.TITLE} fontWeight={'bold'} />
//                 </View>
//                 <View >
//                   <ZIconButton icon={'arrow-right'} backgroundColor={COLORS.WHITE} color={COLORS.YELLOW} onPress={() => { this.props.navigation.navigate("Product") }} />
//                 </View>
//               </View>
//               <View style={styles.cardItem}>
//                 <ZText text={strings.BIG_DOT} color={COLORS.GREEN} />
//                 <View style={{ flex: 1 }}>
//                   <ZText text={strings.TOTAL_NUMBER_OF_PRODUCT} />
//                 </View>
//                 <ZLabel text={this.state.totalProduct} size={TEXT_SIZE.BIG} fontWeight={'bold'} color={COLORS.WHITE} backgroundColor={COLORS.GREEN} />
//               </View>
//             </View>
//           </ZCard>

//           <ZCard>
//             <View style={styles.card}>
//               <View style={styles.title}>
//                 <View style={{ flex: 1 }}>
//                   <ZText text={strings.CLIENT} size={TEXT_SIZE.TITLE} fontWeight={'bold'} />
//                 </View>
//                 <View >
//                   <ZIconButton icon={'arrow-right'} backgroundColor={COLORS.WHITE} color={COLORS.YELLOW} onPress={() => { this.props.navigation.navigate("Client") }} />
//                 </View>
//               </View>
//               <View style={styles.cardItem}>
//                 <ZText text={strings.BIG_DOT} color={COLORS.LIGHTBLUE} />
//                 <View style={{ flex: 1 }}>
//                   <ZText text={strings.TOTAL_NUMBER_OF_CLIENT} />
//                 </View>
//                 <ZLabel text={this.state.totalClient} size={TEXT_SIZE.BIG} fontWeight={'bold'} color={COLORS.WHITE} backgroundColor={COLORS.LIGHTBLUE} />
//               </View>
//             </View>
//           </ZCard>

//           <ZCard>
//             <View style={styles.card}>
//               <View style={styles.title}>
//                 <View style={{ flex: 1 }}>
//                   <ZText text={strings.TERMS} size={TEXT_SIZE.TITLE} fontWeight={'bold'} />
//                 </View>
//                 <View >
//                   <ZIconButton icon={'arrow-right'} backgroundColor={COLORS.WHITE} color={COLORS.YELLOW} onPress={() => { this.props.navigation.navigate("Terms") }} />
//                 </View>
//               </View>
//               <View style={styles.cardItem}>
//                 <ZText text={strings.BIG_DOT} color={COLORS.GREEN} />
//                 <View style={{ flex: 1 }}>
//                   <ZText text={strings.TOTAL_NUMBER_OF_GENERAL_TERMS} />
//                 </View>
//                 <ZLabel text={this.state.totalGeneralTerms} size={TEXT_SIZE.BIG} fontWeight={'bold'} color={COLORS.WHITE} backgroundColor={COLORS.GREEN} />
//               </View>
//               <View style={styles.cardItem}>
//                 <ZText text={strings.BIG_DOT} color={COLORS.LIGHTBLUE} />
//                 <View style={{ flex: 1 }}>
//                   <ZText text={strings.TOTAL_NUMBER_OF_PAYMENT_TERMS} />
//                 </View>
//                 <ZLabel text={this.state.totalPaymentTerms} size={TEXT_SIZE.BIG} fontWeight={'bold'} color={COLORS.WHITE} backgroundColor={COLORS.LIGHTBLUE} />
//               </View>
//               <View style={styles.cardItem}>
//                 <ZText text={strings.BIG_DOT} color={COLORS.SECONDRY} />
//                 <View style={{ flex: 1 }}>
//                   <ZText text={strings.TOTAL_NUMBER_OF_DELIVERY_TERMS} />
//                 </View>
//                 <ZLabel text={this.state.totalDeliveryTerms} size={TEXT_SIZE.BIG} fontWeight={'bold'} color={COLORS.WHITE} backgroundColor={COLORS.SECONDRY} />
//               </View>
//             </View>
//           </ZCard>
//         </ScrollView>
//       </View>
//     );
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//   },
//   card: {
//     margin: 5
//   },
//   title: {
//     flexDirection: 'row',
//     marginLeft: 5,
//     height: 50,
//     alignItems: 'center',
//   },
//   cardItem: {
//     height: 50,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: COLORS.LIGHTGREY
//   },

// });


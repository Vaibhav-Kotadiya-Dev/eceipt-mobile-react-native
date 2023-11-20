import React from 'react';
import { View, Keyboard } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { HEADER_SCREEN_OPTIONS, COLORS, TABBAR_OPTIONS } from '../common/Constants'
import strings from '../i18n/i18n'
import ZIconButton from '../components/ZIconButton';

import CompanyProfileScreen from '../screens/CompanyProfile/CompanyProfileScreen';
import CompanyProfileScreenEdit from '../screens/CompanyProfile/CompanyProfileScreenEdit';

import OverviewScreenOrder from '../screens/Overview/OverviewScreenOrder';

import ProductScreen from '../screens/Product/ProductScreen'
import ProductScreenAddNew from '../screens/Product/ProductScreenAddNew';
import ProductScreenEdit from '../screens/Product/ProductScreenEdit';
import CategoryScreenManage from '../screens/Product/CategoryScreenManage';

import ClientScreen from '../screens/Client/ClientScreen';
import ClientScreenEdit from '../screens/Client/ClientScreenEdit';
import ClientScreenAdd from '../screens/Client/ClientScreenAdd';

import TermsScreenEdit from '../screens/Terms/TermsScreenEdit';
import TermsScreen from '../screens/Terms/TermsScreen';
import TermsScreenAddNew from '../screens/Terms/TermsScreenAddNew';

import TermsTypeScreen from '../screens/TermsType/TermsTypeScreen';
import TermsTypeScreenAddNew from '../screens/TermsType/TermsTypeScreenAddNew';
import TermsTypeScreenEdit from '../screens/TermsType/TermsTypeScreenEdit';


import DeliveryOrderScreenList from '../screens/DeliveryOrder/DeliveryOrderScreenList';
import DeliveryOrderScreenAdd from '../screens/DeliveryOrder/DeliveryOrderScreenAdd';
import DeliveryOrderScreenView from '../screens/DeliveryOrder/DeliveryOrderScreenView';
import DeliveryOrderScreenPreview from '../screens/DeliveryOrder/DeliveryOrderScreenPreview';
import DeliveryOrderScreenEdit from '../screens/DeliveryOrder/DeliveryOrderScreenEdit';

import InvoiceScreenList from '../screens/Invoice/InvoiceScreenList';
import InvoiceScreenAdd from '../screens/Invoice/InvoiceScreenAdd';
import InvoiceScreenView from '../screens/Invoice/InvoiceScreenView';
import InvoiceScreenPreview from '../screens/Invoice/InvoiceScreenPreview';
import InvoiceScreenEdit from '../screens/Invoice/InvoiceScreenEdit';

import SettingsScreen from '../screens/settings/SettingsScreen';
import InstructionScreen from '../screens/settings/InstructionScreen';
import ContactUs from '../screens/settings/ContactUs';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen'

import UserProfileScreen from '../screens/settings/UserProfileScreen';

import UOM from '../screens/UOM/uom';
import uomAddScreen from '../screens/UOM/uomAddScreen';
import uomEditScreen from '../screens/UOM/uomEditScreen';

const UomStack = createStackNavigator();
export const UomStackScreen = ({navigation}) => {
  return (
    <UomStack.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <UomStack.Screen
        name={'UomList'}
        options={{
          title: strings.MANAGE_UOM,
          headerLeft: (() => (<ZIconButton icon={'menu'} onPress={() => { Keyboard.dismiss(); navigation.openDrawer() }} />)),
          headerRight: () => (
            <View style={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }} >
              <ZIconButton icon={'plus'} iconStyle={{ marginRight: 5, marginLeft: 5 }} backgroundColor={COLORS.YELLOW}
                onPress={() => { navigation.push("UomAdd") }} />
            </View>
          )
        }}
        component={UOM} 
      />
      <UomStack.Screen
        name={'UomAdd'}
        options={{
          title: strings.ADD_UOM,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("UomList") }} />),
        }}
        component={uomAddScreen} 
      />
      <UomStack.Screen
        name={'UomEdit'}
        options={{
          title: strings.EDIT_UOM,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("UomList") }} />),
        }}
        component={uomEditScreen} 
      />
    </UomStack.Navigator>
  )
};

const CompanyProfileStack = createStackNavigator();
export const CompanyProfileStackScreen = ({ navigation }) => {
  return (
    <CompanyProfileStack.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <CompanyProfileStack.Screen name={'CompanyProfileView'}
        options={{
          title: strings.COMPANY_PROFILE,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("Overview") }} />),
        }}
        component={CompanyProfileScreen} />
      <CompanyProfileStack.Screen name={'CompanyProfileEdit'}
        options={{
          title: strings.COMPANY_PROFILE_EDIT,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("CompanyProfileView") }} />)
        }}
        component={CompanyProfileScreenEdit} />

    </CompanyProfileStack.Navigator>
  )
};



const OverviewStack = createStackNavigator();
export const OverviewStackScreen = ({ navigation }) => {
  return (
    <OverviewStack.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <OverviewStack.Screen name={'OverviewMain'}
        options={{
          title: strings.OVERVIEW,
          headerLeft: () => (<ZIconButton icon={'menu'} onPress={() => { Keyboard.dismiss(); navigation.openDrawer() }} />),
          headerRight: (() => (<View style={{ flexDirection: 'row' }}>
            <ZIconButton icon={'message-alert-outline'} onPress={() => { navigation.navigate("ContactUs") }} />
            <ZIconButton icon={'help-circle-outline'} onPress={() => { navigation.navigate("Settings", { screen: 'Instruction' }) }} />
          </View>))
        }}
        component={OverviewTabScreen} />

      <OverviewStack.Screen name={'ContactUs'}
        options={{
          title: strings.CONTACT_US,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("OverviewMain") }} />)
        }}
        component={ContactUs} />
    </OverviewStack.Navigator>
  )
};

const OverviewTabNav = createMaterialTopTabNavigator();
const OverviewTabScreen = () => (
  <OverviewTabNav.Navigator
    initialRouteName="OverviewOrder"
    activeColor={COLORS.DARK_BLUE}
    tabBarPosition="top"
    screenOptions={TABBAR_OPTIONS}
  >
    <OverviewTabNav.Screen
      name="OverviewOrder"
      options={{ tabBarLabel: strings.ORDER }}
      component={OverviewOrderStackScreen} />
    {/* <OverviewTabNav.Screen
      name="OverviewOthers"
      options={{ tabBarLabel: strings.OTHERS }}
      component={OverviewOthersStackScreen} /> */}
  </OverviewTabNav.Navigator>
);

const OverviewOrderStack = createStackNavigator();
const OverviewOrderStackScreen = ({ navigation }) => {
  return (
    <OverviewOrderStack.Navigator screenOptions={{ headerShown: false }} >
      <OverviewOrderStack.Screen name="OverviewScreenOrder" component={OverviewScreenOrder} />
    </OverviewOrderStack.Navigator>
  )
};

const ProductStack = createStackNavigator();
export const ProductStackScreen = ({ navigation }) => {
  return (
    <ProductStack.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <ProductStack.Screen name={'ProductList'}
        options={{
          title: strings.PRODUCT,
          headerLeft: (() => (<ZIconButton icon={'menu'} onPress={() => { Keyboard.dismiss(); navigation.openDrawer() }} />)),
          headerRight: () => (
            <View style={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }} >
              <ZIconButton icon={'plus'} iconStyle={{ marginRight: 5, marginLeft: 5 }} backgroundColor={COLORS.YELLOW}
                onPress={() => { navigation.push("ProductAddNew") }} />
            </View>
          )
        }}
        component={ProductScreen} />
      <ProductStack.Screen name={'ProductAddNew'}
        options={{
          title: strings.ADD_NEW_PRODUCT,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("ProductList") }} />),
          headerRight: (() => (<ZIconButton text={strings.CAT} onPress={() => { navigation.navigate("CategoryEdit") }} />))

        }}
        component={ProductScreenAddNew} />
      <ProductStack.Screen name={'ProductEdit'}
        options={{
          title: strings.EDIT_PRODUCT,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("ProductList") }} />),
          headerRight: (() => (<ZIconButton text={strings.CAT} onPress={() => { navigation.navigate("CategoryEdit") }} />))
        }}
        component={ProductScreenEdit} />

      <ProductStack.Screen name={'CategoryEdit'}
        options={{
          title: strings.MANAGE_CATEGORY,
          headerLeft: () => (
            <ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("ProductList") }} />),
        }}
        component={CategoryScreenManage} />
    </ProductStack.Navigator>
  )
};

const ClientStack = createStackNavigator();
export const ClientStackScreen = ({ navigation }) => {
  return (
    <ClientStack.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <ClientStack.Screen name={'ClientList'}
        options={{
          title: strings.CLIENT,
          headerLeft: () => (<ZIconButton icon={'menu'} onPress={() => { Keyboard.dismiss(); navigation.openDrawer() }} />),
          headerRight: () => (
            <View style={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }} >
              <ZIconButton icon={'plus'} iconStyle={{ marginRight: 5, marginLeft: 5 }} backgroundColor={COLORS.YELLOW}
                onPress={() => { navigation.push("ClientAdd") }} />
            </View>
          )
        }}
        component={ClientScreen} />
      <ClientStack.Screen name={'ClientEdit'}
        options={{
          title: strings.CLIENT_EDIT,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("ClientList") }} />)
        }}
        component={ClientScreenEdit} />
      <ClientStack.Screen name={'ClientAdd'}
        options={{
          title: strings.CLIENT_ADD,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("ClientList") }} />)
        }}
        component={ClientScreenAdd} />
    </ClientStack.Navigator>
  )
};

const DeliveryOrderStack = createStackNavigator();
export const DeliveryOrderStackScreen = ({ navigation }) => {
  return (
    <DeliveryOrderStack.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <DeliveryOrderStack.Screen name={'DeliveryOrderMain'}
        options={{
          title: strings.DELIVERY_ORDER,
          headerLeft: () => (<ZIconButton icon={'menu'} onPress={() => { Keyboard.dismiss(); navigation.openDrawer() }} />),
          headerRight: () => (
            <View style={{marginLeft: 5, marginRight: 5, marginBottom: 5}}>
              <ZIconButton
                icon={"plus"}
                iconStyle={{marginRight: 5, marginLeft: 5}}
                backgroundColor={COLORS.YELLOW}
                onPress={() => {
                  navigation.navigate("DeliveryOrderCreate");
                }}
              />
            </View>
          )
        }}
        component={DeliveryOrderScreenList} />
      <DeliveryOrderStack.Screen name={'DeliveryOrderView'}
        options={{
          title: strings.VIEW_DELIVERY_ORDER,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { Keyboard.dismiss(); navigation.navigate("DeliveryOrderMain") }} />)
        }}
        component={DeliveryOrderScreenView} />
      <DeliveryOrderStack.Screen name={'DeliveryOrderCreate'}
        screenOptions={{ gestureEnabled: false }}
        options={{
          title: strings.CREATE_DELIVERY_ORDER,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { Keyboard.dismiss(); navigation.navigate("DeliveryOrderMain") }} />)
        }}
        component={DoTabScreen} />

      <DeliveryOrderStack.Screen name={'DeliveryOrderEdit'}
        screenOptions={{ gestureEnabled: false }}
        options={{
          title: strings.EDIT_DELIVERY_ORDER,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { Keyboard.dismiss(); navigation.navigate("DeliveryOrderMain") }} />)
        }}
        component={DoTabEditScreen} />

    </DeliveryOrderStack.Navigator>
  )
};

const DoTabNav = createMaterialTopTabNavigator();
const DoTabScreen = () => (
  <DoTabNav.Navigator
    initialRouteName="DeliveryOrderAddScreenTab"
    activeColor={COLORS.PRIMARY}
    tabBarPosition="top"
    screenOptions={{ ...TABBAR_OPTIONS, unmountOnBlur: true, swipeEnabled: false }}  
  >
    <DoTabNav.Screen
      name="DeliveryOrderAddScreenTab"
      options={{ tabBarLabel: strings.CREATE }}
      component={DeliveryOrderAddStackScreen} />
    <DoTabNav.Screen
      name="DeliveryOrderPreviewScreenTab"
      options={{ tabBarLabel: strings.PREVIEW }}
      component={DeliveryOrderPreviewStackScreen}
      listeners={{
        tabPress: e => {
          e.preventDefault();
        },
      }}
    />
  </DoTabNav.Navigator>
);

const DoTabEditNav = createMaterialTopTabNavigator();
const DoTabEditScreen = () => (
  <DoTabEditNav.Navigator
    initialRouteName="DeliveryOrderEditScreenTab"
    activeColor={COLORS.PRIMARY}
    tabBarPosition="top"
    screenOptions={{ ...TABBAR_OPTIONS, unmountOnBlur: true, swipeEnabled: false }}  
  >
    <DoTabEditNav.Screen
      name="DeliveryOrderEditScreenTab"
      options={{ tabBarLabel: strings.EDIT }}
      component={DeliveryOrderEditStackScreen} />
    <DoTabEditNav.Screen
      name="DeliveryOrderPreviewScreenTab"
      options={{ tabBarLabel: strings.PREVIEW }}
      component={DeliveryOrderPreviewStackScreen}
      listeners={{
        tabPress: e => {
          e.preventDefault();
        },
      }}
    />
  </DoTabEditNav.Navigator>
);

const DeliveryOrderAddStack = createStackNavigator();
const DeliveryOrderAddStackScreen = ({ navigation }) => {
  return (
    <DeliveryOrderAddStack.Navigator screenOptions={{ headerShown: false }} >
      <DeliveryOrderAddStack.Screen name="DeliveryOrderAddStackScreen" component={DeliveryOrderScreenAdd} />
    </DeliveryOrderAddStack.Navigator>
  )
};
const DeliveryOrderPreviewStack = createStackNavigator();
const DeliveryOrderPreviewStackScreen = ({ navigation }) => {
  return (
    <DeliveryOrderPreviewStack.Navigator screenOptions={{ headerShown: false }} >
      <DeliveryOrderPreviewStack.Screen name="DeliveryOrderPreviewStackScreen" component={DeliveryOrderScreenPreview} />
    </DeliveryOrderPreviewStack.Navigator>
  )
};

const DeliveryOrderEditStack = createStackNavigator();
const DeliveryOrderEditStackScreen = ({ navigation }) => {
  return (
    <DeliveryOrderEditStack.Navigator screenOptions={{ headerShown: false }} >
      <DeliveryOrderEditStack.Screen name="DeliveryOrderEditStackScreen" component={DeliveryOrderScreenEdit} />
    </DeliveryOrderEditStack.Navigator>
  )
};


const InvoiceStack = createStackNavigator();
export const InvoiceStackScreen = ({ navigation }) => {
  return (
    <InvoiceStack.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <InvoiceStack.Screen name={'InvoiceMain'}
        options={{
          title: strings.INVOICE,
          headerLeft: () => (<ZIconButton icon={'menu'} onPress={() => { Keyboard.dismiss(); navigation.openDrawer() }} />),
          headerRight: () => (
            <View style={{marginLeft: 5, marginRight: 5, marginBottom: 5}}>
              <ZIconButton
                icon={"plus"}
                iconStyle={{marginRight: 5, marginLeft: 5}}
                backgroundColor={COLORS.YELLOW}
                onPress={() => {
                  navigation.navigate("InvoiceCreate");
                }}
              />
            </View>
          )
        }}
        component={InvoiceScreenList} />
      <InvoiceStack.Screen name={'InvoiceView'}
        options={{
          title: strings.VIEW_INVOICE,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { Keyboard.dismiss(); navigation.navigate("InvoiceMain") }} />)
        }}
        component={InvoiceScreenView} />
      <InvoiceStack.Screen name={'InvoiceCreate'}
        screenOptions={{ gestureEnabled: false }}
        options={{
          title: strings.CREATE_INVOICE,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { Keyboard.dismiss(); navigation.navigate("InvoiceMain") }} />)
        }}
        component={InvoiceTabScreen} />
      <InvoiceStack.Screen name={'InvoiceEdit'}
        screenOptions={{ gestureEnabled: false }}
        options={{
          title: strings.EDIT_INVOICE,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { Keyboard.dismiss(); navigation.navigate("InvoiceMain") }} />)
        }}
        component={InvoiceTabEditScreen} />

    </InvoiceStack.Navigator>
  )
};

const InvoiceTabNav = createMaterialTopTabNavigator();
const InvoiceTabScreen = () => (
  <InvoiceTabNav.Navigator
    initialRouteName="InvoiceAddScreenTab"
    activeColor={COLORS.PRIMARY}
    tabBarPosition="top"
    screenOptions={{swipeEnabled: false}}
  >
    <InvoiceTabNav.Screen
      name="InvoiceAddScreenTab"
      options={{ tabBarLabel: strings.CREATE }}
      component={InvoiceAddStackScreen} />
    <InvoiceTabNav.Screen
      name="InvoicePreviewScreenTab"
      options={{ tabBarLabel: strings.PREVIEW }}
      component={InvoicePreviewStackScreen}
      listeners={{
        tabPress: e => {
          e.preventDefault();
        },
      }}

    />
  </InvoiceTabNav.Navigator>
);

const InvoiceTabEditNav = createMaterialTopTabNavigator();
const InvoiceTabEditScreen = () => (
  <InvoiceTabEditNav.Navigator
    initialRouteName="InvoiceEditScreenTab"
    activeColor={COLORS.PRIMARY}
    tabBarPosition="top"
    screenOptions={{swipeEnabled: false}}
  >
    <InvoiceTabEditNav.Screen
      name="InvoiceEditScreenTab"
      options={{ tabBarLabel: strings.EDIT }}
      component={InvoiceEditStackScreen} />
    <InvoiceTabEditNav.Screen
      name="InvoicePreviewScreenTab"
      options={{ tabBarLabel: strings.PREVIEW }}
      component={InvoicePreviewStackScreen}
      listeners={{
        tabPress: e => {
          e.preventDefault();
        },
      }}

    />
  </InvoiceTabEditNav.Navigator>
);

const InvoiceAddStack = createStackNavigator();
const InvoiceAddStackScreen = ({ navigation }) => {
  return (
    <InvoiceAddStack.Navigator screenOptions={{ headerShown: false }} >
      <InvoiceAddStack.Screen name="InvoiceAddStackScreen" component={InvoiceScreenAdd} />
    </InvoiceAddStack.Navigator>
  )
};
const InvoicePreviewStack = createStackNavigator();
const InvoicePreviewStackScreen = ({ navigation }) => {
  return (
    <InvoicePreviewStack.Navigator screenOptions={{ headerShown: false }} >
      <InvoicePreviewStack.Screen name="InvoicePreviewStackScreen" component={InvoiceScreenPreview} />
    </InvoicePreviewStack.Navigator>
  )
};

const InvoiceEditStack = createStackNavigator();
const InvoiceEditStackScreen = ({ navigation }) => {
  return (
    <InvoiceEditStack.Navigator screenOptions={{ headerShown: false }} >
      <InvoiceEditStack.Screen name="InvoiceEditStackScreen" component={InvoiceScreenEdit} />
    </InvoiceEditStack.Navigator>
  )
};

const SettingsStack = createStackNavigator();
export const SettingsStackScreen = ({ navigation }) => {
  return (
    <SettingsStack.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <SettingsStack.Screen name={'SettingsMain'}
        options={{
          title: strings.SETTINGS,
          headerLeft: () => (<ZIconButton icon={'menu'} onPress={() => { Keyboard.dismiss(); navigation.openDrawer() }} />),
          headerRight: (() => (<View style={{ flexDirection: 'row' }}>
            <ZIconButton icon={'help-circle-outline'} onPress={() => { navigation.navigate("Settings", { screen: 'Instruction' }) }} />
          </View>))
        }}
        component={SettingTabScreen} />
      <SettingsStack.Screen name={'Instruction'}
        options={{
          title: strings.INSTRUCTION,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("SettingsMain") }} />),
          headerRight: (() => (<ZIconButton text={strings.POLICY} onPress={() => { navigation.navigate("PrivacyPolicy") }} />))
        }}
        component={InstructionScreen} />
      <SettingsStack.Screen name={'PrivacyPolicy'}
        options={{
          title: strings.PRIVACY_POLICY,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("SettingsMain") }} />),

        }}
        component={PrivacyPolicyScreen} />
    </SettingsStack.Navigator>
  )
};

const SettingTabNav = createMaterialTopTabNavigator();
const SettingTabScreen = () => (
  <SettingTabNav.Navigator
    initialRouteName="SettingScreenTab"
    activeColor={COLORS.PRIMARY}
    tabBarPosition="top"
    screenOptions={{swipeEnabled: false}}
  >
    <SettingTabNav.Screen
      name="SettingScreenTab"
      options={{ tabBarLabel: strings.SETTINGS }}
      component={SettingStackScreen} />
    <SettingTabNav.Screen
      name="UserProfileScreenTab"
      options={{ tabBarLabel: strings.PROFILE }}
      component={UserProfileStackScreen} />
  </SettingTabNav.Navigator>
);
const SettingStack = createStackNavigator();
const SettingStackScreen = ({ navigation }) => {
  return (
    <SettingStack.Navigator screenOptions={{ headerShown: false }} >
      <SettingStack.Screen name="SettingsScreen" component={SettingsScreen} />
    </SettingStack.Navigator>
  )
};

const UserProfileStack = createStackNavigator();
const UserProfileStackScreen = ({ navigation }) => {
  return (
    <UserProfileStack.Navigator screenOptions={{ headerShown: false }} >
      <UserProfileStack.Screen name="UserProfileScreen" component={UserProfileScreen} />
    </UserProfileStack.Navigator>
  )
};

const TermsStackNew = createStackNavigator();
export const TermsStackNewScreen = ({ navigation }) => {
  return (
    <TermsStackNew.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <TermsStackNew.Screen name={'TermsList'}
        options={{
          title: strings.TERMS,
          headerLeft: (() => (<ZIconButton icon={'menu'} onPress={() => { Keyboard.dismiss(); navigation.openDrawer() }} />)),
          headerRight: () => (
            <View style={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }} >
              <ZIconButton icon={'plus'} iconStyle={{ marginRight: 5, marginLeft: 5 }} backgroundColor={COLORS.YELLOW}
                onPress={() => { navigation.push("TermsAddNew") }} />
            </View>
          )
        }}
        component={TermsScreen} />
      <TermsStackNew.Screen name={'TermsAddNew'}
        options={{
          title: strings.ADD_NEW_TERMS,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("TermsList") }} />),

        }}
        component={TermsScreenAddNew} />
      <TermsStackNew.Screen name={'TermsEdit'}
        options={{
          title: strings.EDIT_TERMS,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("TermsList") }} />),
        }}
        component={TermsScreenEdit} />
    </TermsStackNew.Navigator>
  )
};

const TermsTypeStack = createStackNavigator();
export const TermsTypeStackScreen = ({ navigation }) => {
  return (
    <TermsTypeStack.Navigator screenOptions={HEADER_SCREEN_OPTIONS} >
      <TermsTypeStack.Screen name={'TermsTypeList'}
        options={{
          title: strings.TERMS_TYPE,
          headerLeft: (() => (<ZIconButton icon={'menu'} onPress={() => { Keyboard.dismiss(); navigation.openDrawer() }} />)),
          headerRight: () => (
            <View style={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }} >
              <ZIconButton icon={'plus'} iconStyle={{ marginRight: 5, marginLeft: 5 }} backgroundColor={COLORS.YELLOW}
                onPress={() => { navigation.push("TermsTypeAddNew") }} />
            </View>
          )
        }}
        component={TermsTypeScreen} />
      <TermsTypeStack.Screen name={'TermsTypeAddNew'}
        options={{
          title: strings.ADD_NEW_TERMS_TYPE,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("TermsTypeList") }} />),

        }}
        component={TermsTypeScreenAddNew} />
      <TermsTypeStack.Screen name={'TermsTypeEdit'}
        options={{
          title: strings.EDIT_TERMS_TYPE,
          headerLeft: () => (<ZIconButton icon={'arrow-left'} onPress={() => { navigation.navigate("TermsTypeList") }} />),
        }}
        component={TermsTypeScreenEdit} />
    </TermsTypeStack.Navigator>
  )
};
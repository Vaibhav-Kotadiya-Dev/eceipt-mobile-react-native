import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerSideMenu from './DrawerSideMenu';
import {
  CompanyProfileStackScreen,
  OverviewStackScreen,
  ProductStackScreen,
  ClientStackScreen,
  DeliveryOrderStackScreen,
  InvoiceStackScreen,
  SettingsStackScreen,
  UomStackScreen,
  TermsStackNewScreen,
  TermsTypeStackScreen
} from './ScreenStacks';

const Drawer = createDrawerNavigator();

export const AppStack = () => {
  return (
    <Drawer.Navigator initialRouteName='Overview' screenOptions={{ headerShown: false, unmountOnBlur: true }} drawerContent={props => <DrawerSideMenu {...props} />}>
      <Drawer.Screen name="Overview" component={OverviewStackScreen} options={{ title: 'Overview Stack' }} />
      <Drawer.Screen name="Product" component={ProductStackScreen} options={{ title: 'Product Stack' }} />
      <Drawer.Screen name="Client" component={ClientStackScreen} options={{ title: 'Client Stack' }} />
      <Drawer.Screen name="Terms" component={TermsStackNewScreen} options={{ title: 'Terms' }} />
      <Drawer.Screen name="TermsType" component={TermsTypeStackScreen} options={{ title: 'TermsType' }} />
      <Drawer.Screen name="DeliveryOrder" component={DeliveryOrderStackScreen} options={{ title: 'DeliveryOrder Stack' }} />
      <Drawer.Screen name="Invoice" component={InvoiceStackScreen} options={{ title: 'Invoice Stack' }} />
      <Drawer.Screen name="Settings" component={SettingsStackScreen} options={{ title: 'Settings Stack' }} />
      <Drawer.Screen name="CompanyProfile" component={CompanyProfileStackScreen} options={{ title: 'Profile Screen Only' }} />
      <Drawer.Screen name="UOM" component={UomStackScreen} options={{ title: 'UOM' }} />
    </Drawer.Navigator>
  );
};

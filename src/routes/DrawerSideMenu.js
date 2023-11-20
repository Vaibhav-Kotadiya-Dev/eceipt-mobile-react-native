import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, SafeAreaView } from 'react-native';
import { Drawer, TouchableRipple } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { APPICON, APPNAME, COLORS } from '../common/Constants'
import ZMenuTitle from '../components/ZMenuTitle'
import ZMenuItem from '../components/ZMenuItem'
import strings from '../i18n/i18n'
import ZIcon from '../components/ZIcon';

import { useAuth } from '../contexts/AuthContext';

export default function DrawerSideMenu (props) {
	const auth = useAuth();
	const [avataUrl, setAvataUrl] = useState(APPICON);
	const [companyName, setCompanyName] = useState(APPNAME);

	useEffect(() => {
		if (global.DrawerNeedUpdate == true) {
			global.DrawerNeedUpdate = false
		}
	}, [global])

	return (
		<>		
		<SafeAreaView />
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
				<View style={styles.drawerContent}>
					<View style={styles.userInfoSection}>
						<View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
							<ImageBackground source={{ uri: avataUrl }} resizeMode="contain" style={styles.avataImg} />
							<TouchableRipple style={{ flex: 1 }} onPress={() => { props.navigation.navigate('CompanyProfile') }}>
								<View style={styles.titleView}>
									<ZMenuTitle text={companyName} height={60} />
									<ZIcon icon={'pencil-box'} size={30} color={COLORS.YELLOW} style={{
										position: 'absolute',
										right: 0,
										bottom: 0
									}} />
								</View>
							</TouchableRipple>
						</View>
					</View>
					<Drawer.Section>
						<ZMenuItem
							icon={"chart-pie"}
							text={strings.OVERVIEW}
							onPress={() => { props.navigation.navigate('Overview') }} />
					</Drawer.Section>
					<Drawer.Section >
						<ZMenuItem
							icon={"tag-text-outline"}
							text={strings.PRODUCT}
							onPress={() => { props.navigation.navigate('Product') }} />
						<ZMenuItem
							icon={"account-multiple-outline"}
							text={strings.CLIENT}
							onPress={() => { props.navigation.navigate('Client') }} />
						<ZMenuItem
							icon={"file-document-outline"}
							text={strings.TERMS}
							onPress={() => { props.navigation.navigate('Terms') }} />
						<ZMenuItem
							icon={"file-document-outline"}
							text={strings.TERMS_TYPE}
							onPress={() => { props.navigation.navigate('TermsType') }} />
						<ZMenuItem
							icon={"file-document-outline"}
							text={strings.UOM}
							onPress={() => { props.navigation.navigate('UOM') }} />
					</Drawer.Section>
					<Drawer.Section>
						<ZMenuItem
							icon={"truck-delivery-outline"}
							text={strings.DELIVERY_ORDER}
							onPress={() => { props.navigation.navigate('DeliveryOrder') }} />
						<ZMenuItem
							icon={"file-document-outline"}
							text={strings.INVOICE}
							onPress={() => { props.navigation.navigate('Invoice') }} />
					</Drawer.Section>
					<Drawer.Section>
						<ZMenuItem
							icon={"cog-outline"}
							text={strings.SETTINGS}
							onPress={() => { props.navigation.navigate('Settings') }} />
					</Drawer.Section>
				</View>
			</DrawerContentScrollView>
			<Drawer.Section style={styles.bottomDrawerSection}>
				{auth.isLoggedIn ?
					<ZMenuItem
						icon={"logout"}
						text={strings.SIGN_OUT}
						onPress={() => { 
							auth.signOut(); 
							props.navigation.closeDrawer();
							props.navigation.reset({
								index: 0,
								routes: [
									{
										name: 'NONAUTH',
										state: {
											routes: [{name: 'Login'}],
										},
									},
								],
							});
						}} />
					: <ZMenuItem
						icon={"login"}
						text={strings.SIGN_IN}
						onPress={() => { props.navigation.navigate('Login', { screen: 'Login' }) }} />}

			</Drawer.Section>
		</View >
		</>
	);
}

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1,
	},
	userInfoSection: {
		paddingLeft: 20,
		paddingRight: 10,
		paddingBottom: 10,
		backgroundColor: COLORS.LIGHTGREY
	},
	avataImg: {
		width: 60, height: 60
	},
	titleView: {
		flex: 1, marginLeft: 10, flexDirection: 'column', height: 60
	},
	row: {
		marginTop: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	drawerSection1: {
		marginTop: 15,
	},
	drawerSection2: {

	},
	bottomDrawerSection: {
		marginBottom: 15,

	},
	preference: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
});

import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, BackHandler, Keyboard, Platform
} from 'react-native';
import styles from './style';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import Edit from '../../../assets/edit_new_blue.png';
import downKey from '../../../assets/down.png';
import BankAccountDetails from './BankAccountDetails';
import BasicDetailsClinic from './BasicDetailsClinic'
import GoogleReview from './GoogleReview'
import { setLogEvent } from '../../service/Analytics';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'
import { NavigationEvents } from 'react-navigation';

class ClinicSetupIndex extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			clinicList: DRONA.getClinicList(),
			dorctoList: [],
			dataConsultantObjClinic: null,
			dataConsultantObjVirtual: null,
			dateTimeArrClinic: [],
			dateTimeArrVirtual: [],
			clinicName: '',
			clinicAddress: '',
			clinicNumber: '',
			clinicProfilePic: '',
			bankDetails: null,
			upiDetails: null,
			clinicUrl: '',
			initialPage: props && props.navigation && props.navigation.state && props.navigation.state.params && props.navigation.state.params.tabActive == 1 ? 1 : 0,
			resData: null
		};
		DRONA.setIsReloadApi(true);
	}
	async componentDidMount() {
		let { actions, signupDetails } = this.props;
		setLogEvent("home", { "Edit_Clinic": "click", UserGuid: signupDetails.UserGuid })
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.navigate('DoctorHome'))

	}


	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'clinicDetailsHome' && newProps.responseData.statusCode == '0') {
				let data = newProps.responseData.data;
				if (data && data.clinicDetails) {
					try {
						let clinicDetails = data.clinicDetails;
						let clinicAddr = '';
						if (clinicDetails.clinicAddress) {
							clinicAddr = clinicDetails.clinicAddress
						}
						if (clinicDetails.clinicCity && !clinicDetails.clinicAddress) {
							clinicAddr += clinicDetails.clinicAddress ? ', ' + clinicDetails.clinicCity : clinicDetails.clinicCity
						}
						if (clinicDetails.clinicState && !clinicDetails.clinicAddress) {
							clinicAddr += ', ' + clinicDetails.clinicState
						}

						if (clinicDetails.clinicZip) {
							clinicAddr += ', ' + clinicDetails.clinicZip
						}
						if (clinicDetails.clinicCountry) {
							clinicAddr += ', ' + clinicDetails.clinicCountry;
						}

						this.setState({ clinicAddress: clinicAddr, clinicName: clinicDetails.clinicName, clinicNumber: clinicDetails.clinicNumber ? clinicDetails.clinicNumber : '', clinicUrl: clinicDetails.clinicImageUrl })
					} catch (e) { }
					DRONA.setIsReloadApi(false);
				}
				this.setState({ resData: data });


			}
		}
	}
	makeShortName = (name) => {
		let shortName = '';
		if (name != null && name.length > 0) {
			try {
				if (name.includes(' ')) {
					let nameArr = name.split(' ')
					if (nameArr.length > 0) {
						let lastIndex = nameArr.length - 1;
						shortName = nameArr[0].charAt(0).toUpperCase() + (lastIndex > 0 ? nameArr[lastIndex].charAt(0).toUpperCase() : "")
					}
				}
				else {
					shortName = name.substr(0, 2)
				}
			} catch (e) { }
			return shortName
		}
	}

	nameFormat = (fullName) => {
		let str = '';
		try {
			if (fullName.includes(' ')) {
				let strArr = fullName.trim().split(' ');
				if (strArr[1]) {
					str = strArr[0].substr(0, 1).toUpperCase() + strArr[1].substr(0, 1).toUpperCase()
				} else {
					str = strArr[0].substr(0, 2).toUpperCase();
				}
			} else {
				str = fullName.substr(1, 2)
			}
		} catch (e) { }
		return str
	}

	getClinicData = () => {
		Keyboard.dismiss(0);
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid":DRONA.getClinicGuid(),// signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToSetupClinicDetails_V2', 'post', params, signupDetails.accessToken, 'clinicDetailsHome');
	}



	render() {
		let { signupDetails } = this.props;
		let from = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.from ? this.props.navigation.state.params.from : 'first';
		return (
			<SafeAreaView style={Platform.OS == 'android' ? styles.containerAndroid : styles.container}>
				<NavigationEvents onDidFocus={() => {
					if (DRONA.getIsReloadApi())
						this.getClinicData()
				}} />
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.white }}>
					<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), }}>
						<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() =>{
							//DRONA.setIsReloadApi(true);
							this.props.navigation.goBack();
						} }>
							<Image source={arrowBack} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5), margin: 7 }} />
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 7, alignItems: 'center', flexDirection: 'row' }}>
							<View style={{
								height: responsiveFontSize(5), width: responsiveFontSize(5), backgroundColor: '#EEE7FB', borderRadius: responsiveFontSize(3),
								alignItems: 'center', justifyContent: 'center'
							}}>
								{/* <Image source={{uri: clinicUrl}} style={{ height: responsiveFontSize(4), width: responsiveFontSize(4),borderRadius: responsiveFontSize(2), resizeMode: 'contain' }} /> */}
								{this.state.clinicUrl && this.state.clinicUrl != '' ?
									<Image
										source={{ uri: this.state.clinicUrl }}
										style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5) }}
									/>
									: <Text style={{ fontSize: CustomFont.font16, color: Color.white, textTransform: 'uppercase' }}>{this.makeShortName(this.state.clinicName)}</Text>
								}

							</View>
							<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font16, color: Color.fontColor, textTransform: "capitalize", marginLeft: responsiveWidth(1.6) }}>{this.state.clinicName && this.state.clinicName.length > 28 ? this.state.clinicName.substring(0, 26) + '...' : this.state.clinicName}</Text>

						</TouchableOpacity>
						{/* <TouchableOpacity style={{ flex: .8, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('ClinicList')}>
							<Image source={downKey} style={{ height: responsiveFontSize(1.6), width: responsiveFontSize(1.6), resizeMode: 'contain' }} />
						</TouchableOpacity> */}
						{!signupDetails.isAssistantUser && DRONA.getClinicGuid()?
							<TouchableOpacity style={{ flex: .8, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('AddNewClinicDetails', { from: 'edit' })}>
								<Image source={Edit} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
							</TouchableOpacity> : null}
					</View>
					<View style={{ zIndex: 999, backgroundColor: Color.white }}>
						<Text style={{ marginLeft: responsiveWidth(22), fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.fontColor }}>{this.state.clinicAddress}</Text>
						<Text style={{ marginLeft: responsiveWidth(22), fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.fontColor, marginBottom: responsiveHeight(4) }}>{this.state.clinicNumber ? 'Clinic Phone Number : ' + this.state.clinicNumber : ''}</Text>
					</View>
					<ScrollableTabView
						renderTabBar={() => (
							<ScrollableTabBar
							//style={styles.scrollStyle}
							//tabStyle={styles.tabStyle}
							/>
						)}
						tabBarTextStyle={{ fontSize: CustomFont.font16 }}
						tabBarInactiveTextColor={Color.optiontext}
						tabBarActiveTextColor={Color.primary}
						tabBarUnderlineStyle={{ backgroundColor: Color.primary, width: responsiveWidth(10), borderRadius: 4, }}
						initialPage={this.state.initialPage}
					>

						<BasicDetailsClinic tabLabel={'Fees & Timings'} style={{ flex: 1 }} nav={{ navigation: this.props.navigation }} />
						{this.state.resData ? <BankAccountDetails resData={this.state.resData} tabLabel={'Assistant & Bank Details'} nav={{ navigation: this.props.navigation, popupOpenStatus: from }} style={{ flex: 1 }} /> : <BankAccountDetails resData={this.state.resData} tabLabel={'Assistant & Bank Details'} nav={{ navigation: this.props.navigation, popupOpenStatus: from }} style={{ flex: 1 }} />}
						<GoogleReview tabLabel={'Review Link'} style={{ flex: 1 }} nav={{ navigation: this.props.navigation }} />

					</ScrollableTabView>


				</View>

			</SafeAreaView>
		);
	}

}
const mapStateToProps = state => ({
	signupDetails: state.signupReducerConfig.signupDetails,
	responseData: state.apiResponseDataConfig.responseData,
	loading: state.apiResponseDataConfig.loading,
});

const ActionCreators = Object.assign(
	{},
	apiActions, signupActions
);
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ClinicSetupIndex);
import React, { useState } from 'react';
import {
	Alert, AppState, SafeAreaView, View, Keyboard, BackHandler, StatusBar, Text, Linking, TouchableOpacity, Platform
} from 'react-native';
import styles from './style';
import FooterTab from '../../utils/footerTab';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Home from './Home';
import Community from './Community';
import Appoinment from './Appoinment';
import Patients from './Patients';
import Ecard from '../eCard/eCardHome';
//import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from 'react-native-encrypted-storage';
import RNExitApp from 'react-native-exit-app';
import Modal from 'react-native-modal';
import Moment from 'moment';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
import Trace from '../../service/Trace'
let appVersion = Platform.OS == 'android' ? 'V_20230310' : 'V_20230310';
let timeRange = '', age = '';
let assistantAdded = '';
let cityName = '';

class DoctorHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0,
			detailText: 'More Details',
			graphArr: [1],
			latestScore: '',
			forceRefresh: null,
			filePath: '',
			selectedIndex: props.signupDetails.isAssistantUser ? 0 : 2,
			isModalVisible: false,
			footerRefresh: true,

			forceUpdateModal: false,
			isUpdateMandatory: false,
			appState: AppState.currentState,

		};
		//alert(JSON.stringify(props.signupDetails.isAssistantUser));

	}


	async componentDidMount() {
		//
		this.getCurrentLocation();
		// let { actions, signupDetails } = this.props;
		// let accessToken = signupDetails.accessToken ? signupDetails.accessToken : CryptoJS.AES.decrypt(await AsyncStorage.getItem('accessToken'),'MNKU').toString(CryptoJS.enc.Utf8);
		// let params = {
		// 	"UserGuid": signupDetails.UserGuid,
		// 	"Data":{}
		// }
		// actions.callLogin('V11/FuncForDrAppToGetDoctorFireBase', 'post', params, accessToken, 'Kpidata');
		this.callAppVersionCheckAPI();
		Keyboard.dismiss(0);
		await AsyncStorage.setItem('profile_complete', 'profile_complete');
		DRONA.setThat(this);

		Linking.addEventListener('url', this.handleNavigation);
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)


	}


	getCurrentLocation = async () => {
		// Get Current Location
		GetLocation.getCurrentPosition({
			enableHighAccuracy: true,
			timeout: 15000,
		})
			.then(location => {
				// ** Get Address from lat and lon **//
				Geocoder.init("AIzaSyD4Lqrxf6Gpnkz5i4LU6h2eyyNAakaKtT8");
				Geocoder.from(location.latitude, location.longitude)
					.then(json => {
						let tempLocation = json.results[0].address_components[0].long_name;
						try {
							let tempLocation1 = json.results[0].address_components[1].long_name
						//console.log('Location========> ' + JSON.stringify(json.results[0]))
						if ( tempLocation && tempLocation.length < 10 && tempLocation1 && tempLocation1.length < 90) {
							cityName = tempLocation + ', ' + tempLocation1;
						}
						else if (tempLocation && tempLocation.length < 10 && tempLocation1 && tempLocation1.length > 90) {
							cityName = tempLocation + ', ' + tempLocation1.substring(0, 89);
						}
						else if (tempLocation && tempLocation.length > 99) {
							cityName = tempLocation.substring(0, 99);
						}
						else
						{
							cityName = tempLocation;
						}
						} catch (error) {
							
						}
						
						// CALL FIREBASE KPI API
						let { actions, signupDetails } = this.props;
						let accessToken = signupDetails.accessToken ? signupDetails.accessToken : CryptoJS.AES.decrypt(AsyncStorage.getItem('accessToken'), 'MNKU').toString(CryptoJS.enc.Utf8);
						let params = {
							"UserGuid": signupDetails.UserGuid,
							"Data": {}
						}
						actions.callLogin('V11/FuncForDrAppToGetDoctorFireBase', 'post', params, accessToken, 'Kpidata');

					})
					.catch(error => console.warn(error));
				//***** */
			})
			.catch(error => {
				Snackbar.show({ text: 'Please enable your location settings ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				// CALL FIREBASE KPI API
				let { actions, signupDetails } = this.props;
				let accessToken = signupDetails.accessToken ? signupDetails.accessToken : CryptoJS.AES.decrypt(AsyncStorage.getItem('accessToken'), 'MNKU').toString(CryptoJS.enc.Utf8);
				let params = {
					"UserGuid": signupDetails.UserGuid,
					"Data": {}
				}
				actions.callLogin('V11/FuncForDrAppToGetDoctorFireBase', 'post', params, accessToken, 'Kpidata');

			})
	}
	callAppVersionCheckAPI = () => {
		let { actions } = this.props;
		let params = {
			"Data": {
				"AppType": Platform.OS == 'ios' ? "DrAppIOS" : "DrAppAndroid",
			}

			//"Version": "V_20220314",
			//"IsUpdateMandatory": true
		}
		//actions.callLogin('V1/FuncForAdminToGetVersionHistoryDetails', 'post', params, 'token', 'appversion');
		actions.callLogin('V1/FuncForWebAppToGetCurrentDateTime', 'post', params, 'token', 'getserverDateTime');

	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'appversion') {
				if (newProps.responseData.statusMessage === 'Success') {
					if (appVersion != newProps.responseData.data.version) {
						setTimeout(() => {
							this.setState({ forceUpdateModal: true, isUpdateMandatory: newProps.responseData.data.isUpdateMandatory });
						}, 1500)

					}
				}
			} else if (tagname === 'getserverDateTime') {
				if (newProps.responseData.statusCode == '0') {
					let { actions, signupDetails } = this.props;
					let dateTime = newProps.responseData.data.currentDateTime;
					if (dateTime) {
						let finalDate = '';
						let str = dateTime.split(" ")[0];
						if (str && str.includes('-')) {
							let strdate = str.split("-");
							finalDate = strdate[2] + '-' + strdate[1] + '-' + strdate[0];
						}
						signupDetails.serverDateTime = finalDate;
						actions.setSignupDetails(signupDetails);
					} else {
						signupDetails.serverDateTime = Moment(new Date()).format('YYYY-MM-DD');
						actions.setSignupDetails(signupDetails);
					}

				}
			}
			else if (tagname === 'Kpidata') {
				let { actions, signupDetails } = this.props;
				try {

					let roleCode = newProps.responseData.data.basicInfo.roleCode;
					let assistantStatus;
					if (roleCode == '70') {
						let drInfo = newProps.responseData.data.basicInfo;
						let finalAge = Trace.getAge(drInfo.dob)
						//let assistantStatus = newProps.responseData.data.basicInfo.assistantList;
						signupDetails.firebasePhoneNumber = drInfo.phoneNumber;
						signupDetails.firebaseDOB = 'NoAssistantAge';
						signupDetails.firebaseSpeciality = signupDetails.drSpeciality ? signupDetails.drSpeciality: 'NoAssistantSpeciality';

						//signupDetails.firebaseDOB = finalAge;
						//signupDetails.firebaseSpeciality = drInfo.selectedSpeciality ? drInfo.selectedSpeciality : '';
						signupDetails.firebaseUserType = 'Ass_';
						signupDetails.firebaseLocation = cityName;
						actions.setSignupDetails(signupDetails);
					}
					else {
						let drInfo = newProps.responseData.data.basicInfo;
						let drSpec = newProps.responseData.data.basicInfo.specialityList[0];

						let finalAge = Trace.getAge(drInfo.dob)
						assistantStatus = newProps.responseData.data.basicInfo.assistantList;
						signupDetails.firebasePhoneNumber = drInfo.phoneNumber;
						signupDetails.firebaseDOB = finalAge;
						//signupDetails.firebaseLocation = drInfo.location;
						signupDetails.firebaseSpeciality = drSpec.specialityName;
						signupDetails.firebaseUserType = 'Dr_';
						signupDetails.firebaseLocation = cityName;
						actions.setSignupDetails(signupDetails);
					}
					timeRange = Trace.getTimeRange();
					Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'App_Launch', signupDetails.firebaseLocation);
					Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "App_Launch", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality })
					
					Trace.setLogEventWithTrace(signupDetails.firebasePhoneNumber, { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality })
					// Getting App state
					this.appStateSubscription = AppState.addEventListener(
						"change",
						nextAppState => {
							if (
								this.state.appState.match(/inactive|background/) &&
								nextAppState === "active"
							) {
								//this.timeGroup();
								console.log("App has come to the foreground!--home--1");
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'App_Launch', signupDetails.firebaseLocation);
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "App_Launch", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality, })
								//setLogEvent("app_launch_event");
							}
							console.log('state checked....' + nextAppState)
							this.setState({ appState: nextAppState });

						}
					);
					if (assistantStatus && assistantStatus.length > 0) {
						assistantAdded = 'AssistantAdded'
						// alert('assistant added');
						Trace.startTraceAssistant(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, 'Dr_Assistant_added_status', assistantAdded);
					}
					else {
						assistantAdded = 'AssistantNotAdded'
						// alert('assistant not added');
						Trace.startTraceAssistant(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, 'Dr_Assistant_added_status', assistantAdded);
					}
					
				} catch (error) {

				}

			}

		}
	}
	handleBackPress = () => {
		this.setState({ isModalVisible: true })
		return true;
	}
	componentWillUnmount() {
		//this.backHandler.remove();
		//Linking.addEventListener('url', this.handleNavigation);
	}
	updateUiOnMeterClick = (index) => {
		this.setState({ selectedIndex: index });
	}
	updateTab = (index) => {
		this.setState({ selectedIndex: index, footerRefresh: false });
		setTimeout(() => {
			this.setState({ footerRefresh: true });
		}, 200)
	}
	handleNavigation = (event) => {
		try {
			let screenName = event.url;
			if (screenName.includes('setupclinic')) {
				this.props.navigation.navigate('SetUpClinic', { tabActive: 0, from: 'deeplink' })
			} else if (screenName.includes('updateprofile')) {
				let { signupDetails } = this.props;
				if (signupDetails.isAssistantUser) {
					this.props.navigation.navigate('Setting', { from: 'deeplink' })
				}
				else {
					this.props.navigation.navigate('Profile', { from: 'deeplink' })
				}
			}
			else if (screenName.includes('createappointment')) {
				this.props.navigation.navigate('AppoinmentTimesShow', { from: 'normal' })
			}
			else if (screenName.includes('cancelappointment') || screenName.includes('editappointment')) {
				let { actions, signupDetails } = this.props;
				if (signupDetails.isAssistantUser) {
					signupDetails.globalTabIndex = 1;
					this.updateTab(1);
				} else {
					signupDetails.globalTabIndex = 0;
					this.updateTab(0);
				}
				actions.setSignupDetails(signupDetails)

			} else if (screenName.includes('termsofusedetails')) {
				this.props.navigation.navigate('TermsofUseDetails', { item: null })
			} else if (screenName.includes('Comments')) {
				let spilitArr = screenName.split('Comments/');
				let commentId = '';
				if (spilitArr.length > 1) {
					commentId = spilitArr[1]
				}
				this.props.navigation.navigate('Comments', { from: 'deeplink', postGuid: commentId })
			}
			Linking.removeAllListeners(event);
		} catch (error) {

		}


	}
	render() {
		let { signupDetails } = this.props;
		//alert(this.state.selectedIndex)
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>
				<StatusBar backgroundColor={Color.primary} barStyle="light-content" />
				{signupDetails.isAssistantUser ? <View style={{ flex: 1, backgroundColor: Color.bgColor }}>
					{this.state.selectedIndex === 0 ? <Home nav={{ navigation: this.props.navigation }} ClickOnMeter={this.updateTab} /> : this.state.selectedIndex === 1 ? <Appoinment nav={{ navigation: this.props.navigation }} ClickOnMeter={this.updateTab} /> : this.state.selectedIndex === 2 ? <Patients nav={{ navigation: this.props.navigation }} /> : <Ecard nav={{ navigation: this.props.navigation }} />}
					{this.state.footerRefresh ? <FooterTab ClickOnMeter={this.updateUiOnMeterClick} selected={this.state.selectedIndex} /> : null}
				</View> : <View style={{ flex: 1, backgroundColor: Color.bgColor }}>
					{this.state.selectedIndex === 0 ? <Appoinment nav={{ navigation: this.props.navigation }} ClickOnMeter={this.updateTab} /> : this.state.selectedIndex === 1 ? <Patients nav={{ navigation: this.props.navigation }} /> : this.state.selectedIndex === 2 ? <Home nav={{ navigation: this.props.navigation }} ClickOnMeter={this.updateTab} /> : this.state.selectedIndex === 3 ? <Community nav={{ navigation: this.props.navigation }} /> : <Ecard nav={{ navigation: this.props.navigation }} />}
					{this.state.footerRefresh ? <FooterTab ClickOnMeter={this.updateUiOnMeterClick} selected={this.state.selectedIndex} /> : null}
				</View>}


				<Modal isVisible={this.state.isModalVisible} >
					<View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 10, borderRadius: 7 }}>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor, fontSize: CustomFont.font18, fontWeight: 'bold', textAlign: 'center' }}>Exit DrOnA Health </Text>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 20, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Do you want to exit? </Text>
						</View>
						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), marginBottom: 20 }}>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisible: false })}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
								</TouchableOpacity>
							</View>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primary }} onPress={() => {
									this.setState({ isModalVisible: false })
									RNExitApp.exitApp();
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>OK </Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				{/*----------- Force update Modal -------*/}
				<Modal isVisible={this.state.forceUpdateModal} >
					<View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 10, borderRadius: 7 }}>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor, fontSize: CustomFont.font18, fontWeight: 'bold', textAlign: 'center' }}>Update Required</Text>
							<Text style={{ fontFamily: CustomFont.fontName, marginTop: 20, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Every update brings new features and bug fixes. Please update app for a better experience </Text>
						</View>
						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), marginBottom: 20 }}>
							{
								this.state.isUpdateMandatory ? null : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
									<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(30) }} onPress={() => this.setState({ forceUpdateModal: false })}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel</Text>
									</TouchableOpacity>
								</View>
							}

							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.8), width: responsiveWidth(30), backgroundColor: Color.primary }} onPress={() => {
									this.setState({ forceUpdateModal: false })
									Platform.OS == 'android' ? Linking.openURL("https://play.google.com/store/apps/details?id=com.dronahealth.doctor") : Linking.openURL("https://apps.apple.com/in/app/drona-for-doctors/id1522138642")

								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Update</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
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
)(DoctorHome);

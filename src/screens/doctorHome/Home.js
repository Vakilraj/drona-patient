import React, { useState } from 'react';
import {
	ScrollView,
	View,
	Text, Linking, Image, TouchableOpacity, Keyboard, Platform
} from 'react-native';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
//import Loader from '../../components/Loader';
import timeDrop from '../../../assets/timeDrop.png';
import CustomFont from '../../components/CustomFont';
import downKey from '../../../assets/down.png';
import share_home from '../../../assets/share_home.png';
import ic_menu from '../../../assets/ic_menu.png';
import closeIcon from '../../../assets/cross.png';
import bank_home from '../../../assets/bank_home.png';
import upi_home from '../../../assets/upi_home.png';
import home_addappointment from '../../../assets/home_addappointment.png';
import home_addpatient from '../../../assets/home_addpatient.png';
import home_earning from '../../../assets/home_earning.png';
import home_newpatient from '../../../assets/home_newpatient.png';
import home_queue from '../../../assets/home_queue.png';
import home_totalpatient from '../../../assets/home_totalpatient.png';

import ic_notification from '../../../assets/ic_notification.png';
import ic_notification_indication from '../../../assets/ic_notification_indication.png';
import Modal from 'react-native-modal';
import cross_new from '../../../assets/cross_new.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Share from 'react-native-share';
import AsyncStorage from 'react-native-encrypted-storage';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import { NavigationEvents, NavigationActions, StackActions } from 'react-navigation';
import home_payment from '../../../assets/home_payment.png';
import Snackbar from 'react-native-snackbar';
let navFlag = 0, navigationUrl = null;
import { setupPushNotification } from "../../service/PushNotification"
import { setLogEvent, setLogShare } from '../../service/Analytics';
import CryptoJS from "react-native-crypto-js";
import Trace from '../../service/Trace'
let prevurl = '', localSavedClinicGuid = '', headDropdownImageUrl= '',showPaymentComponent= true,analyticApiCallingFlag=0;


class Home extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			//doctorName: '',
			badgeShowStaus: false,
			isModalVisible: false,
			accountPopup: false,

			//drfullName: '',
			todaysPatient: '0',
			todaysEarning: '0',
			newPatient: '0',
			liveQuee: '0',
			//drImgUrl: null,
			isRenew: false,
			noOfDaysRenew: 0,
			paymentCardDonotShowAgain: false,
		};
		navFlag = 0;
		headDropdownImageUrl= '';
		showPaymentComponent= true;
		analyticApiCallingFlag=0;
	}

	componentWillMount() {
		// To perform Deep linking when app gets killed
		Linking.getInitialURL().then(url => {
			if (prevurl != url)
				navigationUrl = url;
			else
				navigationUrl = null;
			prevurl = url;
		});
	}
	_handleNotificationOpen = (notification) => {
		try {
			DRONA.getThat().props.navigation.navigate("NotificationDetails", { item: notification.data })
		} catch (error) {
		}
	}

	validateIndianRupees = (x) => {
		if (x && x > 0) {
			x = parseInt(x);
		}
		let res = '';
		try {
			x = x.toString();
			var lastThree = x.substring(x.length - 3);
			var otherNumbers = x.substring(0, x.length - 3);
			if (otherNumbers != '')
				lastThree = ',' + lastThree;
			res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
		} catch (e) {
			res = x;
		}

		return res;
	}
	async componentDidMount() {
		Keyboard.dismiss(0);
		let { actions, signupDetails } = this.props;
		let accessToken = signupDetails.accessToken ? signupDetails.accessToken : CryptoJS.AES.decrypt(await AsyncStorage.getItem('accessToken'), 'MNKU').toString(CryptoJS.enc.Utf8);
		let UserGuid = signupDetails.UserGuid ? signupDetails.UserGuid : CryptoJS.AES.decrypt(await AsyncStorage.getItem('userGuid'), 'MNKU').toString(CryptoJS.enc.Utf8);
		localSavedClinicGuid = signupDetails.clinicGuid ? signupDetails.clinicGuid : await AsyncStorage.getItem('clinicGuid');
		if (!signupDetails.accessToken) {
			signupDetails.accessToken = CryptoJS.AES.decrypt(await AsyncStorage.getItem('accessToken'), 'MNKU').toString(CryptoJS.enc.Utf8);
			actions.setSignupDetails(signupDetails);
		}

		let fcmToken = await AsyncStorage.getItem('fcmToken');
		if (!fcmToken) {
			fcmToken = await messaging().getToken();
			await AsyncStorage.setItem('fcmToken', fcmToken);
		}

		let params = {
			"UserGuid": UserGuid,
			"Version": "",
			"Data": { FcmToken: fcmToken }
		}
		analyticApiCallingFlag=0;
		//V1/FuncForDrAppToGetHomeScreenComponents_V3
		actions.callLogin('V15/FuncForDrAppToGetHomeScreenComponents', 'post', params, accessToken, 'homeComponentApi');

		this.pushNotification = setupPushNotification(this._handleNotificationOpen);

	}

	componentWillUnmount = async () => {
		Trace.stopTrace();
	}

	refreshHome = async () => {
		let { actions, signupDetails } = this.props;
		if (signupDetails.UserGuid && signupDetails.fcmToken) {
			localSavedClinicGuid = signupDetails.clinicGuid ? signupDetails.clinicGuid : await AsyncStorage.getItem('clinicGuid');
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"Version": "",
				"Data": { FcmToken: signupDetails.fcmToken }
			}
			analyticApiCallingFlag=0;
			actions.callLogin('V15/FuncForDrAppToGetHomeScreenComponents', 'post', params, signupDetails.accessToken, 'homeComponentApi');
		}
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			//this.refs.loadingRef.hide();
			let tagname = newProps.responseData.tag;
			if (tagname === 'homeComponentApi') {
				if (newProps.responseData.statusMessage === 'Success') {
					let data = newProps.responseData.data;
					let { actions, signupDetails } = this.props;

					let roleCode = data && data.userInfo && data.userInfo.roleCode ? data.userInfo.roleCode : '10';
					signupDetails.roleCode = roleCode;
					//let roleCode = '10' dr. And 70 for assistant ;
					//for multiple clinic
					DRONA.setClinicList(data.clinicDetailsList);
					let clinicIndex = 0;
					let doctorIndex = 0;

					let clinicList = data.clinicDetailsList;
					if (clinicList && clinicList.length > 0) {
						try {
							// DRONA.setClinicList([clinicList[0]]);  //single clinic

							// For Multiclinic point previous selected clinic
							//if (roleCode == 10)
								for (let i = 0; i < clinicList.length; i++) {
									if (localSavedClinicGuid == clinicList[i].clinicGuid) {
										clinicIndex = i;
										break;
									}
								}
								DRONA.setSelectedIndexClinic(clinicIndex)
							signupDetails.clinicName = clinicList[clinicIndex].clinicName;
							signupDetails.clinicGuid = clinicList[clinicIndex].clinicGuid;
							signupDetails.clinicStatus = clinicList[clinicIndex].status;
							signupDetails.clinicImageUrl = clinicList[clinicIndex].clinicImageUrl;
							DRONA.setClinicGuid(clinicList[clinicIndex].clinicGuid);
						} catch (e) { }

					}
					//set doctor
					let doctorList = data.doctorInfo;
					if (doctorList && doctorList.length > 0) {
						try {
							// if(roleCode==70)
							// for (let i = 0; i < doctorList.length; i++) {
							// 	if (localSavedClinicGuid == doctorList[i].doctorGuid) {
							// 		doctorIndex = i;
							// 		DRONA.setSelectedIndexClinic(clinicIndex)
							// 		break;
							// 	}
							// }

							signupDetails.doctorGuid = doctorList[doctorIndex].doctorGuid;
							signupDetails.mobile = doctorList[doctorIndex].docMobileNumber;
							signupDetails.drSpeciality = doctorList[doctorIndex].doctorSpeciality;
							signupDetails.profileImgUrl = doctorList[doctorIndex].profileImgUrl;
							signupDetails.iseSignatureAvailable = doctorList[doctorIndex].showEsignature;
							//signupDetails.drProfileImgUrlinAssistantLogin = doctorList[doctorIndex].profileImgUrl;
						} catch (e) { }

					}
					let drFullName = doctorList[doctorIndex].doctorName;
					let fname = '', mname = '', lname = '';
					if (drFullName)
						if (drFullName.includes(" ")) {
							let str = drFullName.split(" ");
							fname = str[0];
							mname = str[1];
							lname = str[2];
						}
					signupDetails.fname = fname;
					signupDetails.lname = lname;
					signupDetails.doctorFullName = drFullName;
					signupDetails.UserGuid = data.userInfo.userGuid;
					signupDetails.userName = data.userInfo.userName;

					signupDetails.accessToken = newProps.responseData.accessToken;
					signupDetails.fcmToken = await AsyncStorage.getItem('fcmToken');
					try {
						await AsyncStorage.setItem('userGuid', CryptoJS.AES.encrypt(data.userInfo.userGuid, 'MNKU').toString());
						await AsyncStorage.setItem('profileImgUrl', signupDetails.profileImgUrl);
						await AsyncStorage.setItem('accessToken', CryptoJS.AES.encrypt(newProps.responseData.accessToken, 'MNKU').toString());
						await AsyncStorage.setItem('clinicGuid', signupDetails.clinicGuid);
						await AsyncStorage.setItem('roleCode', roleCode + '');
						await AsyncStorage.setItem('doctorGuid', signupDetails.doctorGuid);
						//signupDetails.profileImgUrl = roleCode == 10 && data.doctorInfo.profileImgUrl != 'null' ? data.doctorInfo.profileImgUrl : null; //
					} catch (error) {
						//console.log(error)
					}
					// if (data.doctorInfo.profileImgUrl && data.doctorInfo.profileImgUrl != 'null')
					// 	this.setState({ drImgUrl: { uri: data.doctorInfo.profileImgUrl } }) //

					try {
						if (roleCode == 70) {
							let menuArr = data.menuList;
							if (menuArr && menuArr.length > 0) {
								signupDetails.isAllowMedicalHistoryAssistant = false;
								signupDetails.isAllowPatientFilesAssistant = false;
								signupDetails.isAllowMessagesAssistant = false;
								signupDetails.isAllowClinicDetailsAssistant = false;
								signupDetails.isAllowBillingAssistant = false;
								for (let i = 0; i < menuArr.length; i++) {
									if (menuArr[i].abraviationName == "PMH" && menuArr[i].isAuthorized) {
										signupDetails.isAllowMedicalHistoryAssistant = true;
									}
									if (menuArr[i].abraviationName == "PF" && menuArr[i].isAuthorized) {
										signupDetails.isAllowPatientFilesAssistant = true;
									}
									if (menuArr[i].abraviationName == "Msg" && menuArr[i].isAuthorized) {
										signupDetails.isAllowMessagesAssistant = true;
									}
									if (menuArr[i].abraviationName == "CD" && menuArr[i].isAuthorized) {
										signupDetails.isAllowClinicDetailsAssistant = true;
									}
									if (menuArr[i].abraviationName == "Billing" && menuArr[i].isAuthorized) {
										signupDetails.isAllowBillingAssistant = true;
									}
								}
							}
							signupDetails.isAssistantUser = true;
							signupDetails.assistantMobile = data.userInfo.mobileNo ? data.userInfo.mobileNo : CryptoJS.AES.decrypt(await AsyncStorage.getItem('loginId'), 'MNKU').toString(CryptoJS.enc.Utf8);

							signupDetails.globalTabIndex = 0;
							this.props.ClickOnMeter(0);
							try {
								if (!data.userInfo.userName.trim()) {
									Snackbar.show({ text: 'Please complete your profile', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
									this.props.nav.navigation.navigate('Setting', { from: 'completeProfile' })
								}
							} catch (error) {

							}
							// if (signupDetails.isAllowClinicDetailsAssistant)
							// 	this.setState({ showPaymentComponent: data.showBankDetailComponent, })

							let urlkey=doctorList[doctorIndex].urlkey;
							let urlname=doctorList[doctorIndex].urlname;
							let shareUrl = data.shareUrl && data.shareUrl.url ? data.shareUrl.url : '';
							signupDetails.shareLinkUrl = shareUrl.replace("urlkey", urlkey).replace("urlname",urlname);
							headDropdownImageUrl= doctorList[doctorIndex].profileImgUrl;
						} else {
							signupDetails.globalTabIndex = 2;

							signupDetails.isAssistantUser = false;
							this.props.ClickOnMeter(2);
							showPaymentComponent= clinicList[clinicIndex].showBankDetailComponent;

							let urlkey=clinicList[clinicIndex].urlkey;
							let urlname=clinicList[clinicIndex].urlname;
							let shareUrl = data.shareUrl && data.shareUrl.url ? data.shareUrl.url : '';
							signupDetails.shareLinkUrl = shareUrl.replace("urlkey", urlkey).replace("urlname",urlname);
							headDropdownImageUrl= clinicList[clinicIndex].clinicImageUrl;
							this.setState({ paymentCardDonotShowAgain: clinicList[clinicIndex].paymentCardDonotShowAgain })
						}

					} catch (e) { }
					actions.setSignupDetails(signupDetails);
					if(analyticApiCallingFlag==0){
						let params = {
							"UserGuid": signupDetails.UserGuid,
							"DoctorGuid": signupDetails.doctorGuid, "ClinicGuid": signupDetails.clinicGuid,
							"Data": {
								"DoctorGuid": signupDetails.doctorGuid, "ClinicGuid": signupDetails.clinicGuid
							}
						}
						actions.callLogin('V1/FuncForDrAppToGetHomeScreenAnalytics', 'post', params, signupDetails.accessToken, 'HomeScreenAnalytics');	
						this.props.ClickOnMeter(9);
						analyticApiCallingFlag=1;
					}
					
					if (navigationUrl && navFlag == 0)
						this.navigateInKilledApp(roleCode);
					DRONA.setIsReloadApi(false);
				} else {
					let { actions, signupDetails } = this.props;
					signupDetails.accessToken = CryptoJS.AES.decrypt(await AsyncStorage.getItem('accessToken'), 'MNKU').toString(CryptoJS.enc.Utf8);
					actions.setSignupDetails(signupDetails);
				}

			} else if (tagname === 'HomeScreenAnalytics') {
				if (newProps.responseData.statusCode == '0') {
					let data = newProps.responseData.data;
					if (data) {
						this.setState({
							todaysPatient: data.todayAppointmentCount ? data.todayAppointmentCount : '0',
							todaysEarning: data.todayFinancialAmount,
							newPatient: data.newEnrolmentCount,
							liveQuee: data.liveQueueCount,
						})
						let date = data.subscriptionDetails.subscriptionExpiredOn.split(' ')[0]
						let noOfDaysRemaining = Math.round(((new Date(date).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))
						this.setState({ noOfDaysRenew: Math.abs(noOfDaysRemaining), isRenew: noOfDaysRemaining <= 30 })

						let { actions, signupDetails } = this.props;
						signupDetails.subscription = data.subscriptionDetails.subscriptionExpiredOn.split(' ')[0];
						actions.setSignupDetails(signupDetails)
					}

				}
			} else if (tagname == 'PaymentCardDisplayStatus') {
				if (newProps.responseData.statusCode == '0') {
					this.setState({ paymentCardDonotShowAgain: true })
				}
			}
		}
	}
	navigateInKilledApp = (roleCode) => {
		//let screenName = navigationUrl.split('://')[1];
		let screenName = navigationUrl;
		if (screenName) {
			if (screenName.includes('setupclinic')) {
				this.props.nav.navigation.navigate('SetUpClinic', { tabActive: 0, from: 'deeplink' })
			}
			else if (screenName.includes('updateprofile')) {
				//let { signupDetails } = this.props;
				if (roleCode == 70) {
					this.props.nav.navigation.navigate('Setting', { from: 'deeplink' })
				}
				else {
					this.props.nav.navigation.navigate('Profile', { from: 'deeplink' })
				}
			}
			else if (screenName.includes('createappointment')) {
				this.props.nav.navigation.navigate('AppoinmentTimesShow', { from: 'normal' })
			}
			else if (screenName.includes('cancelappointment') || screenName.includes('editappointment')) {
				let { actions, signupDetails } = this.props;
				if (signupDetails.isAssistantUser) {
					signupDetails.globalTabIndex = 1;
					this.props.ClickOnMeter(1);
				} else {
					signupDetails.globalTabIndex = 0;
					this.props.ClickOnMeter(0);
				}
				actions.setSignupDetails(signupDetails)

			} else if (navigationUrl.includes('termsofusedetails')) {
				this.props.nav.navigation.navigate('TermsofUseDetails', { item: null })
			} else if (navigationUrl.includes('Comments')) {
				let spilitArr = navigationUrl.split('Comments/');
				let commentId = '';
				if (spilitArr.length > 1) {
					commentId = spilitArr[1]
				}
				this.props.nav.navigation.navigate('Comments', { from: 'deeplink', postGuid: commentId })
			}
			navFlag = 1;
		}
	}

	callShare = () => {
		let { actions, signupDetails } = this.props;
		let urlKel = '', urlname = ''
		let urlK = signupDetails.shareLinkUrl;
		if (urlK.includes('/')) {
			let strArr = urlK.split('/');
			urlKel = strArr[strArr.length - 3];
			urlname = strArr[strArr.length - 1];
		}
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Data": {
				"urlkey": urlKel,
				"urlname": urlname
			}
		}

		actions.callLogin('V1/FuncForMsiteToGetDoctorInfo_V2', 'post', params, signupDetails.accessToken, 'afterShareLink');

		const shareOptions = {
			title: 'Share eClinic link',
			message: ' You can now consult me from the convenience of your home through the DrOnA App. To book an appointment, \n\nclick here:' + '\n\n',
			url: urlK,
		};

		setTimeout(() => {
			Share.open(shareOptions)
				.then(res => {
					//console.log(res);
				})
				.catch(err => {
					//err && console.log(err);
				});
		}, 500);
		setLogShare({ content_type: 'e_clinic' })
	}

	removeSpace = (DrfullName) => {
		let str = '';
		try {
			if (DrfullName.includes(' ')) {
				str = DrfullName.replace("  ", " ");;
			}
		} catch (e) { }
		return str
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
	callApiforDontShowAgain = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Version": "",
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToSaveCardDisplayStatus', 'post', params, signupDetails.accessToken, 'PaymentCardDisplayStatus');
	}
	render() {
		let { signupDetails } = this.props;
		return (
			<View style={Platform.OS == 'android' ? styles.containerAndroid : styles.container}>
				{/* <Loader ref="loadingRef" /> */}
				<NavigationEvents onDidFocus={() => {
					if (DRONA.getIsReloadApi())
						this.refreshHome()
				}} />

				<View style={{ flexDirection: 'row', backgroundColor: Color.white, height: responsiveHeight(7) }}>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<TouchableOpacity onPress={() => this.props.nav.navigation.openDrawer()} >
							<Image style={{ resizeMode: 'contain', width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), marginLeft: responsiveWidth(2.1), marginTop: responsiveHeight(.35) }} source={ic_menu} />
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={{ flex: 7, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
						setLogEvent("home", { "change_clinic": "click", UserGuid: signupDetails.UserGuid })
						this.props.nav.navigation.navigate('ClinicList', { onSelect: this.onSelect })
					}}>
						<View style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), borderRadius: responsiveFontSize(1.5), backgroundColor: '#47C1BF', borderColor: Color.white, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
							{ headDropdownImageUrl ?
								<Image
									source={{ uri: headDropdownImageUrl }}
									style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), borderRadius: responsiveFontSize(1.5) }}
								/>
								: <Text style={{ fontSize: CustomFont.font10, color: Color.white, textTransform: 'uppercase' }}>{this.makeShortName(signupDetails.clinicName)}</Text>
							}
						</View>
						<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: responsiveWidth(2), fontWeight: '500', textTransform: 'capitalize', }}>{signupDetails.clinicName && signupDetails.clinicName.length > 28 ? signupDetails.clinicName.substring(0, 26) + '...' : signupDetails.clinicName}</Text>
						{signupDetails.clinicName ? <Image source={downKey} style={styles.arrowForbigTxt} /> : null}
					</TouchableOpacity>
					<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
						setLogEvent("home", { "Bell_Icon": "click", UserGuid: signupDetails.UserGuid })
						this.setState({ badgeShowStaus: false });
						this.props.nav.navigation.navigate('Notification')
					}}>
						<View>
							{this.state.badgeShowStaus ? <View style={{ height: responsiveFontSize(1.4), width: responsiveFontSize(1.4), borderRadius: 5, backgroundColor: Color.liveBg, position: 'absolute', right: 0, top: 0 }} /> : null}
							<Image source={this.state.badgeShowStaus ? ic_notification_indication : ic_notification} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), }} />
						</View>
					</TouchableOpacity>
				</View>



				<View style={{ flex: 1, backgroundColor: Color.bgColor }}>
					<ScrollView>
						<View style={{ flex: 1, marginBottom: responsiveWidth(2), }}>
							{/* {this.state.showInClinicComponent && this.state.showTimingComponent ?
								<View>
									<Text style={{
										fontFamily: CustomFont.fontNameBold, fontSize: CustomFont.font18, color: Color.fontColor, marginTop: responsiveHeight(2),
										fontWeight: 'bold', marginLeft: responsiveWidth(3), textTransform: 'capitalize'
									}}>Hello, Dr. {signupDetails.fname} {signupDetails.lname ? signupDetails.lname.trim() : ''}</Text>

									<Text style={{
										fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(1),
										marginLeft: responsiveWidth(3), marginBottom: 10
									}}>Start by setting up your dashboard.</Text></View>
								: null
							} */}

							{/* {
								!this.state.isRenew ? null :
									<View style={{ borderRadius: 10, marginTop: 10, marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2), backgroundColor: Color.goldPink, padding: responsiveWidth(5) }}>
										<Text style={{ opacity: .85, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.darkText, fontWeight: CustomFont.fontWeightBold, }}>Renew your membership</Text>
										<Text style={{ opacity: .85, fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.darkText, marginTop: 10, }}>Your membership is due to expire in {this.state.noOfDaysRenew} days, please renew it to continue using DrOnA</Text>
										<View style={{ flexDirection: 'row', marginTop: 10 }}>
											<TouchableOpacity onPress={() => {
												this.props.nav.navigation.navigate('PayForMemberShip', { from: 'Home' })
											}
											}>
												<Text style={{ marginTop: 45, borderRadius: 5, paddingTop: 3, paddingBottom: 5, paddingStart: 25, paddingEnd: 25, backgroundColor: Color.primary, textAlign: 'center', justifyContent: 'center', color: Color.white, fontSize: CustomFont.font16 }}>Renew Now</Text>
											</TouchableOpacity>
											<Text style={{ flex: 1 }}></Text>
											<Image style={{ height: 75.5, width: 49 }} source={timeDrop} />
										</View>
									</View>
							} */}
							{/* {!signupDetails.isAssistantUser ? */}
							<TouchableOpacity onPress={() => {
								let { signupDetails } = this.props;
								let timeRange = Trace.getTimeRange();
								Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + "Msite_Link_Share_popup", signupDetails.firebaseLocation);
								Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Msite_Link_Share_popup", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

								this.setState({ isModalVisible: true })
							}}
								style={[styles.subdivision, { marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveWidth(2), marginBottom: responsiveWidth(0), paddingTop: responsiveWidth(2), paddingBottom: responsiveWidth(2) }]} >
								<View style={{ flexDirection: 'row', flex: 1, marginLeft: 12 }}>
									<View style={styles.profileRoundImg}>
										{signupDetails.profileImgUrl ?
											<Image
												source={{ uri: signupDetails.profileImgUrl }}
												style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5) }}
											/>
											: <Text style={{ fontSize: CustomFont.font14, color: Color.white }}>{this.makeShortName(this.removeSpace(signupDetails.doctorFullName))}</Text>}
									</View>

									<View style={{ marginLeft: responsiveWidth(2.5) }}>
										<Text style={{ textTransform: 'capitalize', fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor }}>Dr. {this.removeSpace(signupDetails.doctorFullName)} </Text>
										<Text style={{ fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight400, color: Color.textGrey }}>{signupDetails.drSpeciality}</Text>
										<View style={{ flex: 1, flexDirection: 'row', }}>
											<Image
												source={share_home}
												style={{ height: responsiveFontSize(2), marginTop: responsiveHeight(2), width: responsiveFontSize(2), resizeMode: 'contain', }}
											/>
										</View>
										<Text style={{ marginLeft: responsiveWidth(7), marginTop: responsiveHeight(1.8), fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.primaryBlue }}>Share e-clinic link with your patient</Text>
									</View>
								</View>
							</TouchableOpacity>


							{!signupDetails.isAssistantUser && !showPaymentComponent && !this.state.paymentCardDonotShowAgain ?
								<View style={{ flexDirection: 'row', backgroundColor: Color.white, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveWidth(2), marginBottom: responsiveWidth(0), borderRadius: 6 }}>
									<View style={{ flex: 1 }}>
										<Image source={home_payment} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain', marginTop: responsiveHeight(2), marginLeft: 10 }} />
									</View>
									<View style={{ flex: 5, marginRight: 10 }}>
										<Text style={{ fontFamily: CustomFont.fontNameBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(3.5), fontWeight: '700', }}>Payment Details</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.fontColor, marginTop: responsiveHeight(1.6) }}>Patients will be able to transfer amount for fees and other bills to these accounts</Text>
										<View style={{ flexDirection: 'row', marginTop: responsiveHeight(4), marginBottom: responsiveHeight(2), alignItems: 'center' }}>
											<TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(40), alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: Color.primary, }} onPress={() => {
												this.setState({ accountPopup: true });
											}}>
												<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12 }}>Add Payment Details</Text>
											</TouchableOpacity>

											<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginLeft: responsiveWidth(3) }} onPress={() => {
												this.callApiforDontShowAgain();
											}}>
												<Text style={{ fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font14, fontWeight: '800' }}>Don’t show again</Text>
											</TouchableOpacity>

										</View>

									</View>
								</View>
								: null}

							{/* -------Home Card Start--------- */}
							<View style={{ backgroundColor: Color.white, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveWidth(2), marginBottom: responsiveWidth(0), borderRadius: 10 }}>
								<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: 'bold', marginTop: responsiveWidth(3), marginLeft: responsiveWidth(3) }}>Today’s View</Text>

								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2) }}>
									<View style={{ flex: 1, flexDirection: 'row', backgroundColor: Color.billBack, borderRadius: 10, marginRight: responsiveWidth(1) }}
										onPress={() => {
											//this.props.nav.navigation.navigate('ClinicSetupStep1', { clinicName: '', from: 'signup' })


											// let { actions, signupDetails } = this.props;
											// if (signupDetails.isAssistantUser) {
											// 	signupDetails.globalTabIndex = 2;
											// 	this.props.ClickOnMeter(2);
											// } else {
											// 	signupDetails.globalTabIndex = 1;
											// 	this.props.ClickOnMeter(1);
											// }
											// actions.setSignupDetails(signupDetails)
											// setLogEvent("home", { "view_Patient": "click", UserGuid: signupDetails.UserGuid })
										}
										}>
										<View style={{ flex: 1, }}>
											<Image source={home_totalpatient} style={{ marginTop: responsiveHeight(2.5), marginLeft: responsiveWidth(2.5), height: responsiveFontSize(4), width: responsiveFontSize(4), resizeMode: 'contain' }} />
										</View>
										<View style={{ flex: 3 }}>
											<Text style={{ fontSize: CustomFont.font24, color: Color.fontColor, fontWeight: 'bold', marginTop: responsiveHeight(2.5) }}>{this.validateIndianRupees(this.state.todaysPatient)}</Text>
											<Text style={{ fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(2), marginBottom: responsiveHeight(3.5) }}>Total Consults</Text>
										</View>
									</View>

									<View style={{ flex: 1, flexDirection: 'row', backgroundColor: Color.nofilebackground, borderRadius: 10, marginLeft: responsiveWidth(1) }}>
										<View style={{ flex: 1, }}>
											<Image source={home_newpatient} style={{ marginTop: responsiveHeight(3), marginLeft: responsiveWidth(2.5), height: responsiveFontSize(3.5), width: responsiveFontSize(3.5), resizeMode: 'contain' }} />
										</View>
										<View style={{ flex: 3 }}>
											<Text style={{ fontSize: CustomFont.font24, color: Color.fontColor, fontWeight: 'bold', marginTop: responsiveHeight(2.5) }}>{this.validateIndianRupees(this.state.newPatient)}</Text>
											<Text style={{ fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(2), marginBottom: responsiveHeight(3.5) }}>New Patients</Text>
										</View>
									</View>

								</View>

								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2), marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2) }}>
									<View style={{ flex: 1, flexDirection: 'row', backgroundColor: Color.divider, borderRadius: 10, marginRight: responsiveWidth(1) }} onPress={() => {
										//this.props.nav.navigation.navigate('EarningScreen');
									}}>
										<View style={{ flex: 1, }}>
											<Image source={home_earning} style={{ marginTop: responsiveHeight(3), marginLeft: responsiveWidth(2.5), height: responsiveFontSize(3.5), width: responsiveFontSize(3.5), resizeMode: 'contain' }} />
										</View>
										<View style={{ flex: 3 }}>
											<Text style={{ fontSize: CustomFont.font24, color: Color.fontColor, fontWeight: 'bold', marginTop: responsiveHeight(2.5) }}>{this.validateIndianRupees(this.state.todaysEarning)}</Text>
											<Text style={{ fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(2), marginBottom: responsiveHeight(3.5) }}>Earnings</Text>
										</View>
									</View>

									<View style={{ flex: 1, flexDirection: 'row', backgroundColor: Color.homecardlastcolor, borderRadius: 10, marginLeft: responsiveWidth(1) }} onPress={() => {
										// try {
										// 	let { actions, signupDetails } = this.props;
										// 	if (signupDetails.isAssistantUser) {
										// 		signupDetails.globalTabIndex = 1;
										// 		this.props.ClickOnMeter(1);
										// 	} else {
										// 		signupDetails.globalTabIndex = 0;
										// 		this.props.ClickOnMeter(0);
										// 	}
										// 	actions.setSignupDetails(signupDetails)

										// } catch (e) { }

									}}>
										<View style={{ flex: 1, }}>
											<Image source={home_queue} style={{ marginTop: responsiveHeight(3), marginLeft: responsiveWidth(2.5), height: responsiveFontSize(3.5), width: responsiveFontSize(3.5), resizeMode: 'contain' }} />
										</View>
										<View style={{ flex: 3 }}>
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<Text style={{ fontSize: CustomFont.font24, color: Color.fontColor, fontWeight: 'bold', marginTop: responsiveHeight(2.5) }}>{this.state.liveQuee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
												<Text style={{ fontSize: CustomFont.font10, color: '#FFF', marginLeft: responsiveWidth(6), fontFamily: CustomFont.fontName, backgroundColor: Color.liveBg, borderRadius: 4, paddingLeft: 3, paddingRight: 3, marginTop: responsiveHeight(2.4) }}>LIVE</Text>
											</View>

											<Text style={{ fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(2), marginBottom: responsiveHeight(3.5) }}>Pending Consults</Text>

										</View>
									</View>

								</View>



							</View>
							{/* -------Home Card end--------- */}

							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity style={{ flex: 1, backgroundColor: Color.white, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(1.5), marginTop: responsiveWidth(3), paddingBottom: responsiveWidth(3), borderRadius: 6, }} onPress={() => {
									//this.props.nav.navigation.navigate('BecomeAMember', { from: 'signup' })
									setLogEvent("home", { "Add_appointment": "click", UserGuid: signupDetails.UserGuid });
									DRONA.setIsAddAppointmentModal(1);
									try {
										let { actions, signupDetails } = this.props;
										if (signupDetails.isAssistantUser) {
											signupDetails.globalTabIndex = 1;
											this.props.ClickOnMeter(1);
										} else {
											signupDetails.globalTabIndex = 0;
											this.props.ClickOnMeter(0);
										}
										actions.setSignupDetails(signupDetails)
									} catch (e) { }
								}}>
									<View style={{ paddingTop: responsiveHeight(2), justifyContent: 'center', alignItems: 'center' }}>
										<Image style={{ justifyContent: 'center', alignItems: 'center', resizeMode: 'contain', height: responsiveFontSize(6), width: responsiveFontSize(6) }} source={home_addappointment} />
									</View>
									<Text style={{ textAlign: 'center', fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor }}>Add Appointment</Text>
									<Text style={{ padding: responsiveWidth(2), textAlign: 'center', fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, color: Color.fontColor }}>Add walk-in, virtual or {'\n'}in-clinic appointments for patients</Text>
								</TouchableOpacity>

								<TouchableOpacity style={{ flex: 1, backgroundColor: Color.white, marginLeft: responsiveWidth(1.5), marginRight: responsiveWidth(3), marginTop: responsiveWidth(3), paddingBottom: responsiveWidth(3), borderRadius: 6, }} onPress={() => this.props.nav.navigation.navigate('SearchPatients', { from: 'AddPatient' })}>
									<View style={{ paddingTop: responsiveHeight(2), justifyContent: 'center', alignItems: 'center' }}>
										<Image style={{ resizeMode: 'contain', height: responsiveFontSize(6), width: responsiveFontSize(6) }} source={home_addpatient} />
									</View>
									<Text style={{ textAlign: 'center', fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor }}>Add Patients</Text>
									<Text style={{ padding: responsiveWidth(2), textAlign: 'center', fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, color: Color.fontColor }}>Add patients and book{'\n'}appointments for your patients</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>
				</View>

				<Modal isVisible={this.state.isModalVisible} onRequestClose={() => this.setState({ isModalVisible: false })}>
					<View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 10, borderRadius: 7 }}>
						<View style={{ flexDirection: 'row' }}>
							<View style={{ flex: 8, alignItems: 'flex-start', }}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font14, fontWeight: 'bold', textAlign: 'center' }}>Share eClinic link</Text>
							</View>
							<View style={{ flex: 2, alignItems: 'flex-end' }}>
								<TouchableOpacity onPress={() => {
									Trace.stopTrace();
									this.setState({ isModalVisible: false })
								}}>
									<Image source={cross_new} style={{ height: responsiveFontSize(4), width: responsiveFontSize(3), resizeMode: 'contain' }} />
								</TouchableOpacity>
							</View>
						</View>

						<View>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.darkText, fontSize: CustomFont.font12, opacity: 0.8 }}>Your shared message:</Text>
						</View>

						<View style={{ backgroundColor: Color.lightGrayBg, margin: responsiveWidth(1), padding: responsiveWidth(2) }}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.darkText, fontSize: CustomFont.font12 }}>
								You can now consult me from the convenience of your home through the DrOnA App. To book an appointment, click here:
							</Text>

							<Text style={{ marginTop: responsiveHeight(2), color: Color.primaryBlue }}>{signupDetails.shareLinkUrl}</Text>

							<Text style={{ marginTop: responsiveHeight(2), fontFamily: CustomFont.fontName, color: Color.darkText, fontSize: CustomFont.font12 }}>
								Dr. {signupDetails.fname + ' ' + signupDetails.lname}
							</Text>
						</View>

						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), marginBottom: 20 }}>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.8), width: responsiveWidth(80), backgroundColor: Color.primary }} onPress={() => {
									Trace.stopTrace();
									setLogEvent("home", { "share_eclinic": "click", UserGuid: signupDetails.UserGuid })
									let timeRange = Trace.getTimeRange();
									Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + "Msite_Link_Share", signupDetails.firebaseLocation);
									Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Msite_Link_Share", { "Msite_Link_Share": "click", 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })
									this.callShare();
									this.setState({ isModalVisible: false });
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Share link</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<Modal isVisible={this.state.accountPopup} avoidKeyboard={true}>
					<View style={styles.modelMessageChoose}>
						<View style={{ marginBottom: responsiveHeight(26) }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }}>
								<Text style={{ marginLeft: 20, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName, color: Color.black, fontWeight: '700' }}>Add</Text>

								<View style={{ marginLeft: responsiveWidth(78) }}>
									<TouchableOpacity style={{ marginTop: responsiveHeight(0) }} onPress={() => this.setState({ accountPopup: false })}>
										<Image source={closeIcon} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
									</TouchableOpacity>
								</View>
							</View>

							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), }}
								onPress={() => {
									this.setState({ accountPopup: false });
									setTimeout(() => {
										this.props.nav.navigation.navigate('SetUpClinic', { from: 'BankPopup', tabActive: 1 });
									}, 300)

								}}>
								<View style={styles.iconViewPop}>
									<Image source={bank_home} style={{ height: responsiveFontSize(5), marginLeft: responsiveWidth(3), width: responsiveFontSize(5), resizeMode: 'contain', }} />
								</View>
								<View style={{ flexDirection: 'column', marginRight: 50 }}>
									<Text style={{ fontFamily: CustomFont.fontName, flexWrap: 'wrap', marginLeft: 20, fontSize: CustomFont.font14, color: Color.black }}>Bank Account Details</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), }}
								onPress={() => {
									this.setState({ accountPopup: false })
									this.props.nav.navigation.navigate('SetUpClinic', { from: 'upiPopup', tabActive: 1 });
								}}>
								<View style={styles.iconViewPop}>
									<Image source={upi_home} style={{ height: responsiveFontSize(5), marginLeft: responsiveWidth(3), width: responsiveFontSize(5), resizeMode: 'contain' }} />
								</View>
								<View style={{ flexDirection: 'column', marginRight: 60 }}>
									<Text style={{ fontFamily: CustomFont.fontName, flexWrap: 'wrap', marginLeft: 20, fontSize: CustomFont.font14, color: Color.black }}>UPI Details</Text>
								</View>
							</TouchableOpacity>
						</View>

					</View>
				</Modal>




			</View>
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
)(Home);

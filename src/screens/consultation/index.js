import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TouchableOpacity,
	FlatList, SectionList, ScrollView, BackHandler
} from 'react-native';
import styles from './style';
import Moment from 'moment';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import arrowBack from '../../../assets/back_blue.png';
import clockIcon from '../../../assets/ic_past_encounter.png';
import rxIcon from '../../../assets/rx.png'
import claIcon from '../../../assets/ic_medical_histroy.png';
import upArrow from '../../../assets/uparrow.png';
import downArrow from '../../../assets/downarrow.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
var _ = require('lodash');
import Trace from '../../service/Trace'
import ThreeDotsModal from './ThreeDotsModal';
import { setLogEvent } from '../../service/Analytics';
import needle from '../../../assets/needle.png';
import ic_inclinic from '../../../assets/ic_inclinic.png';
import vector_phone from '../../../assets/vector_phone.png';

import Snackbar from 'react-native-snackbar';
import Edit from '../../../assets/edit_primary.png';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'
import VitalsTab from './IndexTabConsultation/VitalsTab';
import MadicalHistryTab from './IndexTabConsultation/MadicalHistryTab';
import PastPrescriptionTab from './IndexTabConsultation/PastPrescriptionTab';
import FilesTab from './files/index';

let date = null, ifClickOnEdit = false, patientGuid = '', item = null;
class CN extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isHideConsultNowBtn: false,
			patientName: '',
			gender: '',
			mobile: '',
			imageSource: null,
			responseDataIndexTab: null
		};

	}
	async componentDidMount() {
		item = this.props.navigation.state.params.item;
		console.log('----' + JSON.stringify(item))
		this.getAppointmentPatientDetailApi(item);
		let { actions, signupDetails } = this.props;
		let timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + "Consult_Now_Page_Time", signupDetails.firebaseLocation);
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Consult_Now_Page_Time", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality })
		//ifClickOnEdit = false;
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack();
		})
		date = this.props.navigation.getParam("date");
		this.setData(item, true);
		if (signupDetails.appoinmentGuid && date != Moment(new Date()).format("YYYY-MM-DD")) {
			let callStartTime = item.appointmentStartTime;
			let callEndTime = item.appointmentEndTime;

			let chkIn = Moment(callStartTime, ["h:mm A"]).format("HH:mm") // 24 hrs
			let chkOut = Moment(callEndTime, ["h:mm A"]).format("HH:mm")

			var startCallDateFormat = date + ' ' + chkIn;// "2017-04-14 23:07:15"; 
			var endCallDateFormat = date + ' ' + chkOut;

			var endCall8HrsLaterInMilisecond = Moment(endCallDateFormat).add(8, 'hours').valueOf();
			var startCallInMilisecond = Moment(startCallDateFormat).valueOf();
			if (item.consultationType == 'Virtual') {
				if (Moment().isBefore(startCallInMilisecond - 300000) || Moment().isAfter(endCall8HrsLaterInMilisecond)) {
					this.setState({ isHideConsultNowBtn: true });
				} else {
					this.setState({ isHideConsultNowBtn: false });
				}
			} else {
				this.setState({ isHideConsultNowBtn: true });
			}
		}
	}
	setData = (data, isNotEdited) => {
		this.setState({
			age: isNotEdited ? data.age : this.ageCalculate(data.age),
			patientName: data.patientName,
			gender: data.gender,
			mobile: data.phoneNumber
		})
		if (data.patientImageUrl != null && data.patientImageUrl != "") {
			this.setState({ imageSource: { uri: data.patientImageUrl } })
		} else if (data.imageUrl != null && data.imageUrl != "") {
			this.setState({ imageSource: { uri: data.imageUrl } })
		}
		if (!isNotEdited) {
			item.age = this.ageCalculate(data.age);
			item.patientName = data.patientName;
			item.gender = data.gender;
			item.phoneNumber = data.phoneNumber;
			item.patientImageUrl = data.patientImageUrl;
		}
	}
	onEditPatient = (data) => {
		this.setData(data, false)
	}
	ageCalculate = (val) => {
		let str = '';
		let today = Moment(new Date()).format('MM/DD/YYYY');
		let dob = Moment(val).format('MM/DD/YYYY');
		if (today === dob) {
			str = 'today';
		} else {
			let dt1 = new Date(today);
			let dt2 = new Date(dob);
			var diff = dt1.getTime() - dt2.getTime();
			var daydiff = parseInt(diff / (1000 * 60 * 60 * 24));
			let year = '', month = '', day = '';
			if (daydiff > 365) {
				year = parseInt(daydiff / 365);
				let remday = daydiff % 365;
				if (remday > 30) {
					month = parseInt(remday / 30);
					day = remday % 30;
				} else {
					day = remday;
				}
			} else if (daydiff > 30) {
				month = parseInt(daydiff / 30);
				day = daydiff % 30;
			} else {
				day = daydiff;
			}
			if (year) {
				str = year + ' y'
			}
			if (month) {
				str += str.length > 0 ? ', ' + month + ' m' : month + ' m';
			}
		}
		return str;
	}
	nameFormat = (name, isDoctor) => {
		let shortName = '';
		if (name != null && name.length > 0) {
			let nameArr = name.split(' ')
			if (nameArr.length > 0) {
				let max = nameArr.length > 3 ? 3 : nameArr.length
				for (let i = 0; i < max; i++) {
					shortName = shortName + (isDoctor && i == 0 ? '' : nameArr[i].charAt(0).toUpperCase());
				}
			}
		}
		return shortName
	}
	getAppointmentPatientDetailApi = (item) => {
		let { actions, signupDetails } = this.props;
		patientGuid = item.patientGuid;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Data": {
				"AppointmentGuid": signupDetails.appoinmentGuid,
				PatientGuid: item.patientGuid,
			}
		}
		actions.callLogin('V14/FuncForDrAppToGetAppointmentPatientDetails', 'post', params, signupDetails.accessToken, 'GetDetail');
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'GetDetail') {
				if (newProps.responseData.statusCode == "0") {
					// let tempArr = newProps.responseData.data.prescriptionInfoYearly;
					// let tmpPrescArr = []
					// let prescDetailsArr = []
					// if (tempArr && tempArr.length > 0) {
					// 	for (let i = 0; i < tempArr.length; i++) {

					// 		let jsonObj = {
					// 			title: tempArr[i].prescriptionDetails && tempArr[i].prescriptionDetails.length > 0 ? tempArr[i].prescriptionYear : '',
					// 			data: tempArr[i].prescriptionDetails
					// 		}

					// 		prescDetailsArr.push(jsonObj);
					// 		try {
					// 			if (tempArr[i].prescriptionDetails && tempArr[i].prescriptionDetails.length > 0) {
					// 				for (let j = 0; j < tempArr[i].prescriptionDetails.length; j++) {
					// 					if (tmpPrescArr.length < 3)
					// 						tmpPrescArr.push(tempArr[i].prescriptionDetails[j])
					// 				}
					// 			}
					// 		} catch (error) {

					// 		}
					// 	}
					// 	this.setState({ pastEncounterDetailsArr: prescDetailsArr, prescriptionArr: tmpPrescArr,showDynamicMsg:'' })
					// } else {
					// 	this.setState({ pastEncounterDetailsArr: [], prescriptionArr: [],showDynamicMsg:'Past prescription not found' })
					// }

					// let medicalHistArr = newProps.responseData.data.medicalHistoryInfoYearly;
					// if (medicalHistArr && medicalHistArr.length > 0) {
					// 	let tmpMediArr = []
					// 	let tmpMediDetailsArr = []
					// 	for (let i = 0; i < medicalHistArr.length; i++) {
					// 		let jsonObj = {
					// 			title: medicalHistArr[i].year,
					// 			data: [
					// 				{
					// 					ProblemsArr: medicalHistArr[i].patientConditions,
					// 					FamilyHistArr: medicalHistArr[i].familyHistoryCondition,
					// 				}]
					// 		}
					// 		tmpMediDetailsArr.push(jsonObj);
					// 		if (i == 0) {
					// 			tmpMediArr = [{ type: 'Problems', ProblemsAndFamilyArr: medicalHistArr[i].patientConditions },
					// 			{ type: 'Family History', ProblemsAndFamilyArr: medicalHistArr[i].familyHistoryCondition }]
					// 		}
					// 	}
					// 	this.setState({ medicalHistoryDetalsArray: tmpMediDetailsArr, medicalHistory: tmpMediArr })
					// } else {
					// 	this.setState({
					// 		medicalHistoryDetalsArray: [], medicalHistory: [{ type: 'Problems', ProblemsAndFamilyArr: [] },
					// 		{ type: 'Family History', ProblemsAndFamilyArr: [] }]
					// 	})
					// }

					// let data = newProps.responseData.data.patientDetail;
					// this.setState({ data: data });
					this.setState({ responseDataIndexTab: newProps.responseData.data});
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			} else if (tagname === 'postWalkinConfirmPatient') {
				if (newProps.responseData.statusCode == "0" || newProps.responseData.statusCode == "-1") {
					let { actions, signupDetails } = this.props;
					signupDetails.appoinmentGuid = newProps.responseData.data.patientAppointmentGuid;
					actions.setSignupDetails(signupDetails);
					let itemObj = item;
					itemObj.appointmentStatus = 'booked'
					this.props.navigation.navigate('ConsultationTab', { vitalMasterStatus: null, from: 'consultation', item: itemObj, date: date, tabIndex: 0 });
				}
			}
		}
	}

	Refresh = () => {
		this.getAppointmentPatientDetailApi();
	}
	WalkinBooking = () => {
		let { actions, signupDetails } = this.props;

		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"PatientGuid": patientGuid,
			"Version": null,
			"Data":
			{
				"DoctorGuid": signupDetails.doctorGuid,
				"PatientContactGuid": patientGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"OfferGuid": null,
				"IsWalkIn": true,
				"Notes": 'test',
			}
		}
		actions.callLogin('V1/FuncForDrAppToPatientBookAppointment_V2_1', 'post', params, signupDetails.accessToken, 'postWalkinConfirmPatient');
	}
	render() {
		let { signupDetails } = this.props;
		let item = this.props.navigation.state.params.item;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.lightBackground }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flexDirection: 'row', backgroundColor: Color.white, padding: 10 }}>
					<TouchableOpacity style={{ padding: 10 }} onPress={() => {
						this.props.navigation.goBack();
					}}>
						<Image source={arrowBack} style={{ width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), resizeMode: 'contain' }} />
					</TouchableOpacity>
					<View style={{ marginLeft: 5, marginRight: 10 }}>
						{!this.state.imageSource ?
							<View style={{
								height: responsiveFontSize(5), width: responsiveFontSize(5), backgroundColor: '#84E4E2', borderRadius: responsiveFontSize(2.5),
								alignItems: 'center', justifyContent: 'center',
							}}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.white }}>{this.nameFormat(this.state.patientName, false)}</Text>
							</View>
							: <Image source={this.state.imageSource} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5), }} />
						}
					</View>
					<View style={{ flex: 5, marginLeft: responsiveWidth(1), marginRight: responsiveWidth(1), marginBottom: 10 }}>
						<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.patientSearchName, marginRight: responsiveWidth(1), textTransform: 'capitalize' }}>{this.state.patientName.replace('  ', " ")}</Text>

						<View style={{ flexDirection: 'row', marginTop: 3, }}>

							<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '700' }}>{this.state.gender ? this.state.gender.charAt(0) + " " : ''}</Text>
							<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '500' }}>{this.state.age ? this.state.age : ''} </Text>

							<Image source={vector_phone} style={{ resizeMode: 'contain', width: responsiveWidth(5), height: responsiveWidth(5), marginLeft: 7, marginTop: 0, justifyContent: 'center', alignItems: 'center' }} />
							<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500', marginLeft: 1 }}>{this.state.mobile ? this.state.mobile : ''}</Text>

						</View>
					</View>
					<TouchableOpacity style={{ padding: 10 }} onPress={() => {
						let { signupDetails } = this.props;
						ifClickOnEdit = true;
						setLogEvent("add_patient", { "edit_patient": "click", UserGuid: signupDetails.UserGuid })
						this.props.navigation.navigate('AddNewPatients', { item: item, from: 'edit', isGetData: true, onEditPatient: this.onEditPatient, Refresh: this.Refresh })
					}}>
						<Image source={Edit} style={{ marginRight: responsiveWidth(1), height: responsiveWidth(4), width: responsiveWidth(4), resizeMode: 'contain' }} />
					</TouchableOpacity>
				</View>

				<View style={{ flex: 1, backgroundColor: Color.white, }}>

					{this.state.responseDataIndexTab ? <ScrollableTabView

						renderTabBar={() => (
							<ScrollableTabBar />
						)}
						tabBarTextStyle={{ fontSize: CustomFont.font16 }}
						tabBarInactiveTextColor={Color.optiontext}
						tabBarActiveTextColor={Color.primary}
						tabBarUnderlineStyle={{ backgroundColor: Color.primary, width: responsiveWidth(10), borderRadius: 4 }}
						initialPage={this.state.initialPage}
						ramPage={this.state.pageChangeIndex}
						onChangeTab={(res) => {

						}}
					>
						<VitalsTab responseDataIndexTab={this.state.responseDataIndexTab} tabLabel={'Vitals'} style={{ flex: 1 }} nav={{ navigation: this.props.navigation }} item={item} />
						<PastPrescriptionTab responseDataIndexTab={this.state.responseDataIndexTab} tabLabel={'Past Prescription'} style={{ flex: 1 }} nav={{ navigation: this.props.navigation }} item={item} />
						<FilesTab responseDataIndexTab={this.state.responseDataIndexTab} tabLabel={'Files'} style={{ flex: 1 }} nav={{ navigation: this.props.navigation }} item={item}  data={this.props.navigation.getParam("data", null)} />
						<MadicalHistryTab responseDataIndexTab={this.state.responseDataIndexTab} tabLabel={'Medical History'} style={{ flex: 1 }} nav={{ navigation: this.props.navigation }} item={item} />
					</ScrollableTabView> : null}


				</View>
				{
					item.appointmentStatus == 'No Show' ? null :
						<View style={{ backgroundColor: Color.white, flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 10 }}>
							<ThreeDotsModal item={this.props.navigation.state.params.item} nav={{ navigation: this.props.navigation }} RefreshPatient={this.RefreshPatient} />
							{!signupDetails.isAssistantUser ?
								<View style={{ flexDirection: 'row', }}>

									{(item && (this.state.isHideConsultNowBtn || item.appointmentStatus == 'Completed' || item.appointmentStatus == 'No Show' || item.appointmentStatus == 'Cancelled') || (item.consultationType == 'Virtual' && !item.isPaymentReceived)) || signupDetails.isAssistantUser ?
										null
										:
										<TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(78), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.primary, borderRadius: 5, marginTop: 7, marginBottom: 7 }} onPress={() => {
											let { signupDetails } = this.props;
											if (signupDetails.appoinmentGuid) {

												setLogEvent("patient_appointment_detail", { "consult_now": "click", UserGuid: signupDetails.UserGuid })
												this.props.navigation.navigate('ConsultationTab', { vitalMasterStatus: null, from: 'consultation', item: item, date: date, tabIndex: 0 });

											} else {
												this.WalkinBooking();
											}
										}}>
											<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Consult Now</Text>
										</TouchableOpacity>
									}
								</View> :
								<View>
									<TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(78), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), backgroundColor: Color.primary, borderRadius: 5, marginTop: 7, marginBottom: 7 }}
										onPress={() => { this.props.navigation.navigate('AppoinmentTimesShow', { from: 'normal' }) }}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center', fontWeight: CustomFont.fontWeight600 }}>Add New Appointment</Text>
									</TouchableOpacity>
								</View>}
						</View>
				}
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
)(CN);
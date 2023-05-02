import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, FlatList, ScrollView
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';
import Moment from 'moment';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import cancel_appoin from '../../../assets/cancel_appoin.png';
import three_dot from '../../../assets/three_dot.png';
import reschedule from '../../../assets/reschedule.png';
import cross_new from '../../../assets/cross_new1.png';
import icNoShow from '../../../assets/ic_no_show.png';
import duplicate_consult from '../../../assets/duplicate_consult.png';
import uparrow from '../../../assets/uparrow.png';
import downarrow from '../../../assets/downarrow.png';
import loadTemp from '../../../assets/loadTemp.png';
import icCancelAppointment from '../../../assets/ic_cancel.png';
import icResheduldAppoinment from '../../../assets/ic_timing.png';
import icAddApointment from '../../../assets/ic_add_apointment.png';
import icEditPatient from '../../../assets/ic_edit.png';
import icAddFamily from '../../../assets/ic_add_family.png';
import ic_vitals from '../../../assets/ic_vitals.png';

import { setLogEvent } from '../../service/Analytics';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import CheckBox from '@react-native-community/checkbox';
import Trace from '../../service/Trace';

let currentDate = '';
let availableDateArr = [], diffDays = 0, unAvailableObj = {};
let selectedDay = '', item = null, selectedReson = '';
class ThreeDotsModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible3Dots: false,
			noShowModel: false,
			cancelAppointmentModel: false,
			cancelAppointmentModelData: [{ itemValue: "Patient not available", select: false }, { itemValue: "Booked with incorrect details", select: false }, { itemValue: "Schedule has changed for the doctor", select: false }, { itemValue: "Other", select: false }],
			timePrefix: 'Today',
			isDuplicateItemOpened:false,
		};
		item = props.item;
	}
	async componentDidMount() {
		currentDate = Moment(new Date()).format('YYYY-MM-DD');
		let { actions, signupDetails } = this.props;
		if (currentDate == signupDetails.selectedDate) {
			this.setState({ timePrefix: 'Today' })
		} else {
			this.setState({ timePrefix: signupDetails.selectedDate })
		}
	}

	rescheduleFunc = () => {
		// let { actions, signupDetails } = this.props;
		// if (item.appointmentStatus == 'No Show' || item.appointmentStatus == 'Cancelled') {
		// 	this.props.nav.navigation.navigate('AppoinmentTimesShow', { from: 'Reshedule', item: item })
		// 	this.setState({ isModalVisible3Dots: false })
		// } else {
		// 	if (currentDate == signupDetails.selectedDate) {
		// 		let currentTimestamp = new Date().getTime();
		// 		var slotTime = Moment(item.appointmentStartTime, 'hh:mm A');
		// 		let diff = slotTime - currentTimestamp;
		// 		//alert(diff)
		// 		if (diff > 3600000) {
		let { signupDetails } = this.props;
		setLogEvent("consultation", { "reschdule_appointment": "click", UserGuid: signupDetails.UserGuid })
		this.props.nav.navigation.navigate('AppoinmentTimesShow', { from: 'Reshedule', item: item })
		this.setState({ isModalVisible3Dots: false })
		// 		} else {
		// 			Snackbar.show({ text: 'Reschedule appointment allowed minimum 1 hrs before', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// 		}
		// 	} else {
		// 		var d1 = new Date();
		// 		var d2 = new Date(signupDetails.selectedDate);
		// 		if (d2.getTime() > d1.getTime()) {
		// 			this.props.nav.navigation.navigate('AppoinmentTimesShow', { from: 'Reshedule', item: item })
		// 			this.setState({ isModalVisible3Dots: false })
		// 		} else {
		// 			Snackbar.show({ text: 'Past date appointments cannot be reschedule', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// 		}
		// 	}
		// }

	}


	cancelFunc = () => {
		let { signupDetails } = this.props;
		this.setState({ isModalVisible3Dots: false });
		setTimeout(() => {
			this.setState({ cancelAppointmentModel: true })
		}, 1000)
		//setLogEvent("consultation", { "cancel_appointment": "click", UserGuid: signupDetails.UserGuid })
		// if (currentDate == signupDetails.selectedDate) {
		// 	let currentTimestamp = new Date().getTime();
		// 	var slotTime = Moment(item.appointmentStartTime, 'hh:mm A');
		// 	let diff = slotTime - currentTimestamp;
		// 	if (diff > 3600000) {
		// 		let { signupDetails } = this.props;
		// 		setLogEvent("consultation", { "cancel_appointment": "click", UserGuid: signupDetails.UserGuid })
		// 		selectedReson = '';
		// 		this.setState({ isModalVisible3Dots: false });
		// 		setTimeout(() => {
		// 			this.setState({ cancelAppointmentModel: true })
		// 		}, 1000)
		// 		//this.setState({ cancelAppointmentModel: true, }) // isModalVisible3Dots: false 
		// 	} else {
		// 		Snackbar.show({ text: 'Cancel appointment allowed minimum 1 hrs before', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// 	}
		// } else {
		// 	var d1 = new Date();
		// 	var d2 = new Date(signupDetails.selectedDate);
		// 	if (d2.getTime() > d1.getTime()) {
		// 		this.setState({ isModalVisible3Dots: false });
		// 		setTimeout(() => {
		// 			this.setState({ cancelAppointmentModel: true })
		// 		}, 1000)
		// 	} else {
		// 		Snackbar.show({ text: 'Past date appointments cannot be cancelled', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// 	}
		// }
	}

	renderCancelModelItem = (item, index) => {
		return (
			<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, }} onPress={() => {
				for (let i = 0; i < this.state.cancelAppointmentModelData.length; i++) {
					this.state.cancelAppointmentModelData[i].select = false;
				}
				this.state.cancelAppointmentModelData[index].select = true;
				selectedReson = this.state.cancelAppointmentModelData[index].itemValue;
				this.setState({ cancelAppointmentModelData: this.state.cancelAppointmentModelData })
			}}>
				<CheckBox
					disabled={false}
					value={item.select}
					onValueChange={(newValue) => {
						for (let i = 0; i < this.state.cancelAppointmentModelData.length; i++) {
							this.state.cancelAppointmentModelData[i].select = false;
						}
						this.state.cancelAppointmentModelData[index].select = true;
						selectedReson = this.state.cancelAppointmentModelData[index].itemValue;
						this.setState({ cancelAppointmentModelData: this.state.cancelAppointmentModelData })
					}}
					tintColors={{ true: Color.primary, false: Color.unselectedCheckBox }}
					style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), color: Color.mediumGrayTxt, marginLeft: 6 }}

				/>
				<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext, marginLeft: 10, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName }}>{item.itemValue}</Text>
			</TouchableOpacity>
		)
	}

	noShowModelfunc = () => {
		let { signupDetails } = this.props;
		if (currentDate >= signupDetails.selectedDate) {
			let currentTimestamp = new Date().getTime();
			var slotTime = Moment(item.appointmentStartTime, 'hh:mm A');
			if (currentDate == signupDetails.selectedDate && currentTimestamp < slotTime) {
				Snackbar.show({ text: 'Schedule time is not expired yet.', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			} else {
				let timeRange = Trace.getTimeRange();
				Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + "No_Show", signupDetails.firebaseLocation);
				Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "No_Show", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

				setLogEvent("consultation", { "no_show": "click", UserGuid: signupDetails.UserGuid })
				this.setState({ isModalVisible3Dots: false });
				setTimeout(() => {
					this.setState({ noShowModel: true });
				}, 500)
			}
		} else {
			Snackbar.show({ text: 'Future date appointment you can not do marked as No-Show', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}
	}

	markAsNoShow = () => {

		if (item.appointmentStatus == 'No Show') {
			this.setState({ noShowModel: false, isModalVisible3Dots: false })
			setTimeout(() => {
				Snackbar.show({ text: 'This appointment cannot no show again', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}, 2000)
		} else {
			let { actions, signupDetails } = this.props;
			let params = {
				"userGuid": signupDetails.UserGuid,
				"clinicGuid": signupDetails.clinicGuid,
				"doctorGuid": signupDetails.doctorGuid,
				"Data": {
					"AppointmentGuid": signupDetails.appoinmentGuid,
					"AppointmentStatusText": "Mark as No Show"
				}
			}
			actions.callLogin('V1/FuncForDrAppToAppointmentMarkAsNoShow', 'post', params, signupDetails.accessToken, 'MarkAsNoShow');
		}
	}
	getCancelAppoinment = () => {
		if (item.appointmentStatus == 'Cancelled') {
			this.setState({
				cancelAppointmentModel: false,
				isModalVisible3Dots: false,
			})
			setTimeout(() => {
				Snackbar.show({ text: 'This appointment cannot cacelled again', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}, 2000)
		} else {
			if (!selectedReson) {
				Snackbar.show({ text: 'Please select the reason', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			} else {
				let { actions, signupDetails } = this.props;
				let params = {
					"UserGuid": signupDetails.UserGuid,
					"data": {
						"userGuid": signupDetails.UserGuid,
						"clinicGuid": signupDetails.clinicGuid,
						"doctorGuid": signupDetails.doctorGuid,
						"version": null,
						"pateintGuid": null,
						"patientContactGuid": item.patientGuid,
						"PatientAppointmentGuid": signupDetails.appoinmentGuid,
						"AppointmentGuid": signupDetails.appoinmentGuid,
						"notes": ""
					}
				}
				actions.callLogin('V1/FuncForDrAppToPatientCancelAppointment_101_V2', 'post', params, signupDetails.accessToken, 'CancelAppointment');
				setLogEvent("cancel_appointment", { "userGuid": signupDetails.UserGuid })
			}
		}


	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'CancelAppointment') {
				if (newProps.responseData.statusCode == '-1') {
					this.setState({
						cancelAppointmentModel: false,
						isModalVisible3Dots: false,
						//cancelAppointmentModelData: [{ itemValue: "Patient not available", select: false }, { itemValue: "Booked with incorrect details", select: false }, { itemValue: "Schedule has changed for the doctor", select: false }, { itemValue: "Other", select: false }],
					})
					this.props.nav.navigation.navigate('DoctorHome')
					setTimeout(() => {
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					}, 3000)
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			} else if (tagname === 'MarkAsNoShow') {
				if (newProps.responseData.statusCode == '0') {
					this.setState({ noShowModel: false })
					this.props.nav.navigation.navigate('DoctorHome')
					setTimeout(() => {
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					}, 3000)

				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			}
		}
	}
	Refresh = (data) => {
		this.props.RefreshPatient(data);
	}
	onEditPatient = (data) => {
		// need for navigation. Dont delete this method
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<View>
				<TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(12), justifyContent: 'center', alignItems: 'center', marginTop: 7, marginBottom: 7 }}
					onPress={() => this.setState({ isModalVisible3Dots: true })}>
					<Image source={three_dot} style={{ height: responsiveHeight(6), width: responsiveHeight(6), resizeMode: 'contain' }} />
				</TouchableOpacity>
				{/* -----------3 dots  modal------------------- */}
				<Modal isVisible={this.state.isModalVisible3Dots} avoidKeyboard={true}
					onRequestClose={() => this.setState({ isModalVisible3Dots: false })}>
					<View style={[styles.modelView3dots,{height:item.appointmentGuid ? responsiveHeight(120):responsiveHeight(80)}]}>
						<ScrollView>
						<View style={{marginBottom:responsiveHeight(32)}}>
						<View style={{ margin: responsiveWidth(5), marginBottom: responsiveHeight(36) }}>
							<View style={{ height: responsiveHeight(7), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<View >
									{signupDetails.appoinmentGuid ? <View style={{ padding: 10 }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.patientSearchName, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(3), }}>Appointment</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(3), }}>{this.state.timePrefix ? this.state.timePrefix + "," : ''} {item ? item.appointmentStartTime : ''}</Text>
									</View> : null

									}

								</View>
								<TouchableOpacity onPress={() => this.setState({ isModalVisible3Dots: false })}>
									<Image source={cross_new} style={{ tintColor: Color.primary, height: responsiveHeight(4), width: responsiveHeight(4), margin: 10, resizeMode: 'contain' }} />
								</TouchableOpacity>
							</View>
							
							{/* <TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.2), marginLeft: responsiveWidth(3) }}
										onPress={() => {
											this.setState({isDuplicateItemOpened:!this.state.isDuplicateItemOpened})
										}}>
								<Image source={duplicate_consult} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5),resizeMode:'contain' }} />
								<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Duplicate Rx</Text>
								<Image source={this.state.isDuplicateItemOpened ? uparrow:downarrow} style={{ height: responsiveFontSize(4), width: responsiveFontSize(4),resizeMode:'contain',marginLeft:responsiveWidth(2),tintColor:Color.liveBg }} />
							</TouchableOpacity>
							{ this.state.isDuplicateItemOpened ? 
								<View style={{marginLeft:responsiveWidth(18)}}>
									<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}/>
									<TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.2), }} onPress={() => {

										}}>
								<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Duplicate Previous Rx</Text>
							</TouchableOpacity>
							<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}/>
									<TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.2), }} onPress={() => {
										this.props.nav.navigation.navigate('AllPrescriptionList');
										this.setState({ isModalVisible3Dots: false })
										}}>
								<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Duplicate from List</Text>
							</TouchableOpacity>
									</View>:null
							}
							<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}/>
							<TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.2), marginLeft: responsiveWidth(3) }}
										onPress={() => {
											this.props.nav.navigation.navigate('LoadTemplate');
										this.setState({ isModalVisible3Dots: false })
										}}>
										<Image source={loadTemp} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
										<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Load Template</Text>
									</TouchableOpacity>
							<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}/> */}


							{item.appointmentStatus == 'Completed' || item.appointmentStatus == 'Cancelled' || item.appointmentStatus == 'No Show' || !signupDetails.appoinmentGuid || (item.consultationType == 'Virtual' && !item.isPaymentReceived) ? null :
								<View>
									<TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.2), marginLeft: responsiveWidth(3) }}
										onPress={() => {
											this.noShowModelfunc()
										}}>
										<Image source={icNoShow} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
										<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>No-show</Text>
									</TouchableOpacity>


									<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}/>


									<TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.2), marginLeft: responsiveWidth(3) }}
										onPress={() => {
											this.cancelFunc()
										}}>
										<Image source={icCancelAppointment} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
										<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Cancel Appointment</Text>
									</TouchableOpacity>


									<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}></View>
								</View>}

							{item.appointmentStatus == 'Completed' || item.appointmentStatus == 'Cancelled' || !signupDetails.appoinmentGuid || (item.consultationType == 'Virtual' && !item.isPaymentReceived) ? null :
								<View>
									<TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1), marginLeft: responsiveWidth(3) }}
										onPress={() => {
											this.rescheduleFunc();
										}}>
										<Image source={icResheduldAppoinment} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), }} />
										<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Reschedule</Text>
									</TouchableOpacity>

									<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}></View>
								</View>}

							<TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.2), marginLeft: responsiveWidth(3) }} onPress={() => {
								DRONA.setClinicType('InClinic');
								let { signupDetails } = this.props;
								setLogEvent("consultation", { "add_appointment": "click", UserGuid: signupDetails.UserGuid })
								this.props.nav.navigation.navigate('AppoinmentTimesShow', { from: 'newConsultant', item: item })
								this.setState({ isModalVisible3Dots: false })
							}}>
								<Image source={icAddApointment} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
								<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Add Appointment</Text>
							</TouchableOpacity>

							<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}></View>

							<TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.2), marginLeft: responsiveWidth(3) }} onPress={() => {
								let { signupDetails } = this.props;
								setLogEvent("consultation", { "edit_patient": "click", UserGuid: signupDetails.UserGuid })
								this.props.nav.navigation.navigate('AddNewPatients', { item: item, from: 'edit', isGetData: true, Refresh: this.Refresh, onEditPatient: this.onEditPatient, });
								this.setState({ isModalVisible3Dots: false })
							}}>
								<Image source={icEditPatient} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
								<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Edit Patient</Text>
							</TouchableOpacity>

							<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}></View>

							<TouchableOpacity style={{ height: responsiveHeight(6), flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.2), marginLeft: responsiveWidth(3) }} onPress={() => {
								let { signupDetails } = this.props;
								setLogEvent("consultation", { "add_family_member": "click", UserGuid: signupDetails.UserGuid })
								this.props.nav.navigation.navigate('AddNewPatients', { item: item, from: 'addfamily', isGetData: true, Refresh: this.Refresh, onEditPatient: this.onEditPatient, });
								this.setState({ isModalVisible3Dots: false })
							}}>
								<Image source={icAddFamily} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
								<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Add Family Member</Text>
							</TouchableOpacity>
						</View>
						</View>
						</ScrollView>
						
						
						
					</View>
				</Modal>

				{/* -----------No-Show modal------------------- */}
				<Modal isVisible={this.state.noShowModel} onRequestClose={() => this.setState({ noShowModel: false })}>
					<View style={[styles.modelNoShow]}>
						<View style={{ marginTop: 10, height: responsiveHeight(8), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<TouchableOpacity style={{ padding: 10 }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700', marginLeft: 20, }}>No Show?</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{ padding: 10 }}
								onPress={() => {
									Trace.stopTrace();
									this.setState({
										noShowModel: false, isModalVisible3Dots: false
									})
								}}>
								<Image source={cross_new} style={{ tintColor: Color.primary, height: responsiveWidth(6), width: responsiveWidth(6), marginRight: responsiveWidth(5) }} />
							</TouchableOpacity>
						</View>

						<Text style={{ height: responsiveHeight(3), textAlign: 'center', color: Color.patientSearchName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700, margin: 10, marginTop: 10, marginBottom: 10 }}>
							Do you want to mark the patient as a no show?
						</Text>
						<View style={{ flexDirection: 'row', padding: 10, margin: 10, marginBottom: responsiveHeight(30) }}>

							<TouchableOpacity
								onPress={() => {
									let { signupDetails } = this.props;
									Trace.stopTrace();
									setLogEvent("mark_as_no_show", { "cancel": "click", UserGuid: signupDetails.UserGuid })
									this.setState({
										noShowModel: false, isModalVisible3Dots: false
									})
								}}
								style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.cancelButtonBg, width: '35%', height: responsiveHeight(6) }}>
								<Text style={{ color: Color.primary, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									let { signupDetails } = this.props;
									Trace.stopTrace();
									setLogEvent("mark_as_no_show", { "complete": "click", UserGuid: signupDetails.UserGuid })
									this.markAsNoShow()
								}}
								style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, width: '60%', height: responsiveHeight(6) }}>
								<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Mark as No Show</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				{/* -----------Cancel Appointment modal------------------- */}
				<Modal isVisible={this.state.cancelAppointmentModel}
					onRequestClose={() => this.setState({ cancelAppointmentModel: false })}
					avoidKeyboard={true}>
					<View style={styles.cancelAppointmentModelView}>



						<View style={{ height: responsiveHeight(8), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<TouchableOpacity style={{ padding: 10 }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700', marginLeft: 20, }}>Cancel Appointment ?</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{ padding: 10 }}
								onPress={() => this.setState({ cancelAppointmentModel: false, isModalVisible3Dots: false })}>
								<Image source={cross_new} style={{ tintColor: Color.primary, height: responsiveWidth(6), width: responsiveWidth(6), marginRight: responsiveWidth(5) }} />
							</TouchableOpacity>
						</View>

						<Text style={{ marginLeft: 30, height: responsiveHeight(3), color: Color.patientSearchName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '700', marginTop: 10, marginBottom: 10 }}>
							Select reason
						</Text>

						<View style={{ marginLeft: 20, marginBottom: responsiveHeight(7) }}>
							<FlatList
								data={this.state.cancelAppointmentModelData}
								renderItem={({ item, index }) => this.renderCancelModelItem(item, index)}
								keyExtractor={(item, index) => index.toString()}
							/>
						</View>
						<View style={{ flexDirection: 'row', padding: 10, margin: 10, marginBottom: responsiveHeight(15) }}>

							<TouchableOpacity
								onPress={() => {
									let { signupDetails } = this.props;
									setLogEvent("discard_cancel", { UserGuid: signupDetails.UserGuid })
									this.setState({
										cancelAppointmentModel: false,
										isModalVisible3Dots: false,
										cancelAppointmentModelData: [{ itemValue: "Patient not available", select: false }, { itemValue: "Booked with incorrect details", select: false }, { itemValue: "Schedule has changed for the doctor", select: false }, { itemValue: "Other", select: false }],

									})
								}} style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.cancelButtonBg, width: '35%', height: responsiveHeight(6) }}>
								<Text style={{ color: Color.primary, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Don’t Cancel</Text>
							</TouchableOpacity>
							{selectedReson != '' ? <TouchableOpacity
								onPress={() => {
									this.getCancelAppoinment()
								}}
								style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, width: '60%', height: responsiveHeight(6) }}>
								<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Yes, Cancel</Text>
							</TouchableOpacity>
								:
								<TouchableOpacity style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.grayBack, width: '60%', height: responsiveHeight(6) }} onPress={() => {
									Snackbar.show({ text: 'Please select the reason', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
								}}>
									<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName, color: Color.primary, }}>Yes, Cancel</Text>
								</TouchableOpacity>}
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
)(ThreeDotsModal);

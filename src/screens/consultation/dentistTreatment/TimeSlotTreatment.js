import Moment from 'moment';
import React from 'react';
import { BackHandler, FlatList, Image, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrowBack from '../../../../assets/back_blue.png';
import CalendarImge from '../../../../assets/calender_icon.png';
import morning from '../../../../assets/morning.png';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import CustomFont from '../../../components/CustomFont';
import * as apiActions from '../../../redux/actions/apiActions';
import * as signupActions from '../../../redux/actions/signupActions';
import styles from './style.js'
var _ = require('lodash');
let currentDate = '';
let isReschedule = false;
let selectedDay = '';
let inClinicAfternoon = [], inClinicEvening = [], inClinicMorning = [], virtualAfternoon = [], virtualEvening = [], virtualMorning = [];
let tempinClinicAfternoon = [], tempinClinicEvening = [], tempinClinicMorning = [], tempvirtualAfternoon = [], tempvirtualEvening = [], tempvirtualMorning = [];
let dateArr = [];
let patientTreatmentDetailsGuid = '', dynamicMessageGlobal = '', selectedItem = null;
class TimeSlotTreatment extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clinicType: 'InClinic',
			dataArray: [],
			isModalVisible: false,
			dateForUpdate: '',
			showHeaderDate: '',
			dateForfullCalendar: '',
			dataArrayAfternoon: [],
			dataArrayEvening: [],
			dataArrayMorning: [],
			dynamicMessage: '',

			calenderDateArr: [],
			selectedTab: 0,

		};
		this.getCleanVariable();
		//alert(JSON.stringify(props.navigation.state.params.item))
	}
	getCleanVariable = () => {
		inClinicAfternoon = []; inClinicEvening = []; inClinicMorning = []; virtualAfternoon = []; virtualEvening = []; virtualMorning = [];
		tempinClinicAfternoon = []; tempinClinicEvening = []; tempinClinicMorning = []; tempvirtualAfternoon = []; tempvirtualEvening = []; tempvirtualMorning = [];
		selectedDay = '', selectedDayName = 'this day ';
		selectedItem = null;
	}
	async componentDidMount() {
		let { actions, signupDetails } = this.props;
		
		if (signupDetails.serverDateTime)
			currentDate = signupDetails.serverDateTime; //Moment(new Date()).format('YYYY-MM-DD');
		else
			currentDate = Moment(new Date()).format('YYYY-MM-DD');
		selectedDay = currentDate;
		DRONA.setSelectedAppoinDate(selectedDay);
		//this.setState({ dateForUpdate: currentDate, showHeaderDate: showDate })
		this.callApi();
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		//var today = new Date()
		this.makeDateCalender(currentDate);
		selectedDayName = Moment(selectedDay).format('dddd');
		patientTreatmentDetailsGuid = this.props.navigation.state.params.patientTreatmentDetailsGuid;

	}
	makeDateCalender = (today) => {
		dateArr = [];
		dateArr.push(Moment(today).format("YYYY-MM-DD"));
		dateArr.push(Moment(today, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD'));
		dateArr.push(Moment(today, "YYYY-MM-DD").add(2, 'days').format('YYYY-MM-DD'));
		//dateArr.push(Moment(today, "YYYY-MM-DD").add(3, 'days').format('YYYY-MM-DD'));
		this.setState({ calenderDateArr: dateArr })

	}
	callApi() {
		this.setState({ dynamicMessage: '' })
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Data": {
				"OfferGuid": null,
				"AvailabilityGuid": null,
				"ReasonVisitGuid": null,
				"Notes": null,
				"AvailableDate": selectedDay,
				"ConsultationTypeGuid": null, //"6f2bf848-50da-11eb-bdf4-0022486bc409"
			}

		}
		actions.callLogin('V1/FuncForDrAppToGetAvailableTimeSlot', 'post', params, signupDetails.accessToken, 'TimeslotLest');
	}

	prepairCurentDateItem = (primaryArray) => {
		let secondaryArray = [];
		let currentTimestamp = new Date().getTime();
		if (primaryArray.length > 0) {
			for (let i = 0; i < primaryArray.length; i++) {
				var slotTime = Moment(primaryArray[i].availableTime, 'hh:mm A');
				if (slotTime > currentTimestamp) {
					secondaryArray.push(primaryArray[i]);
				}
			}
		} else {
			secondaryArray = [];
		}
		return secondaryArray;
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'TimeslotLest') {
				if (newProps.responseData.data) {
					let data = newProps.responseData.data[0];
					inClinicTimeSlot = [], virtualTimeSlot = [];
					inClinicAfternoon = [], inClinicEvening = [], inClinicMorning = [], virtualAfternoon = [], virtualEvening = [], virtualMorning = []
					try {

						if (data.consultationtypeList && data.consultationtypeList.length > 0) {
							let dataList = data.consultationtypeList[0].availableDateList
							if (data.consultationtypeList[0].consultationtype == 'In Clinic') {
								if (dataList.length > 0) {
									let availableTimeList = dataList[0].availableTimeList;
									if (availableTimeList && availableTimeList.length > 0) {
										for (let i = 0; i < availableTimeList.length; i++) {
											let dayPeriad = availableTimeList[i].dayPeriad;
											let tempObj = Object.assign({ isActive: false }, availableTimeList[i]);
											if (dayPeriad === 'Afternoon') {
												inClinicAfternoon.push(tempObj);
											} else if (dayPeriad === 'Evening') {
												inClinicEvening.push(tempObj);
											} else if (dayPeriad === 'Morning') {
												inClinicMorning.push(tempObj);
											}
										}
									} else {
										dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'

									}
								}


							} else {

								if (dataList.length > 0) {
									let availableTimeList = dataList[0].availableTimeList;
									if (availableTimeList && availableTimeList.length > 0) {
										for (let i = 0; i < availableTimeList.length; i++) {
											let dayPeriad = availableTimeList[i].dayPeriad;
											let tempObj = Object.assign({ isActive: false }, availableTimeList[i]);
											if (dayPeriad === 'Afternoon') {
												virtualAfternoon.push(tempObj);
											} else if (dayPeriad === 'Evening') {
												virtualEvening.push(tempObj);
											} else if (dayPeriad === 'Morning') {
												virtualMorning.push(tempObj);
											}
										}
									} else {
										dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or';
									}
								}


							}
						}

						if (data.consultationtypeList && data.consultationtypeList.length > 1) {
							let dataList = data.consultationtypeList[1].availableDateList;
							if (data.consultationtypeList[1].consultationtype == 'Virtual') {

								if (dataList.length > 0) {
									let availableTimeList = dataList[0].availableTimeList;
									if (availableTimeList && availableTimeList.length > 0) {
										for (let i = 0; i < availableTimeList.length; i++) {
											let dayPeriad = availableTimeList[i].dayPeriad;
											let tempObj = Object.assign({ isActive: false }, availableTimeList[i]);
											if (dayPeriad === 'Afternoon') {
												virtualAfternoon.push(tempObj);
											} else if (dayPeriad === 'Evening') {
												virtualEvening.push(tempObj);
											} else if (dayPeriad === 'Morning') {
												virtualMorning.push(tempObj);
											}
										}
									} else {
										dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
									}
								}

							} else {
								if (dataList.length > 0) {
									let availableTimeList = dataList[0].availableTimeList;
									if (availableTimeList && availableTimeList.length > 0) {
										for (let i = 0; i < availableTimeList.length; i++) {
											let dayPeriad = availableTimeList[i].dayPeriad;
											let tempObj = Object.assign({ isActive: false }, availableTimeList[i]);
											if (dayPeriad === 'Afternoon') {
												inClinicAfternoon.push(tempObj);
											} else if (dayPeriad === 'Evening') {
												inClinicEvening.push(tempObj);
											} else if (dayPeriad === 'Morning') {
												inClinicMorning.push(tempObj);
											}
										}
									} else {
										dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
									}
								}

							}
						}
						let msgFla = false;
						if (selectedDay == currentDate) {

							tempinClinicAfternoon = [], tempinClinicEvening = [], tempinClinicMorning = [], tempvirtualAfternoon = [], tempvirtualEvening = [], tempvirtualMorning = [];
							if (this.state.clinicType == 'InClinic') {
								if (inClinicAfternoon.length > 0 || inClinicEvening.length > 0 || inClinicMorning.length > 0)
									msgFla = true;
							} else {
								if (virtualAfternoon.length > 0 || virtualEvening.length > 0 || virtualMorning.length > 0)
									msgFla = true;
							}

							tempinClinicAfternoon = this.prepairCurentDateItem(inClinicAfternoon)
							tempinClinicEvening = this.prepairCurentDateItem(inClinicEvening)
							tempinClinicMorning = this.prepairCurentDateItem(inClinicMorning)

							tempvirtualAfternoon = this.prepairCurentDateItem(virtualAfternoon)
							tempvirtualEvening = this.prepairCurentDateItem(virtualEvening)
							tempvirtualMorning = this.prepairCurentDateItem(virtualMorning)
							let innerMsgFla = false;
							if (this.state.clinicType == 'InClinic') {
								if (tempinClinicAfternoon.length > 0 || tempinClinicEvening.length > 0 || tempinClinicMorning.length > 0)
									innerMsgFla = true;

								this.setState({
									dataArrayAfternoon: tempinClinicAfternoon,
									dataArrayEvening: tempinClinicEvening,
									dataArrayMorning: tempinClinicMorning
								})
							} else {
								if (tempvirtualAfternoon.length > 0 || tempvirtualEvening.length > 0 || tempvirtualMorning.length > 0)
									innerMsgFla = true;

								this.setState({
									dataArrayAfternoon: tempvirtualAfternoon,
									dataArrayEvening: tempvirtualEvening,
									dataArrayMorning: tempvirtualMorning
								})
							}
							if (!msgFla) {
								dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
							} else if (!innerMsgFla) {
								dynamicMessageGlobal = 'cosultation timings were not setup for evening session. Select next day or'
							} else {
								dynamicMessageGlobal = '';
							}
						} else {
							if (this.state.clinicType == 'InClinic') {
								if (inClinicAfternoon.length > 0 || inClinicEvening.length > 0 || inClinicMorning.length > 0)
									dynamicMessageGlobal = '';
								else
									dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'

								this.setState({
									dataArrayAfternoon: inClinicAfternoon,
									dataArrayEvening: inClinicEvening,
									dataArrayMorning: inClinicMorning
								})
							} else {
								if (virtualAfternoon.length > 0 || virtualEvening.length > 0 || virtualMorning.length > 0)
									dynamicMessageGlobal = '';
								else
									dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'

								this.setState({
									dataArrayAfternoon: virtualAfternoon,
									dataArrayEvening: virtualEvening,
									dataArrayMorning: virtualMorning
								})
							}
						}
						this.setState({ dynamicMessage: dynamicMessageGlobal })


					} catch (e) {
						this.resetItem();
					}
				} else {
					tempArr = [];
					inClinicTimeSlot = [];
					tempArrVirtual = [];
					virtualTimeSlot = [];
					this.resetItem();
					if (selectedDay >= currentDate)
						this.setState({ dynamicMessage: 'consultation timings were not setup for ' + selectedDayName + '. Select next day or' })
					else
						this.setState({ dynamicMessage: 'Data not available' })
				}

			} else if (tagname == 'postConfirmTimeSlot') {
				if (newProps.responseData.statusCode == 0) {
					Snackbar.show({ text: 'Appointment booked successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					setTimeout(() => {
						DRONA.setIsDrTimingsUpdated(true);
						this.props.navigation.goBack();
					}, 2000)
				} else {
					Snackbar.show({ text: 'Something went wrong. Please try again later', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			}
		}
	}
	confirmAppoinment = (item) => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"PatientGuid": signupDetails.patientGuid,
			"Version": null,
			"Data": {
				"UserGuid": signupDetails.UserGuid,
				"PatientGuid": signupDetails.patientGuid,
				"Version": null,
				"DoctorGuid": signupDetails.doctorGuid,
				"PatientContactGuid": signupDetails.patientGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"OfferGuid": null,
				"AvailabilityGuid": item.availabilityGuid,
				"ReasonVisitGuid": null,
				"Notes": '',
				"StartDate": selectedDay,
				"TimeSlotGuid": item.timeSlotGuid,
				"StartTime": Moment(item.availableTime, 'hh:mm A').format('HH:mm'),
				"EndTime": Moment(item.endTime, 'hh:mm A').format('HH:mm'),
				"DayPeriod": item.dayPeriad,
				"IsForTreatment": 1,
				"PatientTreatmentDetailsGuid": patientTreatmentDetailsGuid,
			}
		}
		actions.callLogin('V16/FuncForDrAppToPatientBookAppointment_V3', 'post', params, signupDetails.accessToken, 'postConfirmTimeSlot');
	}
	clearPreviousSelection = () => {
		if (this.state.dataArrayMorning && this.state.dataArrayMorning.length > 0) {
			let index = this.state.dataArrayMorning.findIndex(property => property.isActive);
			if (index > -1) {
				this.state.dataArrayMorning[index].isActive = false;
			}
		}
		if (this.state.dataArrayAfternoon && this.state.dataArrayAfternoon.length > 0) {
			let index = this.state.dataArrayAfternoon.findIndex(property => property.isActive);
			if (index > -1) {
				this.state.dataArrayAfternoon[index].isActive = false;
			}

		}
		if (this.state.dataArrayEvening && this.state.dataArrayEvening.length > 0) {
			let index = this.state.dataArrayEvening.findIndex(property => property.isActive);
			if (index > -1) {
				this.state.dataArrayEvening[index].isActive = false;
			}
		}
	}
	renderList = ({ item, index }) => (
		<TouchableOpacity style={{
			flexDirection: 'row', margin: responsiveWidth(1), width: responsiveWidth(25.5),
			backgroundColor: item.isActive ? Color.genderSelection : Color.white, height: responsiveHeight(6), borderRadius: 8, justifyContent: 'center', alignItems: 'center',
			borderColor: item.isActive ? Color.liveBg : item.isAvailable ? Color.lightGrayTxt : '#F1ECFB', borderWidth: item.isAvailable ? 1 : .85
		}}
			onPress={() => {
				if (selectedDay > currentDate || selectedDay == currentDate) {
					if (item.isAvailable) {
						this.clearPreviousSelection();
						if (item.dayPeriad == 'Morning') {
							item.isActive = !item.isActive;
							this.setState({ dataArrayMorning: this.state.dataArrayMorning });
						} else if (item.dayPeriad == 'Afternoon') {
							item.isActive = !item.isActive;
							this.setState({ dataArrayAfternoon: this.state.dataArrayAfternoon });
						} else if (item.dayPeriad == 'Evening') {
							item.isActive = !item.isActive;
							this.setState({ dataArrayEvening: this.state.dataArrayEvening });
						}
						selectedItem = item;
					} else {
						Snackbar.show({ text: 'Slot already booked', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					}
				} else {
					Snackbar.show({ text: 'Date should be today or future date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			}}>
			<Text style={{ color: item.isAvailable ? Color.optiontext : '#B9B6BF', fontFamily: CustomFont.fontName, fontWeight: item.isAvailable ? CustomFont.fontWeight800 : CustomFont.fontWeight400 }}>{this.splitTime(item.availableTime)}</Text>
			<Text style={{ color: item.isAvailable ? Color.optiontext : '#B9B6BF', fontFamily: CustomFont.fontName, fontWeight: item.isAvailable ? CustomFont.fontWeight800 : CustomFont.fontWeight400 }}> {this.splitAMPM(item.availableTime)}</Text>
		</TouchableOpacity>
	);
	clickOnDone = () => {
		//
		this.setState({ selectedTab: 0 });
		this.makeDateCalender(selectedDay)
		//
		this.callApi();
		this.setState({ isModalVisible: false });
		DRONA.setSelectedAppoinDate(selectedDay);

		selectedDayName = Moment(selectedDay).format('dddd');
	}

	splitTime = (sTime) => {
		if (sTime.toString().includes(" ")) {
			let str = sTime.toString().split(" ");
			return str[0];
		}
	}

	splitAMPM = (sTime) => {
		if (sTime.toString().includes(" ")) {
			let str = sTime.toString().split(" ");
			return str[1].toLowerCase();
		}
	}
	resetItem() {
		inClinicAfternoon = [], inClinicEvening = [], inClinicMorning = [], virtualAfternoon = [], virtualEvening = [], virtualMorning = [],
			tempinClinicAfternoon = [], tempinClinicEvening = [], tempinClinicMorning = [], tempvirtualAfternoon = [], tempvirtualEvening = [], tempvirtualMorning = [];
		this.setState({
			dataArrayAfternoon: [],
			dataArrayEvening: [],
			dataArrayMorning: []
		});
	}

	hasTabChanged = (tabno) => {
		this.setState({ selectedTab: tabno });
		selectedDay = this.state.calenderDateArr[tabno];
		DRONA.setSelectedAppoinDate(selectedDay);
		selectedDayName = Moment(selectedDay).format('dddd');
		this.callApi();
	}

	render() {

		return (
			<SafeAreaView style={{ ...CommonStyle.container, backgroundColor: Color.patientBackground }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					<View style={{ flex: 1 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Color.white, padding: 10 }}>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.goBack()}>
									<Image source={arrowBack} style={{ height: responsiveHeight(3), width: responsiveHeight(3), resizeMode: 'contain' }} />
								</TouchableOpacity>
							</View>
							<View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
								<TouchableOpacity style={{
									borderColor: Color.liveBg, borderWidth: 1.5, borderRadius: 4,
									justifyContent: 'center', alignItems: 'center', width: responsiveWidth(20), height: responsiveHeight(5.5),
									borderRadius: 4, backgroundColor: Color.genderSelection
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, fontWeight: CustomFont.fontWeight500 }}>In Clinic</Text>
								</TouchableOpacity>
							</View>
							<Text />
						</View>

						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
								onPress={() => this.hasTabChanged(0)}>
								<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 0 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 0 ? 'bold' : 'normal' }}>{Moment(this.state.calenderDateArr[0]).format("ddd, DD MMM")}</Text>
								{this.state.selectedTab == 0 ? <View style={styles.underlineStyle} /> : null}
							</TouchableOpacity>
							<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
								onPress={() => this.hasTabChanged(1)}>
								<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 1 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 1 ? 'bold' : 'normal' }}>{Moment(this.state.calenderDateArr[1]).format("ddd, DD MMM")}</Text>
								{this.state.selectedTab == 1 ? <View style={styles.underlineStyle} /> : null}
							</TouchableOpacity>
							<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
								onPress={() => this.hasTabChanged(2)}>
								<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 2 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 2 ? 'bold' : 'normal' }}>{Moment(this.state.calenderDateArr[2]).format("ddd, DD MMM")}</Text>
								{this.state.selectedTab == 2 ? <View style={styles.underlineStyle} /> : null}
							</TouchableOpacity>

							<TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {

								this.setState({ isModalVisible: true })
							}}>
								<Image source={CalendarImge} style={{ tintColor: Color.primary, height: 30, width: 30, resizeMode: 'contain', margin: 10 }} />
								{/* <CalendarModal /> */}
							</TouchableOpacity>
						</View>


						{(this.state.dataArrayAfternoon.length > 0 || this.state.dataArrayMorning.length > 0 || this.state.dataArrayEvening.length > 0) ?
							<ScrollView>
								<View style={{ flex: 1, margin: responsiveWidth(3), backgroundColor: Color.white, borderRadius: 10 }}>

									{this.state.dataArrayMorning.length > 0 ?
										<View>
											<View style={{ flexDirection: 'row', margin: responsiveWidth(5) }}>
												<Image source={morning} style={{ height: responsiveWidth(5), width: responsiveWidth(5) }} />
												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(2) }}>Morning</Text>
											</View>
											<View style={{ marginLeft: responsiveWidth(3) }}>
												<FlatList
													data={this.state.dataArrayMorning}
													ItemSeparatorComponent={this.renderSeparator}
													renderItem={this.renderList}
													extraData={this.state}
													keyExtractor={(item, index) => index.toString()}
													numColumns={3}
												/>
											</View>
										</View>
										: null}

									{this.state.dataArrayAfternoon.length > 0 ?
										<View>
											<View style={{ flexDirection: 'row', margin: responsiveWidth(5) }}>
												<Image source={morning} style={{ height: responsiveWidth(5), width: responsiveWidth(5), tintColor: '#E16C00' }} />
												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(2) }}>Afternoon</Text>
											</View>
											<View style={{ marginLeft: responsiveWidth(3) }}>
												<FlatList
													data={this.state.dataArrayAfternoon}
													ItemSeparatorComponent={this.renderSeparator}
													renderItem={this.renderList}
													extraData={this.state}
													keyExtractor={(item, index) => index.toString()}
													numColumns={3}
												/>
											</View>
										</View>
										: null}

									{this.state.dataArrayEvening.length > 0 ?
										<View>
											<View style={{ flexDirection: 'row', margin: responsiveWidth(5) }}>
												<Image source={morning} style={{ height: responsiveWidth(5), width: responsiveWidth(5), tintColor: '#E16C00' }} />
												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(2) }}>Evening</Text>
											</View>
											<View style={{ marginLeft: responsiveWidth(3), marginBottom: 10 }}>
												<FlatList
													data={this.state.dataArrayEvening}
													ItemSeparatorComponent={this.renderSeparator}
													renderItem={this.renderList}
													extraData={this.state}
													keyExtractor={(item, index) => index.toString()}
													numColumns={3}
												/>
											</View>
										</View>
										: null}

								</View>
							</ScrollView> :
							<View style={{ alignItems: 'center' }}>
								{this.state.dynamicMessage ? <TouchableOpacity style={{ alignItems: 'center', marginTop: 30, marginLeft: 20, marginRight: 20 }} onPress={() => this.props.navigation.navigate('SetUpClinic', { tabActive: 0, from: 'first' })}>
									<Text style={{ color: Color.fontColor, fontSize: CustomFont.font16 }}>{this.state.dynamicMessage} <Text style={{ color: Color.blueTxt, textDecorationLine: 'underline' }}>{this.state.dynamicMessage == 'Please select today or future date' || this.state.dynamicMessage == 'Data not available' ? '' : 'edit consultation timings'}</Text></Text>
								</TouchableOpacity> : null}


							</View>}

					</View>
					<View style={{ flexDirection: 'row', padding: 10, backgroundColor: Color.white, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
						<TouchableOpacity
							onPress={() => {
								if (selectedItem) {
									this.confirmAppoinment(selectedItem);
								} else {
									Snackbar.show({ text: 'Please select slot', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
								}


							}}
							style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, width: '97%', height: responsiveHeight(6) }}>
							<Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600 }}>Continue</Text>
						</TouchableOpacity>
					</View>
					<Modal isVisible={this.state.isModalVisible} >
						<View style={{ backgroundColor: Color.white, borderRadius: 7, alignItems: 'center' }}>
							<ScrollView>
								<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
									<CalendarPicker
										width={responsiveWidth(90)}
										startFromMonday={true}
										todayTextStyle={{ color: '#00bfff' }}
										todayBackgroundColor="#FFF"
										selectedDayColor={Color.primary}
										selectedDayTextColor="#FFFFFF"
										todayTextColor="red"
										selectYearTitle={true}
										style={{ width: responsiveWidth(99) }}
										onDateChange={date => {
											selectedDay = Moment(date).format('YYYY-MM-DD');
										}}
										maxDate={new Date().setDate(new Date().getDate() + 90)}
										minDate={new Date()}
										nextTitleStyle={{color:Color.fontColor}}
										previousTitleStyle={{color:Color.fontColor}}
										yearTitleStyle={{color:Color.fontColor}}
										monthTitleStyle={{color:Color.fontColor}}
									/>
									<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(3), justifyContent: 'flex-end', width: '100%' }}>
										<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(6), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisible: false })}>
											<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel</Text>
										</TouchableOpacity>

										<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6), marginRight: 10 }} onPress={() => {
											this.clickOnDone();
										}}>
											<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Done </Text>
										</TouchableOpacity>
									</View>
								</View>
							</ScrollView>
						</View>
					</Modal>
				</View>
			</SafeAreaView >
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
)(TimeSlotTreatment);
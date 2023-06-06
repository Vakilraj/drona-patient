import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	Alert,
	StatusBar, Image, TextInput, TouchableOpacity, BackHandler, ScrollView, FlatList, Platform, KeyboardAvoidingView, Linking
} from 'react-native';
import styles from './style';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-native-modal';
import Moment from 'moment';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import down from '../../../assets/down.png';
import clinic_checked from '../../../assets/clinic_checked.png';
import clinic_unchecked from '../../../assets/clinic_timings_uncheck.png';
import deletefile from '../../../assets/deletefile.png';
import stepper from '../../../assets/stepperCheck.png';
import DatePicker from 'react-native-date-picker'
import Snackbar from 'react-native-snackbar';
var ts = require("time-slots-generator");
import Validator from '../../components/Validator';
let weekdayArr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let inClinicGuid = '', virtualGuid = '';
let consultationFeeInc = '', followUpFeeInc = '', followUpValidForInc = '0', isVirtualInclinicFeeSame = true;
let consultationFeeVir = '', followUpFeeVir = '', followUpValidForVir = '0', slotLengthFromArray = '';
let selectedStartTime = '', selectedEndTime = '', ClickOnParentIndex = 1, ClickOnSessionIndex = 0, startDatePicker = new Date(), endDatePicker = new Date();
let counter = -1, flag = false;
import Trace from '../../service/Trace'
let timeRange = '';

class ClinicSetupStep2 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fld1: Color.newBorder,
			genderGuid: true,
			dataArray: [],
			slotLength: '20',
			isModalVisibleStart: false,
			isModalVisibleEnd: false,
		};
		this.flatListRef = React.createRef(null);
		weekdayArr = [];
		counter = -1;
		flag = false;
		consultationFeeInc = ''; followUpFeeInc = ''; followUpValidForInc = '0'; isVirtualInclinicFeeSame = true;
		consultationFeeVir = ''; followUpFeeVir = ''; followUpValidForVir = '0'; slotLengthFromArray = '';
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'GetDoctorConsultationTimings') {
				let data = newProps.responseData.data;
				if (data) {
					try {
						let consultationTypes = data.consultationTypes;
						if (consultationTypes[0].consultationTypeName == 'In Clinic') {
							inClinicGuid = consultationTypes[0].consultationTypeGuid;
						}
						if (consultationTypes[1].consultationTypeName == 'Virtual') {
							virtualGuid = consultationTypes[1].consultationTypeGuid;
						}
						isVirtualInclinicFeeSame = data.isVirtualInclinicFeeSame;
						let tempArr = [''];
						let consultationTimeslots = data.consultationTimeslots; //null; //
						if (consultationTimeslots && consultationTimeslots.length > 0) {


							let obj0 = null
							let obj1 = null
							let obj2 = null
							let obj3 = null
							let obj4 = null
							let obj5 = null
							let obj6 = null

							let session0 = [];
							let session1 = [];
							let session2 = [];
							let session3 = [];
							let session4 = [];
							let session5 = [];
							let session6 = [];
							let orderByGroupNo0 = [], orderByGroupNo1 = [], orderByGroupNo2 = [], orderByGroupNo3 = [], orderByGroupNo4 = [], orderByGroupNo5 = [], orderByGroupNo6 = [];
							for (let i = 0; i < consultationTimeslots.length; i++) {
								let groupNo = consultationTimeslots[i].doctorSchedules[0].groupNo;
								if (groupNo == 0)
									orderByGroupNo0.push(consultationTimeslots[i]);
								else if (groupNo == 1)
									orderByGroupNo1.push(consultationTimeslots[i]);
								else if (groupNo == 2)
									orderByGroupNo2.push(consultationTimeslots[i]);
								else if (groupNo == 3)
									orderByGroupNo3.push(consultationTimeslots[i]);
								else if (groupNo == 4)
									orderByGroupNo4.push(consultationTimeslots[i]);
								else if (groupNo == 5)
									orderByGroupNo5.push(consultationTimeslots[i]);
								else if (groupNo == 6)
									orderByGroupNo6.push(consultationTimeslots[i]);
							}
							let tmpGrArr = []
							if (orderByGroupNo0 && orderByGroupNo0.length > 0)
								tmpGrArr = this.putData(tmpGrArr, orderByGroupNo0);
							if (orderByGroupNo1 && orderByGroupNo1.length > 0)
								tmpGrArr = this.putData(tmpGrArr, orderByGroupNo1);
							if (orderByGroupNo2 && orderByGroupNo2.length > 0)
								tmpGrArr = this.putData(tmpGrArr, orderByGroupNo2);
							if (orderByGroupNo3 && orderByGroupNo3.length > 0)
								tmpGrArr = this.putData(tmpGrArr, orderByGroupNo3);
							if (orderByGroupNo4 && orderByGroupNo4.length > 0)
								tmpGrArr = this.putData(tmpGrArr, orderByGroupNo4);
							if (orderByGroupNo5 && orderByGroupNo5.length > 0)
								tmpGrArr = this.putData(tmpGrArr, orderByGroupNo5);
							if (orderByGroupNo6 && orderByGroupNo6.length > 0)
								tmpGrArr = this.putData(tmpGrArr, orderByGroupNo6);

							consultationTimeslots = _.orderBy(tmpGrArr, ['timeSlotGroupNo'], ['asc']);
							for (let i = 0; i < consultationTimeslots.length; i++) {

								let groupNo = consultationTimeslots[i].doctorSchedules[0].groupNo;
								let checkInOutTime = { checkInTime: consultationTimeslots[i].doctorSchedules[0].checkInTime, checkOutTime: consultationTimeslots[i].doctorSchedules[0].checkOutTime }
								if (groupNo == 0) {
									if (!obj0)
										obj0 = this.getDays(consultationTimeslots[i].doctorSchedules);

									session0 = this.getTimeSlots(session0, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 1) {
									if (!obj1)
										obj1 = this.getDays(consultationTimeslots[i].doctorSchedules);

									session1 = this.getTimeSlots(session1, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 2) {
									if (!obj2)
										obj2 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session2 = this.getTimeSlots(session2, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 3) {
									if (!obj3)
										obj3 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session3 = this.getTimeSlots(session3, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 4) {
									if (!obj4)
										obj4 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session4 = this.getTimeSlots(session4, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 5) {
									if (!obj5)
										obj5 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session5 = this.getTimeSlots(session5, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 6) {
									if (!obj6)
										obj6 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session6 = this.getTimeSlots(session6, consultationTimeslots[i], checkInOutTime);
								}

								try {
									if (!consultationFeeInc) {
										if (consultationTimeslots[i].consultationTypeGuid == inClinicGuid) {
											consultationFeeInc = consultationTimeslots[i].consultationFee;
											followUpFeeInc = consultationTimeslots[i].followUpFee;
											followUpValidForInc = consultationTimeslots[i].followUpValidFor;
										}
									}
									if (!consultationFeeVir) {
										if (consultationTimeslots[i].consultationTypeGuid == virtualGuid) {
											consultationFeeVir = consultationTimeslots[i].consultationFee;
											followUpFeeVir = consultationTimeslots[i].followUpFee;
											followUpValidForVir = consultationTimeslots[i].followUpValidFor;
										}
									}
									if (!slotLengthFromArray) {
										slotLengthFromArray = consultationTimeslots[i].slotDuration;
									}
								} catch (e) { }
							}

							if (obj0)
								tempArr.push({ doctorSchedules: obj0, session: session0 });

							if (obj1)
								tempArr.push({ doctorSchedules: obj1, session: session1 });
							if (obj2)
								tempArr.push({ doctorSchedules: obj2, session: session2 });
							if (obj3)
								tempArr.push({ doctorSchedules: obj3, session: session3 });
							if (obj4)
								tempArr.push({ doctorSchedules: obj4, session: session4 });
							if (obj5)
								tempArr.push({ doctorSchedules: obj5, session: session5 });
							if (obj6)
								tempArr.push({ doctorSchedules: obj6, session: session6 });
							this.setState({ dataArray: tempArr, slotLength: slotLengthFromArray + '' });
							if (this.props.navigation.state.params.from == 'editFees') {
								setTimeout(() => {
									this.saveAndContinue();
								}, 1000)


							}
						} else {
							tempArr.push({
								"doctorSchedules": [
									{ "dayEnum": "Mon", "isOpen": true }, { "dayEnum": "Tue", "isOpen": true }, { "dayEnum": "Wed", "isOpen": true },
									{ "dayEnum": "Thu", "isOpen": true }, { "dayEnum": "Fri", "isOpen": true }, { "dayEnum": "Sat", "isOpen": true },
									{ "dayEnum": "Sun", "isOpen": false }],
								"session": [{
									"timeSlotGroupNumber": 1,
									"errorMsg": '',
									"daySlots": { "checkInTime": "10:00 AM", "checkOutTime": "1:00 PM" },
									"consultationType": [{ timeSlotGuid: "", consultationTypeGuid: inClinicGuid, startDate: null, endDate: null, "label": "In-Clinic", "isOpen": true, "isDisabled": false },
									{ timeSlotGuid: "", consultationTypeGuid: virtualGuid, startDate: null, endDate: null, "label": "Virtual", "isOpen": true, "isDisabled": false }
									]
								},
								{
									"timeSlotGroupNumber": 2,
									"errorMsg": '',
									"daySlots": { "checkInTime": "6:00 PM", "checkOutTime": "9:00 PM" },
									"consultationType": [{ timeSlotGuid: "", consultationTypeGuid: inClinicGuid, startDate: null, endDate: null, "label": "In-Clinic", "isOpen": true, "isDisabled": false },
									{ timeSlotGuid: "", consultationTypeGuid: virtualGuid, startDate: null, endDate: null, "label": "Virtual", "isOpen": true, "isDisabled": false }
									]
								}
								]
							})
							weekdayArr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
							this.setState({ dataArray: tempArr });

						}


					} catch (e) { }
				}
			}
		}
	}
	putData = (orgArr, tmpArr) => {
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				orgArr.push(tmpArr[i]);
			}
		}
		return orgArr;
	}
	getDays = (tmpArr) => {
		let tmp = [{ doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Mon', isOpen: false },
		{ doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Tue', isOpen: false },
		{ doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Wed', isOpen: false },
		{ doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Thu', isOpen: false },
		{ doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Fri', isOpen: false },
		{ doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Sat', isOpen: false },
		{ doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Sun', isOpen: false },]
		if (tmpArr && tmpArr.length > 0) {

			for (let i = 0; i < tmpArr.length; i++) {
				if (tmpArr[i].dayEnum == 'Mon' || tmpArr[i].dayEnum == 'MON') {
					tmp[0].isOpen = true;
				} else if (tmpArr[i].dayEnum == 'Tue') {
					tmp[1].isOpen = true;
				} else if (tmpArr[i].dayEnum == 'Wed') {
					tmp[2].isOpen = true;
				} else if (tmpArr[i].dayEnum == 'Thu') {
					tmp[3].isOpen = true;
				} else if (tmpArr[i].dayEnum == 'Fri') {
					tmp[4].isOpen = true;
				} else if (tmpArr[i].dayEnum == 'Sat') {
					tmp[5].isOpen = true;
				} else if (tmpArr[i].dayEnum == 'Sun') {
					tmp[6].isOpen = true;
				}
				if (!weekdayArr.includes(tmpArr[i].dayEnum)) {
					weekdayArr.push(tmpArr[i].dayEnum)
				}
			}
		}
		return tmp;
	}
	getTimeSlots = (tempSession, tmpObj, checkInOutTime) => {
		flag = false;
		let timeSlotGroupNo = tmpObj.timeSlotGroupNo;
		if (timeSlotGroupNo == 0) {
			flag = true;
		}
		if (tempSession && tempSession.length > 0) {
			var check_orders = tempSession.filter(order => (order.timeSlotGroupNumber == timeSlotGroupNo));
			if (check_orders && check_orders.length == 0) {
				tempSession.push({
					"timeSlotGroupNumber": timeSlotGroupNo,
					"errorMsg": '',
					"daySlots": checkInOutTime,
					"consultationType":
						[{ timeSlotGuid: "", consultationTypeGuid: inClinicGuid, startDate: null, endDate: "", "label": "In-Clinic", "isOpen": false, "isDisabled": false },
						{ timeSlotGuid: "", consultationTypeGuid: virtualGuid, startDate: null, endDate: "", "label": "Virtual", "isOpen": false, "isDisabled": false }
						]
				})
			}
		} else {
			tempSession.push({
				"timeSlotGroupNumber": timeSlotGroupNo,
				"errorMsg": '',
				"daySlots": checkInOutTime,
				"consultationType":
					[{ timeSlotGuid: "", consultationTypeGuid: inClinicGuid, startDate: null, endDate: "", "label": "In-Clinic", "isOpen": false, "isDisabled": false },
					{ timeSlotGuid: "", consultationTypeGuid: virtualGuid, startDate: null, endDate: "", "label": "Virtual", "isOpen": false, "isDisabled": false }
					]
			})
		}
		try {
			if (tmpObj.consultationTypeGuid == inClinicGuid) {
				tempSession[flag ? timeSlotGroupNo : timeSlotGroupNo - 1].consultationType[0].isOpen = true;
				tempSession[flag ? timeSlotGroupNo : timeSlotGroupNo - 1].consultationType[0].timeSlotGuid = tmpObj.timeSlotGuid;
				tempSession[flag ? timeSlotGroupNo : timeSlotGroupNo - 1].consultationType[0].consultationTypeGuid = tmpObj.consultationTypeGuid;
			} else {
				tempSession[flag ? timeSlotGroupNo : timeSlotGroupNo - 1].consultationType[1].isOpen = true;
				tempSession[flag ? timeSlotGroupNo : timeSlotGroupNo - 1].consultationType[1].timeSlotGuid = tmpObj.timeSlotGuid;
				tempSession[flag ? timeSlotGroupNo : timeSlotGroupNo - 1].consultationType[1].consultationTypeGuid = tmpObj.consultationTypeGuid;
			}
		} catch (e) { }


		return tempSession;
	}
	addAnotherSession = (index) => {
		let tmpArr = [...this.state.dataArray];
		let session = tmpArr[index].session;
		session.push({
			"timeSlotGroupNumber": session.length + 1,
			"errorMsg": '',
			"daySlots": { checkInTime: "06:00 PM", checkOutTime: "09:00 PM" },
			"consultationType":
				[{ timeSlotGuid: "", consultationTypeGuid: inClinicGuid, startDate: null, endDate: null, "label": "In-Clinic", "isOpen": true, "isDisabled": false },
				{ timeSlotGuid: "", consultationTypeGuid: virtualGuid, startDate: null, endDate: null, "label": "Virtual", "isOpen": false, "isDisabled": false }
				]
		})
		tmpArr[index].session = session;
		this.setState({ dataArray: tmpArr });
	}
	addAnotherDays = () => {
		let tmpArr = [...this.state.dataArray];
		tmpArr.push({
			"doctorSchedules": [
				{ "dayEnum": "Mon", "isOpen": false }, { "dayEnum": "Tue", "isOpen": false }, { "dayEnum": "Wed", "isOpen": false },
				{ "dayEnum": "Thu", "isOpen": false }, { "dayEnum": "Fri", "isOpen": false }, { "dayEnum": "Sat", "isOpen": false },
				{ "dayEnum": "Sun", "isOpen": false }],
			"session": [{
				"timeSlotGroupNumber": 1,
				"errorMsg": '',
				"daySlots": { "checkInTime": "06:00 AM", "checkOutTime": "01:00 PM" },
				"consultationType": [{ timeSlotGuid: "", consultationTypeGuid: inClinicGuid, startDate: null, endDate: null, "label": "In-Clinic", "isOpen": true, "isDisabled": false },
				{ timeSlotGuid: "", consultationTypeGuid: virtualGuid, startDate: null, endDate: null, "label": "Virtual", "isOpen": false, "isDisabled": false }
				]
			}
			]
		});
		this.setState({ dataArray: tmpArr });
		setTimeout(() => {
			this.flatListRef.scrollToOffset({ animated: true, offset: 5000 });
		}, 500)
	}
	async componentDidMount() {

		let { actions, signupDetails } = this.props;
		timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +'Consultation_Timing_Setup', signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Consultation_Timing_Setup", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
		let params = {
			"RoleCode": signupDetails.roleCode ? signupDetails.roleCode : 10,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,//DRONA.getClinicGuid()
			"DoctorGuid": signupDetails.doctorGuid,
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToGetDoctorConsultationTimings', 'post', params, signupDetails.accessToken, 'GetDoctorConsultationTimings');
		this.backHandler = BackHandler.addEventListener('hardwareBackPress',
			() => this.props.navigation.goBack())
	}

	callOnBlur = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.inputdefaultBorder })
		}
	}
	deleteSession = (index, parentIndex) => {
		let tmpArr = [...this.state.dataArray];
		let session = tmpArr[parentIndex].session;
		session.splice(index, 1);
		for (let i = 0; i < session.length; i++) {
			session[i].timeSlotGroupNumber = i + 1;
		}
		tmpArr[parentIndex].session = session;
		this.setState({ dataArray: tmpArr });

	}
	updateInclinic = (item, index, parentIndex) => {
		let tmpArr = [...this.state.dataArray];
		let session = tmpArr[parentIndex].session;
		session[index].consultationType[0].isOpen = !session[index].consultationType[0].isOpen;
		tmpArr[parentIndex].session = session;
		this.setState({ dataArray: tmpArr });
	}
	updateVirtual = (item, index, parentIndex) => {
		let tmpArr = [...this.state.dataArray];
		let session = tmpArr[parentIndex].session;
		session[index].consultationType[1].isOpen = !session[index].consultationType[1].isOpen;
		tmpArr[parentIndex].session = session;
		this.setState({ dataArray: tmpArr });
	}
	deleteDaysAndTimeSlots = (index) => {
		if (this.state.dataArray.length > 2) {
			let tmpArr = [...this.state.dataArray];
			let indexArray = tmpArr[index].doctorSchedules;
			tmpArr.splice(index, 1);
			this.setState({ dataArray: tmpArr })
			if (indexArray && indexArray.length > 0) {
				for (let i = 0; i < indexArray.length; i++) {
					if (indexArray[i].isOpen) {
						const deleteIndex = weekdayArr.indexOf(indexArray[i].dayEnum);
						if (deleteIndex > -1) {
							weekdayArr.splice(deleteIndex, 1);
						}
					}
				}
			}
		} else {
			Snackbar.show({ text: 'Atleast one days grid should remain', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}

	}
	getUpdateTimeSlot = (dateArray, dateObj) => {
		let tempArr = [];
		let index = 0;
		for (let i = 0; i < dateArray.length; i++) {
			if (dateArray[i].isOpen) {
				tempArr.push(dateArray[i]);
				tempArr[index].checkInTime = dateObj.checkInTime;
				tempArr[index].checkOutTime = dateObj.checkOutTime;
				index++;
			}
		}
		return tempArr;
	}

	saveAndContinue = async () => {
		Trace.stopTrace()
		let tmpArr = [...this.state.dataArray];
		tmpArr.splice(0, 1);
		let finalArr = []
		let isDaySelected = false;
		for (let i = 0; i < tmpArr.length; i++) {
			let dayArr = [];
			for (let k = 0; k < tmpArr[i].doctorSchedules.length; k++) {
				if (tmpArr[i].doctorSchedules[k].isOpen)
					dayArr.push(tmpArr[i].doctorSchedules[k]);
			}
			if (dayArr.length > 0)
				isDaySelected = true;

			//console.log('e---'+JSON.stringify(dayArr))

			for (let j = 0; j < tmpArr[i].session.length; j++) {
				let consultationType0 = tmpArr[i].session[j].consultationType[0];
				let consultationType1 = tmpArr[i].session[j].consultationType[1];
				//let timeSlotGroupNumber = tmpArr[i].session[j].timeSlotGroupNumber;
				let daySlots = tmpArr[i].session[j].daySlots;

				let UpdatedDayArray = [];
				for (let r = 0; r < dayArr.length; r++) {
					var obj = { doctorScheduleGuid: "", dayEnumGuid: "", groupNo: i + 1, checkInTime: daySlots.checkInTime, checkOutTime: daySlots.checkOutTime, dayEnum: dayArr[r].dayEnum, isOpen: dayArr[r].isOpen };

					UpdatedDayArray.push(obj);
				}

				if (consultationType0.isOpen) {
					finalArr.push({
						timeSlotGuid: consultationType0.timeSlotGuid,
						consultationTypeGuid: consultationType0.consultationTypeGuid,
						startDate: null,
						endDate: null,
						slotDuration: this.state.slotLength,
						consultationFee: consultationFeeInc,
						followUpFee: followUpFeeInc,
						followUpValidFor: followUpValidForInc,
						timeSlotGroupNo: j + 1,  //timeSlotGroupNumber
						doctorSchedules: UpdatedDayArray
					})
				}
				if (consultationType1.isOpen) {
					finalArr.push({
						timeSlotGuid: consultationType1.timeSlotGuid,
						consultationTypeGuid: consultationType1.consultationTypeGuid,
						startDate: null,
						endDate: null,
						slotDuration: this.state.slotLength,
						consultationFee: consultationFeeVir,
						followUpFee: followUpFeeVir,
						followUpValidFor: followUpValidForVir,
						timeSlotGroupNo: j + 1,  //timeSlotGroupNumber
						doctorSchedules: UpdatedDayArray
					})
				}

			}
		}
		let { actions, signupDetails, loading } = this.props;
		let objParams = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,//DRONA.getClinicGuid()
			"DoctorGuid": signupDetails.doctorGuid,
			"data": {
				"editConsent": false,
				"isVirtualInclinicFeeSame": isVirtualInclinicFeeSame,
				"consultationTypes": [
					{
						"consultationTypeGuid": inClinicGuid,
						"consultationTypeName": "In-Clinic"
					},
					{
						"consultationTypeGuid": virtualGuid,
						"consultationTypeName": "Virtual"
					}
				],
				"consultationTimeslots": finalArr
			}
		}
		console.log('---------' + JSON.stringify(finalArr))
		//console.log('-----+++tmpArr----' + JSON.stringify(tmpArr))
		let isAllTimeSlotAreCorrect = true;
		let dynamicMsg = '';
		try {
			for (let i = 0; i < tmpArr.length; i++) {
				let existingTime = []
				for (let j = 0; j < tmpArr[i].session.length; j++) {
					let daySlots = tmpArr[i].session[j].daySlots;

					let isOpenInClinic = tmpArr[i].session[j].consultationType[0].isOpen;
					let isOpenVirtual = tmpArr[i].session[j].consultationType[1].isOpen;
					if (!isOpenInClinic && !isOpenVirtual) {
						let slotmsg= j == 0 ? 'Morning Session' : j == 1 ? 'Evening Session' : 'time slot '+daySlots.checkInTime + ' - ' + daySlots.checkOutTime;
						dynamicMsg = 'Please select atleast Virtual or in-Clinic for ' +  slotmsg;
						isAllTimeSlotAreCorrect = false;
						break;
					}
					let chkIn = Moment(daySlots.checkInTime, ["h:mm A"]).format("HH:mm")
					let chkOut = Moment(daySlots.checkOutTime, ["h:mm A"]).format("HH:mm")
					let str = chkIn.split(':');
					chkIn = str[0] * 60 + parseInt(str[1]);

					let str2 = chkOut.split(':');
					chkOut = str2[0] * 60 + parseInt(str2[1]);
					if (chkOut > chkIn) {
						//existingTime.push([chkIn, chkOut]);
						let n = ts.getTimeSlots(existingTime, false, "fifth", false, false);
						if (isAllTimeSlotAreCorrect)
							for (let k = chkIn; k < chkOut; k += 10) {
								if (n.includes(k)) {
									continue;
								} else {

									//dynamicMsg = daySlots.checkInTime + ' - ' + daySlots.checkOutTime + ' time slot not available .';
									dynamicMsg = 'Selected time slot is conflicting with other time slot.';
									isAllTimeSlotAreCorrect = false;
									break;
								}
							}
						existingTime.push([chkIn, chkOut]);
					} else {
						isAllTimeSlotAreCorrect = false;
						dynamicMsg = 'End time should be greater than start time';
						// tmpArr[i].session[j].errorMsg = 'End time should be greater than start time'
						// tmpArr.splice(0, 0, '');
						// this.setState({ dataArray: tmpArr });
					}


				}
			}
		} catch (error) {
		}


		if (!isDaySelected) {
			Snackbar.show({ text: 'Please select any day', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (finalArr.length == 0) {
			Snackbar.show({ text: 'Please select consultation type', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.slotLength || this.state.slotLength == 0) {
			Snackbar.show({ text: 'Please enter slots duration', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!isAllTimeSlotAreCorrect) {
			Snackbar.show({ text: dynamicMsg, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else {
			this.props.navigation.navigate('ClinicSetupStep3', {
				objParams: objParams, consultationFeeInc: consultationFeeInc, followUpFeeInc: followUpFeeInc, followUpValidForInc: followUpValidForInc,
				consultationFeeVir: consultationFeeVir, followUpFeeVir: followUpFeeVir, followUpValidForVir: followUpValidForVir, isVirtualInclinicFeeSame: isVirtualInclinicFeeSame,
				inClinicGuid: inClinicGuid, virtualGuid: virtualGuid,
				from: this.props.navigation.state.params.from
			});
		}


	}
	setFromTime = () => {
		counter++;
		if (!selectedStartTime) {
			selectedStartTime = startDatePicker;
		}
		let tmpArr = [...this.state.dataArray];
		// if (counter % 2 == 1 && selectedEndTime) {
		// 	let startTimeInMin = selectedStartTime.getHours() * 60 + selectedStartTime.getMinutes();
		// 	let endTimeInMin = selectedEndTime.getHours() * 60 + selectedEndTime.getMinutes();
		// 	if (endTimeInMin > startTimeInMin) {

		// 		const sratrTime = Moment(selectedStartTime.getHours() + '.' + selectedStartTime.getMinutes(), ["HH.mm"]).format("hh:mm A");
		// 		let tmpArr = [...this.state.dataArray];
		// 		let session = tmpArr[ClickOnParentIndex].session;
		// 		session[ClickOnSessionIndex].daySlots.checkInTime = sratrTime;
		// 		tmpArr[ClickOnParentIndex].session = session;
		// 		this.setState({ dataArray: tmpArr, isModalVisibleStart: false });
		// 	} else {
		// 		counter--;
		// 		Snackbar.show({ text: 'End time should be greater than start time ', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		// 	}
		// } else {
		const sratrTime = Moment(selectedStartTime.getHours() + '.' + selectedStartTime.getMinutes(), ["HH.mm"]).format("hh:mm A");
		//let tmpArr = [...this.state.dataArray];
		let session = tmpArr[ClickOnParentIndex].session;
		session[ClickOnSessionIndex].daySlots.checkInTime = sratrTime;
		tmpArr[ClickOnParentIndex].session = session;
		this.setState({ dataArray: tmpArr, isModalVisibleStart: false });
		//}


	}
	setEndTime = () => {
		counter++;
		if (!selectedEndTime) {
			selectedEndTime = endDatePicker;
		}
		let tmpArr = [...this.state.dataArray];
		// if (counter % 2 == 1 && selectedStartTime) {
		// 	let startTimeInMin = selectedStartTime.getHours() * 60 + selectedStartTime.getMinutes();
		// 	let endTimeInMin = selectedEndTime.getHours() * 60 + selectedEndTime.getMinutes();
		// 	if (endTimeInMin > startTimeInMin) {

		// 		const endTime = Moment(selectedEndTime.getHours() + '.' + selectedEndTime.getMinutes(), ["HH.mm"]).format("hh:mm A");

		// 		let session = tmpArr[ClickOnParentIndex].session;
		// 		session[ClickOnSessionIndex].daySlots.checkOutTime = endTime;
		// 		tmpArr[ClickOnParentIndex].session = session;
		// 		this.setState({ dataArray: tmpArr, isModalVisibleEnd: false });
		// 	} else {
		// 		Snackbar.show({ text: 'End time should be greater than start time ', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		// 		counter--;
		// 	}
		// } else {
		const endTime = Moment(selectedEndTime.getHours() + '.' + selectedEndTime.getMinutes(), ["HH.mm"]).format("hh:mm A");
		let session = tmpArr[ClickOnParentIndex].session;
		session[ClickOnSessionIndex].daySlots.checkOutTime = endTime;
		tmpArr[ClickOnParentIndex].session = session;
		this.setState({ dataArray: tmpArr, isModalVisibleEnd: false });
		//}
	}
	getStartdate = (val) => {
		selectedStartTime = val;
	}
	getEnddate = (val) => {
		selectedEndTime = val;


	}
	daySelectDeselect = (index, parentIndex, item) => {
		if (weekdayArr.includes(item.dayEnum)) {
			if (item.isOpen) {
				let doctorSchedules = this.state.dataArray[parentIndex].doctorSchedules;
				doctorSchedules[index].isOpen = !doctorSchedules[index].isOpen;
				this.setState({ dataArray: this.state.dataArray });
				const deleteIndex = weekdayArr.indexOf(item.dayEnum);
				if (deleteIndex > -1) {
					weekdayArr.splice(deleteIndex, 1);
				}
			}
		} else {
			let doctorSchedules = this.state.dataArray[parentIndex].doctorSchedules;
			doctorSchedules[index].isOpen = !doctorSchedules[index].isOpen;
			this.setState({ dataArray: this.state.dataArray });
			weekdayArr.push(item.dayEnum)
		}



		// let doctorSchedules = this.state.dataArray[parentIndex].doctorSchedules;
		// doctorSchedules[index].isOpen = !doctorSchedules[index].isOpen;
		// this.setState({ dataArray: this.state.dataArray });
		// //alert(parentIndex)
		// if (weekdayArr.includes(item.dayEnum)) {
		// 	const deleteIndex = weekdayArr.indexOf(item.dayEnum);
		// 	if (deleteIndex > -1) {
		// 		weekdayArr.splice(deleteIndex, 1);
		// 	}
		// } else {
		// 	weekdayArr.push(item.dayEnum)
		// }
	}
	renderListHeader = ({ item, index }, parentIndex) => (
		<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: item.isOpen ? Color.liveBg : Color.createInputBorder, borderWidth: 1.5, borderRadius: 4, backgroundColor: item.isOpen ? Color.genderSelection : Color.white, marginEnd: 5, width: responsiveWidth(12) }}
			onPress={() => {
				this.daySelectDeselect(index, parentIndex, item)

			}}>
			<Text style={{ color: Color.optiontext, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500 }}>{item.dayEnum}</Text>
		</TouchableOpacity>
	);
	renderListSession = ({ item, index }, parentIndex) => (
		<View style={{ backgroundColor: '#f9f8f8', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2), borderRadius: 6 }}>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<Text style={{ color: Color.fontColor, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight500, marginTop: 10, marginLeft: 10 }}>{index == 0 ? 'Morning Session' : index == 1 ? 'Evening Session' : 'Other Session'}</Text>
				<TouchableOpacity onPress={() => this.deleteSession(index, parentIndex)}>
					<Image source={deletefile} style={{ height: responsiveFontSize(3.5), width: responsiveFontSize(3.5), resizeMode: 'contain', margin: 5 }} />
				</TouchableOpacity>

			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
				<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: Color.inputdefaultBorder, borderWidth: 1, borderRadius: 6, backgroundColor: Color.white, marginLeft: 10, flexDirection: 'row' }}
					onPress={() => {
						let startTime = item.daySlots.checkInTime;
						let hrs = Moment(startTime, ["h:mm A"]).format("HH");
						let mins = Moment(startTime, ["h:mm A"]).format("mm")

						selectedStartTime = '';
						ClickOnParentIndex = parentIndex;
						ClickOnSessionIndex = index;

						startDatePicker.setHours(hrs);
						startDatePicker.setMinutes(mins);

						// if (index == 0) {
						// 	startDatePicker.setHours(10);
						// 	startDatePicker.setMinutes(0);
						// } else if (index == 1) {
						// 	startDatePicker.setHours(18);
						// 	startDatePicker.setMinutes(0);
						// } else {
						// 	startDatePicker.setHours(6);
						// 	startDatePicker.setMinutes(0);
						// }

						this.setState({ isModalVisibleStart: true })
					}}>
					<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500 }}>{item.daySlots.checkInTime}</Text>
					<Image source={down} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginLeft: responsiveWidth(3) }} />
				</TouchableOpacity>

				<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500, marginLeft: 10, marginRight: 10 }}>to</Text>

				<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: Color.inputdefaultBorder, borderWidth: 1, borderRadius: 6, backgroundColor: Color.white, marginRight: 10, flexDirection: 'row' }}
					onPress={() => {
						let endTime = item.daySlots.checkOutTime;
						let hrs = Moment(endTime, ["h:mm A"]).format("HH");
						let mins = Moment(endTime, ["h:mm A"]).format("mm")
						endDatePicker.setHours(hrs);
						endDatePicker.setMinutes(mins);

						ClickOnParentIndex = parentIndex;
						ClickOnSessionIndex = index;
						selectedEndTime = '';

						// if (index == 0) {
						// 	endDatePicker.setHours(13);
						// 	endDatePicker.setMinutes(0);
						// } else if (index == 1) {
						// 	endDatePicker.setHours(21);
						// 	endDatePicker.setMinutes(0);
						// } else {
						// 	endDatePicker.setHours(9);
						// 	endDatePicker.setMinutes(0);
						// }
						this.setState({ isModalVisibleEnd: true })
					}}>
					<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500 }}>{item.daySlots.checkOutTime}</Text>
					<Image source={down} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginLeft: responsiveWidth(3) }} />
				</TouchableOpacity>
			</View>

			<Text style={{ color: Color.red, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500, marginLeft: 10, }}>{item.errorMsg}</Text>
			<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500, marginLeft: 10, margin: responsiveHeight(3) }}>Consultation Type Allowed in {index == 0 ? 'Morning Session' : index == 1 ? 'Evening Session' : 'Other Session'}</Text>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 10, marginBottom: 20 }}>
				<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: item.consultationType[0].isOpen ? Color.liveBg : Color.createInputBorder, borderWidth: 1, borderRadius: 4, backgroundColor: item.consultationType[0].isOpen ? Color.genderSelection : Color.white, marginRight: 10, flexDirection: 'row' }}
					onPress={() => this.updateInclinic(item, index, parentIndex)}>
					<Image source={item.consultationType[0].isOpen ? clinic_checked : clinic_unchecked} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), marginRight: 15,resizeMode: 'contain' }} />
					<Text style={{ color: Color.optiontext, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500 }}>{item.consultationType[0].label}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: item.consultationType[1].isOpen ? Color.liveBg : Color.createInputBorder, borderWidth: 1, borderRadius: 4, backgroundColor: item.consultationType[1].isOpen ? Color.genderSelection : Color.white, marginLeft: 10, flexDirection: 'row' }}
					onPress={() => this.updateVirtual(item, index, parentIndex)}>
					<Image source={item.consultationType[1].isOpen ? clinic_checked : clinic_unchecked} style={{ height: responsiveFontSize(2.6), width: responsiveFontSize(2.6), marginRight: 15, resizeMode: 'contain' }} />
					<Text style={{ color: Color.optiontext, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500 }}>{item.consultationType[1].label}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
	renderList = ({ item, index }) => (
		<View>
			{index == 0 ? <View style={{ backgroundColor: Color.white, margin: responsiveWidth(2), borderRadius: 7 }}>
				<Text style={{ fontWeight: '700', fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: responsiveWidth(4), marginTop: responsiveHeight(3) }}>Slot Duration</Text>
				<TextInput returnKeyType="done"
					maxLength={2}
					onBlur={() => this.callOnBlur('1')}
					placeholderTextColor={Color.placeHolderColor}
					style={[styles.createInputStyle, { borderColor: this.state.fld1, margin: responsiveWidth(3) }]} placeholder="Enter Duration" onChangeText={slotLength => {
						if (!slotLength || Validator.isMobileValidate(slotLength))
							this.setState({ slotLength })

					}} value={this.state.slotLength} onFocus={() => this.setState({ fld1: Color.primary })} />
			</View> : <View style={{ backgroundColor: Color.white, margin: responsiveWidth(2), borderRadius: 7 }}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={{ fontWeight: '700', fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: responsiveWidth(3), marginTop: responsiveHeight(3) }}>Days</Text>
					<TouchableOpacity onPress={() => this.deleteDaysAndTimeSlots(index)}>
						<Text style={{ fontWeight: '700', fontSize: CustomFont.font14, color: Color.primary, marginRight: responsiveWidth(3), marginTop: responsiveHeight(3) }}>Remove Timings</Text>
					</TouchableOpacity>

				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(3.5), marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2) }}>
					<FlatList
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						data={item.doctorSchedules}
						renderItem={
							(childData) => this.renderListHeader(childData, index)
						}
						//renderItem={this.renderListHeader}

						//contentContainerStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden' }}
						extraData={this.state}
						keyExtractor={(item, index) => index.toString()}
					/>

				</View>
				<Text style={{ fontWeight: '700', fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: responsiveWidth(3), marginTop: responsiveHeight(4) }}>Sessions</Text>

				<FlatList
					data={item.session}
					renderItem={
						(childData) => this.renderListSession(childData, index)
					}
					// renderItem={({ item, index }) => (

					// )}
					extraData={this.state}
					keyExtractor={(item, index) => index.toString()}
				/>



				<TouchableOpacity onPress={() => this.addAnotherSession(index)}>
					<Text style={{ fontWeight: '700', fontSize: CustomFont.font14, color: Color.primary, marginLeft: 10, marginBottom: 10, marginTop: 10 }}>Add Another Session</Text>
				</TouchableOpacity>
				<Text style={{ height: 1.5, backgroundColor: Color.previewSigntaurebg, marginLeft: 10, marginRight: 10, marginTop: 7, marginBottom: responsiveHeight(4) }} />
				<TouchableOpacity style={{ height: responsiveHeight(6), justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: Color.addAppointmentBackground, marginLeft: 10, marginRight: 10, marginBottom: responsiveHeight(4) }}
					onPress={() => this.addAnotherDays()}>
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.primary, }}>Add More Days & Sessions</Text>
				</TouchableOpacity>
			</View>}
		</View>

	);
	render() {
		let { actions, signupDetails } = this.props;
		let from = this.props.navigation.state.params.from;
		return (
			<SafeAreaView style={[CommonStyle.container, { backgroundColor: Color.newBgColor }]}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flexDirection: 'row', backgroundColor: Color.white, height: responsiveHeight(6), alignItems: 'center', zIndex: 999, justifyContent: 'space-between' }}>
					<TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() =>{
						Trace.stopTrace();
						this.props.navigation.goBack();
					} }>
						<Image source={arrowBack} style={{ height: responsiveWidth(4), width: responsiveWidth(5), tintColor: Color.primary }} />
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginLeft: responsiveWidth(3), fontWeight: Platform.OS == 'ios' ? CustomFont.fontWeight600 : '700' }}>{from == 'first' ? 'Consultation Timings' : 'Edit Clinic Details'} </Text>
					</TouchableOpacity>

				</View>
				{from == 'first' ? <View>
					<View style={{ flexDirection: 'row', backgroundColor: Color.white }}>
						<View style={{ width: responsiveWidth(8), height: responsiveWidth(8), backgroundColor: Color.progressBar, borderRadius: responsiveWidth(4), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(8) }}>
							<Image source={stepper} style={{ height: responsiveFontSize(1.6), width: responsiveFontSize(1.6), resizeMode: 'contain' }} />
						</View>
						<View style={{ flex: 4, justifyContent: 'center' }}>
							<View style={{ width: '100%', height: responsiveWidth(.2), backgroundColor: Color.progressBar }} />
						</View>
						<View style={{ width: responsiveWidth(8), height: responsiveWidth(8), backgroundColor: Color.primary, borderRadius: responsiveWidth(4), justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: Color.white, textAlign: 'center', fontSize: CustomFont.font16 }}>2</Text>
						</View>
						<View style={{ flex: 4, justifyContent: 'center' }}>
							<View style={{ width: '100%', height: responsiveWidth(.2), backgroundColor: '#CCC8CF' }} />
						</View>
						<View style={{ width: responsiveWidth(8), height: responsiveWidth(8), backgroundColor: '#CCC8CF', borderRadius: responsiveWidth(4), justifyContent: 'center', alignItems: 'center', marginRight: responsiveWidth(7) }}>
							<Text style={{ color: Color.white, textAlign: 'center', fontSize: CustomFont.font16 }}>3</Text>
						</View>
					</View>
					<View style={{ flexDirection: 'row', backgroundColor: Color.white, paddingTop: 5, paddingBottom: 15, justifyContent: 'space-between' }}>
						<Text style={{ color: '#CCC8CF', fontSize: CustomFont.font12, marginLeft: responsiveWidth(3) }}>Clinic Details</Text>
						<Text style={{ color: Color.primary, fontSize: CustomFont.font12 }}>Consultation Timings</Text>
						<Text style={{ color: '#CCC8CF', fontSize: CustomFont.font12, marginRight: responsiveWidth(8) }}>Fees</Text>
					</View>
				</View>
					: null}


				<View style={{ flex: 1 }}>


					<FlatList
						ref={(ref) => { this.flatListRef = ref; }}
						data={this.state.dataArray}
						//ItemSeparatorComponent={this.renderSeparator}
						renderItem={this.renderList}
						extraData={this.state}
						keyExtractor={(item, index) => index.toString()}
					/>
					{this.state.dataArray && this.state.dataArray.length == 1 ? <View style={{ backgroundColor: Color.white, alignItems: 'center' }}>
						<TouchableOpacity style={{ width: '93%', height: responsiveHeight(6), justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: Color.addAppointmentBackground, marginLeft: 10, marginRight: 10, marginBottom: responsiveHeight(4), marginTop: 20 }}
							onPress={() => this.addAnotherDays()}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.primary, }}>Add More Days & Sessions</Text>
						</TouchableOpacity>
					</View> : null}





				</View>
				<View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

					<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(1.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 10 }} onPress={() => {
						this.saveAndContinue();
					}}>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save & Continue</Text>
					</TouchableOpacity>
				</View>
				<Modal isVisible={this.state.isModalVisibleStart} onRequestClose={() => this.setState({ isModalVisibleStart: false })}>
					<View style={{ padding: 10, backgroundColor: Color.white, borderRadius: 7, alignItems: 'center' }}>
						<View style={{ width: responsiveWidth(85) }}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.fontColor, marginTop: 20 }}>Start Time</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', }}>
							<DatePicker
								date={startDatePicker}
								mode="time"
								onDateChange={this.getStartdate}
								minuteInterval={5}
								is24hourSource="locale"
							/>
						</View>
						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(1.4), justifyContent: 'flex-end', width: '100%' }}>
							<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisibleStart: false })}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
							</TouchableOpacity>

							<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6) }} onPress={() => {

								this.setFromTime()
							}}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>OK </Text>
							</TouchableOpacity>

						</View>
					</View>
				</Modal>
				<Modal isVisible={this.state.isModalVisibleEnd} onRequestClose={() => this.setState({ isModalVisibleEnd: false })}>
					<View style={{ padding: 10, backgroundColor: Color.white, borderRadius: 7, alignItems: 'center' }}>
						<View style={{ width: responsiveWidth(85) }}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.fontColor, marginTop: 20 }}>End Time</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', }}>
							<DatePicker
								date={endDatePicker}
								mode="time"
								onDateChange={this.getEnddate}
								minuteInterval={5}
								is24hourSource="locale"
							/>
						</View>
						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(1.4), justifyContent: 'flex-end', width: '100%' }}>
							<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisibleEnd: false })}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
							</TouchableOpacity>

							<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6) }} onPress={() => {

								this.setEndTime();
							}}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>OK </Text>
							</TouchableOpacity>

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
)(ClinicSetupStep2);

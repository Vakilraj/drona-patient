import Moment from 'moment';
import React from 'react';
import { TextInput, BackHandler, FlatList, Image, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import down from '../../../assets/down.png';
import Modal from 'react-native-modal';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import arrowBack from '../../../assets/back_blue.png';
import CalendarImge from '../../../assets/calender_icon.png';
import alertAdhoc from '../../../assets/alertAdhoc.png';
import cross from '../../../assets/cross_blue.png';
import morning from '../../../assets/morning.png';
import Color from '../../components/Colors';
import CommonStyle from '../../components/CommonStyle.js';
import CustomFont from '../../components/CustomFont';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import { setLogEvent } from '../../service/Analytics';
import DatePicker from 'react-native-date-picker'
import styles from './style.js'
var _ = require('lodash');
let currentDate = '';
let isReschedule = false;
let selectedDay = '';
let selectedDayForCalendar = '';
let inClinicAfternoon = [], inClinicEvening = [], inClinicMorning = [], virtualAfternoon = [], virtualEvening = [], virtualMorning = [];
let tempinClinicAfternoon = [], tempinClinicEvening = [], tempinClinicMorning = [], tempvirtualAfternoon = [], tempvirtualEvening = [], tempvirtualMorning = [];
let dateArr = [], selectedDayName = 'this day ', startDatePicker = new Date();
let dynamicMessageGlobal = '', dynamicMessageGlobalVirtual = '', selectedStartTime = '', selectedItem = null;


class AppoinmentTimesShow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clinicType: props.navigation.state.params && props.navigation.state.params.isVirtual ? 'Virtual' : 'InClinic',
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
			isModalVisibleAdhoc: false,
			fld1: Color.newBorder,
			fld2: Color.newBorder,
			fld3: Color.newBorder,
			fld4: Color.newBorder,
			fld5: Color.newBorder,
			selectedTime: '',
			isModalVisibleStart: false,
			addAnotherSlotVisible: true,
			showAlreadyExistMsg: false,
		};
		this.getCleanVariable();
		//alert(JSON.stringify(props.navigation.state.params.item))
	}



	getCleanVariable = () => {
		inClinicAfternoon = []; inClinicEvening = []; inClinicMorning = []; virtualAfternoon = []; virtualEvening = []; virtualMorning = [];
		tempinClinicAfternoon = []; tempinClinicEvening = []; tempinClinicMorning = []; tempvirtualAfternoon = []; tempvirtualEvening = []; tempvirtualMorning = [];
		selectedDay = '', selectedDayName = 'this day ';
		selectedDayForCalendar = '';
		selectedItem = null;
		dynamicMessageGlobal = ''; dynamicMessageGlobalVirtual = '';
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
	saveSlot = () => {
		let currTime = new Date();
		let getCurrentTime = Moment(currTime.getHours() + '.' + currTime.getMinutes(), ["HH.mm"]).format("hh:mm A");
		// alert("time: " + getCurrentTime);

		let randomSlotGuid = [];
		var ramdomstr = "ABCDEFGHIJKLMNOP32164QRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 32; i++) {
			randomSlotGuid += ramdomstr.charAt(Math.floor(Math.random() * ramdomstr.length));
		}
		const split_string = randomSlotGuid.split('');
		split_string.splice(8, 0, '-');
		split_string.splice(13, 0, '-');
		split_string.splice(18, 0, '-');
		split_string.splice(23, 0, '-');
		let temp = split_string.toString();
		let newRandomSlotGuid = temp.replace(/,/g, "")
		let newSelectedTime = this.state.selectedTime.toString();

		let setDayPeriod = '';

		var getHrs = newSelectedTime.split(' ');

		var getAMPM = getHrs[1];
		var getHours = getHrs[0].substring(0, 2);

		if (getAMPM == 'AM') {
			setDayPeriod = 'Morning';
		} else if (getAMPM == 'PM' && getHours > 5 && getHours != '12') {
			setDayPeriod = 'Evening';
		} else {
			setDayPeriod = 'Afternoon';
		}

		// this.state.dataArrayMorning.length > 0 ||

		if (selectedDay == Moment(new Date()).format('YYYY-MM-DD') && getCurrentTime > newSelectedTime) {
			Snackbar.show({ text: 'past time cant be select', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			selectedItem = {
				"availabilityGuid": newRandomSlotGuid,
				"timeSlotGuid": '',
				"availableTime": newSelectedTime,
				"dayPeriad": setDayPeriod,
				"endTime": "00:00 PM",
				"isAvailable": true,
				"isActive": true
			}
			if (setDayPeriod == 'Morning') {
				let flag = false;
				this.state.dataArrayMorning.map((value, index) => {
					if (value.availableTime == newSelectedTime) {
						flag = true;
					}
				})
				if (flag) {
					this.setState({ showAlreadyExistMsg: true });
				} else {
					this.state.dataArrayMorning.push(selectedItem);
					this.setState({ addAnotherSlotVisible: false, isModalVisibleAdhoc: false });
					const sorter1 = (a, b) => a.availableTime.toLowerCase() > b.availableTime.toLowerCase() ? 1 : -1;
					this.state.dataArrayMorning.sort(sorter1);
				}
			} else if (setDayPeriod == 'Afternoon') {
				let flag = false;
				this.state.dataArrayAfternoon.map((value, index) => {
					if (value.availableTime == newSelectedTime) {
						flag = true;
					}
				})
				if (flag) {
					this.setState({ showAlreadyExistMsg: true });
				} else {
					let temp12 = [], tempNormal = [];
					let tempArray = [...this.state.dataArrayAfternoon];
					if (tempArray && tempArray.length > 0) {
						for (let i = 0; i < tempArray.length; i++) {
							if (tempArray[i].availableTime.includes('12'))
								temp12.push(tempArray[i])
							else
								tempNormal.push(tempArray[i])
						}
						if (newSelectedTime.includes('12'))
							temp12.push(selectedItem);
						else
							tempNormal.push(selectedItem)
						const sorter1 = (a, b) => a.availableTime.toLowerCase() > b.availableTime.toLowerCase() ? 1 : -1;
						temp12.sort(sorter1);
						tempNormal.sort(sorter1);
						const children = temp12.concat(tempNormal);
						this.setState({ dataArrayAfternoon: children });
					} else {
						this.state.dataArrayAfternoon.push(selectedItem);
						const sorter1 = (a, b) => a.availableTime.toLowerCase() > b.availableTime.toLowerCase() ? 1 : -1;
						this.state.dataArrayAfternoon.sort(sorter1);
					}

					this.setState({ addAnotherSlotVisible: false, isModalVisibleAdhoc: false });
				}
			}
			else if (setDayPeriod == 'Evening') {
				let flag = false;
				this.state.dataArrayEvening.map((value, index) => {
					if (value.availableTime == newSelectedTime) {
						flag = true;
					}
				})
				if (flag) {
					this.setState({ showAlreadyExistMsg: true });
				} else {
					this.state.dataArrayEvening.push(selectedItem);
					this.setState({ addAnotherSlotVisible: false, isModalVisibleAdhoc: false });
					const sorter1 = (a, b) => a.availableTime.toLowerCase() > b.availableTime.toLowerCase() ? 1 : -1;
					this.state.dataArrayEvening.sort(sorter1);
				}

			}
		}
	}


	getStartdate = (val) => {
		// alert(val);
		//this.setState({ selectedTime: val });
		selectedStartTime = val;
	}

	setFromTime = () => {
		if (!selectedStartTime) {
			selectedStartTime = startDatePicker;
		}
		const setTimes = Moment(selectedStartTime.getHours() + '.' + selectedStartTime.getMinutes(), ["HH.mm"]).format("hh:mm A");
		this.setState({ selectedTime: setTimes, isModalVisibleStart: false });
	}

	async componentDidMount() {
		if (this.props.navigation.state.params.from == 'Reshedule') {
			isReschedule = true
		}
		//alert(Moment("2022-03-08 00:00:00.000000").format('DD MMM YYYY'))

		//var CurrentTime = Moment();
		//alert(slotTime)
		//var beginningTime = Moment('09:45am', 'hh:mma');
		// var endTime = Moment('09:00am', 'hh:mma');
		// alert(beginningTime.isBefore(endTime)); 
		//alert(Moment().isBefore(slotTime));
		//alert(beginningTime); 


		//alert(Moment('01:40 PM', 'hh:mm').subtract(30, 'minutes').format('LTS'));
		//alert(Moment('07:00 PM').isBetween('00:00:00', '07:03 PM'));
		// var duration = Moment.duration('07:00 PM');
		// 		alert(duration);
		let { actions, signupDetails } = this.props;
		//alert(signupDetails.serverDateTime);
		//currentDate = Moment(new Date()).format('YYYY-MM-DD');
		if (signupDetails.selectedDate) {
			if (signupDetails.selectedDate < Moment(new Date()).format('YYYY-MM-DD')) {
				currentDate = Moment(new Date()).format('YYYY-MM-DD');
				selectedDay = currentDate;
			} else {
				selectedDay = signupDetails.selectedDate
				if (signupDetails.serverDateTime)
					currentDate = signupDetails.serverDateTime;
				else
					currentDate = Moment(new Date()).format('YYYY-MM-DD');
			}
		} else if (signupDetails.serverDateTime)
			currentDate = signupDetails.serverDateTime; //Moment(new Date()).format('YYYY-MM-DD');
		else
			currentDate = Moment(new Date()).format('YYYY-MM-DD');
		if (!selectedDay)
			selectedDay = currentDate;
		selectedDayName = Moment(selectedDay).format('dddd');
		DRONA.setSelectedAppoinDate(selectedDay);
		//this.setState({ dateForUpdate: currentDate, showHeaderDate: showDate })
		this.callApi();
		// var today = new Date()
		// this.makeDateCalender(today, 0);
		//alert(increaseDate)
		this.makeDateCalender(selectedDay);

		this.setState({ selectedTime: Moment(new Date(), ["h:mm A"]).format("HH:mm A") })
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
	}
	makeDateCalender = (today) => {
		dateArr = [];
		// if (fromCalender == 0) {
		// 	//dateArr.push(Moment(today).format("ddd,DD MMM"));
		// 	dateArr.push(Moment(today).format("YYYY-MM-DD"));

		// 	var today1 = new Date()
		// 	var nextDay1 = new Date(today1.setDate(today1.getDate() + 1)).toString()
		// 	//	dateArr.push(Moment(today1).format("ddd,DD MMM"));
		// 	dateArr.push(Moment(today1).format("YYYY-MM-DD"));

		// 	var today2 = new Date()
		// 	var nextDay2 = new Date(today2.setDate(today2.getDate() + 2)).toString()
		// 	//dateArr.push(Moment(today2).format("ddd,DD MMM"));
		// 	dateArr.push(Moment(today2).format("YYYY-MM-DD"));

		// 	var today3 = new Date()
		// 	var nextDay3 = new Date(today3.setDate(today3.getDate() + 3)).toString()
		// 	//dateArr.push(Moment(today3).format("ddd,DD MMM"));
		// 	dateArr.push(Moment(today3).format("YYYY-MM-DD"));

		// 	this.setState({ calenderDateArr: dateArr })
		// }
		// else {
		dateArr.push(Moment(today).format("YYYY-MM-DD"));
		//let increaseDate = Moment(today, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD');
		dateArr.push(Moment(today, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD'));
		dateArr.push(Moment(today, "YYYY-MM-DD").add(2, 'days').format('YYYY-MM-DD'));
		dateArr.push(Moment(today, "YYYY-MM-DD").add(3, 'days').format('YYYY-MM-DD'));
		// var today1 = today;
		// var nextDay1 = new Date(today1.setDate(today1.getDate() + 1)).toString()
		// dateArr.push(Moment(today1).format("YYYY-MM-DD"));

		// var today2 = today;
		// var nextDay2 = new Date(today2.setDate(today2.getDate() + 1)).toString()
		// dateArr.push(Moment(today2).format("YYYY-MM-DD"));

		// var today3 = today;
		// var nextDay3 = new Date(today3.setDate(today3.getDate() + 1)).toString()
		// dateArr.push(Moment(today3).format("YYYY-MM-DD"));

		this.setState({ calenderDateArr: dateArr })
		//}
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
										dynamicMessageGlobalVirtual = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
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
										dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
									} else {
										dynamicMessageGlobalVirtual = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or';
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
										dynamicMessageGlobalVirtual = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
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
						let msgFlaVitual = false;
						if (selectedDay == currentDate) {

							tempinClinicAfternoon = [], tempinClinicEvening = [], tempinClinicMorning = [], tempvirtualAfternoon = [], tempvirtualEvening = [], tempvirtualMorning = [];
							if (this.state.clinicType == 'InClinic') {
								if (inClinicAfternoon.length > 0 || inClinicEvening.length > 0 || inClinicMorning.length > 0)
									msgFla = true;
							}else {
								if (virtualAfternoon.length > 0 || virtualEvening.length > 0 || virtualMorning.length > 0)
									msgFlaVitual = true;
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
								if (!msgFla) {
									dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
								} else if (!innerMsgFla) {
									dynamicMessageGlobal = 'No more slots available today '
								} else {
									dynamicMessageGlobal = '';
								}
							} else {
								if (tempvirtualAfternoon.length > 0 || tempvirtualEvening.length > 0 || tempvirtualMorning.length > 0)
									innerMsgFla = true;

								this.setState({
									dataArrayAfternoon: tempvirtualAfternoon,
									dataArrayEvening: tempvirtualEvening,
									dataArrayMorning: tempvirtualMorning
								})
								if (!msgFlaVitual) {
									dynamicMessageGlobalVirtual = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
								} else if (!innerMsgFla) {
									dynamicMessageGlobalVirtual = 'No more slots available today '
								} else {
									dynamicMessageGlobalVirtual = '';
								}
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
									dynamicMessageGlobalVirtual = '';
								else
									dynamicMessageGlobalVirtual = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'

								this.setState({
									dataArrayAfternoon: virtualAfternoon,
									dataArrayEvening: virtualEvening,
									dataArrayMorning: virtualMorning
								})
							}
						}
						if (this.state.clinicType == 'InClinic')
							this.setState({ dynamicMessage: dynamicMessageGlobal })
						else
							this.setState({ dynamicMessage: dynamicMessageGlobalVirtual })
						// setTimeout(() => {
						// 	if (this.state.dataArrayAfternoon.length > 0 || this.state.dataArrayMorning.length > 0 || this.state.dataArrayEvening.length > 0) {
						// 		this.setState({ dynamicMessage: '' })
						// 	} else {
						// 		if (!this.state.dynamicMessage)
						// 			this.setState({ dynamicMessage: 'cosultation timings were not setup for evening session. Select next day or' })
						// 	}
						// }, 1000)

						if (this.props.navigation.state.params.from == 'Reshedule') {
							let isDisableVirtualorInClinic = this.props.navigation.state.params.item.consultationType
							if (isDisableVirtualorInClinic == 'Virtual') {
								DRONA.setClinicType('Virtual');
								this.setState({
									clinicType: 'Virtual',
									dataArrayAfternoon: selectedDay == currentDate ? tempvirtualAfternoon : virtualAfternoon,
									dataArrayEvening: selectedDay == currentDate ? tempvirtualEvening : virtualEvening,
									dataArrayMorning: selectedDay == currentDate ? tempvirtualMorning : virtualMorning
								})
							}
						}


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


						// if (this.props.navigation.state.params.from === 'normal') {
						// 	this.props.navigation.navigate('SearchPatients', { item: item, clinicType: this.state.clinicType, from: 'AddAppoinment' })

						// } else {
						// 	this.props.navigation.navigate('ConfirmAppointment', { item: this.props.navigation.state.params.item, timeslot: item, from: this.props.navigation.state.params.from })
						// 	let { signupDetails } = this.props;
						// 	let eventName = isReschedule ? "reschdule_appointment" : DRONA.getClinicType() === "WalkIns" ? "add_walkin" : DRONA.getClinicType() === "InClinic" ? "add_in_clinic" : "add_virtual"
						// 	setLogEvent(eventName, { "select_slot": "click", UserGuid: signupDetails.UserGuid })
						// }

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
		this.setState({ selectedTab: 0, addAnotherSlotVisible: true });
		this.makeDateCalender(selectedDay, 1)
		//
		this.callApi();
		this.setState({ isModalVisible: false, dateForUpdate: selectedDay });
		selectedDayForCalendar = selectedDay;
		DRONA.setSelectedAppoinDate(selectedDay);

		let { signupDetails } = this.props;
		let eventName = isReschedule ? "reschdule_appointment" : DRONA.getClinicType() === "WalkIns" ? "add_walkin" : DRONA.getClinicType() === "InClinic" ? "add_in_clinic" : "add_virtual"
		setLogEvent(eventName, { "change_date": "click", UserGuid: signupDetails.UserGuid });
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
		this.setState({ selectedTab: tabno, addAnotherSlotVisible: true });
		selectedDay = this.state.calenderDateArr[tabno];
		DRONA.setSelectedAppoinDate(selectedDay);
		selectedDayName = Moment(selectedDay).format('dddd');
		// alert(selectedDay);
		this.callApi();
	}
	gotoNext = () => {
		// ******For AdHok Task. Need in Future ******
		//console.log('--------selected item '+JSON.stringify(selectedItem));
		// if(!selectedItem.timeSlotGuid){
		// 	let avlGuid=selectedItem.availabilityGuid;
		// 	let tmpArr=[];
		// 	let selIndex=0;
		// 	if(selectedItem.dayPeriad=='Morning'){
		// 		tmpArr=[...this.state.dataArrayMorning];
		// 	}else if(selectedItem.dayPeriad=='Afternoon'){
		// 		tmpArr=[...this.state.dataArrayAfternoon];
		// 	}else{
		// 		tmpArr=[...this.state.dataArrayEvening];
		// 	}
		// 	selIndex = _.findIndex(tmpArr, { availabilityGuid: selectedItem.availabilityGuid });
		// 	alert(selIndex)
		// }

		if (this.props.navigation.state.params.from === 'normal') {
			this.props.navigation.navigate('SearchPatients', { item: selectedItem, clinicType: this.state.clinicType, from: 'AddAppoinment' })

		} else {
			this.props.navigation.navigate('ConfirmAppointment', { item: this.props.navigation.state.params.item, timeslot: selectedItem, from: this.props.navigation.state.params.from })
			let { signupDetails } = this.props;
			let eventName = isReschedule ? "reschdule_appointment" : DRONA.getClinicType() === "WalkIns" ? "add_walkin" : DRONA.getClinicType() === "InClinic" ? "add_in_clinic" : "add_virtual"
			setLogEvent(eventName, { "select_slot": "click", UserGuid: signupDetails.UserGuid })
		}
	}

	render() {
		//alert(this.state.date)
		let NavigateFrom = this.props.navigation.state.params.from;
		let { actions, signupDetails, loading } = this.props;
		let isDisableVirtualorInClinic = '';
		if (NavigateFrom == 'Reshedule') {
			isDisableVirtualorInClinic = this.props.navigation.state.params.item.consultationType
		}
		return (
			<SafeAreaView style={{ ...CommonStyle.container, backgroundColor: Color.patientBackground }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Color.white, padding: 10 }}>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.goBack()}>
								<Image source={arrowBack} style={{ height: responsiveHeight(3), width: responsiveHeight(3), resizeMode: 'contain' }} />
							</TouchableOpacity>
						</View>
						<View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
							{/* <Text style={{color:'#FFF'}}>{this.state.dateForUpdate}</Text> */}
							<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
								{isDisableVirtualorInClinic && isDisableVirtualorInClinic == 'Virtual' ?
									<View style={{
										borderColor: Color.borderColor, borderWidth: 1.5, borderRadius: 4,
										justifyContent: 'center', alignItems: 'center', width: responsiveWidth(26), height: responsiveHeight(6),
										borderRadius: 4, backgroundColor: Color.grayColor
									}} onPress={() => {
										//alert("ff")
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, fontWeight: CustomFont.fontWeight500 }}>In Clinic</Text>
									</View>
									:
									<TouchableOpacity style={{
										borderColor: this.state.clinicType === 'InClinic' ? Color.liveBg : Color.borderColor, borderWidth: 1.5, borderRadius: 4,
										justifyContent: 'center', alignItems: 'center', width: responsiveWidth(20), height: responsiveHeight(5.5),
										borderRadius: 4, marginRight: responsiveWidth(2), backgroundColor: this.state.clinicType === 'InClinic' ? Color.genderSelection : Color.white
									}} onPress={() => {
										DRONA.setClinicType('InClinic');
										//this.setState({ clinicType: 'InClinic', dataArray: selectedDay == currentDate ? tempArr : inClinicTimeSlot })
										this.setState({
											clinicType: 'InClinic',
											dataArrayAfternoon: selectedDay == currentDate ? tempinClinicAfternoon : inClinicAfternoon,
											dataArrayEvening: selectedDay == currentDate ? tempinClinicEvening : inClinicEvening,
											dataArrayMorning: selectedDay == currentDate ? tempinClinicMorning : inClinicMorning
										})
										let msgFla = false;
										let innerMsgFla = false;
										if (inClinicAfternoon.length > 0 || inClinicEvening.length > 0 || inClinicMorning.length > 0)
											msgFla = true;
										if (tempinClinicAfternoon.length > 0 || tempinClinicEvening.length > 0 || tempinClinicMorning.length > 0)
											innerMsgFla = true;

										if (!msgFla) {
											dynamicMessageGlobal = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
										} else if (!innerMsgFla) {
											dynamicMessageGlobal = 'No more slots available today '
										} else {
											dynamicMessageGlobal = '';
										}
										this.setState({ dynamicMessage: dynamicMessageGlobal })

										let { signupDetails } = this.props;
										let eventName = isReschedule ? "reschdule_appointment" :  "add_in_clinic";
										setLogEvent(eventName, { "appointment_type_change": "InClinic", UserGuid: signupDetails.UserGuid })

									}}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, fontWeight: CustomFont.fontWeight500 }}>In Clinic</Text>
									</TouchableOpacity>}

								{isDisableVirtualorInClinic && isDisableVirtualorInClinic == 'In Clinic' ?
									<View style={{
										borderColor: Color.borderColor, borderWidth: 1.5, borderRadius: 4,
										justifyContent: 'center', alignItems: 'center', width: responsiveWidth(26), height: responsiveHeight(6), borderRadius: 4,
										backgroundColor: Color.grayColor
									}} onPress={() => {
										alert("ok")
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, fontWeight: CustomFont.fontWeight500 }}>Virtual</Text>
									</View>
									: <TouchableOpacity style={{
										borderColor: this.state.clinicType === 'Virtual' ? Color.liveBg : Color.borderColor, borderWidth: 1.5, borderRadius: 4,
										justifyContent: 'center', alignItems: 'center', width: responsiveWidth(20), height: responsiveHeight(5.5), borderRadius: 4,
										backgroundColor: this.state.clinicType === 'Virtual' ? Color.genderSelection : Color.white
									}} onPress={() => {
										DRONA.setClinicType('Virtual');
										this.setState({
											clinicType: 'Virtual',
											dataArrayAfternoon: selectedDay == currentDate ? tempvirtualAfternoon : virtualAfternoon,
											dataArrayEvening: selectedDay == currentDate ? tempvirtualEvening : virtualEvening,
											dataArrayMorning: selectedDay == currentDate ? tempvirtualMorning : virtualMorning
										})
										let msgFlaVitual = false;
										let innerMsgFla = false;
										if (virtualAfternoon.length > 0 || virtualEvening.length > 0 || virtualMorning.length > 0)
											msgFlaVitual = true;
										if (tempvirtualAfternoon.length > 0 || tempvirtualEvening.length > 0 || tempvirtualMorning.length > 0)
											innerMsgFla = true;

										if (!msgFlaVitual) {
											dynamicMessageGlobalVirtual = 'consultation timings were not setup for ' + selectedDayName + '. Select next day or'
										} else if (!innerMsgFla) {
											dynamicMessageGlobalVirtual = 'No more slots available today '
										} else {
											dynamicMessageGlobalVirtual = '';
										}
										this.setState({ dynamicMessage: dynamicMessageGlobalVirtual })
										let { signupDetails } = this.props;
										let eventName = isReschedule ? "reschdule_appointment" : "add_virtual";
										setLogEvent(eventName, { "appointment_type_change": "Virtual", UserGuid: signupDetails.UserGuid })
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, fontWeight: CustomFont.fontWeight500 }}>Virtual</Text>
									</TouchableOpacity>
								}
							</View>
						</View>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => {

							this.setState({ isModalVisible: true, dateForfullCalendar: selectedDayForCalendar })
						}}>
							<Image source={CalendarImge} style={{ tintColor: Color.primary, height: 30, width: 30, resizeMode: 'contain' }} />
							{/* <CalendarModal /> */}
						</TouchableOpacity>
					</View>

					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
							onPress={() => this.hasTabChanged(0)} disabled={loading}>
							<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 0 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 0 ? 'bold' : 'normal' }}>{Moment(this.state.calenderDateArr[0]).format("ddd, DD MMM")}</Text>
							{this.state.selectedTab == 0 ? <View style={styles.underlineStyle} /> : null}
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
							onPress={() => this.hasTabChanged(1)} disabled={loading}>
							<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 1 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 1 ? 'bold' : 'normal' }}>{Moment(this.state.calenderDateArr[1]).format("ddd, DD MMM")}</Text>
							{this.state.selectedTab == 1 ? <View style={styles.underlineStyle} /> : null}
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
							onPress={() => this.hasTabChanged(2)} disabled={loading}>
							<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 2 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 2 ? 'bold' : 'normal' }}>{Moment(this.state.calenderDateArr[2]).format("ddd, DD MMM")}</Text>
							{this.state.selectedTab == 2 ? <View style={styles.underlineStyle} /> : null}
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
							onPress={() => this.hasTabChanged(3)} disabled={loading}>
							<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 3 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 3 ? 'bold' : 'normal' }}>{Moment(this.state.calenderDateArr[3]).format("ddd, DD MMM")}</Text>
							{this.state.selectedTab == 3 ? <View style={styles.underlineStyle} /> : null}
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
										<View style={{ marginLeft: responsiveWidth(3) }}>
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

								{/* {this.state.addAnotherSlotVisible ?
									<TouchableOpacity style={{ marginTop: responsiveHeight(2), marginLeft: responsiveWidth(4), marginBottom: responsiveWidth(4), }}
										onPress={() =>{
											this.setState({selectedTime:Moment(new Date(), ["h:mm A"]).format("HH:mm A")});
											this.setState({ isModalVisibleAdhoc: true, showAlreadyExistMsg: false, })
										} }
									>
										<Text style={{ fontWeight: 'bold', fontFamily: CustomFont.fontName, color: Color.primaryBlue, fontSize: CustomFont.font16 }}>Add Another Slot</Text>
									</TouchableOpacity>
									: null
								} */}

							</View>
						</ScrollView> :
						<View>
							{this.state.dynamicMessage ? <TouchableOpacity style={{ flexDirection: 'row', padding: responsiveWidth(3), borderRadius: responsiveWidth(1), marginLeft: responsiveWidth(5), marginRight: responsiveWidth(5), marginTop: 20 }} onPress={() => this.props.navigation.navigate('SetUpClinic', { tabActive: 0, from: 'first' })}>
								{/* <Image source={alertAdhoc} style={[styles.adhocIcon, { marginTop: responsiveHeight(.5) }]} />  backgroundColor: Color.adHocAlert,*/}
								<Text style={{ color: Color.fontColor, fontSize: CustomFont.font16 }}>{this.state.dynamicMessage} <Text style={{ color: Color.blueTxt, textDecorationLine: 'underline' }}>{this.state.dynamicMessage == 'Please select today or future date' || this.state.dynamicMessage == 'Data not available' ? '' : '\n edit consultation timings'}</Text></Text>
							</TouchableOpacity> : null}
						</View>}


				</View>
				<View style={{ flexDirection: 'row', padding: 10, backgroundColor: Color.white, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
					<TouchableOpacity
						onPress={() => {
							if (selectedItem)
								this.gotoNext();
							else
								Snackbar.show({ text: 'Please select a slot', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
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
										selectedDay = Moment(date).format('YYYY-MM-DD')
									}}
									maxDate={new Date().setDate(new Date().getDate() + 90)}
									minDate={new Date()}
									nextTitleStyle={{ color: Color.fontColor }}
									previousTitleStyle={{ color: Color.fontColor }}
									yearTitleStyle={{ color: Color.fontColor }}
									monthTitleStyle={{ color: Color.fontColor }}
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

				{/* Adhoc code */}

				<Modal isVisible={this.state.isModalVisibleAdhoc} avoidKeyboard={true}>
					<View style={[styles.modelAdhoc, { height: responsiveHeight(60) }]}>
						<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={-200}>
							<ScrollView>
								<View style={styles.modelViewAdditional}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
										<Text style={styles.modelMainTitle}>Add Slot</Text>
										<TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ isModalVisibleAdhoc: false })}>
											<Image source={cross} style={styles.crossIcon} />
										</TouchableOpacity>
									</View>
									<Text style={styles.tiTitle}>Slot Timing</Text>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: responsiveHeight(2) }}>
										<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', height: responsiveHeight(6), borderColor: Color.inputdefaultBorder, borderWidth: 1, borderRadius: 6, backgroundColor: Color.white, flexDirection: 'row' }}
											onPress={() => {
												this.setState({ isModalVisibleStart: true })
											}}>
											<TextInput returnKeyType="done" style={styles.modelTextInput1} value={this.state.selectedTime} onChangeText={selectedTime => {
												this.setState({ selectedTime });
											}} />
											<Image source={down} style={{ textAlign: 'right', height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginRight: responsiveWidth(2) }} />
										</TouchableOpacity>
									</View>
									{this.state.showAlreadyExistMsg ? <View style={{ flexDirection: 'row', alignItems: 'center', padding: responsiveWidth(3), backgroundColor: Color.adHocAlert, borderRadius: 5, }}>
										<Image source={alertAdhoc} style={styles.adhocIcon} />
										<Text style={{ marginRight: responsiveWidth(2), fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font12 }}>Another slot exists for {this.state.selectedTime}. Please change{'\n'} the start time</Text>
									</View> : null}


									<TouchableOpacity style={styles.modalBtn} onPress={() => {
										this.clearPreviousSelection();
										this.saveSlot();

									}}>
										<Text style={styles.modalBtnTxt}>Save</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						</KeyboardAvoidingView>
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
									minuteInterval={1}
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
)(AppoinmentTimesShow);

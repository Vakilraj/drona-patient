import React, { useState } from 'react';
import {
	ScrollView,
	View,
	Text, Platform, Image, TextInput, FlatList, TouchableOpacity, Keyboard
} from 'react-native';
import styles from './style';
import Moment from 'moment';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Add from '../../../assets/plus.png';
import closeIcon from '../../../assets/cross_blue.png';
import ic_virtual from '../../../assets/ic_virtual.png';
import walkin from '../../../assets/walkin.png';
import AddAppoin from '../../../assets/ic_inclinic.png';
import icMenu from '../../../assets/ic_menu.png';
import down from '../../../assets/down.png';
import finding_patient from '../../../assets/BillingBlank.png';
import time_clinic from '../../../assets/time_clinic.png';
import CalendarImge from '../../../assets/calender_icon.png';
import search_blue from '../../../assets/search_blue.png';
import threeDotBlue from '../../../assets/threeDotBlue.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import Draggable from 'react-native-draggable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationEvents } from 'react-navigation';
import _ from 'lodash';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import vector_phone from '../../../assets/vector_phone.png';
import CalendarPicker from 'react-native-calendar-picker';
import { setLogEvent, setLogShare } from '../../service/Analytics';
import Trace from '../../service/Trace';
const signalR = require("@microsoft/signalr");
let sendPaymentLinkAppointmentGuid = '';
let dateArr = [], selectedIndex = 1;
let selectedDay = '', currentDate = '';
let fullArrayCheckIn = [], fullArrayCompleted = [], fullArrayWalikIn = [], fullArrayCancel = [], fullArrayNoShow = [];
let connection=null;
class Appoinment extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dataArray: [],
			isModalVisible: false,
			isModalVisibleCalendar: false,
			completedArray: [],
			walikInArray: [],
			CancelApoinArray: [],
			MarkAsNoShowArray: [],
			showHeaderDate: '',
			dateForfullCalendar: '',
			showSearchStatus: false,
			searchTxt: '',
			tab1: '',
			tab2: '',
			tab3: '',
			selectedTab: 1,
			apoinmentBlockShow: true,
			isPaymentModalVisible: false,
			isLiveDate: true,
		};
	}
	
	componentDidMount() {
		let { actions, signupDetails } = this.props;

		let timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +"Appointment_Tab_Time",  signupDetails.firebaseLocation);
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Appointment_Tab_Time", {'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })

		signupDetails.confirmAppoinmentDate = '';
		actions.setSignupDetails(signupDetails);

		if (DRONA.getIsAddAppointmentModal() == 1) {
			setTimeout(() => {
				this.setState({ isModalVisible: true });
			}, 1000)
			DRONA.setIsAddAppointmentModal(0);
		}
		Keyboard.dismiss(0);
		if(signupDetails.serverDateTime)
		currentDate =signupDetails.serverDateTime; //Moment(new Date()).format('YYYY-MM-DD');
		else
		currentDate = Moment(new Date()).format('YYYY-MM-DD');

		selectedDay = currentDate;
		this.clickOnDone();

		// socket IO

	 connection = new signalR.HubConnectionBuilder()
    .withUrl("https://mnkdronaqueuefuncappdev.azurewebsites.net/api")
    .build();

connection.on('UpdatePatientList_' + signupDetails.UserGuid, data => {
    // console.log('---------'+JSON.stringify(data));
	 alert('--++--'+JSON.stringify(data));
	this.getAppoinmentedList();
});
connection.start()
    .then(() => connection.invoke("currentUser", "Hello"));

// setTimeout(()=>{
// 	connection.stop().then(function() {
// 		alert('kl')
//         console.log('Closed');
//         connection = null;    
//     });
// },5000)

	}
	componentWillUnmount()
	{
		if(connection)
		connection.stop();
		Trace.stopTrace();
	}
	sendPaymentLink = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Data": {
				"AppointmentGuid": sendPaymentLinkAppointmentGuid
			}
		}
		actions.callLogin('V1/FuncForDrAppResendPymentLink', 'post', params, signupDetails.accessToken, 'sendPaymentLink');
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails } = this.props;
			if (tagname === 'patientListForHomeScreen') {
				if (newProps.responseData.data) {
					let data = newProps.responseData.data

					if (data && data.newLiveQueue && data.newLiveQueue.bookedAppointment) {
						this.setState({ dataArray: data.newLiveQueue.bookedAppointment });
						fullArrayCheckIn = data.newLiveQueue.bookedAppointment;
					} else {
						this.setState({ dataArray: [] });
						fullArrayCheckIn = [];
					}
					if (data && data.newLiveQueue && data.newLiveQueue.completedAppointment) {
						this.setState({ completedArray: data.newLiveQueue.completedAppointment });
						fullArrayCompleted = data.newLiveQueue.completedAppointment;
					} else {
						this.setState({ completedArray: [] });
						fullArrayCompleted = [];
					}
					if (data && data.newLiveQueue && data.newLiveQueue.walkIn) {
						this.setState({ walikInArray: data.newLiveQueue.walkIn });
						fullArrayWalikIn = data.newLiveQueue.walkIn;
					} else {
						this.setState({ walikInArray: [] });
						fullArrayWalikIn = [];
					}
					if (data && data.newLiveQueue && data.newLiveQueue.cancelledAppointment) {
						this.setState({ CancelApoinArray: data.newLiveQueue.cancelledAppointment });
						fullArrayCancel = data.newLiveQueue.cancelledAppointment;
					} else {
						this.setState({ CancelApoinArray: [] });
						fullArrayCancel = [];
					}
					if (data && data.newLiveQueue && data.newLiveQueue.markAsNoShow) {
						this.setState({ MarkAsNoShowArray: data.newLiveQueue.markAsNoShow });
						fullArrayNoShow = data.newLiveQueue.markAsNoShow;
					} else {
						this.setState({ MarkAsNoShowArray: [] });
						fullArrayNoShow = [];
					}
					// this.setState({ dataArray: data && data.newLiveQueue && data.newLiveQueue.bookedAppointment ? data.newLiveQueue.bookedAppointment : [] });
					// this.setState({ completedArray: data && data.newLiveQueue && data.newLiveQueue.completedAppointment ? data.newLiveQueue.completedAppointment : [] });
					// this.setState({ walikInArray: data && data.newLiveQueue && data.newLiveQueue.walkIn ? data.newLiveQueue.walkIn : [] });
					// this.setState({ CancelApoinArray: data && data.newLiveQueue && data.newLiveQueue.cancelledAppointment ? data.newLiveQueue.cancelledAppointment : [] });
					// this.setState({ MarkAsNoShowArray: data && data.newLiveQueue && data.newLiveQueue.markAsNoShow ? data.newLiveQueue.markAsNoShow : [] });

					if (DRONA.getShowAppoinmentCompleteMsg() == 1) {
						setTimeout(() => {
							Snackbar.show({ text: 'Consultation Completed e-Prescription sent to patient', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
							DRONA.setShowAppoinmentCompleteMsg(0);
						}, 1000);
					}

				} else {
					this.setState({ dataArray: [], completedArray: [], walikInArray: [], CancelApoinArray: [], markAsNoShow: [] });
				}
			} else if (tagname == 'sendPaymentLink') {
				setTimeout(() => {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
				}, 1000)

			}
		}
	}
	hasTabChanged = (index) => {
		selectedIndex = index;
		this.setState({ selectedTab: index });
		this.getAppoinmentedList();
	}
	renderSeparator = () => {
		return <View style={styles.seperatorPatient} />;
	};
	renderList = ({ item, index }) => (
		<TouchableOpacity style={{ flexDirection: 'row', marginTop: 1, marginLeft: 5, marginRight: 10, backgroundColor: Color.white, height: responsiveHeight(10), alignItems: 'center' }} onPress={() => {
			let { actions, signupDetails } = this.props;
			signupDetails.appoinmentGuid = item.appointmentGuid;
			signupDetails.patientGuid =item.patientGuid;
			signupDetails.patientProfileUrl = item.patientImageUrl ? item.patientImageUrl : '';
			signupDetails.consultType = item.consultationType;
			// signupDetails.patientName = item.patientName;
			// signupDetails.patientGender = item.gender;
			// signupDetails.patientAge = item.age;
			actions.setSignupDetails(signupDetails);
			this.props.nav.navigation.navigate('Consultation', { item: item, date: dateArr[selectedIndex], appointmentStatus: 'CheckedIn' });
		}}>
			{/* <View style={{ flex: .9, alignItems: 'center' }}>
				<View style={styles.profileRoundImg} >
					{item.patientImageUrl ?
						<Image style={{ width: responsiveWidth(11), height: responsiveWidth(11), borderRadius: responsiveWidth(6), justifyContent: 'center', alignItems: 'center' }} source={{ uri: item.patientImageUrl }} /> :
						<Text style={{ fontSize: CustomFont.font14, color: Color.profileImageText, fontFamily: CustomFont.fontName, fontWeight: '400', justifyContent: 'center', alignItems: 'center' }}>{this.nameFormat(item)}</Text>}
				</View>
			</View> */}

			<View style={{ flex: 4, marginLeft: 10, marginTop: responsiveHeight(2.5), marginBottom: 10 }}>
				<Text style={{ fontSize: CustomFont.font14, fontWeight: '500', color: Color.patientSearchName, lineHeight: 16, fontFamily: Platform.OS == 'ios' ? CustomFont.fontName : CustomFont.fontNameSemiBold, textTransform: 'capitalize' }}>{item.patientName.replace('  ', ' ')}</Text>
				<View style={{ flexDirection: 'row', marginTop: 3, alignItems: 'center' }}>
					<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '700' }}>{item.gender.charAt(0)} </Text>
					<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500' }}>{item.age}</Text>
					<Image source={vector_phone} style={{ resizeMode: 'contain', width: responsiveWidth(5), height: responsiveWidth(5), marginLeft: 7, marginTop: 0, justifyContent: 'center', alignItems: 'center' }} />
					<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500', marginLeft: 1 }}>{item.phoneNumber}</Text>
				</View>
			</View>
			{/* <View style={{ flex: 4, marginLeft: 5 }}>
				<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.fontColor, fontFamily: CustomFont.fontNameBold, textTransform: 'capitalize' }}>{item.patientName ? item.patientName.replace('  ', " ") : ''}</Text>
				<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 3, fontFamily: CustomFont.fontName }}>{item.gender + ', '} {item.dob}</Text>
			</View>
			 */}
			<View style={{ flex: 1.4 }}>
				<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500' }}>{item.appointmentStartTime}</Text>
				<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500' }}>{item.consultationType} {item.consultationType == 'Virtual' && !item.isPaymentReceived && item.appointmentStatus != "Cancelled" ? '\n(Tentative)' : ''}</Text>
			</View>
			{
				item.consultationType == 'Virtual' && !item.isPaymentReceived && selectedDay >= currentDate && item.appointmentStatus != "Cancelled" ? 
				<TouchableOpacity onPress={() => {
					sendPaymentLinkAppointmentGuid = item.appointmentGuid;
					this.setState({ isPaymentModalVisible: true })
				}} style={{ marginLeft: -5 }}>
				<Image source={threeDotBlue} style={{ height: 24, width: 8 }} />
				</TouchableOpacity> : null
			}
		</TouchableOpacity>
	);
	
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
	nameFormat = (item) => {
		let str = '';
		try {
			if (item.patientName.includes(' ')) {
				let strArr = item.patientName.trim().split('  ');
				if (strArr[1]) {
					str = strArr[0].substr(0, 1).toUpperCase() + strArr[1].substr(0, 1).toUpperCase()
				} else {
					str = strArr[0].substr(0, 2).toUpperCase();
				}
			} else {
				str = item.patientName.substr(1, 2)
			}
		} catch (e) { }
		return str
	}
	nameFormat2 = (fullName) => {
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
		// alert(str);
		return str
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
				str = year + 'y'
			}
			if (month) {
				str += str.length > 0 ? ' ' + month + 'm' : month + 'm';
			}
			if (day) {
				str += str.length > 0 ? ' ' + day + 'd' : day + 'd';
			}
		}
		return str;
	}
	getAppoinmentedList = () => {
		let { actions, signupDetails } = this.props;
		if (signupDetails.confirmAppoinmentDate) {
			selectedDay = signupDetails.confirmAppoinmentDate;
			signupDetails.confirmAppoinmentDate = '';
			actions.setSignupDetails(signupDetails);
			this.clickOnDone()
		} else {
			DRONA.setSelectedAppoinDate(dateArr[selectedIndex]);
			let params = {
                "RoleCode": signupDetails.roleCode,
				"UserGuid": signupDetails.UserGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"Version": "",
				"Data":
				{
					"AppointmentDate": dateArr[selectedIndex]
				}
			}
			selectedDay=dateArr[selectedIndex];
			actions.callLogin('V1/FuncForDrAppToGetPatientGroupedList_V2', 'post', params, signupDetails.accessToken, 'patientListForHomeScreen');
			signupDetails.selectedDate = dateArr[selectedIndex];
			actions.setSignupDetails(signupDetails);
			// if (DRONA.getIsDrTimingsAdded()) {
			// 	this.setState({ apoinmentBlockShow: true });
			// } else {
			// 	this.setState({ apoinmentBlockShow: false });
			// }
		}

	}
	clickOnDone = () => {
		this.setState({ isModalVisibleCalendar: false })
		dateArr = [];
		let temparr = [];
		let decreseDate = Moment(selectedDay, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
		let showDate = Moment(decreseDate).format('ddd,DD MMM');
		dateArr.push(decreseDate);
		temparr.push(showDate);


		dateArr.push(selectedDay);
		if (currentDate == selectedDay) {
			this.setState({isLiveDate : true})
			let showDate1 = Moment(selectedDay).format('DD MMM');
			temparr.push('Today, ' + showDate1);
			
		} else {
			let showDate1 = Moment(selectedDay).format('ddd,DD MMM');
			temparr.push(showDate1);
			this.setState({isLiveDate : false})
		}
		let increaseDate1 = Moment(selectedDay, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD')
		let showDate2 = Moment(increaseDate1).format('ddd,DD MMM');
		dateArr.push(increaseDate1);
		temparr.push(showDate2);

		this.setState({ tab1: temparr[0], tab2: temparr[1], tab3: temparr[2] });
		this.hasTabChanged(1);
		//alert(JSON.stringify(temparr))
	}
	SearchFilterFunction = (text) => {
		//for CheckIn
		if(text.length>=2){
			let { signupDetails } = this.props;
			setLogEvent("search_patient", { "userGuid": signupDetails.UserGuid, searchKeyword: text })
			var searchResultCheckIn = _.filter(fullArrayCheckIn, function (item) {
				return item.patientName ? item.patientName.toLowerCase().indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf('AddnewPatient') > -1 : null;
			});
			this.setState({
				dataArray: searchResultCheckIn ? searchResultCheckIn : []
			});
			//for Completed
			var searchResultCompleted = _.filter(fullArrayCompleted, function (item) {
				return item.patientName ? item.patientName.toLowerCase().indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf('AddnewPatient') > -1 : null;
			});
			this.setState({
				completedArray: searchResultCompleted ? searchResultCompleted : []
			});
	
			//for WalikIn
			var searchResultWalikIn = _.filter(fullArrayWalikIn, function (item) {
				return item.patientName ? item.patientName.toLowerCase().indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf('AddnewPatient') > -1 : null;
			});
			this.setState({
				walikInArray: searchResultWalikIn ? searchResultWalikIn : []
			});
			//for Cancel
			var searchResultCancel = _.filter(fullArrayCancel, function (item) {
				return item.patientName ? item.patientName.toLowerCase().indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf('AddnewPatient') > -1 : null;
			});
			this.setState({
				CancelApoinArray: searchResultCancel ? searchResultCancel : []
			});
			//for NoShow
			var searchResultNoShow = _.filter(fullArrayNoShow, function (item) {
				return item.patientName ? item.patientName.toLowerCase().indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf('AddnewPatient') > -1 : null;
			});
			this.setState({
				MarkAsNoShowArray: searchResultNoShow ? searchResultNoShow : []
			});
		}else{
			this.setState({
				dataArray: fullArrayCheckIn,completedArray:fullArrayCompleted,walikInArray:fullArrayWalikIn,CancelApoinArray:fullArrayCancel,MarkAsNoShowArray:fullArrayNoShow
			});
		}
		



		this.setState({ searchTxt: text });
	}
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<View style={Platform.OS == 'android' ? styles.containerAndroid : styles.containerIos}>
				<NavigationEvents onDidFocus={() =>{
						this.getAppoinmentedList();
				} } />
				<View style={{ backgroundColor: Color.white }}>
					<View style={{ flexDirection: 'row', backgroundColor: Color.white, height: responsiveHeight(7) }}>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<TouchableOpacity onPress={() => this.props.nav.navigation.openDrawer()}>

								<Image style={{ resizeMode: 'contain', width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), marginLeft: responsiveWidth(2.1), marginTop: responsiveHeight(.35) }} source={icMenu} />

							</TouchableOpacity>
						</View>
						<TouchableOpacity style={{ flex: 7, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.nav.navigation.navigate('ClinicList')}>
							<View style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), borderRadius: responsiveFontSize(1.5), backgroundColor: '#47C1BF', borderColor: Color.white, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
								{signupDetails.clinicImageUrl ?
									<Image
										source={{ uri: signupDetails.clinicImageUrl }}
										style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), borderRadius: responsiveFontSize(1.5) }}
									/>
									: <Text style={{ fontSize: CustomFont.font12, color: Color.white, textTransform: 'uppercase' }}>{this.makeShortName(signupDetails.clinicName)}</Text>
								}
							</View>
							<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: responsiveWidth(2), fontFamily: Platform.OS == 'ios' ? CustomFont.fontName : CustomFont.fontNameSemiBold, fontWeight: '500', textTransform: 'capitalize', }}>{signupDetails.clinicName && signupDetails.clinicName.length > 28 ? signupDetails.clinicName.substring(0, 26) + '...' : signupDetails.clinicName}</Text>
							<TouchableOpacity style={{ marginLeft: 10, marginTop: -5 }} onPress={() => this.props.nav.navigation.navigate('ClinicList')}>
								<Image source={down} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginTop: responsiveHeight(1) }} />
							</TouchableOpacity>

						</TouchableOpacity>

						<TouchableOpacity style={{ flex: .8, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
							this.setState({ showSearchStatus: true })
							setTimeout(() => {
								this.refs.search.focus();
							}, 500)

						}}>
							<Image style={{ resizeMode: 'contain', height: responsiveWidth(6), width: responsiveWidth(6), marginLeft: responsiveWidth(2.1), marginRight: responsiveWidth(2.1) }} source={search_blue} />
						</TouchableOpacity>
					</View>
							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ flexDirection: 'row', backgroundColor: Color.liveBg, justifyContent: 'center', alignItems: 'center', borderRadius: 4, height: responsiveHeight(4), width: responsiveWidth(20) }}>
									<View style={{ height: responsiveFontSize(1), width: responsiveFontSize(1), borderRadius: responsiveFontSize(.8), backgroundColor: Color.white }} />
									<Text style={{ fontSize: CustomFont.font16, color: '#FFF', marginLeft: 5, fontFamily: CustomFont.fontName }}>LIVE</Text>
								</View>
								
								<TouchableOpacity style={{ position: 'absolute', right: 10, top: 0 }} onPress={() => {
									//let { signupDetails } = this.props;
									//setLogEvent("change_date", { "userGuid": signupDetails.UserGuid });
									this.setState({ isModalVisibleCalendar: true })
								}}>
									<Image source={CalendarImge} style={{ tintColor: Color.primary, height: 30, width: 30, resizeMode: 'contain' }} />
								</TouchableOpacity>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
									onPress={() => this.hasTabChanged(0)}>
									<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 0 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 0 ? 'bold' : 'normal' }}>{this.state.tab1 ? this.state.tab1.split(',')[0] : this.state.tab1}</Text>
									<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 0 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontNameBold, fontWeight: 'bold' }}>,{this.state.tab1 ? this.state.tab1.split(',')[1] : this.state.tab1}</Text>
									{this.state.selectedTab == 0 ? <View style={styles.underlineStyle} /> : null}

								</TouchableOpacity>
								<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
									onPress={() => this.hasTabChanged(1)}>
									<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 1 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 1 ? 'bold' : 'normal' }}>{this.state.tab2 ? this.state.tab2.split(',')[0] : this.state.tab2}</Text>
									<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 1 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontNameBold, fontWeight: 'bold' }}>,{this.state.tab2 ? this.state.tab2.split(',')[1] : this.state.tab2}</Text>
									{this.state.selectedTab == 1 ? <View style={styles.underlineStyle} /> : null}
								</TouchableOpacity>
								<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(8), flexDirection: 'row' }}
									onPress={() => this.hasTabChanged(2)}>
									<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 2 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontName, fontWeight: this.state.selectedTab == 2 ? 'bold' : 'normal' }}>{this.state.tab3 ? this.state.tab3.split(',')[0] : this.state.tab3}</Text>
									<Text style={{ fontSize: CustomFont.font12, color: this.state.selectedTab == 2 ? Color.primary : Color.optiontext, fontFamily: CustomFont.fontNameBold, fontWeight: 'bold' }}>,{this.state.tab3 ? this.state.tab3.split(',')[1] : this.state.tab3}</Text>
									{this.state.selectedTab == 2 ? <View style={styles.underlineStyle} /> : null}
								</TouchableOpacity>
							</View>

				</View>
				{this.state.showSearchStatus ? <TextInput returnKeyType="done"
					//onBlur={this.callOnBlur}
					//returnKeyType={'done'}
					//keyboardType={'phone-pad'}
					ref='search'
					placeholderTextColor={Color.placeHolderColor}
					style={{
						padding: 0, backgroundColor: Color.white, height: responsiveHeight(5), borderRadius: 5, paddingLeft: 10, paddingRight: 10, marginLeft: responsiveWidth(2.5),
						marginRight: responsiveWidth(2.5), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName,
						color: Color.patientSearch, marginTop: responsiveHeight(2), zIndex: 999
					}} placeholder="Search by patient name or number" value={this.state.searchTxt}
					onChangeText={(searchTxt) => { return this.SearchFilterFunction(searchTxt); }} /> : null}


				{this.state.dataArray.length > 0 || this.state.completedArray.length > 0 || this.state.walikInArray.length > 0 || this.state.CancelApoinArray.length > 0 || this.state.MarkAsNoShowArray.length > 0 ?
					<View style={{ flex: 1, }}>
						<ScrollView style={{marginTop:10 }}>
							<View style={{ flex: 1}}>
								{this.state.dataArray.length > 0 ?
									<View style={{backgroundColor: Color.white, borderRadius: 10, marginLeft: 10,marginRight:10,marginTop:10 }}>
											<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontFamily: CustomFont.fontNameBold, fontWeight: 'bold',marginLeft:13,marginTop:10 }}>Checked In ({this.state.dataArray.length})</Text>
										<FlatList
											data={this.state.dataArray}
											ItemSeparatorComponent={this.renderSeparator}
											renderItem={this.renderList}
											//contentContainerStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden' }}
											extraData={this.state}
											keyExtractor={(item, index) => index.toString()}
										/>
									</View> : null}

								{this.state.walikInArray.length > 0 ?
									<View style={{backgroundColor: Color.white, borderRadius: 10,marginLeft: 10,marginRight:10,marginTop:10}}>
											<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontFamily: CustomFont.fontNameBold, fontWeight: 'bold',marginLeft:13,marginTop:10 }}>Walk-In ({this.state.walikInArray.length})</Text>
										<FlatList
											data={this.state.walikInArray}
											ItemSeparatorComponent={this.renderSeparator}
											renderItem={this.renderList}
											extraData={this.state}
											keyExtractor={(item, index) => index.toString()}
										/>
									</View> : null}

								{this.state.CancelApoinArray.length > 0 ?
									<View style={{backgroundColor: Color.white, borderRadius: 10,marginLeft: 10,marginRight:10,marginTop:10 }}>
										<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontFamily: CustomFont.fontNameBold, fontWeight: 'bold',marginLeft:13,marginTop:10 }}>Cancelled ({this.state.CancelApoinArray.length})</Text>
											
										<FlatList
											data={this.state.CancelApoinArray}
											ItemSeparatorComponent={this.renderSeparator}
											//contentContainerStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden' }}
											renderItem={this.renderList}
											extraData={this.state}
											keyExtractor={(item, index) => index.toString()}
										/>
									</View> : null}

								{this.state.MarkAsNoShowArray.length > 0 ?
									<View style={{backgroundColor: Color.white, borderRadius: 10,marginLeft: 10,marginRight:10,marginTop:10 }}>
										<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontFamily: CustomFont.fontNameBold, fontWeight: 'bold' ,marginLeft:13,marginTop:10}}>No-Show ({this.state.MarkAsNoShowArray.length})</Text>
										<FlatList
											data={this.state.MarkAsNoShowArray}
											ItemSeparatorComponent={this.renderSeparator}
											renderItem={this.renderList}
											extraData={this.state}
											keyExtractor={(item, index) => index.toString()}
										/>
									</View> : null}

								{this.state.completedArray.length > 0 ?
									<View style={{backgroundColor: Color.white, borderRadius: 10,marginLeft: 10,marginRight:10,marginTop:10 }}>
										<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font14, fontFamily: CustomFont.fontNameBold, fontWeight: 'bold',marginLeft:13,marginTop:10 }}>Completed ({this.state.completedArray.length})</Text>
										<FlatList
											data={this.state.completedArray}
											ItemSeparatorComponent={this.renderSeparator}
											//contentContainerStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden' }}
											renderItem={this.renderList}
											extraData={this.state}
											keyExtractor={(item, index) => index.toString()}
										/>
									</View> : null}

							</View>

						</ScrollView>
						<Draggable x={responsiveWidth(97)} y={responsiveHeight(62)} maxY={responsiveHeight(62)}>
						<TouchableOpacity style={styles.addPost} onPress={() =>
						{
						this.setState({ isModalVisible: true })
						let { actions, signupDetails } = this.props;
						let timeRange = Trace.getTimeRange();
						Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +"Add_Appointment_Popup_Open",  signupDetails.firebaseLocation);
						Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Add_Appointment_Popup_Open", { "Add_Appointment_Popup": "click", 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
							 }}>
							<Image source={Add} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain' }} />
						</TouchableOpacity>
						</Draggable>
					</View>

					:
					<View style={{ flex: 1, backgroundColor: Color.patientBackground, alignItems: 'center', justifyContent: 'center' }}>
						
						<Image source={finding_patient} style={{ height: responsiveFontSize(25), width: responsiveFontSize(25), resizeMode: 'contain', }} />
						<View style={{ alignItems: 'center', }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.patientTextColor, textAlign: 'center', lineHeight: CustomFont.font22, fontWeight: '400', marginTop: responsiveFontSize(1) }}>No patients in queue for this date</Text>
								<TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(50), justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: Color.addAppointmentBackground, marginTop: responsiveHeight(5) }}
									onPress={() => {
										this.setState({ isModalVisible: true })
									}}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.primary, }}>Add Appointment</Text>
								</TouchableOpacity>
							</View>
					</View>}


				<Modal isVisible={this.state.isModalVisible}
					onRequestClose={() => this.setState({ isModalVisible: false })}
					avoidKeyboard={true}>
					<View style={styles.modelView}>
						<View style={{ margin: responsiveHeight(2), justifyContent: 'space-between', flexDirection: 'row' }}>
							<Text style={{ fontFamily: CustomFont.fontNameBold, color: Color.black, fontWeight: 'bold', fontSize: CustomFont.font18, marginLeft: responsiveWidth(3), marginTop: responsiveHeight(1.6), }}>Add</Text>
							<TouchableOpacity style={{ position: 'absolute', right: 0, justifyContent: 'center', flexDirection: 'row', }} onPress={() => 
								{
								Trace.stopTrace();
								this.setState({ isModalVisible: false })
								}}>
								<Image style={[styles.bsIcon,{ height: responsiveHeight(4), width: responsiveWidth(4), marginRight: responsiveWidth(4), marginTop: responsiveHeight(1.6), resizeMode: 'contain' }]} source={closeIcon} />
							</TouchableOpacity>
						</View>


						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.6), marginLeft: responsiveHeight(1.5) }} onPress={() => {
							this.setState({ isModalVisible: false })
							//let { signupDetails } = this.props;
							setLogEvent("appointment", { "add_walkin": "click", "userGuid": signupDetails.UserGuid })
							DRONA.setClinicType('WalkIns');
							Trace.stopTrace();
							this.props.nav.navigation.navigate('SearchPatients', { from: 'AddAppoinment' })
						}}>
							<Image source={walkin} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), }} />
							<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Walk in</Text>
						</TouchableOpacity>
						<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}></View>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.6), marginLeft: responsiveHeight(1.5) }} onPress={() =>
						 {
							Trace.stopTrace();
							this.setState({ isModalVisible: false })
							DRONA.setClinicType('InClinic');
							let { signupDetails } = this.props;
							setLogEvent("appointment", { "add_in_clinic": "click", "userGuid": signupDetails.UserGuid })
							this.props.nav.navigation.navigate('AppoinmentTimesShow', { from: 'normal',selectedDay:selectedDay })
						}}>
							<Image source={AddAppoin} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), }} />
							<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>In-Clinic Appointment</Text>
						</TouchableOpacity>

						<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5), }}></View>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: responsiveHeight(1.5), marginTop: responsiveHeight(1.5), }} onPress={() => {
							Trace.stopTrace();
							this.setState({ isModalVisible: false });
							DRONA.setClinicType('Virtual');
							//let { signupDetails } = this.props;
							setLogEvent("appointment", { "add_virtual": "click", "userGuid": signupDetails.UserGuid })
							this.props.nav.navigation.navigate('AppoinmentTimesShow', { from: 'normal', isVirtual: true,selectedDay:selectedDay })
						}}>
							<Image source={ic_virtual} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
							<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Virtual Appointment</Text>
						</TouchableOpacity>

					</View>
				</Modal>

				<Modal isVisible={this.state.isPaymentModalVisible}
					onRequestClose={() => this.setState({ isModalVisible: false })}
					avoidKeyboard={true}>
					<View style={[styles.modelView, { height: responsiveHeight(30) }]}>

						<View style={{ margin: responsiveHeight(2), justifyContent: 'space-between', flexDirection: 'row' }}>

							{/* <Text style={{ fontFamily: CustomFont.fontNameBold, color: Color.black, fontWeight: 'bold', fontSize: CustomFont.font18, marginLeft: responsiveWidth(3), marginTop: responsiveHeight(1.6), }}>Add</Text> */}
							<TouchableOpacity style={{ position: 'absolute', right: 0, justifyContent: 'center', flexDirection: 'row', }} onPress={() => this.setState({ isPaymentModalVisible: false })}>

								<Image style={[styles.bsIcon,{ height: responsiveHeight(4), width: responsiveWidth(4), marginRight: responsiveWidth(4), marginTop: responsiveHeight(1.6), resizeMode: 'contain' }]} source={closeIcon}  />
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3.6), marginLeft: responsiveHeight(1.5) }} onPress={() => {
							let { signupDetails } = this.props;
							setLogEvent("patient_appointment", { "resend_payment_link": "click", UserGuid: signupDetails.UserGuid })
							this.setState({ isPaymentModalVisible: false })
							this.sendPaymentLink()
						}}>
							{/* <Image source={AddAppoin} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), }} /> */}
							<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, color: Color.black }}>Request Payment</Text>
						</TouchableOpacity>


					</View>
				</Modal>

				{/* --------Modal for Calendar ------------- */}
				{/* <Modal isVisible={this.state.isModalVisibleCalendar} onRequestClose={() => this.setState({ isModalVisibleCalendar: false })}>
					<View style={{ backgroundColor: Color.white, borderRadius: 7, alignItems: 'center' }}>
						<ScrollView>
							<View style={{ flex: 1, flexDirection: 'column' }}>
								<View style={{ width: '100%', backgroundColor: Color.primaryBlue, borderTopLeftRadius: 7, borderTopRightRadius: 7, }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font24, color: Color.fontColor, color: Color.white, marginTop: 15, marginBottom: 15, marginLeft: 15 }}>{this.state.showHeaderDate}</Text>
								</View>
								<View style={{ width: '100%', flexDirection: 'row', marginTop: 7, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1, marginLeft: responsiveWidth(3) }}>Sun</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Mon</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Tue</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Wed</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Thu</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Fri</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Sat</Text>
								</View>
								<Calendar
									theme={{
										monthTextColor: Color.fontSize,
										arrowColor: '#165c96',
										todayTextColor: '#33a8e2',
										selectedDayTextColor: 'white',
										selectedDayBackgroundColor: Color.liveBg,
									}}
									markedDates={{
										[this.state.dateForfullCalendar]: { selected: true },
									}}
									onDayPress={day => {
										//alert(day.dateString)
										selectedDay = day.dateString
										let showDate = Moment(selectedDay).format('DD MMM YYYY');
										this.setState({ dateForfullCalendar: day.dateString, showHeaderDate: showDate })
									}}
									hideDayNames={true}
								//minDate={new Date()}
								/>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(3), justifyContent: 'flex-end', width: '100%' }}>
									<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisibleCalendar: false })}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel</Text>
									</TouchableOpacity>

									<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6), marginRight: 10 }} onPress={() => {
										this.clickOnDone();
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Done </Text>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>

					</View>
				</Modal> */}
				<Modal isVisible={this.state.isModalVisibleCalendar} >
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
										let showDate = Moment(selectedDay).format('DD MMM YYYY');

										this.setState({ dateForfullCalendar: selectedDay, showHeaderDate: showDate })
									}}
									maxDate={new Date().setDate(new Date().getDate() + 90)}
									//minDate = {new Date()}
									nextTitleStyle={{color:Color.fontColor}}
									previousTitleStyle={{color:Color.fontColor}}
									yearTitleStyle={{color:Color.fontColor}}
									monthTitleStyle={{color:Color.fontColor}}
								/>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(3), justifyContent: 'flex-end', width: '100%' }}>
									<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(6), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisibleCalendar: false })}>
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
			</View >
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
)(Appoinment);

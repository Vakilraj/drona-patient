import React, { useState } from 'react';
import {
	View,
	Text,
	ImageBackground, Image, SectionList, TouchableOpacity, Keyboard,Platform
} from 'react-native';
import styles from './style';
import Moment from 'moment';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Add from '../../../assets/plus.png';
import icMenu from '../../../assets/ic_menu.png';
import patient_background from '../../../assets/patient_background.png';
import finding_patient from '../../../assets/finding_patient.png';
import search_blue from '../../../assets/search_blue.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationEvents } from 'react-navigation';
import _ from 'lodash';
import vector_phone from '../../../assets/vector_phone.png';
import down from '../../../assets/down.png';
import Trace from '../../service/Trace'
const signalR = require("@microsoft/signalr");
let connection=null;
let dateArr = [], selectedIndex = 1;
class Patients extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			dataArray: [],
			dateTab: [],
			isModalVisible: false,
			isModalVisibleCalendar: false,
			completedArray: [],
			walikInArray: [],
			CancelApoinArray: [],
			MarkAsNoShowArray: [],
			showHeaderDate: '',
			dateForfullCalendar: '',
		};
	}
	componentDidMount() {
		let { actions, signupDetails } = this.props;
        let timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +"Patient_Tab_Time",  signupDetails.firebaseLocation);
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Patient_Tab_Time", {'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })

		this.getSearchData();

		let rawData = [
			{ firstName: 'Cake', id: 7 },
			{ firstName: 'animals', id: 10 },
			{ firstName: 'Batteries', id: 7 },
			{ firstName: 'Baggage', id: 12 },
		]
		rawData.sort(function (a, b) {
			return a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase());
		})
		let dataArray = rawData.reduce((r, e) => {
			// get first letter of name of current element
			let group = e.firstName[0];
			// if there is no property in accumulator with this letter create it
			if (!r[group]) r[group] = { group, data: [e] }
			// if there is push current element to children array for that letter
			else r[group].data.push(e);
			// return accumulator
			return r;
		}, {})

		Keyboard.dismiss(0);

		connection = new signalR.HubConnectionBuilder()
		.withUrl("https://mnkdronaqueuefuncappdev.azurewebsites.net/api")
		.build();
	
	connection.on('UpdatePatientList_' + signupDetails.UserGuid, data => {
		// console.log('---------'+JSON.stringify(data));
		 alert('--'+JSON.stringify(data));
		 this.getSearchData();
	});
	connection.start()
		.then(() => connection.invoke("currentUser", "Hello"));
	}

	componentWillUnmount(){
		if(connection)
		connection.stop();
        Trace.stopTrace();
		// console.log('patient tab');
    }
	
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'patientList') {
				let data = newProps.responseData.data;
				if (data && data.length > 0) {
					data.sort(function (a, b) {
						return a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase());
					})
					//console.log('------data----'+JSON.stringify(data))
					let dataArray = data.reduce((r, e) => {
						// get first letter of name of current element
						let group = e.firstName[0].toLowerCase();
						// if there is no property in accumulator with this letter create it
						if (!r[group]) r[group] = { group, data: [e] }
						// if there is push current element to children array for that letter
						else r[group].data.push(e);
						// return accumulator
						return r;
					}, {})
					this.setState({ dataArray: Object.values(dataArray) });
				} else {
					this.setState({ dataArray: [] });
				}
			}
		}
	}
	renderSeparator = () => {
		return <View style={styles.seperatorPatient} />;
	};
	Refresh=()=>{
		//this.getSearchData();
	}
	renderList = (item, index) => {
		//console.log("item - - -",JSON.stringify(item));
		return (
			<View>
				<TouchableOpacity style={{ flexDirection: 'row', marginLeft: 5, marginRight: 5, backgroundColor: Color.white, height: responsiveHeight(10), alignItems: 'center' }} onPress={() => {
					let { actions, signupDetails } = this.props;
					signupDetails.appoinmentGuid = '';
					signupDetails.selectedDate='';
					signupDetails.patientGuid = item.patientGuid;
					signupDetails.patientProfileUrl = item.patientImageUrl ? item.patientImageUrl : '';
					actions.setSignupDetails(signupDetails);
					
					this.props.nav.navigation.navigate('Consultation', { item: item, date: Moment(new Date()).format("YYYY-MM-DD"), appointmentStatus: 'CheckedIn',Refresh:this.Refresh });
				}}>
					<View style={{ flex: 1.1, alignItems: 'center' }}>
						<View style={styles.profileRoundImg} >
							{item.imageUrl ?
								<Image style={{ width: responsiveWidth(11), height: responsiveWidth(11), borderRadius: responsiveWidth(6), justifyContent: 'center', alignItems: 'center' }} source={{ uri: item.imageUrl }} /> :
								<Text style={{ fontSize: CustomFont.font14, color: Color.profileImageText, fontFamily: CustomFont.fontName, fontWeight: '400', justifyContent: 'center', alignItems: 'center' }}>{this.nameFormat(item)}</Text>}
						</View>
					</View>
					<View style={{ flex: 4, marginLeft: 5, marginTop: responsiveHeight(2.5), marginBottom: 10 }}>
						<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.patientSearchName, lineHeight: 16, fontFamily: CustomFont.fontNameBold, textTransform: 'capitalize' }}>{item.patientName.replace('  ', ' ')}</Text>
						<View style={{ flexDirection: 'row', marginTop: 3, alignItems: 'center' }}>
							<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '700' }}>{item.gender.charAt(0)} </Text>
							<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500' }}>{item.age}</Text>
							<Image source={vector_phone} style={{ resizeMode: 'contain', width: responsiveWidth(5), height: responsiveWidth(5), marginLeft: 7, marginTop: 0, justifyContent: 'center', alignItems: 'center' }} />
							<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500', marginLeft: 1 }}>{item.phoneNumber}</Text>

						</View>
					</View>
					<View style={{ flex: 1.2 }}>
						<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500' }}>{item.appointmentStartTime}</Text>
						<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500' }}>{item.consultationType}</Text>
					</View>
				</TouchableOpacity>
				<View style={{ height: 2, backgroundColor: Color.patientBackground, marginTop: 5 }} />
			</View>

		);
	};

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
	getSearchData = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"Data": {
				"phoneNumber": null
			}

		}
		actions.callLogin('V1/FuncForDrAppToGetAddPatientList', 'post', params, signupDetails.accessToken, 'patientList');
	}
	render() {
		let { actions, signupDetails } = this.props;

		return (
			<View style={Platform.OS == 'android' ? styles.containerAndroid: styles.container}>
				<NavigationEvents onDidFocus={() => this.getSearchData()} />
				<View style={{ flexDirection: 'row', backgroundColor: Color.white, height: responsiveHeight(7) }}>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<TouchableOpacity onPress={() => this.props.nav.navigation.openDrawer()}>

							<Image style={{ resizeMode: 'contain', width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), marginLeft: responsiveWidth(2.1), marginTop: responsiveHeight(.35) }} source={icMenu} />

						</TouchableOpacity>
					</View>
					<TouchableOpacity style={{ flex: 7, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.nav.navigation.navigate('ClinicList')}>
						{/* <View style={{ backgroundColor: Color.patientCircle, height: responsiveFontSize(3), width: responsiveFontSize(3), borderRadius: responsiveFontSize(2), marginLeft: 10 }} />
						 */}
						<View style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), borderRadius: responsiveFontSize(1.5), backgroundColor: '#47C1BF', borderColor: Color.white, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
							{signupDetails.clinicImageUrl ?
								<Image
									source={{ uri: signupDetails.clinicImageUrl }}
									style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), borderRadius: responsiveFontSize(1.5) }}
								/>
								: <Text style={{ fontSize: CustomFont.font12, color: Color.white, textTransform: 'uppercase' }}>{this.makeShortName(signupDetails.clinicName)}</Text>
							}
						</View>

						<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: responsiveWidth(2), fontFamily: CustomFont.fontName, fontWeight: '500', textTransform: 'capitalize', }}>{signupDetails.clinicName && signupDetails.clinicName.length > 28 ? signupDetails.clinicName.substring(0, 26) + '...' : signupDetails.clinicName}</Text>

						<TouchableOpacity style={{ marginLeft: 10, marginTop: -5 }} onPress={() => this.props.nav.navigation.navigate('ClinicList')}>
							<Image source={down} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginTop: responsiveHeight(1) }} />

						</TouchableOpacity>

					</TouchableOpacity>

					<TouchableOpacity style={{ flex: .8, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
						this.props.nav.navigation.navigate('SearchPatients', { from: 'home',Refresh:this.Refresh });
						//this.props.nav.navigation.navigate('PatientsListForConsultant')
					}}>
						<Image style={{ resizeMode: 'contain', height: responsiveWidth(6), width: responsiveWidth(6), marginLeft: responsiveWidth(2.1), marginRight: responsiveWidth(2.1) }} source={search_blue} />
					</TouchableOpacity>
				</View>

				{this.state.dataArray.length > 0 ?
					<View style={{ flex: 1, backgroundColor: Color.white, borderRadius: 10, margin: 10 }}>
						<SectionList
							stickySectionHeadersEnabled={false}
							sections={this.state.dataArray}
							//style={{ marginStart: 20, marginEnd: 20, maxHeight: Platform.OS === 'ios' ? responsiveHeight(85) : responsiveHeight(90) }}
							renderItem={({ item, index }) => this.renderList(item, index)}
							renderSectionHeader={({ section }) => <Text style={{ marginLeft: responsiveWidth(7), fontSize: CustomFont.font14, fontWeight: 'bold', marginBottom: responsiveHeight(2), marginTop: responsiveHeight(4), color: Color.fontColor }}>{section.group.toUpperCase()}</Text>}
							//ItemSeparatorComponent={this.renderSeparator}
							keyExtractor={(item, index) => index} />

						{/* <FlatList style={{ margin: 6 }}
							data={this.state.dataArray}
							//contentContainerStyle={{ borderRadius: 15, }}
							ItemSeparatorComponent={this.renderSeparator}
							renderItem={this.renderList}
							extraData={this.state}
							keyExtractor={(item, index) => index.toString()}
						/> */}
					</View>

					:
					<View style={{ flex: 1, backgroundColor: Color.patientBackground, alignItems: 'center', }}>
						<ImageBackground source={patient_background} style={{ height: responsiveFontSize(25), width: responsiveFontSize(25), marginTop: responsiveFontSize(10), justifyContent: 'center', alignItems: 'center', resizeMode: 'contain' }}>

							<Image source={finding_patient} style={{ height: responsiveFontSize(16), width: responsiveFontSize(16), resizeMode: 'cover', marginTop: responsiveFontSize(2) }} />


						</ImageBackground>
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.patientTextColor, textAlign: 'center', lineHeight: CustomFont.font22, fontWeight: '400', marginTop: responsiveFontSize(1) }}>No patients in your clinic yet</Text>

						<TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(44), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.addAppointmentBackground, borderRadius: 5, marginTop: responsiveHeight(5) }}
							onPress={() => {
								this.props.nav.navigation.navigate('SearchPatients', { from: 'AddPatient',Refresh:this.Refresh })

							}}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.primary }}>Add Patient</Text>
						</TouchableOpacity>

					</View>}

				<TouchableOpacity style={styles.addPost} onPress={() => this.props.nav.navigation.navigate('SearchPatients', { from: 'AddPatient',Refresh:this.Refresh })}>
					<Image source={Add} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain' }} />
				</TouchableOpacity>

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
)(Patients);

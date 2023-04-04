import React, { useState } from 'react';
import {
	SafeAreaView, ScrollView,
	View,
	Text, Image, TextInput, FlatList, BackHandler, TouchableOpacity
} from 'react-native';
import styles from './style';
import Modal from 'react-native-modal';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import search_patient from '../../../assets/search_patient.png';
import arrowBack from '../../../assets/back_blue.png';
import cross_white from '../../../assets/Vector-512.png';
import addPatinent from '../../../assets/addPatinent.png';
import vector_phone from '../../../assets/vector_phone.png';
import _ from 'lodash';
import Moment from 'moment';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLogEvent } from '../../service/Analytics';
import { NavigationEvents } from 'react-navigation';
import Validator from '../../components/Validator';
let fullArray = [], fullArrayGlobal = [], selectedItem = null, timeslot = null, isEdit = false;

class SearchPatients extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			count: 0,
			dataArray: [],
			searchTxt: '',
			recentDataArr: [],
			showDateTime: '',
			isModalVisible: false,
			selectedName: '',
			selectedPhone: '',
			itemForDialog: null,
			fname: '',
			lname: '',
			imageDialog: null,
			fld1: Color.inputdefaultBorder,
			selectedGender: '',
			addPatientType: '',
			patientNumber: '',
			addPatientStatus: 'aa',
			AddPatientWithNumberStatus: false
		};
		fullArray = [];

	}
	callOnFocus = () => {
		this.setState({ fld1: Color.primary })
	}
	callOnBlur = () => {
		this.setState({ fld1: Color.inputdefaultBorder })
	}
	async componentDidMount() {
		isEdit = false;
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack()
			try {
				if (isEdit)
				this.props.navigation.state.params.Refresh();
			} catch (error) {
				
			}
			
		})
		try {
			if (this.props.navigation.state.params.from === 'AddAppoinment') {
				//alert('xxxx')
				this.setState({ addPatientType: 'fromappointment' })
				timeslot = this.props.navigation.state.params.item;
				let selday = DRONA.getSelectedAppoinDate();
				let showDate = Moment(selday).format('DD MMM YYYY');
				this.setState({ showDateTime: timeslot.availableTime + ', ' + showDate })
			}
			else {
				//alert('yyyy')
				this.setState({ addPatientType: 'frompatient' })
			}
		} catch (e) { }
		this.getSearchData();
	}
	// patientSort = (pArray) => {
	// 	return pArray.sort((a, b) => a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase()));
	// }
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'searchPatient') {
				if (newProps.responseData.statusCode && newProps.responseData.data) {
					fullArray = newProps.responseData.data;
					this.setState({ dataArray: fullArray, AddPatientWithNumberStatus: false });
				} else {
					this.setState({ dataArray: [], AddPatientWithNumberStatus: true });
				}
			} else if (tagname === 'searchPatientGlibal') {

				if (newProps.responseData.statusCode && newProps.responseData.data) {
					fullArrayGlobal = newProps.responseData.data;

					// let sortedArray = this.patientSort(fullArrayGlobal);
					this.setState({ dataArray: sortedArray, AddPatientWithNumberStatus: false });

				} else {
					this.setState({ dataArray: [], AddPatientWithNumberStatus: true });
				}
			}

			// tempArr.splice(0, 0, { patientName: 'AddnewPatient', phoneNumber: 'AddnewPatient' })

		}
	}
	getNamechar = (fname, lname) => {
		fname = fname ? fname.trim() : '';
		lname = lname ? lname.trim() : '';
		let str = '';
		try {
			if (!lname) {
				str = fname.substr(0, 2);
			} else if (fname && lname) {
				str = fname.substr(0, 1) + lname.substr(0, 1);
			}
		} catch (e) { }
		return str ? str.toUpperCase() : str;
	}
	renderSeparator = () => {
		return <View style={styles.seperatorPatient} />;
	};

	SearchFilterFunction = (text) => {
		let { actions, signupDetails } = this.props;
		let eventName = DRONA.getClinicType() === "WalkIns" ? "add_walkin" : DRONA.getClinicType() === "InClinic" ? "add_in_clinic" : "add_virtual"
		setLogEvent(eventName, { "search_patient": "search", "userGuid": signupDetails.UserGuid, searchKeyword: text })

			var searchResult = _.filter(fullArray, function (item) {
				let patientName=item.patientName ? item.patientName.replace('  ', ' ').replace('   ', ' '):'';
				return patientName ? patientName.toLowerCase().indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf(text.toLowerCase()) > -1 || item.phoneNumber.indexOf('AddnewPatient') > -1 : null;
			});
		
		this.setState({
			dataArray: searchResult ? searchResult : [], searchTxt: text
		});

		if (text.length === 10 && Validator.isMobileValidate(text)) {
			this.setState({ AddPatientWithNumberStatus: false });
			setTimeout(() => {
				//if (this.state.dataArray.length == 1) {

				let params = {
					"RoleCode": signupDetails.roleCode,
					"UserGuid": signupDetails.UserGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"Version": "",
					"Data": {
						"phoneNumber": text
					}
				}
				actions.callLogin('V1/FuncForDrAppToGetAddPatientList', 'post', params, signupDetails.accessToken, 'searchPatientGlibal');
				//}
			}, 1000)
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
				str = year + ' y'
			}
			if (month) {
				str += str.length > 0 ? ', ' + month + ' m' : month + ' m';
			}
			if (day) {
				str += str.length > 0 ? ', ' + day + ' d' : day + ' d';
			}
		}
		return str;
	}

	selectPatientForAdd = (item) => {
		try {
			this.setState({ selectedName: item.patientName, selectedPhone: item.phoneNumber, fname: item.firstName, lname: item.lastName, imageDialog: item.imageUrl, selectedGender: item.gAge })
		} catch (e) { }
		this.setState({ isModalVisible: true })
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
				"phoneNumber": this.state.patientNumber && this.state.patientNumber.length == 10 && Validator.isMobileValidate(this.state.patientNumber) ? this.state.patientNumber : null
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetAddPatientList', 'post', params, signupDetails.accessToken, 'searchPatient');
	}

	renderList = ({ item, index }) => {
		return (
			<View>
				{this.state.patientNumber.length >= 2 ?
					<TouchableOpacity style={{ flexDirection: 'row', marginTop: 1, backgroundColor: Color.white, height: responsiveHeight(10), alignItems: 'center', paddingStart: 10, paddingEnd: 10 }}
						onPress={() => {
							if (this.props.navigation.state.params.from === 'AddAppoinment') {
								// {
								// 	DRONA.getClinicType() === 'WalkIns' ?
								// 	this.props.navigation.navigate('ConfirmAppointment', { item: item, timeslot: null })
								// 	:
									//this.props.navigation.navigate('ConfirmAppointment', { item: item, timeslot: DRONA.getClinicType() === 'WalkIns' ? null:timeslot })
									this.props.navigation.navigate('AddFamilyMember', { item: item, timeslot: timeslot,Refresh: this.Refresh })
								//}
							} else {
								selectedItem = item;
								//this.selectPatientForAdd(item);
								let { actions, signupDetails } = this.props;
								signupDetails.appoinmentGuid = '';
								signupDetails.selectedDate = '';
								signupDetails.patientGuid = item.patientGuid;
								signupDetails.patientProfileUrl = item.patientImageUrl ? item.patientImageUrl : '';
								actions.setSignupDetails(signupDetails);
								this.props.navigation.navigate('Consultation', { item: item, date: '', appointmentStatus: 'CheckedIn', Refresh: this.Refresh });
							}
						}}>
						<View style={{ flex: .9, alignItems: 'center', justifyContent: 'center', alignItems: 'center' }}>
							<View style={styles.profileRoundImg} >
								{item.imageUrl ?
									<Image source={{ uri: item.imageUrl }} style={styles.profileImg} />
									: <Text style={{ fontSize: CustomFont.font14, color: Color.profileImageText, fontFamily: CustomFont.fontName, fontWeight: '400', justifyContent: 'center', alignItems: 'center' }}>{this.getNamechar(item.firstName, item.lastName)}</Text>}
							</View>
						</View>
						<View style={{ flex: 4, marginLeft: 5, marginTop: responsiveHeight(2.5) }}>
							<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.patientSearchName, lineHeight: 16, fontFamily: CustomFont.fontNameBold, textTransform: 'capitalize' }}>{item.patientName.replace('  ', ' ')}</Text>
							<View style={{ flexDirection: 'row', marginTop: 3, }}>
								<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '700' }}>{item.gender ? item.gender : item.genderName}</Text>
								<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '500', marginLeft: 5 }}>{item.age}</Text>
								<Image source={vector_phone} style={{ resizeMode: 'contain', width: responsiveWidth(5), height: responsiveWidth(5), marginLeft: 7, marginTop: 0, justifyContent: 'center', alignItems: 'center' }} />
								<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500', marginLeft: 1 }}>{item.phoneNumber ? item.phoneNumber : item.contactNumber}</Text>
							</View>
						</View>
					</TouchableOpacity>
					:
					null}
			</View>
		)
	};
	Refresh = () => {
		this.getSearchData();
		isEdit = true;
	}
	onEditPatient = (data) => {
		// need for navigation. Dont delete this method
	}
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={CommonStyle.container}>
				{/* <NavigationEvents onDidFocus={() => this.getSearchData()} /> */}
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					{this.props.navigation.state.params.from === 'AddAppoinment' ?
						<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Color.white, padding: 10 }}>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableOpacity style={{ padding: 10 }} onPress={() => {
									this.props.navigation.goBack()
									try {
										if (isEdit)
										this.props.navigation.state.params.Refresh();
									} catch (error) {
										
									}
								}}>
									<Image source={arrowBack} style={{ width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
								</TouchableOpacity>
							</View>
							<View style={{ flex: 6, justifyContent: 'center' }}>

								{DRONA.getClinicType() === 'WalkIns' ?
									<Text style={{ fontSize: CustomFont.font16, color: Color.patientSearch, marginLeft: responsiveWidth(3), fontWeight: '700' }}>{Moment(new Date()).format('YYYY-MM-DD')}</Text>
									:
									<Text style={{ fontSize: CustomFont.font16, color: Color.patientSearch, marginLeft: responsiveWidth(3), fontWeight: '700' }}>{this.state.showDateTime}</Text>
								}
								{/* <Text style={{ fontSize: CustomFont.font12, color: Color.lightGrayTxt, marginLeft: responsiveWidth(3) }}>{DRONA.getClinicType() === 'InClinic' ? 'In-Clinic' : 'Virtual'}</Text>
							 */}
							</View>
							{/* <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.props.navigation.goBack(); this.setState({ searchTxt: '', dataArray: fullArray }) }}>
								<Image source={cross_white} style={{ tintColor: Color.primary }} />
							</TouchableOpacity> */}
						</View> : <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.white }}>
							<TouchableOpacity onPress={() => {
								this.props.navigation.goBack()
								try {
									if (isEdit)
									this.props.navigation.state.params.Refresh();
								} catch (error) {
									
								}
							}} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
								<TouchableOpacity onPress={() => {
									this.props.navigation.goBack()
									try {
										if (isEdit)
										this.props.navigation.state.params.Refresh();
									} catch (error) {
										
									}
								}} >
									<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
								</TouchableOpacity>
								<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font16, fontWeight: 'bold', marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>Add Patient</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {
								this.props.navigation.goBack()
								try {
									if (isEdit)
									this.props.navigation.state.params.Refresh();
								} catch (error) {
									
								}
								this.setState({ searchTxt: '', dataArray: fullArray });
							}} >
								<Image source={cross_white} style={{ tintColor: Color.primary, marginEnd: 10, width: responsiveFontSize(1.8), height: responsiveFontSize(1.8) }} />
							</TouchableOpacity>
						</View>}

					<View style={{ backgroundColor: Color.patientSearchBackgroundLight }}>
						<TextInput returnKeyType="done"
							onFocus={this.callOnFocus}
							onBlur={this.callOnBlur}
							maxLength={10}
							//keyboardType={'phone-pad'}
							placeholderTextColor={Color.placeHolderColor}
							style={{
								margin: 10, padding: 0, backgroundColor: Color.patientSearchBg, height: responsiveHeight(5.5), borderRadius: 5, paddingLeft: 10, paddingRight: 10, marginLeft: responsiveWidth(4),
								marginRight: responsiveWidth(4), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName,
								color: Color.patientSearch, fontWeight: '400', letterSpacing: 1
							}} placeholder={this.state.addPatientType == 'frompatient' ? "Search by patient name or mobile number" : "Search by patient name or mobile number"} value={this.state.searchTxt}
							onChangeText={(searchTxt) => {
								this.setState({ patientNumber: searchTxt });
								return this.SearchFilterFunction(searchTxt);
							}} />
					</View>
					{this.state.patientNumber.length > 1 ? null :
						<View style={{ justifyContent: 'center', borderRadius: 15, alignItems: 'center' }}>
							<Image source={search_patient} style={{ marginTop: responsiveHeight(10) }} />
							<Text style={{ fontSize: CustomFont.font14, color: Color.mediumGrayTxt, textAlign: 'center', marginTop: responsiveHeight(3) }}>Start typing patient's {'\n'} 10 digit mobile number or name</Text>
						</View>
					}

					{this.state.dataArray && this.state.dataArray.length > 0 ?
						<FlatList style={{ backgroundColor: Color.patientBackground, margin: 20 }}
							data={this.state.dataArray}
							contentContainerStyle={{ borderRadius: 15, overflow: 'hidden' }}
							ItemSeparatorComponent={this.renderSeparator}
							renderItem={this.renderList}
							extraData={this.state}
							keyExtractor={(item, index) => index.toString()}
						/> :
						<View style={{ margin: responsiveWidth(3), borderRadius: 15, alignItems: 'center' }}>
							{this.state.AddPatientWithNumberStatus && this.state.patientNumber && this.state.patientNumber.length == 10 && Validator.isMobileValidate(this.state.patientNumber) ?
								<View style={{ alignItems: 'center' }}>
									<TouchableOpacity style={{ flexDirection: 'row', marginTop: 1, backgroundColor: Color.white, height: responsiveHeight(10), width: responsiveWidth(90), alignItems: 'center', paddingStart: 10, paddingEnd: 10 }}
										onPress={() => {
											let { signupDetails } = this.props;
											let eventName = DRONA.getClinicType() === "WalkIns" ? "add_walkin" : DRONA.getClinicType() === "InClinic" ? "add_in_clinic" : "add_virtual"
											setLogEvent(eventName, { "add_new_patient": "click", UserGuid: signupDetails.UserGuid })
											this.props.navigation.navigate('AddNewPatients', { item: this.state.patientNumber, from: 'add', timeslot: timeslot, fromwhere: this.state.addPatientType, Refresh: this.Refresh,onEditPatient: this.onEditPatient })
										}}>
										<View style={{ flex: .9, alignItems: 'center' }}>
											<View style={styles.addPost}>
												<Image source={addPatinent} style={{ height: 40, width: 40, resizeMode: 'contain' }} />
											</View>
										</View>
										<View style={{ flex: 4, marginLeft: 2 }}>
											<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.primary, fontFamily: CustomFont.fontName }}>Add New Patient for "{this.state.patientNumber}"</Text>
										</View>

									</TouchableOpacity>
									<Image source={search_patient} style={{ marginTop: responsiveHeight(10), }} />
									<Text style={{ fontSize: CustomFont.font14, color: Color.mediumGrayTxt, textAlign: 'center', marginTop: responsiveHeight(3) }}>Searched Patient not found</Text>
								</View>
								: this.state.dataArray && this.state.dataArray.length == 0 && this.state.patientNumber.length > 1? <View style = {{alignItems : 'center'}}>
								<Image source={search_patient} style={{ marginTop: responsiveHeight(10), }} />
								<Text style={{ fontSize: CustomFont.font14, color: Color.mediumGrayTxt, textAlign: 'center', marginTop: responsiveHeight(3) }}>Searched Patient not found</Text>
							</View>: null}

						{/* <Image source={search_patient} style={{ marginTop: responsiveHeight(10) }} />
						<Text style={{ fontSize: CustomFont.font14, color: Color.mediumGrayTxt, textAlign: 'center', marginTop: responsiveHeight(3) }}>Start typing patient's {'\n'} 10 digit mobile number or name</Text> */}

						</View>
					}
					
				</View>

				<Modal isVisible={this.state.isModalVisible} avoidKeyboard={true}>

					<View style={{ ...styles.modelView, height: responsiveHeight(75) }}>

						<ScrollView>
							{/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 15 }} onPress={() => this.setState({ isModalVisible: false })} >
								<Image source={arrow} style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.6), resizeMode: 'contain' }} />
								<Text style={{ fontSize: CustomFont.font16, color: Color.fontColor, marginLeft: responsiveWidth(3) }}>Back</Text>
							</TouchableOpacity> */}
							<View style={{ alignItems: 'center' }}>
								{this.state.searchTxt.length === 10 ?
									<View style={{ height: responsiveHeight(10), width: '100%', marginTop: responsiveHeight(4), position: 'absolute', left: 0, top: 0 }}>
										<Text style={{ fontSize: CustomFont.font18, color: Color.black, fontFamily: CustomFont.fontName, fontWeight: 'bold', position: 'absolute', left: responsiveHeight(5) }}>A patient already exists with {'\n'}this phone number</Text>
									</View> : null}
								<TouchableOpacity style={{ height: responsiveHeight(10), width: '100%', marginTop: responsiveHeight(4) }} onPress={() => this.setState({ isModalVisible: false })}>
									{/* <Image source={closeImage} style={{ width: responsiveHeight(2), height: responsiveHeight(2),resizeMode:'contain', position: 'absolute', right: responsiveHeight(5) }} />
								     */}
									<Image source={cross_white} style={{ tintColor: Color.primary, position: 'absolute', right: responsiveHeight(3), width: responsiveFontSize(1.8), height: responsiveFontSize(1.8) }} />
								</TouchableOpacity>
								<View style={{ flexDirection: 'row', backgroundColor: '#F8F8F8', borderRadius: 5, height: responsiveHeight(12), alignItems: 'center', marginTop: responsiveHeight(1), width: responsiveWidth(90) }}>
									<View style={{ flex: 1, marginLeft: 20, }}>
										<View style={styles.profileRoundImg}>
											{this.state.imageDialog ? <Image source={{ uri: this.state.imageDialog }} style={styles.profileImg} /> : this.state.fname ? <Text style={{ fontSize: CustomFont.font14, color: Color.profileImageText, fontFamily: CustomFont.fontName, fontWeight: '400', justifyContent: 'center', alignItems: 'center' }}>{this.getNamechar(this.state.fname, this.state.lname)}</Text> : <Text style={{ fontSize: CustomFont.font14, color: Color.profileImageText, fontFamily: CustomFont.fontName, fontWeight: '400', justifyContent: 'center', alignItems: 'center' }}>CS</Text>}
										</View>
									</View>
									<View style={{ flex: 4, marginLeft: 5, marginTop: responsiveHeight(2.5) }}>
										<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.patientSearchName, lineHeight: 16, fontFamily: CustomFont.fontNameBold, textTransform: 'capitalize' }}>{this.state.selectedName}</Text>
										<View style={{ flexDirection: 'row', marginTop: 3, }}>
											<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '500' }}>{this.state.selectedGender}</Text>
											<Image source={vector_phone} style={{ resizeMode: 'contain', width: responsiveWidth(5), height: responsiveWidth(5), marginLeft: 7, marginTop: 0, justifyContent: 'center', alignItems: 'center' }} />
											<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500', marginLeft: 1 }}>{this.state.selectedPhone}</Text>
										</View>
									</View>
									{/* <View style={{ flex: 5, marginLeft: 10 }}>
										<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: 'bold', textTransform: 'capitalize' }}>"{this.state.selectedName}"</Text>
										<Text style={{ fontSize: CustomFont.font13, color: Color.fontColor, opacity: .8 }}>{this.state.selectedPhone}</Text>
									</View> */}
								</View>

								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), backgroundColor: Color.primary, marginTop: responsiveHeight(3), width: responsiveWidth(90) }}
									onPress={() => {
										this.props.navigation.navigate('AddNewPatients', { item: selectedItem, from: 'edit', Refresh: this.Refresh,onEditPatient: this.onEditPatient });
										this.setState({ isModalVisible: false })
									}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center', fontWeight: 'bold' }}>Edit Patient</Text>
								</TouchableOpacity>

								
							</View>
						</ScrollView>

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
)(SearchPatients);

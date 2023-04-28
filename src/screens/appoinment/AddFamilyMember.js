import React, { useState } from 'react';
import {
	SafeAreaView, ScrollView,
	View,
	Text, Image, TextInput, FlatList, BackHandler, TouchableOpacity, Alert
} from 'react-native';
import styles from './style';
import Modal from 'react-native-modal';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import noFamily from '../../../assets/noFamily.png';
import arrowBack from '../../../assets/back_blue.png';
import AddFamilyIcon from '../../../assets/addFam.png';
import addPatinent from '../../../assets/addPatinent.png';
import vector_phone from '../../../assets/vector_phone.png';
import _ from 'lodash';
import Moment from 'moment';
import radioSelected from '../../../assets/radioSelected.png';
import radioNotSelected from '../../../assets/radioNotSelected.png';
import EditIcon from '../../../assets/edit_primary.png';
import SelectedIcon from '../../../assets/selected.png';
import Toolbar from '../../customviews/Toolbar.js';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Snackbar from 'react-native-snackbar';
let fullArray = [], fullArrayGlobal = [], selectedItem = null, timeslot = null, isEdit = false;
let item = null, selectFamilyMemberObj = null,selfObj = null;
let tempDob = '', patientFamilyMemberData=null;
class AddFamily extends React.Component {


	constructor(props) {
		super(props);
		this.state = {

			selectedUserType: '',
			isFamilyMemberSelected: false,
			familyMemberArr: [],
			parentFName: '',
			parentLName: '',
			parentAge: '',
			parentGender: '',
			parentContactNumber: '',
			parentImageUrl: '',
			showDateTime:''

		};
		isEdit = false;
	}

	async componentDidMount() {
		item = this.props.navigation.state.params.item;
		console.log('add family parent data ====>' + JSON.stringify(item));
		if (item) {
			if(item.age == null)
			{
				Snackbar.show({ text: 'Please enter patient\'s Age to continue', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });

				this.props.navigation.navigate('AddNewPatients', { item: item, from: 'editfamily', isGetData: true, Refresh: this.Refresh, onEditPatient: this.onEditPatient,patientFamilyMemberData: null });
			}
			else
			{
				let tempDobArr = item.dateOfBirth.split(' ');
				tempDob = tempDobArr[0];
				if (item.relationName)
					this.selectPatientType(item.relationName);
			}
		}
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack()
					try {
						if (isEdit)
							this.props.navigation.state.params.Refresh();
					} catch (error) {

					}
		})

		this.getAllFamilyMemberData();
		try {
			let timeslot = this.props.navigation.state.params.timeslot;
				let selday = DRONA.getSelectedAppoinDate();
				let showDate = Moment(selday).format('DD MMM YYYY');
				this.setState({ showDateTime: timeslot.availableTime + ', ' + showDate })
			
		} catch (e) { }
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'getFamilyMember') {
				if (newProps.responseData.statusCode && newProps.responseData.data) {
					let data = newProps.responseData.data;
					let tempArr = data.patientDetailsList && data.patientDetailsList.fmailyMimberList ? data.patientDetailsList.fmailyMimberList : [];
					// alert(JSON.stringify(item));
					patientFamilyMemberData = data;
					if (tempArr && tempArr.length > 0) {
						try {
							for (let i = 0; i < tempArr.length; i++) {
								if (item.patientGuid == tempArr[i].patientGuid) {
									tempArr[i].isSelect = true;
									selectFamilyMemberObj = tempArr[i];
								}
								else
									tempArr[i].isSelect = false;
							}
							tempArr.sort((a, b) => a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase()));
						} catch (error) {
							
						}
						
					}
						let parentDetails = data.patientDetailsList;
						this.setState({
							familyMemberArr: tempArr,
							parentFName: parentDetails.firstName,
							parentLName: parentDetails.lastName,
							parentAge: parentDetails.age,
							parentGender: parentDetails.gender == 'Male' ? 'M' : 'F',
							parentContactNumber: parentDetails.phoneNumber,
							parentImageUrl: parentDetails.patientImage,
						});
						selfObj={"patientGuid":parentDetails.patientGuid,
						"firstName":parentDetails.firstName,
						"middleName":"",
						"lastName":parentDetails.lastName,
						"patientName":parentDetails.firstName +' '+parentDetails.lastName,
						"gender":parentDetails.gender,
						"dob":"1999-04-04 00:00:00.000000",
						"phoneNumber":parentDetails.phoneNumber,
						"relationGuid":"2ad73e08-45aa-11eb-bdf4-0022486bc409",
						"relationName":"Brother",
						"emailAddress":"",
						"refferedBy":"",
						"age":""}
						if (selectFamilyMemberObj)
							this.setState({ isFamilyMemberSelected: true })
				} else {
					this.setState({ familyMemberArr: [], });
				}
			}
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

	selectPatientForAdd = (item) => {
		try {
			this.setState({ selectedName: item.patientName, selectedPhone: item.phoneNumber, fname: item.firstName, lname: item.lastName, imageDialog: item.imageUrl, selectedGender: item.gAge })
		} catch (e) { }
		this.setState({ isModalVisible: true })
	}

	getAllFamilyMemberData = () => {
		selectFamilyMemberObj = null;
		let item = this.props.navigation.state.params.item ? this.props.navigation.state.params.item : '';
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Data": { 
				"PatientGuid": item.patientGuid 
			}
		}
		actions.callLogin('V16/FuncForDrAppToGetPatientDetailsById', 'post', params, signupDetails.accessToken, 'getFamilyMember');
	}

	ContinueToConfirmAppointment = () => {
		let timeslot = this.props.navigation.state.params.timeslot;
		if (this.state.selectedUserType == 'Self') {
			if(selfObj)
			this.props.navigation.navigate('ConfirmAppointment', { item: selfObj, timeslot: DRONA.getClinicType() === 'WalkIns' ? null : timeslot })
			else
			Snackbar.show({ text: 'Something went wrong. Please try again', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
		} else {
			if(selectFamilyMemberObj){
				selectFamilyMemberObj.patientName = selectFamilyMemberObj.firstName + ' ' + selectFamilyMemberObj.lastName;
				console.log('-----11-' + JSON.stringify(selectFamilyMemberObj))
				this.props.navigation.navigate('ConfirmAppointment', { item: selectFamilyMemberObj, timeslot: DRONA.getClinicType() === 'WalkIns' ? null : timeslot })
			}else
			Snackbar.show({ text: 'Please select family member', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
			

		}
	}

	Refresh = () => {
		isEdit=true;
		this.getAllFamilyMemberData();

	}
	addFamilyClk = () => {
		this.props.navigation.navigate('AddNewPatients', { item: item, from: 'addfamily', isGetData: true, Refresh: this.Refresh, onEditPatient: this.onEditPatient,patientFamilyMemberData: patientFamilyMemberData });
	}
	onEditPatient = (data) => {
		// need for navigation. Dont delete this method
	}
	selectPatientType = (type) => {
		if (type == 'Self') {
			this.setState({ selectedUserType: 'Self' })
		}
		else {
			this.setState({ selectedUserType: 'fm' })
		}
	}
	selectFamilyMember = (index, itemClick) => {
		let tempArr = [];
		for (let i = 0; i < this.state.familyMemberArr.length; i++) {
			let tempObj = this.state.familyMemberArr[i];
			if (i == index) {
				tempObj.isSelect = true;
			} else {
				tempObj.isSelect = false;
			}

			tempArr.push(tempObj)
		}
		selectFamilyMemberObj = itemClick;
		console.log('selectFamilyMemberObj------' + JSON.stringify(selectFamilyMemberObj))
		this.setState({ familyMemberArr: tempArr, isFamilyMemberSelected: true })
	}
	editFamilyMember = (item) => {
		this.props.navigation.navigate('AddNewPatients', { item: item, from: 'editfamily', isGetData: true, Refresh: this.Refresh, onEditPatient: this.onEditPatient,patientFamilyMemberData: null });
	}
	renderList = ({ item, index }) => (
		<TouchableOpacity style={{
			flexDirection: 'row', alignItems: 'center',
			paddingBottom: 20, paddingTop: 20
		}}
			onPress={() => this.selectFamilyMember(index, item)}>
			{
				item.isSelect ? <View style={[styles.profileRoundImg]} >
					<Image source={SelectedIcon} style={styles.profileImg} />

				</View> : <View style={[styles.profileRoundImg, { backgroundColor: '#7457AA' }]} >
					{item.imageUrl ?
						<Image source={{ uri: item.imageUrl }} style={styles.profileImg} />
						: <Text style={{
							fontSize: CustomFont.font14, color: Color.white,
							fontFamily: CustomFont.fontName, fontWeight: '400',
							justifyContent: 'center', alignItems: 'center'
						}}>{this.getNamechar(item.firstName, item.lastName)}
						</Text>
					}
				</View>
			}

			<View style={{ flex: 4, marginLeft: 15 }}>
				<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.patientSearchName, fontFamily: CustomFont.fontNameBold, textTransform: 'capitalize' }}>{item.firstName + ' ' + item.lastName} {' (' + item.relationName + ')'} </Text>
				<View style={{ flexDirection: 'row', marginTop: 4, }}>
					<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(0), fontWeight: '700' }}>{item.gender}</Text>
					<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(0), fontWeight: '500', marginLeft: 5 }}>{item.age}</Text>
					<Image source={vector_phone} style={{ resizeMode: 'contain', width: responsiveWidth(5), height: responsiveWidth(5), marginLeft: 7, marginTop: 0, justifyContent: 'center', alignItems: 'center' }} />
					<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500', marginLeft: 1 }}>{item.phoneNumber}</Text>
				</View>
			</View>
			<TouchableOpacity onPress={() => this.editFamilyMember(item)} style={{ padding: 5 }}>
				<Image style={{ resizeMode: 'contain', height: responsiveHeight(4), width: responsiveWidth(4) }} source={EditIcon} />
			</TouchableOpacity>

		</TouchableOpacity>
	);
	render() {
		let { actions, signupDetails } = this.props;
		item = this.props.navigation.state.params.item;
		return (
			<SafeAreaView style={CommonStyle.container}>
				<Toolbar title={this.state.showDateTime} onBackPress={() => {
					this.props.navigation.goBack()
					try {
						if (isEdit)
							this.props.navigation.state.params.Refresh();
					} catch (error) {

					}
				}} />

				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					<View style={{
						margin: responsiveWidth(3), marginTop: responsiveHeight(2),
						justifyContent: 'center', padding: responsiveHeight(2), backgroundColor: Color.white, borderRadius: 10
					}}>
						<Text style={{
							textAlign: 'left', fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.patientSearchName,
							fontFamily: CustomFont.fontName, textTransform: 'capitalize', marginBottom: 15
						}}>Patient</Text>
						<View style={{ flexDirection: 'row', }}>
							<View style={[styles.profileRoundImg, { backgroundColor: '#7457AA' }]} >
								{this.state.parentImageUrl ?
									<Image source={{ uri: this.state.parentImageUrl }} style={styles.profileImg} />
									: <Text style={{ fontSize: CustomFont.font14, color: Color.white, fontFamily: CustomFont.fontName, fontWeight: '400', justifyContent: 'center', alignItems: 'center' }}>{this.getNamechar(this.state.parentFName, this.state.parentLName)}</Text>}
							</View>
							<View style={{ flex: 4, marginLeft: 15 }}>
								<Text style={{ fontSize: CustomFont.font14, fontWeight: 'bold', color: Color.patientSearchName, fontFamily: CustomFont.fontNameBold, textTransform: 'capitalize' }}>{this.state.parentFName} {this.state.parentLName} </Text>
								<View style={{ flexDirection: 'row', marginTop: 4, }}>
									<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '700' }}>{this.state.parentGender}</Text>
									<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, marginBottom: responsiveHeight(1.4), fontWeight: '500', marginLeft: 5 }}>{this.state.parentAge}</Text>
									<Image source={vector_phone} style={{ resizeMode: 'contain', width: responsiveWidth(5), height: responsiveWidth(5), marginLeft: 7, marginTop: 0, justifyContent: 'center', alignItems: 'center' }} />
									<Text style={{ fontSize: CustomFont.font12, color: Color.patientSearchAge, fontFamily: CustomFont.fontName, fontWeight: '500', marginLeft: 1 }}>{this.state.parentContactNumber}</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<TouchableOpacity onPress={() => this.selectPatientType('Self')} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
										<Image source={this.state.selectedUserType == 'Self' ? radioSelected : radioNotSelected} style={{ height: responsiveHeight(2.5), width: responsiveHeight(2.5), resizeMode: 'contain' }} />
										<Text style={{ marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14,color:Color.fontColor }}>Self</Text>
									</TouchableOpacity>

									<TouchableOpacity onPress={() => this.selectPatientType('fm')} style={{ flexDirection: 'row', flex: 2, alignItems: 'center' }}>
										<Image source={this.state.selectedUserType == 'fm' ? radioSelected : radioNotSelected} style={{ height: responsiveHeight(2.5), width: responsiveHeight(2.5), resizeMode: 'contain' }} />
										<Text style={{ marginLeft: responsiveWidth(3), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14,color:Color.fontColor }}>Family Members</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
					<View style={{ flex: 1, }}>
						{
							this.state.selectedUserType == 'fm' ?
								<View style={{
									margin: responsiveWidth(3), marginBottom: responsiveHeight(2),
									justifyContent: 'center', padding: responsiveHeight(2), backgroundColor: Color.white,
									borderTopLeftRadius: 10, borderTopRightRadius: 10,
									borderBottomLeftRadius: this.state.familyMemberArr.length > 0 ? 0 : 10, borderBottomRightRadius: this.state.familyMemberArr.length > 0 ? 0 : 10
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, }}>Family Members</Text>

									{
										this.state.familyMemberArr.length == 0 ?
											<View style={{ alignItems: 'center', justifyContent: 'center' }}>
												<Image source={noFamily} style={{ marginTop: responsiveHeight(0), width: responsiveWidth(30), resizeMode: "contain", height: responsiveHeight(15) }} />
												<Text style={{ fontSize: CustomFont.font14, color: Color.mediumGrayTxt, textAlign: 'center', marginTop: responsiveHeight(3) }}>
													No family member listed for {item.firstName + ' ' + item.lastName}.</Text>
											</View> : null
									}

									<TouchableOpacity onPress={this.addFamilyClk} style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.5) }}>
										<Image style={{ height: responsiveHeight(5), borderRadius: responsiveHeight(2.5), width: responsiveHeight(5) }} source={AddFamilyIcon} />
										<Text style={{
											fontFamily: CustomFont.fontName,
											fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500, marginLeft: responsiveWidth(5),color:Color.fontColor
										}}>Add Family Member</Text>
									</TouchableOpacity>
									{this.state.familyMemberArr.length > 0 ? <View style={{ marginLeft: responsiveWidth(-5), height: 1, backgroundColor: Color.lineColor, width: responsiveWidth(95), marginTop: responsiveHeight(1.5) }} /> : null}
									{
										this.state.familyMemberArr.length > 0 ?
											<FlatList
												data={this.state.familyMemberArr}
												//ItemSeparatorComponent={this.renderSeparator}
												renderItem={this.renderList}
												extraData={this.state}
												keyExtractor={(item, index) => index.toString()}
											/> : null}

								</View> : null
						}
					</View>

					<View style={{
						height: responsiveHeight(8),
						alignItems: 'center',
						justifyContent: 'center',
						borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: Color.white,
						marginTop: responsiveHeight(2),
					}}>
						<TouchableOpacity style={{
							alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93),
							backgroundColor: this.state.selectedUserType == 'Self' || this.state.isFamilyMemberSelected ? Color.primary : Color.borderColor,
						}} onPress={() => this.ContinueToConfirmAppointment()}>
							<Text style={{
								fontFamily: CustomFont.fontName, color: Color.white,
								fontSize: CustomFont.font16, textAlign: 'center', fontWeight: CustomFont.fontWeight600
							}}>Continue</Text>
						</TouchableOpacity>
					</View>


				</View>


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
)(AddFamily);

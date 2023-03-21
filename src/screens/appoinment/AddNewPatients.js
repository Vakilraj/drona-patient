import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, BackHandler, ScrollView, FlatList, Platform, KeyboardAvoidingView
} from 'react-native';
import styles from './style';
import Validator from '../../components/Validator';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-native-modal';
import closeImage from '../../../assets/cross_blue.png';
import takePicture from '../../../assets/take_picture.png';
import uploadGallery from '../../../assets/upload_from_gallery.png';

import TickIcon from '../../../assets/green_tick.png';
import Moment from 'moment';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import addMemberIcon from '../../../assets/addMember.png';
import addPhoto from '../../../assets/add_photo.png';
import calenderIcon from '../../../assets/calender_icon.png';
import cross_txt from '../../../assets/cross_primary.png';
import down from '../../../assets/down.png';
import Snackbar from 'react-native-snackbar';
import ImagePicker from 'react-native-image-crop-picker';
import AddressDetails from './AddressDetails';
import CalendarPicker from 'react-native-calendar-picker';
import EmailValidator from '../../components/Validator'
import { setLogEvent } from '../../service/Analytics';
import alerts from '../../../assets/success_tick.png';
let dataAll = '', isGetData = false
let selectedDay = '', selectedDayReformat = '', RelationGuid = '';
let pincode = '', city = '', stateName = '', addr1 = '', addr2 = '', landmark = '', patientGuid = '', base64 = null, filename = '', from = '';;
//

let availabilityGuid = '';
let prevIndex = 0;
let resonOfVisitId = '';
let timeSlotGuid = '';
let DayPeriod = '';
let convertedStartTime = '';
let convertedEndTime;
let stop2TimesClickStatus = 0;
let objItem = {}
let timeslot = {};
let addPatientFromWhere = '';
let isChange = false;

class AddNewPatients extends React.Component {
	constructor(props) {
		// alert("page addnewpatient called");
		super(props);
		this.state = {
			fname: '',
			lname: '',
			referedName: '',
			mobile: '',
			relationShipArr: [],
			fnameAlert: '',
			lnameAlert: '',
			referedNameAlert: '',
			mobileAlert: '',
			age: '',
			ageAlert: '',
			email: '',
			emailAlert: '',
			isModalVisible: false,
			showSelectedDay: 'DD/MM/YYYY',
			showHeaderDate: '',
			dateForfullCalendar: '',
			imageSource: null,
			//isModalVisibleRelation: false,
			relationship: 'Select Relationship',
			isMale: false,
			isFemale: false,
			isOther: false,
			relationHeader: '',
			keyboardAvoiding: 0,
			addFamilyMember: 'Add Family Member',
			tempData: [],
			tagData: [],
			//selectedData: [],
			searchTxt: '',
			isAddImage: false,
			isImageAvailable: false,
			isEdit: false,
			isNewEdit: false,
			isAgeEditable: true,
			successAddPatient: false,
			isPatientAddStatus: false,
			isPatientAddStatusDate: '',

			fld1: Color.borderColor,
			fld2: Color.borderColor,
			fld3: Color.borderColor,
			fld4: Color.borderColor,
			fld5: Color.borderColor,
			fld6: Color.borderColor,

			moreDetails: true,
			showDiscard: false,
			showDiscardDialog: false,
			showInitialDate: new Date(),
			isValidAge: true,
			parentName: ''
		};
		selectedDay = ''; selectedDayReformat = ''; RelationGuid = '';
		pincode = ''; city = ''; stateName = ''; addr1 = ''; addr2 = ''; landmark = ''; patientGuid = ''; base64 = null; filename = '';
		DRONA.setAddress('');
		isChange = false;
	}

	callOnFocus = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.primary })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.primary })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.primary })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.primary, keyboardAvoiding: responsiveHeight(10) })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.primary })
		}
		else if (type == '6') {
			this.setState({ fld6: Color.primary })
		}

	}
	callOnBlur = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.borderColor })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.borderColor })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.borderColor })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.borderColor, keyboardAvoiding: 0 })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.borderColor })
		}
		else if (type == '6') {
			this.setState({ fld6: Color.borderColor })
		}

	}

	handleBackPress = () => {

		if (this.state.showDiscard) {
			this.setState({
				showDiscardDialog: true
			})
		} else {
			this.props.navigation.goBack();
			try {
				if (isChange)
					this.props.navigation.state.params.Refresh();
			} catch (error) { }

		}
		//	this.props.navigation.goBack();
		// this.goBack()
		return true;
	}

	cancelPress = () => {
		this.setState({ showDiscardDialog: false })
	}
	discardPress = () => {
		this.setState({ showDiscardDialog: false })
		this.props.navigation.goBack();
		try {
			if (isChange)
				this.props.navigation.state.params.Refresh();
		} catch (error) { }
	}
	componentWillUnmount() {

		this.backHandler.remove();
	}

	async componentDidMount() {

		addPatientFromWhere = this.props.navigation.state.params.fromwhere

		timeslot = this.props.navigation.state.params.timeslot;
		if (timeslot) {
			availabilityGuid = timeslot.availabilityGuid;
			timeSlotGuid = timeslot.timeSlotGuid;
			DayPeriod = timeslot.dayPeriad;
			convertedStartTime = Moment(timeslot.availableTime, 'hh:mm A').format('HH:mm');
			convertedEndTime = Moment(timeslot.endTime, 'hh:mm A').format('HH:mm');
			//alert(DayPeriod)
		}
		this.setState({ showHeaderDate: Moment(new Date()).format('DD MMM YYYY') })
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
		try {

			let item = this.props.navigation.state.params.item ? this.props.navigation.state.params.item : '';
			from = this.props.navigation.state.params.from ? this.props.navigation.state.params.from : '';
			isGetData = this.props.navigation.state.params.isGetData ? this.props.navigation.state.params.isGetData : false;

			if (isGetData) {
				this.callGetData();
			} else if (item && from === 'edit') {
				let age = 0;
					if (item.dob) {
						age = Moment(new Date()).format('YYYY') - Moment(item.dob).format('YYYY');
					} else {
						age = item.age;
					}

				this.setState({
					isEdit: true,
					fname: item.firstName,
					lname: item.lastName,
					referedName: item.referredBy,
					mobile: item.contactNumber ? item.contactNumber : item.phoneNumber,
					age: age + '',
					email: item.emailAddress,
					showSelectedDay: Moment(item.dateOfBirth).format('DD/MM/YYYY'),
					relationship: item.relationName,
					showInitialDate: Moment(item.dateOfBirth).format('YYYY-MM-DD')
				})
				if (item.dateOfBirth) this.setState({ isAgeEditable: false })

				RelationGuid = item.relationGuid
				patientGuid = item.patientGuid
				selectedDay = Moment(item.dateOfBirth).format('YYYY/MM/DD');
				try {
					if (item.gender == 'M') {
						this.setState({ isMale: true, isFemale: false, isOther: false });
					} else if (item.gender == 'F') {
						this.setState({ isMale: false, isFemale: true, isOther: false });
					} else if (item.gender == 'O') {
						this.setState({ isMale: false, isFemale: false, isOther: true });
					}
					pincode = item.pincode;
					city = item.city;
					stateName = item.state;
					addr1 = item.address1;
					addr2 = item.address2;
					landmark = item.landmark ? item.landmark : '';
					if (item.relationGuid) {
						this.setState({ relationHeader: 'Relationship with ' + this.props.navigation.state.params.item.firstName })
					}
				} catch (error) {
				}
				if (item.imageUrl) {
					this.setState({ imageSource: { uri: item.imageUrl } });
				}
			} else if (from == 'add') {
				this.setState({ mobile: item })
			}
		} catch (e) {
		}
		try {
			let item = this.props.navigation.state.params.item;
			if (from == 'famityadd') {
				this.setState({ relationHeader: 'Select Relationship with ' + item.firstName, mobile: isGetData ? item.phoneNumber : item.contactNumber ? item.contactNumber : item.phoneNumber });
			}
			if (from == 'editfamily') {
				RelationGuid = item.relationGuid
				this.setState({ relationship: item.relationName });
			}
		} catch (e) {
		}
		//this.getRelationShip()
		//this.callTagApi()
	}

	callGetData = () => {
		let item = this.props.navigation.state.params.item ? this.props.navigation.state.params.item : '';

		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Data": { "PatientGuid": item.patientGuid }
		}
		actions.callLogin('V11/FuncForDrAppToGetPatientDetailsById', 'post', params, signupDetails.accessToken, 'getData');
	}
	openCamera = () => {
		ImagePicker.openCamera({
			cropping: true,
			includeBase64: true
		}).then(image => {
			this.setState({ isAddImage: false })
			this.handleCameraGalleryImage(image)
		});
	}

	openGallery = () => {
		this.setState({ isAddImage: false })
		ImagePicker.openPicker({
			cropping: true,
			includeBase64: true
		}).then(image => {
			this.handleCameraGalleryImage(image)
		});
	}

	handleCameraGalleryImage = (image) => {
		const source = { uri: 'data:image/jpeg;base64,' + image.data };
		// this.setState({ imageSource: source })
		this.goToPureview(true, source, image.fileName)
	}

	goToPureview = (isEdit, image, fileName) => {
		this.props.navigation.navigate("PicturePureview", { onImageAdded: this.onImageAdded, picture: image, isEdit: isEdit, fileName: fileName })
	}

	onImageAdded = (response, isEditImage, name) => {
		if (isEditImage) {
			filename = name
			base64 = response.uri.replace('data:image/jpeg;base64,', '')
			this.setState({ imageSource: response, showDiscard: true });
			// setTimeout(() => {
			//     this.saveProfile()
			// }, 500);
		}
	}

	clickGender = (gender) => {
		if (gender === 'male') {
			this.setState({
				isMale: true, isFemale: false, isOther: false, showDiscard: true,
			})
			this.getRelationShip('M')
		} else if (gender === 'female') {
			this.setState({
				isMale: false, isFemale: true, isOther: false, showDiscard: true,
			})
			this.getRelationShip('F')

		}
		else {
			this.setState({
				isMale: false, isFemale: false, isOther: true, showDiscard: true,
			})
			this.getRelationShip('O')

		}
	}

	setChecked = (val) => {
		if (val === 'Male') {
			this.setState({ male: 'checked', female: 'unchecked', other: 'unchecked' });
		} else if (val === 'Female') {
			this.setState({ male: 'unchecked', female: 'checked', other: 'unchecked' });
		} else {
			this.setState({ male: 'unchecked', female: 'unchecked', other: 'checked' });
		}
	}

	gotoNext = () => {
		let from = this.props.navigation.state.params.from ? this.props.navigation.state.params.from : '';
		let item = this.props.navigation.state.params.item;
		let { actions, signupDetails } = this.props;
		if (!this.state.fname) {
			this.setState({ fnameAlert: 'Please enter first name' });
			this.refs.fname.focus();
		}
		else if (!Validator.isNameValidate(this.state.fname)) {
			this.setState({ fnameAlert: 'Name should contain only alphabets' });
			this.refs.fname.focus();
		} else if (this.state.fname.length < 1) {
			this.setState({ fnameAlert: 'First name minimum 1 character' });
			this.refs.fname.focus();
		}
		//  else if (!this.state.lname) {
		// 	this.setState({ lnameAlert: 'Please enter last name' });
		// 	this.refs.lname.focus();
		// } else if (!Validator.isNameValidate(this.state.lname)) {
		// 	this.setState({ lnameAlert: 'Name should contain only alphabets' });
		// 	this.refs.lname.focus();
		// }
		else if (!this.state.isMale && !this.state.isFemale && !this.state.isOther) {
			Snackbar.show({ text: 'Please select gender', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!selectedDay && !this.state.age) {
			Snackbar.show({ text: 'Please select date of birth OR enter Age', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}
		else if (this.state.age && !Validator.isMobileValidate(this.state.age.substring(0, 1))) {
			// else if (this.state.age)
			this.setState({ ageAlert: 'Age should contain only number' });
			this.refs.age.focus();
		}
		else if (!this.state.mobile) {
			this.setState({ mobileAlert: 'Please enter mobile number' });
			//this.refs.mobile.focus();
		} else if (this.state.mobile.length != 10) {
			this.setState({ mobileAlert: 'Mobile number should be 10 digit' });
			//this.refs.mobile.focus();
		} else if (!Validator.isMobileValidate(this.state.mobile)) {
			this.setState({ mobileAlert: 'Mobile number should contain only number' });
			//this.refs.mobile.focus();
		}
		else if (this.state.email && !EmailValidator.isEmailValid(this.state.email)) {
			this.refs.email.focus();
			this.setState({ emailAlert: "Please Enter valid email" })
		}
		// else if (this.props.navigation.state.params.from == 'famityadd' && !RelationGuid) {
		// 	Snackbar.show({ text: 'Please select relationship', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// }
		// else if (!DRONA.getAddress()) {
		// 	Snackbar.show({ text: 'Please fill up Address', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// } 
		else if (this.state.isValidAge) {
			try {
				if (!selectedDay && this.state.age) {
					let y = parseInt(Moment(new Date()).format('YYYY')) - this.state.age;
					selectedDay = y + '/' + Moment(new Date()).format('MM/DD')
					// alert(selectedDay)
				}
			} catch (error) {

			}

			if (landmark == 'NA' || landmark == "NA'") {
				landmark = '';
			}

			if (from == 'addfamily' || from == 'editfamily') {
				if (RelationGuid) {
					let params = {
						"UserGuid": from == 'famityadd' ? item.patientGuid : signupDetails.UserGuid,
						"ClinicGuid": signupDetails.clinicGuid,
						"DoctorGuid": signupDetails.doctorGuid,
						"Data": {
							"firstname": this.state.fname.trim(),
							"lastname": this.state.lname.trim(),
							"email": this.state.email,
							"GenderName": this.state.isMale ? 'M' : this.state.isFemale ? 'F' : 'O',
							"Mobile": this.state.mobile,
							"RelationGuid": RelationGuid ? RelationGuid : null,
							"RefferedBy": this.state.referedName,
							"Dob": selectedDay,
							"PatientGuid": from == 'editfamily' ? item.patientGuid : "",
						}
					}
					actions.callLogin('V11/FuncForDrAppToInsertUpdatePatientFamilyMember', 'post', params, signupDetails.accessToken, 'AddPatient');
				} else {
					Snackbar.show({ text: 'Please select relationship', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			} else {
				let ageVal = this.state.age ? this.state.age.substring(0, 1) : 0;
				let params = {
					"RoleCode": signupDetails.roleCode,
					"UserGuid": from == 'famityadd' ? item.patientGuid : signupDetails.UserGuid,
					"ClinicGuid": signupDetails.clinicGuid,
					"DoctorGuid": signupDetails.doctorGuid,
					"Version": null,
					"Data": {
						"State": stateName,
						"City": city,
						"Gender": this.state.isMale ? 'M' : this.state.isFemale ? 'F' : 'O',
						"PatientFirstName": this.state.fname.trim(),
						"PatientLastName": this.state.lname.trim(),
						"Email": this.state.email,
						"PhoneNumber": this.state.mobile,
						"DOB": selectedDay,
						"ReferredBy": this.state.referedName,
						"PatientGuid": from == 'edit' ? patientGuid ? patientGuid : null : null,
						"RelationTypeGuid": RelationGuid ? RelationGuid : null,
						"NDHMHealth": "",
						"Age": ageVal,
						"PatientAddress1": addr1,
						"PatientAddress2": addr2,
						"PinCode": pincode,
						"Landmark": landmark,
						"PatientImage": null,
						"taglist": [],
						"Attachment": {
							"FileGuid": null,
							"OrgFileName": filename,
							"OrgFileExt": ".png",
							"SysFileName": null,
							"SysFileExt": null,
							"FileBytes": base64 ? base64 : null,
							"RefType": null,
							"RefId": null,
							"SysFilePath": null,
							"DelMark": 0,
							"UploadedOnCloud": 0
						}
					}
				}
				actions.callLogin('V11/FuncForDrAppToAddPatient', 'post', params, signupDetails.accessToken, 'AddPatient');

			}

			// "Age": this.state.age ? this.state.age.substring(0, 1) : 0,
		}
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails } = this.props;
			if (tagname === 'relationShipList') {
				if (newProps.responseData.data) {
					let tempArr = newProps.responseData.data;
					if (tempArr && tempArr.length > 0) {
						const delIndex = tempArr.findIndex((obj) => obj.relationName == 'Self');
						if (delIndex > -1) {
							tempArr.splice(delIndex, 1);
						}
					}

					this.setState({ relationShipArr: tempArr });

				} else {
					this.setState({ relationShipArr: [] });

				}
			} else if (tagname === 'AddPatient') {
				isChange = true;
				if (newProps.responseData.statusCode == '0') {
					let eventName = DRONA.getClinicType() === "WalkIns" ? "add_walkin" : DRONA.getClinicType() === "InClinic" ? "add_in_clinic" : "add_virtual"
					if (from !== 'edit')
						setLogEvent(eventName, { "add_patient_success": "success" });
					objItem = {};
					objItem.patientName = this.state.fname.trim() + ' ' + this.state.lname.trim();
					objItem.phoneNumber = this.state.mobile;
					objItem.patientGuid = newProps.responseData.data.patientGuid

					if (isGetData) {
						let imageUrl = this.state.imageSource ? this.state.imageSource.uri : ""
						let data = {
							patientName: this.state.fname + " " + this.state.lname, phoneNumber: this.state.mobile, gender: this.state.isMale ? 'Male' : this.state.isFemale ? 'Female' : 'Other',
							age: selectedDay, patientImageUrl: imageUrl
						}
						this.props.navigation.state.params.onEditPatient(data);
						this.props.navigation.goBack();
						try {
							if (isChange)
								this.props.navigation.state.params.Refresh();
						} catch (error) { }
					} else {
						//	this.props.navigation.navigate(isGetData ? "Consultation" : 'SearchPatients', { item: this.props.navigation.state.params.item });
						if (addPatientFromWhere == 'fromappointment') {
							this.props.navigation.navigate('ConfirmAppointment', { item: objItem, timeslot: timeslot });
						}
						else {
							this.props.navigation.goBack();
							try {
								if (isChange)
									this.props.navigation.state.params.Refresh();
							} catch (error) { }
						}

					};
					
					//this.setState({ successAddPatient: true });
				} else {
					this.setState({ isPatientAddStatus: true });
					this.setState({ isPatientAddStatusDate: newProps.responseData.statusMessage });
					setLogEvent("edit_patient_success", { "edit_patient_success": "success" })
					//alert(newProps.responseData.statusMessage)
					//Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			} else if (tagname === "getData") {
				let data = newProps.responseData.data
				dataAll = data
				let item = data
				if (from == 'addfamily') {
					if (data.patientDetailsList) {
						this.setState({ parentName: data.patientDetailsList.firstName + ' ' + data.patientDetailsList.lastName, mobile: data.patientDetailsList.phoneNumber })
					}


				} else {
					let age = 0;
					if (item.dob) {
						age = Moment(new Date()).format('YYYY') - Moment(item.dob).format('YYYY');
					} else {
						age = item.age;
					}

					this.setState({
						isEdit: true,
						fname: item.firstName,
						lname: item.lastName,
						referedName: item.referredBy,
						mobile: item.phoneNumber,
						age: age + '',
						email: item.email,
						showSelectedDay: Moment(item.dob).format('DD/MM/YYYY'),
						// showHeaderDate: '',
						// dateForfullCalendar: '',
						//imageSource: null,
						//isModalVisibleRelation: false,
						//relationship: item.relationName,
						showInitialDate: Moment(item.dob).format('YYYY-MM-DD')
					})
					// alert(this.state.age);
					if (item.dob != null && item.dob != "") this.setState({ isAgeEditable: false })

					// if (item.taglist && item.taglist.length > 0 && item.taglist[0].tagGuid)
					// 	this.setState({ selectedData: item.taglist })

					//RelationGuid = item.relationGuid
					patientGuid = item.patientGuid
					selectedDay = Moment(item.dob).format('YYYY/MM/DD');
					try {
						if (item.gender == 'Male') {
							this.setState({ isMale: true, isFemale: false, isOther: false });
						} else if (item.gender == 'Female') {
							this.setState({ isMale: false, isFemale: true, isOther: false });
						} else if (item.gender == 'Other') {
							this.setState({ isMale: false, isFemale: false, isOther: true });
						}
						//   alert(item.pinCode)
						pincode = item.pinCode;
						city = item.city;
						stateName = item.state;
						addr1 = item.patientAddress1;
						addr2 = item.patientAddress2;
						landmark = item.landmark ? item.landmark : '';
						if (item.relationGuid) {
							this.setState({ relationHeader: 'Relationship with ' + this.props.navigation.state.params.item.firstName })
						}
					} catch (error) {
					}
					if (item.patientImage) {
						this.setState({ imageSource: { uri: item.patientImage } });
					}

					if (from == 'editfamily') {
						if (data.patientDetailsList) {
							this.setState({ parentName: data.patientDetailsList.firstName + ' ' + data.patientDetailsList.lastName })
						}
					}
				}

			}
		}
	}

	getRelationShip = (item) => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid, "ClinicGuid": null, "DoctorGuid": signupDetails.doctorGuid, "Version": null,
			"Data": { "GenderCode": item }
		}
		actions.callLogin('V1/FuncFoDrAppToGetRelationTypeList', 'post', params, signupDetails.accessToken, 'relationShipList');
	}

	clickOnDone = () => {
		if (!selectedDayReformat) {
			Snackbar.show({ text: 'Please select date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			let yr = '';
			try {
				let today = new Date();
				let yyyy = today.getFullYear();
				if (selectedDay && selectedDay.includes('/')) {
					//let yy = Moment(selectedDay).format('YYYY');
					let yy = selectedDay.split('/')[0];
					yr = yyyy - yy;
				}


			} catch (error) {

			}
			this.setState({ showSelectedDay: selectedDayReformat, isModalVisible: false, age: yr + '', isAgeEditable: false, showDiscard: true });
		}

	}
	refreshData = (val) => {
		if (val) {
			pincode = val.pin;
			city = val.city;
			stateName = val.stateName;
			addr1 = val.addressLine1;
			addr2 = val.addressLine2;
			landmark = val.landMark ? val.landMark : '';
		}
	}

	tagChangeText = (text) => {
		this.setState({ searchTxt: text });
		if (text.trim().length >= 1) {
			this.setState({ tagData: [] })
			let tempArr = []
			for (let i = 0; i < this.state.tempData.length; i++) {
				let item = this.state.tempData[i]
				if (item.tagName.toUpperCase().includes(text.toUpperCase())) {
					tempArr.push(item)
				}
			}
			if (tempArr.length == 0) {
				tempArr.push({ "tagName": text, "tagGuid": '' })
			}
			this.setState({ tagData: tempArr })
		} else {
			this.setState({ tagData: [] })
		}
	}

	// addTag = (item) => {
	// 	// this.setState({selectedData : tempArr})
	// 	if (this.state.selectedData.indexOf(item) == -1 && this.state.selectedData.length < 3) {
	// 		this.state.selectedData.push(item)
	// 		this.setState({ selectedData: this.state.selectedData })
	// 		this.state.searchTxt = ''
	// 		this.state.tagData = []
	// 	}
	// }

	// removeTag = (item, index) => {
	// 	this.state.selectedData.splice(index, 1);
	// 	this.setState({ selectedData: this.state.selectedData })
	// }
	renderSeparator2 = () => {
		return <View style={styles.seperatorPatient} />;
	};

	renderItem = (item, index) => {
		return (
			<TouchableOpacity style={styles.rowView} onPress={() => this.addTag(item)}>
				{/* <View style={styles.circle} /> */}
				<Text style={styles.qusTxt}>{item.tagName}</Text>
			</TouchableOpacity>
		)
	}


	renderSeparator = () => {
		return (
			<View />
		)
	}

	renderTag = (item, index) => {
		return (
			<View style={styles.tagView}>
				<Text style={{ fontSize: CustomFont.font18, color: Color.white }}>{item.tagName}</Text>
				<TouchableOpacity style={{
					alignItems: 'center', justifyContent: 'center',
					height: 15, width: 15, borderRadius: 7.5, marginLeft: 8,
					backgroundColor: Color.white,
				}}
					onPress={() => this.removeTag(item, index)}>
					<Text style={{ color: Color.weekdaycellPink, fontSize: CustomFont.font10 }}>X</Text>
					{/* <Image style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5) }} source={CloseIcon}></Image> */}
				</TouchableOpacity>
			</View>
		)
	}

	renderSeparatorTag = () => {
		return <View style={{ marginLeft: 10 }} />;
	};

	render() {

		// let from = this.props.navigation.state.params.from ? this.props.navigation.state.params.from : '';
		// let item = this.props.navigation.state.params.item ? this.props.navigation.state.params.item : '';
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flexDirection: 'row', backgroundColor: Color.white, justifyContent: 'space-between', height: responsiveHeight(7), alignItems: 'center', zIndex: 999 }}>
					<TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.handleBackPress()} disabled={this.state.successAddPatient}>
						<Image source={arrowBack} style={{ width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), resizeMode: 'contain' }} />
						<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font16, fontWeight: 'bold', marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>{from == 'addfamily' ? 'Add Family Member' : from == 'editfamily' ? 'Edit Family Member' : 'Patient Details'}</Text>
					</TouchableOpacity>
					{/* <TouchableOpacity style={{ padding: 10 }} onPress={() => this.gotoNext()}>
						<Text style={{ color: Color.patientSearch, fontSize: CustomFont.font16, fontWeight: 'bold', marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>SAVE</Text>
					</TouchableOpacity> */}
				</View>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} >


					<ScrollView style={{ marginBottom: 50, backgroundColor: Color.patientBackground }} keyboardShouldPersistTaps='always'>
						<View style={{ flex: 1 }}>

							<View style={{ margin: responsiveWidth(4), backgroundColor: Color.white, borderRadius: 20, padding: responsiveWidth(4) }}>
								{/* <View style={{ alignItems: 'center', flexDirection: 'row' }}>
									{this.state.imageSource ? <TouchableOpacity onPress={() => this.goToPureview(false, this.state.imageSource, '')}><Image source={this.state.imageSource} style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8), marginTop: responsiveHeight(1), }} /></TouchableOpacity> :
										<TouchableOpacity onPress={() => this.setState({ isAddImage: true })}>
											<Image source={addPhoto} style={{ height: responsiveFontSize(9), width: responsiveFontSize(9) }} />
										</TouchableOpacity>

									}
									<TouchableOpacity onPress={() => this.setState({ isAddImage: true })}>
										<Text style={{ color: Color.primary, fontSize: CustomFont.font14, fontWeight: 'bold', marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>{this.state.imageSource ? 'Change Photo' : 'Add Photo'} </Text>
									</TouchableOpacity>

								</View> */}
								{from == 'addfamily' || from == 'editfamily' ?
									<View>
										<Text style={styles.inputHeaderTop1}>Primary Patient Details</Text>

										<Text style={styles.inputHeader}>Name</Text>
										<TextInput editable={false} style={[styles.createInputStyle, { backgroundColor: '#EEEEEE', borderColor: this.state.fld1 }]} value={this.state.parentName} />


										<View>
											<Text style={styles.inputHeader}>Mobile No.</Text>
											<TextInput editable={false} style={[styles.createInputStyle, { backgroundColor: '#EEEEEE', borderColor: this.state.fld4, borderRadius: 5, color: Color.placeHolderColor }]} value={this.state.mobile} />
										</View>
										<Text style={styles.inputHeaderTop}>We'll use this number to contact your patient</Text>

										<Text style={styles.inputHeaderTop1}>Family Member Details</Text>
									</View>
									: null}
								<View>
									<Text style={styles.inputHeader}>First {'&'} Middle Name *</Text>
									<TextInput returnKeyType="done"
										//onFocus = {() => this.callOnFocus('1')}
										onBlur={() => this.callOnBlur('1')}
										style={[styles.createInputStyle, { borderColor: this.state.fld1 }]} placeholder="Enter Name" placeholderTextColor={Color.placeHolderColor} onChangeText={fname => {
											fname = fname;
											this.setState({ fname, showDiscard: true })
											if (!fname || Validator.isNameValidate(fname)) {
												this.setState({ fnameAlert: '', fld1: Color.inputErrorBorder })
											} else {
												this.setState({ fnameAlert: 'Name should contain only alphabets', fld1: Color.inputErrorBorder })
											}
										}} ref='fname' onSubmitEditing={() => this.refs.lname.focus()} value={this.state.fname} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld1: Color.primary })} />
									{this.state.fnameAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.fnameAlert}</Text> : null}
									<Text style={styles.inputHeader}>Last Name (Optional)</Text>
									<TextInput returnKeyType="done"
										//onFocus = {() => this.callOnFocus('2')}
										onBlur={() => this.callOnBlur('2')}
										style={[styles.createInputStyle, { borderColor: this.state.fld2, borderWidth: 1 }]} placeholder="Last Name" placeholderTextColor={Color.placeHolderColor} onChangeText={lname => {
											lname = lname;
											this.setState({ lname, showDiscard: true })
											if (!lname || Validator.isNameValidate(lname)) {
												this.setState({ lnameAlert: '', fld2: Color.inputErrorBorder })
											} else {
												this.setState({ lnameAlert: 'name should contain only alphabets', fld2: Color.inputErrorBorder })
											}
										}} ref='lname' onSubmitEditing={() => this.refs.age.focus()} value={this.state.lname} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-40), fld2: Color.primary })} />
									{this.state.lnameAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.lnameAlert}</Text> : null}
								</View>
								{from == 'addfamily' || from == 'editfamily' ? null : <View style={{ marginTop: responsiveHeight(1) }}>
									<Text style={styles.inputHeader}>Primary Phone Number *</Text>
									<TextInput returnKeyType="done"
										onFocus={() => this.callOnFocus('4')}
										onBlur={() => this.callOnBlur('4')}
										style={[styles.createInputStyle, { backgroundColor: '#EEEEEE', borderColor: this.state.fld4, borderRadius: 5, color: Color.placeHolderColor }]} placeholder="10 digit phone number" placeholderTextColor={Color.placeHolderColor} onChangeText={mobile => {
											this.setState({ mobile, showDiscard: true })
											if (Validator.isMobileValidate(mobile) || mobile === '') {  //!mobile || 
												this.setState({ mobileAlert: '' })
											} else {
												this.setState({ mobileAlert: 'Mobile number should contain only number', fld4: Color.inputErrorBorder })
											}
										}}
										editable={this.state.isNewEdit}
										keyboardType={'phone-pad'} maxLength={10}
										ref='mobile'
										//onSubmitEditing={() => this.refs.email.focus()}
										value={this.state.mobile} />
									{this.state.mobileAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.mobileAlert}</Text> : null}
								</View>}


								<Text style={styles.inputHeader}>Gender *</Text>
								<View style={{ flexDirection: 'row', marginTop: 10, }}>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: this.state.isMale ? Color.liveBg : Color.createInputBorder, borderWidth: 1.5, borderRadius: 4, backgroundColor: this.state.isMale ? Color.genderSelection : Color.white, marginEnd: 5, }} onPress={() => this.clickGender('male')}>
										<Text style={{ color: this.state.isMale ? Color.optiontext : Color.optiontext, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500 }}>Male</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: this.state.isFemale ? Color.liveBg : Color.createInputBorder, borderWidth: 1.5, borderRadius: 4, backgroundColor: this.state.isFemale ? Color.genderSelection : Color.white, marginEnd: 5, }} onPress={() => this.clickGender('female')}>
										<Text style={{ color: this.state.isFemale ? Color.optiontext : Color.optiontext, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500 }}>Female</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(6), borderColor: this.state.isOther ? Color.liveBg : Color.createInputBorder, borderWidth: 1.5, borderRadius: 4, backgroundColor: this.state.isOther ? Color.genderSelection : Color.white, marginEnd: 5, }} onPress={() => this.clickGender('other')}>
										<Text style={{ color: this.state.isOther ? Color.optiontext : Color.optiontext, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight500 }}>Other</Text>
									</TouchableOpacity>
								</View>
								{/* <View style={{ flexDirection: 'row', marginTop: 7 }}>
									<View style={{ flex: 3 }}>
										<Text style={styles.inputHeader}>Date of Birth *</Text>
										<TouchableOpacity style={{ flexDirection: 'row', height: responsiveHeight(7), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 4, backgroundColor: Color.white, alignItems: 'center', marginTop: 7, width: responsiveWidth(60), justifyContent: 'space-between' }}
											onPress={() => {
												this.setState({ isModalVisible: true })
											}}>
											<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: 10 }}>{this.state.showSelectedDay}</Text>
											<Image source={calendar_basic} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginRight: 10 }} />
										</TouchableOpacity>
									</View>
								</View> */}

								<View style={{ flexDirection: 'row', marginTop: 7 }}>

									<View style={{ flex: 3 }}>
										<Text style={styles.inputHeader}>Date of Birth *</Text>
										<TouchableOpacity style={{ height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1, borderRadius: 5, backgroundColor: Color.white, alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(1.2), flexDirection: 'row' }}
											onPress={() => {
												this.setState({ isModalVisible: true })
											}}>
											<Text style={{ fontSize: CustomFont.font14, color: Color.placeHolderColor, textAlign: 'center', fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, }}>{this.state.showSelectedDay}</Text>
											<Image source={calenderIcon} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginLeft: 10 }} />

										</TouchableOpacity>
									</View>

									<View style={{ flex: 1, alignItems: 'center' }}>
										<Text style={{ fontSize: CustomFont.font12, color: Color.optiontext, marginTop: responsiveHeight(7.5), fontFamily: CustomFont.fontName, fontWeight: '500' }}>OR</Text>
									</View>

									<View style={{ flex: 2 }}>
										<View style={{ flexDirection: 'row' }}>
											<Text style={styles.inputHeader}>Age</Text>
											<Text style={{
												fontSize: CustomFont.font12,
												color: Color.optiontext,
												fontFamily: CustomFont.fontName,
												fontWeight: '200',
												marginTop: responsiveHeight(2.2),
											}}> ( In Years)</Text>
										</View>
										<TextInput returnKeyType="done"
											onFocus={() => this.callOnFocus('3')}
											onBlur={() => this.callOnBlur('3')}
											style={[styles.createInputStyle, { borderColor: this.state.fld3, borderWidth: 1 }]} keyboardType={'phone-pad'} maxLength={3}
											ref='age' onChangeText={age => {
												this.setState({ age, showDiscard: true })
												if (Validator.isMobileValidate(age.substring(0, 1)) || age === '') {  //!mobile ||
													if (age > 150) {
														this.setState({ ageAlert: 'Age should not be greater than 150 years' })
														this.setState({ isValidAge: false })
													} else {
														this.setState({ isValidAge: true })
														this.setState({ ageAlert: '' })
														try {
															if (age) {
																let y = parseInt(Moment(new Date()).format('YYYY')) - age;
																this.setState({ showSelectedDay: Moment(new Date()).format('DD/MM') + '/' + y });
																selectedDay = y + '/' + Moment(new Date()).format('MM/DD')
															} else {
																selectedDay = '';
																this.setState({ showSelectedDay: 'DD/MM/YYYY' });
															}
														} catch (error) {

														}
													}

												} else {
													this.setState({ ageAlert: 'Age should contain only number' })
												}
											}
											}
											//editable={this.state.isAgeEditable}
											value={this.state.age && this.state.age.includes('y') ? this.state.age.split("y")[0] : this.state.age} />
										{this.state.ageAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.ageAlert}</Text> : null}
									</View>
								</View>

								{from == 'addfamily' || from == 'editfamily' ? <View style={{ marginTop: responsiveHeight(1) }}>
									<Text style={styles.inputHeader}>Relationship (Optional)</Text>
									<TouchableOpacity style={{ flexDirection: 'row', height: responsiveHeight(6), borderColor: Color.createInputBorder, borderWidth: 1.5, borderRadius: 5, backgroundColor: Color.white, marginTop: responsiveHeight(1.2), alignItems: 'center', justifyContent: 'space-between' }}
										onPress={() => this.setState({ isModalVisibleRelation: true })}>
										<Text style={{ fontSize: CustomFont.font14, color: Color.placeHolderColor, paddingLeft: 10, paddingRight: 10 }}>{this.state.relationship}</Text><Image source={down} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', marginRight: responsiveWidth(3) }} />
									</TouchableOpacity>
								</View> : null}

								<Text style={styles.inputHeader}>Referred By</Text>
								<TextInput returnKeyType="done"
									onBlur={() => this.callOnBlur('2')}
									style={[styles.createInputStyle, { borderColor: this.state.fld2, borderWidth: 1 }]} placeholder="Enter Doctor's Name" placeholderTextColor={Color.placeHolderColor}
									onChangeText={referedName => {
										referedName = referedName;
										this.setState({ referedName, showDiscard: true })
										if (!referedName || Validator.isNameValidate(referedName)) {
											this.setState({ referedNameAlert: '', fld2: Color.inputErrorBorder })
										} else {
											this.setState({ referedNameAlert: 'name should contain only alphabets', fld2: Color.inputErrorBorder })
										}
									}} ref='referedName' onSubmitEditing={() => this.refs.age.focus()} value={this.state.referedName} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-40), fld2: Color.primary })} />
								{this.state.referedNameAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.referedNameAlert}</Text> : null}


								{this.state.moreDetails == false ?
									<TouchableOpacity style={{ marginTop: responsiveHeight(2) }} onPress={() => this.setState({ moreDetails: true })}>
										<Text style={{ fontSize: CustomFont.font14, color: Color.primaryBlue, fontWeight: 'bold' }}>+ Add More Details</Text>
									</TouchableOpacity>
									:
									<View>

										<View style={{ marginTop: responsiveHeight(1) }}>
											<Text style={styles.inputHeader}>Email (Optional)</Text>
											<TextInput returnKeyType="done"
												//onFocus = {() => this.callOnFocus('5')}
												onBlur={() => this.callOnBlur('5')}
												style={[styles.createInputStyle, { borderColor: this.state.fld5, borderWidth: 1 }]} placeholder="Enter email address" placeholderTextColor={Color.placeHolderColor} onChangeText={email => {
													this.setState({ email })
													this.setState({ emailAlert: '' })
													if (email == "" || EmailValidator.isEmailValid(email)) {
														this.setState({ emailAlert: '' })
													} else {
														this.setState({ emailAlert: 'Please Enter valid email', fld5: Color.inputErrorBorder })
													}
												}}
												keyboardType={Platform.OS == 'ios' ? 'email-address' : 'email'}
												ref='email' value={this.state.email} onFocus={() => this.setState({ keyboardAvoiding: 0, fld5: Color.primary })} />
											{this.state.emailAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.emailAlert}</Text> : null}
										</View>

										{/* <View style={{ marginTop: responsiveHeight(1) }}>
											<Text style={styles.inputHeader}>Tags</Text>

											<TextInput
												onFocus={() => this.callOnFocus('6')}
												onBlur={() => this.callOnBlur('6')}
												placeholderTextColor = {Color.placeHolderColor}
												style={[styles.createInputStyle, { borderColor: this.state.fld6, borderWidth: 1 }]} placeholder="Add Tags"
												onChangeText={this.tagChangeText} value={this.state.searchTxt} />

										</View> */}

										{/* {
									this.state.selectedData.length > 0 ?
										<FlatList
											horizontal={true}
											style={{ marginTop: 5, marginLeft: 10, marginRight: 10 }}
											tagData={this.state.selectedData}
											renderItem={({ item, index }) => this.renderTag(item, index)}
											ItemSeparatorComponent={this.renderSeparatorTag} /> : null
								} */}

										{/* commented for new flow */}
										{/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
											{this.state.selectedData.map((item, index) => this.renderTag(item, index), this)}
										</View>

										{this.state.tagData.length > 0 ?
											<FlatList
												style={{ marginTop: 10 }}
												data={this.state.tagData}
												renderItem={({ item, index }) => this.renderItem(item, index)}
												ItemSeparatorComponent={this.renderSeparator} /> : null
										} */}


										{/* <View style={{ marginTop: 16 }}>
											<AddressDetails Refresh={this.refreshData} nav={{ item: isGetData ? dataAll : this.props.navigation.state.params.item ? this.props.navigation.state.params.item : null, from: this.props.navigation.state.params.from, isGetData: isGetData }} />
										</View> */}

										{/* <Text style={[styles.inputHeader, { marginTop: responsiveHeight(1.6) }]}>Add Family Member</Text> */}
										{/* {this.state.isEdit ? <TouchableOpacity style={{ flexDirection: 'row', marginBottom: responsiveHeight(2), marginTop: responsiveHeight(1), borderColor: Color.createInputBorder, borderWidth: 1.5, borderRadius: 4, alignItems: 'center', backgroundColor: '#00000005' }}
											// onPress={() => this.setState({ isModalVisibleRelation: true })}
											onPress={() => this.props.navigation.navigate('AddPatients', { item: isGetData ? dataAll : this.props.navigation.state.params.item, from: 'famityadd', isGetData: isGetData })}>
											<Image source={addMemberIcon} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), margin: responsiveHeight(1.7) }} />
											<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: 10, marginTop: 10, marginBottom: 10, marginRight: responsiveWidth(10) }}>{this.state.addFamilyMember}</Text>
										</TouchableOpacity> : null} */}
									</View>
								}

								{/* <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(7), backgroundColor: Color.primary, marginTop: responsiveHeight(4) }} onPress={() => {
									this.gotoNext();
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save </Text>
								</TouchableOpacity> */}

							</View>

						</View>

						{/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(11), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

							<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(8), backgroundColor: Color.primary, marginTop: responsiveHeight(3), marginBottom: responsiveHeight(3), width: responsiveHeight(48) }} onPress={() => {
								this.gotoNext();
							}}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save</Text>
							</TouchableOpacity>
						</View> */}

						<View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(11), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
							<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 20 }} onPress={() => {
								this.gotoNext();
							}}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>


				</KeyboardAvoidingView>
				<Modal isVisible={this.state.isModalVisible} >
					<View style={{ backgroundColor: Color.white, borderRadius: 7, alignItems: 'center' }}>
						<ScrollView>
							<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
								<CalendarPicker
									initialDate={this.state.showInitialDate}
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
										//alert(date.toString())
										selectedDay = Moment(date.toString()).format('YYYY/MM/DD');
										//let showDate = Moment(selectedDay).format('DD MMM YYYY');
										selectedDayReformat = Moment(date.toString()).format('DD/MM/YYYY');
										//alert(selectedDay)
										//this.setState({ dateForfullCalendar: date.toString() })  //, showHeaderDate: showDate 
									}}
									maxDate={new Date()}
									minDate={new Date(1900, 1, 1)}
									nextTitleStyle={{ color: Color.fontColor }}
									previousTitleStyle={{ color: Color.fontColor }}
									yearTitleStyle={{ color: Color.fontColor }}
									monthTitleStyle={{ color: Color.fontColor }}
								/>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(3), justifyContent: 'flex-end', width: '100%' }}>
									<TouchableOpacity style={{ backgroundColor: Color.community_loader, alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(6), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisible: false })}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel</Text>
									</TouchableOpacity>

									<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(6), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6), marginRight: 10 }} onPress={() => {
										this.clickOnDone();
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Done</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</View>
				</Modal>
				{/* modal for relationship */}

				<Modal isVisible={this.state.isModalVisibleRelation} >
					<View style={styles.modelViewRelation}>
						<View style={{ marginBottom: Platform.OS === 'ios' ? responsiveHeight(47) : responsiveHeight(35) }}>
							<View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 10 }}>
								<Text style={{ fontSize: CustomFont.font18, fontWeight: 'bold', color: Color.black, fontFamily: CustomFont.fontName, marginLeft: 20, marginTop: 20 }}>{this.state.relationHeader}</Text>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => { this.setState({ isModalVisibleRelation: false }) }}>
									<Image source={cross_txt} style={{ marginRight: 20, marginTop: 20, width: 20, height: 20 }} />
								</TouchableOpacity>
							</View>
							<FlatList
								data={this.state.relationShipArr}
								ItemSeparatorComponent={this.renderSeparator2}
								renderItem={({ item, index }) => (
									<TouchableOpacity style={{ height: responsiveHeight(7), justifyContent: 'flex-start' }}
										onPress={() => {
											RelationGuid = item.relationGuid;
											this.setState({ isModalVisibleRelation: false, relationship: item.relationName, addFamilyMember: item.relationName, showDiscard: true })
										}}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font14, marginTop: responsiveHeight(1.3), marginLeft: 20, fontWeight: CustomFont.fontWeight400 }}>{item.relationName}</Text>
									</TouchableOpacity>
								)}
								keyExtractor={(item, index) => index.toString()}
							/>
						</View>

					</View>
				</Modal>


				<Modal isVisible={this.state.isAddImage} avoidKeyboard={true}>
					<View style={styles.modelViewCamera}>
						<View style={{ height: responsiveHeight(3), margin: responsiveHeight(2), justifyContent: 'center', flexDirection: 'row' }}>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontWeight: 'bold', fontSize: CustomFont.font18, marginTop: responsiveHeight(1.7), height: responsiveHeight(3), position: 'absolute', left: 0 }}>Upload Photo</Text>
							<TouchableOpacity style={{ position: 'absolute', right: 0, justifyContent: 'center', flexDirection: 'row', }} onPress={() => this.setState({ isAddImage: false })}>
								<Image source={closeImage} style={{ height: responsiveHeight(4), width: responsiveWidth(4), marginRight: responsiveWidth(3), marginTop: responsiveHeight(2), resizeMode: 'contain' }} />
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), marginLeft: responsiveHeight(1.5) }} onPress={this.openCamera}>

							<Image source={takePicture} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), }} />

							<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '500', fontFamily: CustomFont.fontName, color: Color.black }}>Take A Picture</Text>
						</TouchableOpacity>

						<View style={{ backgroundColor: Color.lineColor, height: 1, width: '100%', marginTop: responsiveHeight(1.5) }}></View>

						<TouchableOpacity style={{ flexDirection: 'row', height: responsiveFontSize(5), alignItems: 'center', marginLeft: responsiveHeight(1.5), marginTop: responsiveHeight(1.5), }} onPress={this.openGallery}>

							<Image source={uploadGallery} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />

							<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '500', fontFamily: CustomFont.fontName, color: Color.black }}>Upload From Gallery</Text>
						</TouchableOpacity>



					</View>

					{/* <View style={styles.modelViewCamera}>
						<TouchableOpacity onPress={this.openCamera} style={styles.row1Camera}>
							<View style={styles.iconView}>
								<Image style={styles.imageIcon} source={CameraIcon} />
							</View>
							<Text style={styles.rowTxt}>Take a photo</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.openGallery} style={styles.row2}>
							<View style={styles.iconView}>
								<Image style={styles.imageIcon} source={GalleryIcon} />
							</View>
							<Text style={styles.rowTxt}>Upload from gallery</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.setState({ isAddImage: false })} style={styles.row2}>
							<View style={styles.iconViewCancel}>
								<Image style={styles.imageIconCancel} source={CloseIconGrey} />
							</View>
							<Text style={[styles.rowTxt, { fontColor: Color.mostLightGrey, opacity: 0.8 }]}>Cancel</Text>
						</TouchableOpacity>
					</View> */}
				</Modal>

				<Modal isVisible={this.state.successAddPatient}>
					<View style={[styles.modelViewMessage2]}>
						<Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
						<Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
							Patient {this.state.isEdit ? 'updated' : 'added'} successfully.
						</Text>
						<TouchableOpacity
							onPress={() => {
								if (isGetData) {
									let imageUrl = this.state.imageSource ? this.state.imageSource.uri : ""
									let data = {
										patientName: this.state.fname + " " + this.state.lname, phoneNumber: this.state.mobile, gender: this.state.isMale ? 'Male' : this.state.isFemale ? 'Female' : 'Other',
										age: selectedDay, patientImageUrl: imageUrl
									}
									this.props.navigation.state.params.onEditPatient(data);
									this.props.navigation.goBack();
									try {
										if (isChange)
											this.props.navigation.state.params.Refresh();
									} catch (error) { }
								} else {
									//	this.props.navigation.navigate(isGetData ? "Consultation" : 'SearchPatients', { item: this.props.navigation.state.params.item });
									if (addPatientFromWhere == 'fromappointment') {
										this.props.navigation.navigate('ConfirmAppointment', { item: objItem, timeslot: timeslot });
									}
									else {
										this.props.navigation.goBack();
										try {
											if (isChange)
												this.props.navigation.state.params.Refresh();
										} catch (error) { }
									}

								};
								this.setState({ successAddPatient: false });
							}}
							style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
							<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
						</TouchableOpacity>
					</View>
				</Modal>

				<Modal isVisible={this.state.isPatientAddStatus} onRequestClose={() => this.setState({ isPatientAddStatus: false })}>
					<View style={[styles.modelViewMessage2]}>
						<Image source={alerts} style={{ height: 65, width: 65, marginTop: 30 }} />
						<Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
							{this.state.isPatientAddStatusDate}
						</Text>
						<TouchableOpacity
							onPress={() => {
								this.setState({ isPatientAddStatus: false });
								this.props.navigation.goBack();
								try {
									if (isChange)
										this.props.navigation.state.params.Refresh();
								} catch (error) {
									console.log(error)
								}
							}}
							style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
							<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
						</TouchableOpacity>
					</View>
				</Modal>
				<Modal isVisible={this.state.showDiscardDialog}>
					<View style={styles.modelViewDiscard}>
						<View style={styles.rowDiscard}>
							<Text style={styles.modalHeading}>All pages added here will be deleted.</Text>
							<View style={{ marginRight: 20, flexDirection: 'row', marginTop: Platform.OS === 'android' ? responsiveHeight(3) : responsiveHeight(2) }}>
								<View style={{ flex: 1.4, alignItems: 'flex-end' }}>
									<Text onPress={this.cancelPress} style={{ color: Color.primary, fontFamily: CustomFont.fontName, fontSize: CustomFont.font18 }}>Cancel</Text>
								</View>
								<View style={{ flex: 1, alignItems: 'flex-end' }}>
									<Text onPress={this.discardPress} style={{ color: Color.primary, fontFamily: CustomFont.fontName, fontSize: CustomFont.font18 }}>Discard</Text>
								</View>
							</View>
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
)(AddNewPatients);

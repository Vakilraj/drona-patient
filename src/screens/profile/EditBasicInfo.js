import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, Alert, BackHandler, ScrollView, FlatList, Platform, KeyboardAvoidingView
} from 'react-native';
import styles from './style';
import Validator from '../../components/Validator';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-native-modal';

import Moment from 'moment';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import camera from '../../../assets/camera_P.png';
import Snackbar from 'react-native-snackbar';
import ImagePicker from 'react-native-image-crop-picker';
import CommonStyle from '../../components/CommonStyle.js';
import CloseIcon from '../../../assets/cross_blue.png';
			import TakeAPhotoIcon from '../../../assets/ic_camera.png';
			import UploadPhotoIcon from '../../../assets/ic_gallery.png';

import CalendarPicker from 'react-native-calendar-picker';
import TickIcon from '../../../assets/green_tick.png';
import Toolbar from '../../customviews/Toolbar.js';
let selectedDay = '', selectedDayReformat = '', fullArraySpeciality = [];
let specialityGuid = null, base64 = null, filename = '';
import { setLogEvent } from '../../service/Analytics';
class EditBasicInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fname: '',
			lname: '',
			mobile: '',
			fnameAlert: '',
			lnameAlert: '',
			mobileAlert: '',
			email: '',
			emailAlert: '',
			showSelectedDay: 'DD/MM/YYYY',
			dateForfullCalendar: '',
			imageSource: null,
			isMale: false,
			isFemale: false,
			isOther: false,
			keyboardAvoiding: 0,
			specialityName: '',
			specialityArr: [],
			showSpecialityStatus: false,
			specialityAlert: '',
			fld1: Color.newBorder,
			fld2: Color.newBorder,
			basicInfoUpdate: false,
			isModalShowBrowseImage:false
		};
		selectedDay = ''; selectedDayReformat = ''; fullArraySpeciality = [];
		specialityGuid = null; base64 = null; filename = '';
	}
	async componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		try {
			let item = this.props.navigation.state.params.item ? this.props.navigation.state.params.item : '';
			if (item) {
				this.setState({
					fname: item.firstName,
					lname: item.lastName,
					mobile: item.phoneNumber,
					email: item.email,
					showSelectedDay: item.dob ? Moment(item.dob).format('DD-MM-YYYY') : 'DD/MM/YYYY',

				})

				if (item.gender == 'Male') {
					this.setState({ isMale: true })
				} else if (item.gender == 'Female') {
					this.setState({ isFemale: true })
				} else {
					this.setState({ isOther: true })
				}
				if (item.selectedSpeciality) {
					specialityGuid = item.selectedSpeciality.specialityGuid
					this.setState({ specialityName: item.selectedSpeciality.specialityName })
				}
				if (item.dob) {
					selectedDay = Moment(item.dob).format('YYYY-MM-DD')
				}
			}

		} catch (e) { }
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Version": "",
			"Data": {
				"SpecialityGuId": null
			}
		}
		//actions.callLogin('V1/FuncForDrAppToGetSpeciality', 'post', params, signupDetails.accessToken, 'SpecialityInBasicInfo');

	}

	BrowseImage() {
		var options = {
			title: 'Select Profile Picture',
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};
		ImagePicker.showImagePicker(options, response => {
			//console.log('---------'+JSON.stringify(response));
			if (response.didCancel) {
				//console.log('User cancelled image picker');
			} else if (response.error) {
				//console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				//console.log('User tapped custom button: ', response.customButton);
			} else {
				//let sizeInMb=response.fileSize > 0 ? response.fileSize/1000000 :0;
		//alert(sizeInMb)
		// if(sizeInMb > 10) {
		// 	alert('Maximum file upload size allowed is 10 MB')
        // }else{
			//console.log('------------: ', response);
			const source = { uri: response.uri };
				base64 = response.data;
				filename = response.fileName;
				//fileType = response.type;
				//imagArr.push(source)
				this.setState({ imageSource: source });
		//}
				
			}
		});
	}
	openCamera = () => {
        // this.setState({ isAddImage: false })
        ImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
			compressImageQuality: .5
        }).then(image => {
            this.handleCameraGalleryImage(image);
            
        });
    }
    openGallery = () => {

        ImagePicker.openPicker({
            cropping: true,
            includeBase64: true,
            // multiple : true,
            compressImageQuality: .5
        }).then(image => {
            this.handleCameraGalleryImage(image)
        });
    }

    handleCameraGalleryImage = (image) => {
        const source = { uri: 'data:image/jpeg;base64,' + image.data };
		this.setState({ imageSource: source });
		base64 = image.data;

		let fileExtFromBase64=base64 && base64.startsWith("iV") ?'.png':'.jpeg'
		filename='Clinic'+new Date().getTime()+fileExtFromBase64;

				this.setState({ isModalShowBrowseImage: false })
    }
	clickGender = (gender) => {
		if (gender === 'male') {
			this.setState({ isMale: true, isFemale: false, isOther: false })
		} else if (gender === 'female') {
			this.setState({ isMale: false, isFemale: true, isOther: false })
		}
		else {
			this.setState({ isMale: false, isFemale: false, isOther: true })
		}
	}

	gotoNext = () => {
		try {
			let { actions, signupDetails } = this.props;
		if (!this.state.fname.trim()) {
			this.setState({ fnameAlert: 'Please enter first name', fld1: Color.inputErrorBorder });
			this.refs.fname.focus();
		} else if (!Validator.isNameAcceptDotForDoc(this.state.fname)) {
			this.setState({ fnameAlert: 'Name should contain only alphabets,number,dot and hyphen', fld1: Color.inputErrorBorder });
			this.refs.fname.focus();
		} else if (this.state.fname.length < 1) {
			this.setState({ fnameAlert: 'First name minimum 1 character', fld1: Color.inputErrorBorder });
			this.refs.fname.focus();
		} else if (!this.state.lname.trim()) {
			this.setState({ lnameAlert: 'Please enter last name', fld2: Color.inputErrorBorder });
			this.refs.lname.focus();
		} else if (this.state.lname.length < 1) {
			this.setState({ lnameAlert: 'Last name minimum 1 character', fld2: Color.inputErrorBorder });
			this.refs.lname.focus();
		} else if (!Validator.isNameAcceptDotForDoc(this.state.lname)) {
			this.setState({ lnameAlert: 'Name should contain only alphabets,number,dot and hyphen', fld2: Color.inputErrorBorder });
			this.refs.lname.focus();
		} else if (!this.state.isMale && !this.state.isFemale && !this.state.isOther) {
			Snackbar.show({ text: 'Please select gender', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (this.state.showSelectedDay == 'DD/MM/YYYY') {
			Snackbar.show({ text: 'Please enter date of birth', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}
		else if (!this.state.mobile.trim()) {
			this.setState({ mobileAlert: 'Please enter mobile number' });
			this.refs.mobile.focus();
		} else if (this.state.mobile.length != 10) {
			this.setState({ mobileAlert: 'Mobile number should be 10 digit' });
			this.refs.mobile.focus();
		} else if (!Validator.isMobileValidate(this.state.mobile)) {
			this.setState({ mobileAlert: 'Mobile number should contain only number' });
			this.refs.mobile.focus();
		}
		else if (!this.state.email.trim()) {
			this.setState({ emailAlert: 'Please enter Email Id' });
		}
		else if (!Validator.isEmailValid(this.state.email)) {
			this.setState({ alertTxt: 'Please enter valid email id' });
		}
		else if (!this.state.specialityName) {
			this.setState({ specialityAlert: 'Please enter speciality' });
			this.refs.specialityName.focus();
		} else {
			let { actions, signupDetails } = this.props;
			let fileExtFromBase64=base64 && base64.startsWith("iV") ?'.png':'.jpeg'
			let fileNameCustom='Clinic'+new Date().getTime()+fileExtFromBase64;
			let params = {
				"RoleCode": signupDetails.roleCode,
				"UserGuid": signupDetails.UserGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"Version": "",
				"Data": {
					"FirstName": this.state.fname,
					"MiddleName": null,
					"LastName": this.state.lname,
					"Gender": this.state.isMale ? "M" : this.state.isFemale ? "F" : "O",
					"DOB": selectedDay,
					"SelectedSpeciality": {
						"SpecialityGuid": specialityGuid,
						"SpecialityName": this.state.specialityName
					},
					"Attachment": {
						"FileGuid": null,
						"OrgFileName": fileNameCustom,
						"OrgFileExt": fileExtFromBase64,
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
			actions.callLogin('V11/FuncForDrAppToUpdateDrProfileBasicInfo', 'post', params, signupDetails.accessToken, 'updateBasicInfo');
		}
		} catch (error) {
			
		}
		
	}

	SearchFilterFunctionSpeciality = (text) => {
		if (text.length > 0) {
			var searchResult = _.filter(fullArraySpeciality, function (item) {
				return item.label.toLowerCase().indexOf(text.toLowerCase()) > -1;
			});
			this.setState({
				specialityArr: searchResult, showSpecialityStatus: true
			});
		} else {
			this.setState({ showSpecialityStatus: true });
		}
		this.setState({ specialityName: text });
	}
	clickOnSpeciality = (item) => {
		specialityGuid = item.value;
		this.setState({ specialityName: item.label, showSpecialityStatus: false })
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'SpecialityInBasicInfo') {
				let speciaArr = newProps.responseData.data;
				let tempArr = [];
				for (let i = 0; i < speciaArr.length; i++) {
					tempArr.push({ label: speciaArr[i].specialtyName, value: speciaArr[i].specialityGuId })
				}
				fullArraySpeciality = tempArr;
				this.setState({ specialityArr: tempArr });
			} else if (tagname === 'updateBasicInfo') {
				//console.log(JSON.stringify(newProps.responseData));
				if (newProps.responseData.statusCode == '0') {
					setTimeout(()=>{
						this.setState({ basicInfoUpdate: true })
					},300)
					
					// setTimeout(()=>{
					// 	Alert.alert(
					// 		'Success',
					// 		'Profile updated successfully',
					// 		[
					// 			{
					// 				text: 'Ok',
					// 				onPress: () => {
					// 					this.props.navigation.goBack();
					// 				},
					// 			},
					// 		],
					// 		{ cancelable: false },
					// 	);

					// },300)
					try {
						let { actions, signupDetails } = this.props;
						signupDetails.fname = this.state.fname
						signupDetails.lname = this.state.lname
						if (newProps.responseData.data.drProfileImgUrl) {
							signupDetails.profileImgUrl = newProps.responseData.data.drProfileImgUrl;
						}
						actions.setSignupDetails(signupDetails);
					} catch (e) { }
				}
			}
		}
	}

	clickOnDone = () => {
		if (!selectedDayReformat) {
			Snackbar.show({ text: 'Please select date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			this.setState({ showSelectedDay: selectedDayReformat, isModalVisible: false });
		}
	}

	isCallFocus = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.primary })
		}
		else {
			this.setState({ fld2: Color.primary })
		}

	}
	isCallBlur = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.newBorder })
		}
		else {
			this.setState({ fld2: Color.newBorder })

		}
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
				{/* <View style={{ flexDirection: 'row', backgroundColor: Color.primaryBlue, justifyContent: 'space-between', height: responsiveHeight(7), alignItems: 'center', zIndex: 999 }}>
					<TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
						<Image source={arrowBack} style={{ height: responsiveWidth(4), width: responsiveWidth(5) }} />
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.white, marginLeft: responsiveWidth(3) }}>Basic Info</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{ padding: 10 }} onPress={() => this.gotoNext()}>
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.white }}>SAVE</Text>
					</TouchableOpacity>
				</View> */}
				<Toolbar
					title={"Edit Basic Information"}
					onBackPress={() => { this.props.navigation.goBack() }} />
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={this.state.keyboardAvoiding}>
					<ScrollView>
						<View style={{ flex: 1, backgroundColor: Color.lightGrayBg, padding: responsiveWidth(3), marginBottom: responsiveHeight(20) }}>

							<View style={{ margin: responsiveWidth(0), backgroundColor: Color.white, borderRadius: 10, padding: 16, }}>
								{/* <View style={{ flexDirection: 'row', }}> */}
								<View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }}>
									{this.state.imageSource ? <TouchableOpacity >
										<Image source={this.state.imageSource} style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8), marginTop: responsiveHeight(0), }} />
										{/* <View style={{ position: 'absolute', height: responsiveFontSize(3), width: responsiveFontSize(3), borderRadius: responsiveFontSize(1.5), alignItems: 'center', justifyContent: 'center', backgroundColor: Color.primary, bottom: 0, right: responsiveWidth(-1) }}>
											<Image source={edit} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
										</View> */}
									</TouchableOpacity> :
										signupDetails.profileImgUrl ? <TouchableOpacity onPress={() => this.setState({isModalShowBrowseImage:true})}>
											<Image source={{ uri: signupDetails.profileImgUrl }} style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8), marginTop: responsiveHeight(0), }} />
											{/* <View style={{ position: 'absolute', height: responsiveFontSize(3), width: responsiveFontSize(3), borderRadius: responsiveFontSize(1.5), alignItems: 'center', justifyContent: 'center', backgroundColor: Color.primary, bottom: 0, right: responsiveWidth(-1) }}>
												<Image source={edit} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
											</View> */}
										</TouchableOpacity> :
											<TouchableOpacity style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8), borderColor: Color.grayBorder, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.white, marginTop: responsiveHeight(0) }}
											onPress={() =>this.setState({isModalShowBrowseImage:true})}>
												<Image source={camera} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3) }} />
											</TouchableOpacity>}
									<Text onPress={() =>this.setState({isModalShowBrowseImage:true})} style={{ marginLeft: 16, justifyContent: 'center', alignItems: 'center', color: Color.primary, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight600, fontName: CustomFont.fontName }}>Change Photo</Text>
								</View>

								{/* <View style={{ flex: 7, marginLeft: 0 }}> */}
								<Text style={[styles.inputHeader, { marginTop: 25 }]}>First Name *</Text>
								{/* <TextInput returnKeyType="done"
									onBlur={() => this.isCallBlur('1')}
									style={[styles.createInputStyle, { borderColor: this.state.fld1 }]} placeholder="First Name" placeholderTextColor={Color.placeHolderColor} onChangeText={fname => {
										this.setState({ fname })
										if (!fname || Validator.isNameValidate(fname)) {
											this.setState({ fnameAlert: '' })
										} else {

											this.setState({ fnameAlert: 'name should contain only alphabets', fld1: Color.inputErrorBorder })
										}
									}} ref='fname' onSubmitEditing={() => this.refs.lname.focus()} value={this.state.fname} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld1: Color.primary })} /> */}

<View style={{flexDirection:'row'}}>
									<View style={{flex: 1, backgroundColor: Color.grayBorder, width:responsiveHeight(4), height:responsiveHeight(7.2), justifyContent:'center', marginTop:responsiveHeight(1.2),borderTopLeftRadius: 5,borderBottomLeftRadius: 5,}}><Text style={{marginLeft:responsiveWidth(2)}}>Dr.</Text></View>
									<View style={{flex: 11}}><TextInput returnKeyType="done"
									onBlur={() => this.isCallBlur('1')}
									style={[styles.createInputStylefname, { borderColor: this.state.fld1 }]} placeholder="First Name" placeholderTextColor={Color.placeHolderColor} onChangeText={fname => {
										this.setState({ fname })
										if (!fname || Validator.isNameAcceptDotForDoc(fname)) {
											this.setState({ fnameAlert: '' })
										} else {

											this.setState({ fnameAlert: 'Name should contain only alphabets,number,dot and hyphen', fld1: Color.inputErrorBorder })
										}
									}} ref='fname' onSubmitEditing={() => this.refs.lname.focus()} value={this.state.fname} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld1: Color.primary })} /></View>
								</View>

								{this.state.fnameAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.fnameAlert}</Text> : null}
								<Text style={styles.inputHeader}>Last Name *</Text>
								<TextInput returnKeyType="done"
									onBlur={() => this.isCallBlur('2')} style={[styles.createInputStyle, { borderColor: this.state.fld2 }]} placeholderTextColor={Color.placeHolderColor} placeholder="Last Name" onChangeText={lname => {
										this.setState({ lname })
										if (!lname || Validator.isNameAcceptDotForDoc(lname)) {
											this.setState({ lnameAlert: '' })
										} else {

											this.setState({ lnameAlert: 'Name should contain only alphabets,number,dot and hyphen', fld2: Color.inputErrorBorder })
										}
									}} ref='lname' value={this.state.lname} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-40), fld2: Color.primary })} />
								{this.state.lnameAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.lnameAlert}</Text> : null}
								{/* </View> */}

								{/* </View> */}

								<View style={{ marginTop: responsiveHeight(1) }}>
									<Text style={styles.inputHeader}>Primary Phone Number *</Text>
									{/* <View style={{ position: 'absolute', marginTop: responsiveHeight(7.5), marginLeft: responsiveWidth(75), zIndex: 1 }}>
										<TouchableOpacity style={{ flexDirection: 'row' }} onPress={()=>alert('under development')}>
											<Image source={edit_blue} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
											<Text style={{ color: '#5715D2', marginLeft: 5 }}>Edit</Text>
										</TouchableOpacity>
									</View> */}
									<TouchableOpacity onPress={()=>{
									Snackbar.show({ text: 'Note: Primary Phone Number can not be changed', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
								}}><Text style={[styles.createInputStyleMobile]}>{this.state.mobile}</Text></TouchableOpacity>
								</View>

								<View  style={{ marginTop: responsiveHeight(1) }}>
									<Text style={styles.inputHeader}>Email Address *</Text>
									{/* <TextInput style={styles.createInputStyle} placeholder="Enter email id" placeholderTextColor={Color.placeHolderColor} onChangeText={email => {
										this.setState({ email })
										this.setState({ emailAlert: '' })
									}
									} keyboardType={Platform.OS == 'ios' ? 'email-address' : 'email'}
										ref='email' value={this.state.email} onFocus={() => this.setState({ keyboardAvoiding: 0 })} />
									{this.state.emailAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.emailAlert}</Text> : null} */}
									<TouchableOpacity onPress={()=>{
									Snackbar.show({ text: 'Note: Email Address can not be changed', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
								}}><Text style={[styles.createInputStyleMobile]}>{this.state.email}</Text></TouchableOpacity>
									
								</View>

								<View style={{ flexDirection: 'row', marginTop: 7 }}>
									<View style={{ flex: 3 }}>
										<Text style={styles.inputHeader}>Date of Birth</Text>
										<TouchableOpacity style={{ flexDirection: 'row', height: responsiveHeight(7), borderColor: Color.newBorder, borderWidth: 1, borderRadius: 4, backgroundColor: Color.white, alignItems: 'center', marginTop: 7, justifyContent: 'space-between' }}
											onPress={() => {
												this.setState({ isModalVisible: true })
											}}>
											<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: 10 }}>{this.state.showSelectedDay}</Text>
											{/* <Image source={calendar_basic} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), marginRight: 10 }} /> */}
										</TouchableOpacity>
									</View>
								</View>

								<Text style={styles.inputHeader}>Gender *</Text>
								<View style={{ flexDirection: 'row', marginTop: 10, borderColor: Color.createInputBorder, borderRadius: 4 }}>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(7), borderWidth: 0.5, borderRadius: 4, borderColor: Color.newBorder, backgroundColor: this.state.isMale ? Color.liveBg : Color.white }} onPress={() => this.clickGender('male')}>
										<Text style={{ color: this.state.isMale ? Color.white : Color.optiontext, fontSize: CustomFont.font14 }}>Male</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(7), borderWidth: 0.5, marginLeft: 16, borderColor: Color.newBorder, marginRight: 16, borderRadius: 4, backgroundColor: this.state.isFemale ? Color.liveBg : Color.white, }} onPress={() => this.clickGender('female')}>
										<Text style={{ color: this.state.isFemale ? Color.white : Color.optiontext, fontSize: CustomFont.font14, }}>Female</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderRadius: 4, height: responsiveHeight(7), borderColor: Color.newBorder, backgroundColor: this.state.isOther ? Color.liveBg : Color.white }} onPress={() => this.clickGender('other')}>
										<Text style={{ color: this.state.isOther ? Color.white : Color.optiontext, fontSize: CustomFont.font14, }}>Other</Text>
									</TouchableOpacity>
								</View>

								<View>
									<Text style={styles.inputHeader}>Speciality</Text>
									{/* <TextInput style={styles.createInputStyle} placeholder="Select speciality" placeholderTextColor={Color.placeHolderColor} value={this.state.specialityName} onChangeText={(specialityName) => {
										return this.SearchFilterFunctionSpeciality(specialityName);
									}} />
									{this.state.specialityAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.specialityAlert}</Text> : null} */}
									<TouchableOpacity onPress={()=>{
									Snackbar.show({ text: 'Note: Speciality can not be changed', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
								}}><Text style={[styles.createInputStyleMobile]}>{this.state.specialityName}</Text></TouchableOpacity>
								</View>


								<View style={{ flex: 1 }}>
									{this.state.showSpecialityStatus && this.state.specialityArr ?
										<View style={{
											borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
											borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
										}}>
											<FlatList style={{ backgroundColor: '#fafafa' }}
												data={this.state.specialityArr}
												renderItem={({ item, index }) => (
													<TouchableOpacity style={{ height: responsiveHeight(7), justifyContent: 'flex-start' }}
														onPress={() => this.clickOnSpeciality(item)}>
														<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: 20 }}>{item.label}</Text>
													</TouchableOpacity>
												)}
												keyExtractor={(item, index) => index.toString()}
											/>
										</View> : null}
								</View>

								{/* <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(7), backgroundColor: Color.primary, marginTop: responsiveHeight(4), marginBottom: responsiveHeight(7) }} onPress={() => {
									this.gotoNext();
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save </Text>
								</TouchableOpacity> */}
							</View>


						</View>

					</ScrollView>
				</KeyboardAvoidingView>

				<View style={{ marginLeft: -.5, backgroundColor: Color.white, width: "100%", padding: 16, position: 'absolute', bottom: -40, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
					<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(7), backgroundColor: Color.primary, marginTop: responsiveHeight(0), marginBottom: responsiveHeight(5) }}
					 onPress={() => {
						let { signupDetails } = this.props;
						setLogEvent("doctor_profile", { "edit-profile": "click", UserGuid: signupDetails.UserGuid })
						this.gotoNext();
					}}>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save </Text>
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
										selectedDay = Moment(date.toString()).format('YYYY-MM-DD');
										//let showDate = Moment(selectedDay).format('DD MMM YYYY');
										selectedDayReformat = Moment(selectedDay).format('DD/MM/YYYY');
									}}
									maxDate={new Date()}
									minDate = {new Date(1900, 1, 1)}
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
				<Modal isVisible={this.state.basicInfoUpdate}>
					<View style={[styles.modelViewMessage2]}>
						<Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
						<Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
							Profile updated successfully
                        	</Text>
						<TouchableOpacity
							onPress={() => {
								this.setState({ basicInfoUpdate: false });
								this.props.navigation.goBack();
							}}
							style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
							<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
						</TouchableOpacity>
					</View>
				</Modal>
				<Modal isVisible={this.state.isModalShowBrowseImage} avoidKeyboard={true}>
                            <View style={CommonStyle.modelViewBrowse}>
						<View style={{ marginBottom: responsiveHeight(20) }}>
                                <View style={{ marginBottom: 22, flexDirection: 'row', marginLeft: 24, marginRight: 24, marginTop: 24, }}>
                                    <Text style={CommonStyle.addtxt}>Browse Image</Text>
                                    <TouchableOpacity style={CommonStyle.crossbtn} onPress={() => this.setState({ isModalShowBrowseImage: false })}>
                                        <Image style={CommonStyle.closeIcon} source={CloseIcon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={CommonStyle.rowShare}>
                                    <TouchableOpacity style={CommonStyle.btn} onPress={this.openCamera}>
                                        <Image style={CommonStyle.optionimg} source={TakeAPhotoIcon} />
                                        <Text style={CommonStyle.optiontxt}>Take a photo</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={CommonStyle.divider} />

                                <View style={CommonStyle.rowShare}>
                                    <TouchableOpacity style={CommonStyle.btn} onPress={this.openGallery}>
                                        <Image style={CommonStyle.optionimg} source={UploadPhotoIcon} />
                                        <Text style={CommonStyle.optiontxt}>Upload from gallery</Text>
                                    </TouchableOpacity>
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
)(EditBasicInfo);

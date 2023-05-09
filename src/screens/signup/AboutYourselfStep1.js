import React, { useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	View,
	Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, StatusBar
} from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';
import CommonStyle from '../../components/CommonStyle.js';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';
import steps1 from '../../../assets/steps1.png';
import user from '../../../assets/user.png';
import Validator from '../../components/Validator';
import Modal from 'react-native-modal';
import CloseIcon from '../../../assets/cross_blue.png';
import TakeAPhotoIcon from '../../../assets/ic_camera.png';
import UploadPhotoIcon from '../../../assets/ic_gallery.png';
import { TapGestureHandler } from 'react-native-gesture-handler';

let selectedSpeciality = '', selectedState = null;
let fullArraySpeciality = [], base64 = null;
let fullArrayState = [];
class AboutYourselfStep1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSource: null,
			registrationNumber: '',
			qualification: '',
			userType: 'doctor',
			isMale: false,
			isFemale: false,
			isOther: false,
			stateDropdownArr: [],
			specialityArr: [],
			registarationAlert: '',
			qualificationAlert: '',
			specialityName: '',
			stateName: '',
			showSpecialityStatus: false,
			showStateStatus: false,
			InpborderColor1: Color.inputdefaultBorder,
			InpborderColor2: Color.inputdefaultBorder,
			InpborderColor3: Color.inputdefaultBorder,
			InpborderColor4: Color.inputdefaultBorder,
			buttonBorderWidth: 0,
			isModalShowBrowseImage: false

		};
	}
	componentDidMount() {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Version": "",
			"Data": {
				"SpecialityGuId": null
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetSpeciality', 'post', params, signupDetails.accessToken, 'Speciality');

	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails } = this.props;
			if (tagname === 'Speciality') {
				let speciaArr = newProps.responseData.data;
				let tempArr = [];
				for (let i = 0; i < speciaArr.length; i++) {
					tempArr.push({ label: speciaArr[i].specialtyName, value: speciaArr[i].specialityGuId })
				}
				fullArraySpeciality = tempArr;
				this.setState({ specialityArr: tempArr });
				let params = {
					"UserGuid": signupDetails.UserGuid,
					"Version": "",
					"Data": {
						"stateGuId": null
					}
				}
				actions.callLogin('V1/FuncForDrAppToGetStateList', 'post', params, signupDetails.accessToken, 'stateList');
			} else if (tagname === 'stateList') {
				let sateArr = newProps.responseData.data;
				let tempArr = [];
				for (let i = 0; i < sateArr.length; i++) {
					tempArr.push({ label: sateArr[i].stateName, value: sateArr[i].stateGuId })
				}
				fullArrayState = tempArr;
				this.setState({ stateDropdownArr: tempArr });
			} else if (tagname === 'aboutYourself1') {
				this.setState({ buttonBorderWidth: 0 })
				if (newProps.responseData.statusMessage === 'Success') {
					this.props.navigation.navigate('BecomeAMember', { from: 'signup' });
					//this.props.navigation.navigate('AddNewClinic', { selectedState: selectedState });  //AboutYourselfStep2
				} else {
					alert(JSON.stringify(newProps.responseData.statusMessage))
				}
			}
		}
	}
	continueBtn = () => {
		this.setState({ buttonBorderWidth: 1 })
		if (!this.state.isMale && !this.state.isFemale && !this.state.isOther) {
			Snackbar.show({ text: 'Please select gender', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.setState({buttonBorderWidth : 0})
		}
		else if (!this.state.qualification.trim()) {
			this.setState({ InpborderColor3: Color.inputErrorBorder })
			this.setState({ qualificationAlert: 'Please enter your qualification' })
		}
		else if (!selectedSpeciality) {
			//this.setState({buttonBorderWidth : 0})
			Snackbar.show({ text: 'Please select Speciality', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!selectedState) {
			//this.setState({buttonBorderWidth : 0})
			Snackbar.show({ text: 'Please select State', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}

		else if (!this.state.registrationNumber.trim()) {
			//this.setState({buttonBorderWidth : 0})
			this.setState({ InpborderColor3: Color.inputErrorBorder })
			this.setState({ registarationAlert: 'Please enter registration number' })
		} else if (this.state.registrationNumber.trim().length < 4) {
			//this.setState({buttonBorderWidth : 0})
			this.setState({ registarationAlert: 'Registration number should be minimum 4 digit' })
		} else if (this.state.registrationNumber.trim().length > 8) {
			//this.setState({buttonBorderWidth : 0})
			this.setState({ registarationAlert: 'Registration number should be maximum 8 digit' })
		} else if (!Validator.isSpecialCharValidate(this.state.registrationNumber)) {
			this.setState({ registarationAlert: 'Registration number can not contain any special charecter' })
		} else {
			let { actions, signupDetails } = this.props;
			let fileExtFromBase64 = base64 && base64.startsWith("iV") ? '.png' : '.jpeg'
			let fileNameCustom = 'Clinic' + new Date().getTime() + fileExtFromBase64;
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"Version": "",
				"Data": {
					"UserGuid": signupDetails.UserGuid,
					"Gender": this.state.isMale ? "M" : this.state.isFemale ? "F" : "O",
					"RoleType": this.state.userType === 'doctor' ? "dr" : "std",
					"SpecialityGuid": selectedSpeciality,
					"MedicalCouncilGuid": selectedState,
					"RegistrationNumber": this.state.registrationNumber,
					"Education": this.state.qualification,
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
			//console.log(JSON.stringify(params));
			actions.callLogin('V11/FuncForDrAppToRegisterUserStep1_V1', 'post', params, signupDetails.accessToken, 'aboutYourself1');
		}
	}

	// BrowseImage() {
	// 	var options = {
	// 		title: 'Select Profile Picture',
	// 		storageOptions: {
	// 			skipBackup: true,
	// 			path: 'images',
	// 		},
	// 	};
	// 	ImagePicker.showImagePicker(options, response => {
	// 		if (response.didCancel) {
	// 			//console.log('User cancelled image picker');
	// 		} else if (response.error) {
	// 			//console.log('ImagePicker Error: ', response.error);
	// 		} else if (response.customButton) {
	// 			//console.log('User tapped custom button: ', response.customButton);
	// 		} else {
	// 			//let sizeInMb=response.fileSize > 0 ? response.fileSize/1000000 :0;
	// 			//alert(sizeInMb)
	// 			// if(sizeInMb > 10) {
	// 			// 	alert('Maximum file upload size allowed is 10 MB')
	// 			// }else{
	// 			const source = { uri: response.uri };
	// 			base64 = response.data;
	// 			//filename = response.fileName;
	// 			this.setState({ imageSource: source });
	// 			//}

	// 		}
	// 	});
	// }
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

		// let fileExtFromBase64 = base64 && base64.startsWith("iV") ? '.png' : '.jpeg'
		// filename = 'Clinic' + new Date().getTime() + fileExtFromBase64;

		this.setState({ isModalShowBrowseImage: false })
	}
	clickDoctor = () => {
		this.setState({ userType: 'doctor' })
	}
	clickStudent = () => {
		this.setState({ userType: 'student' })
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
		this.dismissDialog()
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
			this.setState({ showSpecialityStatus: true, specialityArr: fullArraySpeciality });
		}
		this.setState({ specialityName: text });
	}
	clickOnSpeciality = (item) => {
		selectedSpeciality = item.value;
		this.setState({ specialityName: item.label, showSpecialityStatus: false })
	}

	SearchFilterFunctionState = (text) => {
		if (text.length > 0) {
			var searchResult = _.filter(fullArrayState, function (item) {
				return item.label.toLowerCase().indexOf(text.toLowerCase()) > -1;
			});
			this.setState({
				stateDropdownArr: searchResult, showStateStatus: true
			});
		} else {
			this.setState({ showStateStatus: true, stateDropdownArr: fullArrayState });
		}
		this.setState({ stateName: text });
	}
	clickOnState = (item) => {
		selectedState = item.value;
		this.setState({ stateName: item.label, showStateStatus: false })
	}
	callIsFucused1 = () => {
		this.setState({ InpborderColor1: Color.primary })
	}
	callIsBlur1 = () => {
		this.setState({ InpborderColor1: Color.inputdefaultBorder });
		//this.dismissDialog()
	}
	callIsFucused2 = () => {
		this.setState({ InpborderColor2: Color.primary })
	}
	callIsBlur2 = () => {
		this.setState({ InpborderColor2: Color.inputdefaultBorder })
		//this.dismissDialog()
	}
	callIsFucused3 = () => {
		this.setState({ InpborderColor3: Color.primary });
		this.dismissDialog()
	}
	callIsBlur3 = () => {
		this.setState({ InpborderColor3: Color.inputdefaultBorder })
	}
	callIsFucused4 = () => {
		this.setState({ InpborderColor4: Color.primary });
		this.dismissDialog()
	}
	callIsBlur4 = () => {
		this.setState({ InpborderColor4: Color.inputdefaultBorder })
	}
	// onSingleTap = () => {
	// 	//this.setState({specialityArr: [],stateDropdownArr:[]});
	// 	setTimeout(() => {
	// 		this.setState({ showSpecialityStatus: false, showStateStatus: false });
	// 	}, 1000)

	// }
	dismissDialog = () => {
			this.setState({ showSpecialityStatus: false, showStateStatus: false });
	}
	render() {

		let { actions, signupDetails } = this.props;
		return (
			// <TapGestureHandler
			// onHandlerStateChange={this.onSingleTap}>
				<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }} onStartShouldSetResponder={() => this.dismissDialog()}>
					<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
					<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}>
						<ScrollView keyboardShouldPersistTaps='always'>
							<View style={{ flex: 1 }}>
								<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
								<View style={{ flex: 1, margin: responsiveWidth(6), }}>
									<View style={{ alignItems: 'flex-end', marginRight: responsiveWidth(-4), marginTop: -10 }}>
										<Image source={steps1} style={{ height: responsiveFontSize(3), width: responsiveFontSize(4), resizeMode: 'contain', marginTop: responsiveHeight(1.3), marginRight: responsiveWidth(2.4) }} />
									</View>

									<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />

									<Text style={styles.getstartedTxt}>Tell us about yourself</Text>

									<View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }}>
										{this.state.imageSource ? <TouchableOpacity >
											<Image source={this.state.imageSource} style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8), marginTop: responsiveHeight(0), }} />
										</TouchableOpacity> :
											<TouchableOpacity style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8), alignItems: 'center', justifyContent: 'center', backgroundColor: Color.googleLoginBtn, marginTop: responsiveHeight(0) }}
												onPress={() => this.setState({ isModalShowBrowseImage: true,showSpecialityStatus: false, showStateStatus: false })}>
												<Image source={user} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain' }} />
											</TouchableOpacity>}
										<Text onPress={() => this.setState({ isModalShowBrowseImage: true,showSpecialityStatus: false, showStateStatus: false })} style={{ marginLeft: 16, justifyContent: 'center', alignItems: 'center', color: Color.primary, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight600, fontName: CustomFont.fontName }}>Add Profile Picture</Text>
									</View>

									<Text style={styles.labelStyleReg}>What is your gender? *</Text>
									<View style={{ flexDirection: 'row', marginTop: 10, marginRight: responsiveWidth(10) }}>
										<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.8), borderRadius: 4, borderWidth: 1, borderColor: this.state.isMale ? Color.liveBg : Color.lightBlueBorder, backgroundColor: this.state.isMale ? Color.accountTypeSelBg : Color.white }} onPress={() => this.clickGender('male')}>
											<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14 }}>Male</Text>
										</TouchableOpacity>
										<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.8), borderRadius: 4, borderWidth: 1, borderColor: this.state.isFemale ? Color.liveBg : Color.lightBlueBorder, backgroundColor: this.state.isFemale ? Color.accountTypeSelBg : Color.white, marginLeft: 10, marginRight: 10 }} onPress={() => this.clickGender('female')}>
											<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, }}>Female</Text>
										</TouchableOpacity>
										<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(5.8), borderRadius: 4, borderWidth: 1, borderColor: this.state.isOther ? Color.liveBg : Color.lightBlueBorder, backgroundColor: this.state.isOther ? Color.accountTypeSelBg : Color.white }} onPress={() => this.clickGender('other')}>
											<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, }}>Other</Text>
										</TouchableOpacity>
									</View>

									<Text style={styles.labelStyleReg}>What is your qualification ? *</Text>
									<TextInput returnKeyType="done" onFocus={this.callIsFucused3}
										onBlur={this.callIsBlur3} style={[styles.createInputStyle, { borderColor: this.state.InpborderColor3 }]} placeholder="Enter your qualification" placeholderTextColor={Color.placeHolderColor} onChangeText={qualification => {
											this.setState({ qualification })
											if (qualification.length > 0) {
												this.setState({ qualificationAlert: '' })
											}
										}} maxLength={150} value={this.state.qualification} />
									{this.state.qualificationAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.qualificationAlert}</Text> : null}

									<Text style={styles.labelStyleReg}>What is your speciality? *</Text>
									<TextInput returnKeyType="done" onBlur={this.callIsBlur1} onFocus={this.callIsFucused1} style={[styles.createInputStyle, { borderColor: this.state.InpborderColor1 }]} placeholder="Enter your speciality" placeholderTextColor={Color.placeHolderColor} value={this.state.specialityName} onChangeText={(specialityName) => { return this.SearchFilterFunctionSpeciality(specialityName); }} />
									<View style={{ flex: 1 }}>

										{this.state.showSpecialityStatus ?
											<View style={{
												borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
												borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
											}}>
												{this.state.specialityArr && this.state.specialityArr.length > 0 ? <FlatList style={{ backgroundColor: '#fafafa' }}
													data={this.state.specialityArr}
													renderItem={({ item, index }) => (
														<TouchableOpacity style={{ height: responsiveHeight(7), justifyContent: 'flex-start' }}
															onPress={() => this.clickOnSpeciality(item)}>
															<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }}>{item.label}</Text>
														</TouchableOpacity>
													)}
													keyExtractor={(item, index) => index.toString()}
												/> : <View style={{ alignItems: 'center', }}>
													<Text style={{ marginTop: 20,marginBottom:30,fontSize:CustomFont.font16,color:Color.primary }}>No Speciality Found</Text>
												</View>}

											</View> : null}
									</View>

									<Text style={styles.labelStyleReg}>Which Medical Council/State are you{'\n'}
										registered to? *</Text>
									<TextInput returnKeyType="done" onBlur={this.callIsBlur2} onFocus={this.callIsFucused2} style={[styles.createInputStyle, { borderColor: this.state.InpborderColor2 }]} placeholder="Choose State" placeholderTextColor={Color.placeHolderColor} value={this.state.stateName} onChangeText={(stateName) => { return this.SearchFilterFunctionState(stateName); }} />

									<View style={{ flex: 1 }}>
										{this.state.showStateStatus?
											<View style={{
												borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
												borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
											}}>
												{this.state.stateDropdownArr && this.state.stateDropdownArr.length>0 ? <FlatList style={{ backgroundColor: '#fafafa' }}
													data={this.state.stateDropdownArr}
													renderItem={({ item, index }) => (
														<TouchableOpacity style={{ height: responsiveHeight(7), justifyContent: 'flex-start' }}
															onPress={() => this.clickOnState(item)}>
															<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }}>{item.label}</Text>
														</TouchableOpacity>
													)}
													keyExtractor={(item, index) => index.toString()}
												/>:<View style={{ alignItems: 'center', }}>
												<Text style={{ marginTop: 20,marginBottom:30,fontSize:CustomFont.font16,color:Color.primary }}>No State Found</Text>
											</View>}
												
											</View> : null}
									</View>
									<Text style={styles.labelStyleReg}>What is your Registration Number ? *</Text>
									<TextInput returnKeyType="done" onFocus={this.callIsFucused4}
										onBlur={this.callIsBlur4} style={[styles.createInputStyle, { borderColor: this.state.InpborderColor4 }]} placeholder="Enter Medical Registration Number" placeholderTextColor={Color.placeHolderColor} onChangeText={registrationNumber => {
											if(registrationNumber){
												if (Validator.isSpecialCharValidate(registrationNumber))
												this.setState({ registrationNumber })
											}else{
												this.setState({ registrationNumber })
											}

											if (registrationNumber.length > 0) {
												this.setState({ registarationAlert: '' })
											}
										}} maxLength={80} value={this.state.registrationNumber} />
									{this.state.registarationAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.registarationAlert}</Text> : null}


									<TouchableOpacity style={styles.signUpBtn} onPress={this.continueBtn}>
										<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Continue </Text>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
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
			// </TapGestureHandler>
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
)(AboutYourselfStep1);

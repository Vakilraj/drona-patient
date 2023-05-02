import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	Alert,
	StatusBar, Image, TextInput, TouchableOpacity, BackHandler, ScrollView, FlatList, Platform, KeyboardAvoidingView, Linking
} from 'react-native';
import styles from './style';
import TickIcon from '../../../assets/green_tick.png';
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
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import close from '../../../assets/cross_blue.png';
import camera from '../../../assets/clinic_primary.png';
import info from '../../../assets/info.png';
import Time from '../../../assets/time_red.png';
import deletefile from '../../../assets/deletefile.png';
import DatePicker from 'react-native-date-picker'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from 'react-native-encrypted-storage';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import CloseIcon from '../../../assets/cross_blue.png';
import TakeAPhotoIcon from '../../../assets/ic_camera.png';
import UploadPhotoIcon from '../../../assets/ic_gallery.png';
import ImagePicker from 'react-native-image-crop-picker';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
let base64 = null, filename = '';
var ts = require("time-slots-generator");
let pinCodeValid = true;
import { setLogEvent } from '../../service/Analytics';
import NetInfo from "@react-native-community/netinfo";
//import LocationEnabler from 'react-native-location-enabler';

var addressComponent = '';
let listener = null;

class AddNewClinicDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSource: null,
			clinicName: props.navigation.state.params.clinicName,
			primaryNumber: '',
			clinicNumber: '',
			address: '',
			landMark: '',
			pincode: '',
			city: '',
			stateName: '',
			keyboardAvoiding: 0,
			isModalVisible: false,
			isModalVisibleTimeSlot: false,
			dataArray: [{ su: false, m: false, tu: false, w: false, th: false, f: false, sa: false, times: null }],
			showWeekDayTimings: null,

			fld1: Color.newBorder,
			fld2: Color.newBorder,
			fld3: Color.newBorder,
			fld4: Color.newBorder,
			fld5: Color.newBorder,
			fld6: Color.newBorder,
			fld7: Color.newBorder,
			clinicTimeSetupSuccess: false,

			latitude: 0,
			longitude: 0,
			googleMapUrl: '',
			isModalShowBrowseImage:false
		};
		this.ClearAllLists();
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
			this.setState({ fld4: Color.primary })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.primary })
		}
		else if (type == '6') {
			this.setState({ fld6: Color.primary })
		}
		else if (type == '7') {
			this.setState({ fld6: Color.primary })
		}

	}
	callOnBlur = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.inputdefaultBorder })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.inputdefaultBorder })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.inputdefaultBorder })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.inputdefaultBorder })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.inputdefaultBorder })
		}
		else if (type == '6') {
			this.setState({ fld6: Color.inputdefaultBorder })
		}
		else if (type == '7') {
			this.setState({ fld6: Color.inputdefaultBorder })
		}

	}
	ClearAllLists = () => {
		base64 = null; filename = '';
		
	}

	async componentDidMount() {
		// if (Platform.OS == 'android') {
		// 	try {
		// 		listener = LocationEnabler.addListener((res) => {
		// 			this.getCurrentLocation();
		// 			if (listener !== null) {
		// 				// remove listener when you finish
		// 				listener.remove();
		// 			}
		// 		});
		// 	} catch (error) {

		// 	}
		// }

		let from = this.props.navigation.state.params.from;
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			if (from == 'AddFirst') {
				return true;
				//this.props.navigation.navigate('DoctorHome');
			} else {
				this.props.navigation.goBack()
			}

		})
		if (from == 'edit') {
			let { actions, signupDetails } = this.props;
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"ClinicGuid": DRONA.getClinicGuid(),//signupDetails.clinicGuid DRONA.getClinicGuid()
				"Data": null
			}
			actions.callLogin('V1/FuncForDrAppToGetClinicDetails', 'post', params, signupDetails.accessToken, 'GetClinicDetails');
		}


		//
	}

	callApiRelationShip = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid, "ClinicGuid": null, "DoctorGuid": signupDetails.doctorGuid, "Version": null,
			"Data": { "GenderCode": null }
		}
		//console.log(JSON.stringify(params))
		actions.callLogin('V1/FuncFoDrAppToGetRelationTypeList', 'post', params, signupDetails.accessToken, 'relationShipList');
	}
	
	openCamera = () => {
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
		this.setState({ imageSource: source.uri });
		base64 = image.data;

		let fileExtFromBase64=base64 && base64.startsWith("iV") ?'.png':'.jpeg'
		filename='Clinic'+new Date().getTime()+fileExtFromBase64;

				this.setState({ isModalShowBrowseImage: false })
    }

	gotoNext = () => {

		if (!this.state.clinicName.trim()) {
			Snackbar.show({ text: 'Please enter clinic name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.refs.cname.focus();
		} else if (!this.state.clinicNumber) {
			Snackbar.show({ text: 'Please enter clinic phone number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.refs.cnumber.focus();
		} else if (this.state.clinicNumber.length<6) {
			Snackbar.show({ text: 'Please enter valid clinic phone number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.refs.cnumber.focus();
		}

		else if (!this.state.address) {
			Snackbar.show({ text: 'Please enter Address', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.refs.address.focus();
		}

		else if (!this.state.pincode) {
			Snackbar.show({ text: 'Please enter pin code', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.refs.pin.focus();
		} else if (!pinCodeValid) {
			Snackbar.show({ text: 'Please enter valid Pin code', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.city) {
			Snackbar.show({ text: 'Please enter city', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.refs.city.focus();
		} else if (!this.state.stateName) {
			Snackbar.show({ text: 'Please enter state', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			//this.refs.state.focus();
		} else if (this.state.latitude <= 0 || this.state.longitude <= 0) {
			Alert.alert(
				"Alert",
				"Your typed address does not match with Google Location. Do you want to progress yet?",
				[
					{
						text: "CANCEL",
						onPress: () => console.log(""),
						style: "CANCEL"
					},
					{ text: "CONTINUE", onPress: this.saveDetails }
				]
			);
		}

		else {
			this.saveDetails();
		}
	}

	saveDetails = () => {
		let { actions, signupDetails } = this.props;
		let fileExtFromBase64=base64 && base64.startsWith("iV") ?'.png':'.jpeg'
			let fileNameCustom='Clinic'+new Date().getTime()+fileExtFromBase64;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"data": {
				"clinicId": 0,
				"clinicGuid": this.props.navigation.state.params.from == 'edit' ? DRONA.getClinicGuid() : null,//DRONA.getClinicGuid() signupDetails.clinicGuid
				"clinicName": this.state.clinicName.trim(),
				"clinicImageUrl": "",
				"primaryNumber": signupDetails.mobile,
				"clinicNumber": this.state.clinicNumber,
				"clinicLocation": null,
				"clinicCity": this.state.city,
				"clinicPostal": 0,
				"streetArea": null,
				"suitApt": null,
				"clinicAddress": this.state.address,
				"clinicAddressOptional": null,
				"clinicState": this.state.stateName,
				"clinicZip": this.state.pincode,
				"clinicCountry": null,
				"landmark": this.state.landMark,
				"latitude": this.state.latitude,
				"longitude": this.state.longitude,
				"clinicTimings": this.state.showWeekDayTimings,
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
		actions.callLogin('V11/FuncForDrAppToAddClinicDetails', 'post', params, signupDetails.accessToken, 'AddNewClinic');
		DRONA.setIsReloadApi(true);
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'AddNewClinic') {
				if (newProps.responseData.statusCode == '-1') {
					this.props.navigation.navigate('SetUpClinic', { from: 'edit' });
					if (this.props.navigation.state.params.from !== 'edit')
						setLogEvent("add_new_clinic")
					signupDetails.clinicName = this.state.clinicName;
					actions.setSignupDetails(signupDetails);
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
				//this.getHomeComponentRefresh()
			} else if (tagname === 'getCityStateBypinCode') {
				if (newProps.responseData && newProps.responseData.length > 0) {
					try {
						if (newProps.responseData[0].Status == 'Success') {
							pinCodeValid = true;
							let postal = newProps.responseData[0].PostOffice;
							if (postal) {
								let state = postal[0].State
								let city = '';
								if (postal[0].Block != 'NA') {
									city = postal[0].Block;
								} else {
									if (postal[0].Region != 'NA') {
										city = postal[0].Region;
									} else {
										city = postal[0].Division != 'NA' ? postal[0].Division:'' ;
									}
								}
								this.setState({ city: city, stateName: state });
							} else {
								this.setState({ city: '', stateName: '' });
							}
						} else {
							pinCodeValid = false;
							Snackbar.show({ text: 'Invalid Pincode', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
						}


					} catch (e) { }

				} else {
					this.setState({ city: '', stateName: '' });
				}

			} else if (tagname === 'GetClinicDetails') {
				if (newProps.responseData.statusCode == '0') {
					let data = newProps.responseData.data;
					if (data) {
						this.setState({
							imageSource: data.clinicImageUrl,
							clinicName: data.clinicName,
							primaryNumber: data.primaryNumber,
							clinicNumber: data.clinicNumber,
							address: data.clinicAddress,
							landMark: data.landmark,
							pincode: data.clinicZip + '',
							city: data.clinicCity,
							stateName: data.clinicState,
							showWeekDayTimings: data.clinicTimings,
							latitude: data.latitude,
							longitude: data.longitude
						});
					}
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			}
		}
	}

	getPinCode = (myArray) => {
		let pinCode = ""
		for (var i = 0; i < myArray.length; i++) {

			if (myArray[i].types[0] === 'postal_code') {
				pinCode = myArray[i].long_name
				break
			}

		}
		return pinCode;
	}

	getCurrentLocation = () => {
		// Get Current Location
		GetLocation.getCurrentPosition({
			enableHighAccuracy: true,
			timeout: 15000,
		})
			.then(location => {
				latitude = location.latitude;
				longitude = location.longitude;
				this.setState({ latitude: location.latitude, longitude: location.longitude })
				// ** Get Address from lat and lon **//
				Geocoder.init("AIzaSyD4Lqrxf6Gpnkz5i4LU6h2eyyNAakaKtT8");
				Geocoder.from(this.state.latitude, this.state.longitude)
					.then(json => {
						console.log(JSON.stringify(json));
						addressComponent = json.results[0].formatted_address;
						let address_components = json.results[0].address_components;
						var pinCode = this.getPinCode(address_components);
						if (pinCode.length === 6) {
							let { actions, signupDetails } = this.props;
							actions.callLogin(pinCode, 'get', 'params', signupDetails.accessToken, 'getCityStateBypinCode');
						}
						this.setState({ address: addressComponent, pincode: pinCode });
						const provider = Platform.OS === 'ios' ? 'google' : 'google'
						const link = `http://maps.${provider}.com/?daddr=${addressComponent}`;
						this.setState({ googleMapUrl: link })
					})
					.catch(error => console.warn(error));
				//***** */
			})
			.catch(error => {
				alert(error)
				Snackbar.show({ text: 'Please enable your location settings ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				if (Platform.OS == 'android') {
					// try {
					// 	const {
					// 		requestResolutionSettings,
					// 		PRIORITIES: { HIGH_ACCURACY },
					// 	} = LocationEnabler;

					// 	requestResolutionSettings({
					// 		priority: HIGH_ACCURACY, // optional: default BALANCED_POWER_ACCURACY
					// 		alwaysShow: true, // optional: default false
					// 		needBle: true, // optional: default false
					// 	});
					// } catch (error) {

					// }

				} else {
					try {
						Linking.openURL('App-Prefs:LOCATION_SERVICES');
					} catch (e) { }

				}

			})
	}
	
	render() {
		let { actions, signupDetails, loading } = this.props;
		let from = this.props.navigation.state.params.from;
		return (
			<SafeAreaView style={[CommonStyle.container, { backgroundColor: Color.newBgColor }]}>
				{/* <NavigationEvents onDidFocus={() => this.getPatientData()} /> */}
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flexDirection: 'row', backgroundColor: Color.white, height: responsiveHeight(7), alignItems: 'center', zIndex: 999 }}>
					{from != 'AddFirst' ? <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
						<Image source={arrowBack} style={{ height: responsiveWidth(4), width: responsiveWidth(5), tintColor: Color.primary }} />
					</TouchableOpacity> : null}
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginLeft: responsiveWidth(3), fontWeight: Platform.OS == 'ios' ? CustomFont.fontWeight600 : '700' }}>{from == 'AddFirst' ? 'Add New Clinic' : 'Edit Clinic'}</Text>

				</View>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={this.state.keyboardAvoiding}>
					<View style={{ paddingBottom: 10, paddingTop: 10, borderRadius: 10, margin: responsiveWidth(4), marginBottom: responsiveHeight(21), backgroundColor: Color.white }}>
						<ScrollView keyboardShouldPersistTaps='always'>
							<View style={{ flex: 1, borderRadius: 10, paddingBottom: 10, backgroundColor: Color.white }}>


								<View style={{ margin: responsiveWidth(4) }}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<View style={{ flex: 1.5, }}>
											{!this.state.imageSource ? <TouchableOpacity style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8), borderColor: Color.grayBorder, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.lightPurple, }}
												onPress={() => this.setState({isModalShowBrowseImage:true})}>
												<Image source={camera} style={{ resizeMode: 'contain', height: responsiveFontSize(3), width: responsiveFontSize(3) }} />
											</TouchableOpacity> : <TouchableOpacity onPress={() => this.setState({isModalShowBrowseImage:true})}>
												<Image source={{ uri: this.state.imageSource }} style={{ height: responsiveWidth(16), width: responsiveWidth(16), borderRadius: responsiveWidth(8) }} />


											</TouchableOpacity>}
										</View>
										<View style={{ flex: 7, marginLeft: 30 }}>
											<Text style={{
												fontFamily: CustomFont.fontName,
												fontSize: CustomFont.font14,
												fontWeight: CustomFont.fontWeight700, color: Color.primary, marginTop: 0
											}} onPress={() => this.setState({isModalShowBrowseImage:true})}>{this.state.imageSource ? 'Edit Clinic Photo':'Add Clinic Photo'} </Text>

										</View>
									</View>

									<Text style={styles.inputHeader}>Clinic Name *</Text>
									<TextInput returnKeyType="done"

										onBlur={() => this.callOnBlur('1')}
										placeholderTextColor={Color.placeHolderColor}
										style={[styles.createInputStyle, { borderColor: this.state.fld1, color: Color.headingTxtClr }]} placeholder="Enter Name" onChangeText={clinicName => {
											this.setState({ clinicName })

										}} onSubmitEditing={() => this.refs.cnumber.focus()} value={this.state.clinicName} ref='cname' onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-100), fld1: Color.primary })} />


									<Text style={styles.inputHeader}>Primary Phone Number *</Text>
									<Text style={styles.createInputStyleMobile}>{signupDetails.mobile}</Text>
									<Text style={ { fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.grayTxt, marginTop: responsiveHeight(1) }}>This number is visible only to you</Text>
									<Text style={styles.inputHeader}>Clinic Number *</Text>
									<View>
										<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(3), right: responsiveWidth(4), zIndex: 5 }} onPress={() => alert("Your patients will see this phone number on the public profile.")} >
											<Image source={info} style={{ resizeMode: 'contain', height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
										</TouchableOpacity>
										<TextInput returnKeyType="done"
											onChangeText={(clinicNumber) => {
												if (clinicNumber) {
													if (Validator.isMobileValidate(clinicNumber)) {
														this.setState({ clinicNumber });
													}
												} else
													this.setState({ clinicNumber });
											}}
											onBlur={() => this.callOnBlur('2')}
											placeholderTextColor={Color.placeHolderColor}
											style={[styles.createInputStyle, { borderColor: this.state.fld2, color: Color.headingTxtClr }]} placeholder="Enter clinic phone number" ref='cnumber' onSubmitEditing={() => this.refs.address.focus()} value={this.state.clinicNumber} maxLength={13} keyboardType={'phone-pad'} />
<Text style={ { fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.grayTxt, marginTop: responsiveHeight(1) }}>This number is visible to your patients & Enables followup reminders to Patients on WA</Text>
									</View>
									<Text style={styles.inputHeader}>Address *</Text>
									{/* <TextInput 
								//onFocus = {() => this.callOnFocus('3')}
								onBlur = {() => this.callOnBlur('3')}
								style={[styles.createTextArea, {borderColor : this.state.fld3}]} placeholder="Enter clinic address" onChangeText={address => {
									this.setState({ address })
								}
								} ref='address' onSubmitEditing={() => this.refs.landmark.focus()} value={this.state.address} multiline={true} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-85), fld3 : Color.primary })}/> */}

									<View style={{ marginTop: 10, zIndex: 4 }}>
										<GooglePlacesAutocomplete
											placeholder='Search address'
											fetchDetails={true}
											enablePoweredByContainer={false}
											textInputProps={{
												value: this.state.address,
												style: {
													paddingLeft: 10, paddingTop: 0, paddingBottom: 0, borderColor: Color.createInputBorder, width: responsiveWidth(83.8), borderWidth: 1, borderRadius: 6,
													fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(0), height: responsiveHeight(6)
												},
												onChangeText: (text) => {
													if (text.length > 0) {
														Geocoder.from(text)
															.then(json => {
																console.log('----------'+JSON.stringify(json))
																var location = json.results[0].geometry.location;
																this.setState({ latitude: location.lat, longitude: location.lng })
																const provider = Platform.OS === 'ios' ? 'google' : 'google'
																const link = `http://maps.${provider}.com/?daddr=${location}`;
																this.setState({ googleMapUrl: link })
															}).catch(error => console.warn(error));
													}
													this.setState({ address: text })
												}
											}}
											ref='address'
											zIndex={999}
											onPress={(data, details = null) => {
												// console.log('_______+++++++-----'+JSON.stringify(data));
												 console.log('details+++++++-----'+JSON.stringify(details));
												if (data.description.length > 1000) {
													Snackbar.show({ text: 'Address length must be less than 1000 characters', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
												}
												else {
													this.setState({ address: data.description })
													//Anup Change
													const provider = Platform.OS === 'ios' ? 'google' : 'google'
													const link = `http://maps.${provider}.com/?daddr=${data.description}`;
													this.setState({ googleMapUrl: link })
												}
												if (details.geometry.location.lat != 'undefined' && details.geometry.location.lng != 'undefined') {
													this.setState({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng })
												}

											}}
											query={{
												key: 'AIzaSyD4Lqrxf6Gpnkz5i4LU6h2eyyNAakaKtT8',
												language: 'en',
												components: 'country:ind'
											}}
										/>
										<Text style={{ marginTop: 5, color: Color.darkText, fontFamily: CustomFont.fontNameBold, marginTop: 15 }}>OR</Text>
										<TouchableOpacity><Text onPress={this.getCurrentLocation} style={{ color: Color.primary, fontFamily: CustomFont.fontNameBold, marginTop: 10 }}>Use current location</Text></TouchableOpacity>
									</View>

									{/* <View style={{ flexDirection: 'row', marginTop: 7 }}> */}
									<View style={{ flex: 3 }}>
										<Text style={styles.inputHeader}>Landmark (optional)</Text>
										<TextInput returnKeyType="done"

											onBlur={() => this.callOnBlur('4')}
											placeholderTextColor={Color.placeHolderColor}
											style={[styles.createInputStyle, { borderColor: this.state.fld4, color: Color.headingTxtClr }]} placeholder="Enter landmark"
											ref='landmark' onSubmitEditing={() => this.refs.pin.focus()} onChangeText={landMark => {
												this.setState({ landMark })
											}
											} value={this.state.landMark} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-80), fld4: Color.primary })} />
										{/* </View> */}

										<Text style={styles.inputHeader}>PIN Code *</Text>
										<TextInput returnKeyType="done"

											onBlur={() => this.callOnBlur('5')}
											placeholderTextColor={Color.placeHolderColor}
											style={[styles.createInputStyle, { borderColor: this.state.fld5, color: Color.headingTxtClr }]} placeholder="Enter pin code" value={this.state.pincode}
											ref='pin' onSubmitEditing={() => this.refs.city.focus()} onChangeText={pincode => {
												this.setState({ pincode })
												if (!pincode || Validator.isMobileValidate(pincode)) {
													this.setState({ pinAlert: '' })
												} else {
													this.setState({ pinAlert: 'Pin code should contain only numeric' })
												}
												if (pincode.length === 6) {
													let { actions, signupDetails } = this.props;
													actions.callLogin(pincode, 'get', 'params', signupDetails.accessToken, 'getCityStateBypinCode');
												} else {
													this.setState({ city: '', stateName: '' });
												}
											}
											} keyboardType={'phone-pad'} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-80), fld5: Color.primary })}  />

									</View>

									<Text style={styles.inputHeader}>City *</Text>
									<TextInput returnKeyType="done"
										onBlur={() => this.callOnBlur('6')}
										placeholderTextColor={Color.placeHolderColor}
										style={[styles.createInputStyle, { backgroundColor: Color.newBgColor, borderColor: this.state.fld6, color: Color.headingTxtClr }]} placeholder="Enter city" onChangeText={city => {
											this.setState({ city });
										}} ref='city'
										editable={false} value={this.state.city} onFocus={() => this.setState({ keyboardAvoiding: -50, fld6: Color.primary })} />

									<Text style={styles.inputHeader}>State *</Text>
									<TextInput returnKeyType="done"

										onBlur={() => this.callOnBlur('7')}
										placeholderTextColor={Color.placeHolderColor}
										style={[styles.createInputStyle, { borderColor: this.state.fld7 }]} placeholder="Enter state" onChangeText={stateName => {
											this.setState({ stateName })
										}
										} ref='state' value={this.state.stateName} onFocus={() => this.setState({ keyboardAvoiding: -80, fld7: Color.primary })} />


									{/* <Text style={styles.inputHeader}>Google Maps URL</Text>
									<TextInput
										onBlur={() => this.callOnBlur('8')}
										placeholderTextColor={Color.placeHolderColor}
										//editable = {false}
										style={[styles.createInputStyle, { borderColor: this.state.fld7 }]}  ref='state' value={this.state.googleMapUrl} onFocus={() => this.setState({ keyboardAvoiding: -80, fld7: Color.primary })} /> */}



									{/* <TouchableOpacity style={{ marginTop: responsiveHeight(3), flexDirection: 'row', alignItems: 'center' }} onPress={() => {
										this.setState({ isModalVisibleTimeSlot: true })  //add
									}}>
										{this.state.showWeekDayTimings ? null : <Image source={time_blue} style={{ height: responsiveFontSize(3), width: responsiveFontSize(3) }} />}

										<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginRight: responsiveWidth(5), marginLeft: 10 }}>{this.state.showWeekDayTimings ? 'Clinic Timings' : 'Add Clinic Timings'}</Text>
									</TouchableOpacity> */}
									

								</View>


							</View>

						</ScrollView>
					</View>
				</KeyboardAvoidingView>
				<View style={{ marginLeft: responsiveWidth(-1), borderTopLeftRadius: 10, borderTopRightRadius: 10, position: 'absolute', bottom: -5, alignItems: 'center', justifyContent: 'center', height: responsiveHeight(12), width: responsiveWidth(101), backgroundColor: Color.white }}>
					<TouchableOpacity style={{ width: responsiveWidth(93), alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(5.5), backgroundColor: Color.primary }} onPress={() => {
						this.gotoNext();
					}}>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save </Text>
					</TouchableOpacity>
				</View>
				
				
				<Modal isVisible={this.state.clinicTimeSetupSuccess}>
					<View style={[styles.modelViewMessage2]}>
						<Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
						<Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
							Clinic details saved successfully
						</Text>
						<TouchableOpacity
							onPress={() => {
								this.setState({ clinicTimeSetupSuccess: false });
								this.props.navigation.navigate('DoctorHome');
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
)(AddNewClinicDetails);

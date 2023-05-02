import AsyncStorage from 'react-native-encrypted-storage';
//import { GoogleSignin } from '@react-native-community/google-signin';
import Moment from 'moment';
import React from 'react';
import { Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import { NavigationActions, NavigationEvents, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cross from '../../../assets/cross_blue.png';
import edit_blue from '../../../assets/edit_new_blue.png';
import TickIcon from '../../../assets/green_tick.png';
import tickGreen from '../../../assets/tick_green.png';
import eye from '../../../assets/eye.png';
import eyeClose from '../../../assets/eyeClose.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Validator from '../../components/Validator';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import { setLogEvent } from '../../service/Analytics';
import styles from './style';
import { sha256 } from 'js-sha256';
import Trace from '../../service/Trace'

let basicInfoDetails = null;

let weekPasssList=[{weekPasswordGuid:'', weekPasswordName:'Test@123'},]
const navigateAction = StackActions.reset({
	index: 0,
	actions: [NavigationActions.navigate({ routeName: 'GetStarted' })],
});


class BasicInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dataArray: [],
			dateTab: [],
			isModalVisible: false,
			imageSource: null,
			cityState: '',
			isModalVisibleChangePassword: false,
			keyboardAvoiding: 0,
			oldPassword: '',
			newPassword: '',
			confirmNewPassword: '',
			passwordModal: false,
			fld1: Color.newBorder,
			fld2: Color.newBorder,
			fld3: Color.newBorder,
			isPasswordChanged: false,
			currPasswordShowStatus : true,
			newPasswordShowStatus : true,
			confirmPasswordShowStatus : true,
			confPasswordAlert:''
		};
	}
	componentDidMount() {
		if(this.props.resDataFromServer)
		this.setValueFromResponse(this.props.resDataFromServer);
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": null,
			"ClinicGuid": null,
			version: null,
			Data: null
		};
		actions.callLogin('V1/FuncForDrAppToGetWeekPasswordList', 'post', params, 'token', 'GetWeekPasswordList');
	}
	setValueFromResponse = (data) => {
		let { actions, signupDetails } = this.props;
		signupDetails.email = data.basicInfo.email
					signupDetails.mobile = data.basicInfo.phoneNumber
					signupDetails.gender = data.basicInfo.gender
					signupDetails.dob = data.basicInfo.dob
					// signupDetails.fname=data.basicInfo.firstName
					// signupDetails.lname=data.basicInfo.lastName

					signupDetails.kycStatus = data.accountDetails.isKycVerified
					signupDetails.drRegistrationNo = data.accountDetails.registrationNo
					//signupDetails.subscription = data.accountDetails.subscription
					if (data.basicInfo.drProfileImgUrl)
						signupDetails.profileImgUrl = data.basicInfo.drProfileImgUrl

					actions.setSignupDetails(signupDetails);
					basicInfoDetails = data.basicInfo;
					//this.props.GetBackData(basicInfoDetails);
					let tempCity = '';
					if (data.basicInfo.city && data.basicInfo.city.cityName) {
						tempCity = data.basicInfo.city.cityName;
					}
					if (data.basicInfo.city && data.basicInfo.city.country) {
						tempCity += ', ' + data.basicInfo.city.country;
					}
					this.setState({ cityState: tempCity });
					try {
						 AsyncStorage.setItem('profileImgUrl', data.basicInfo.drProfileImgUrl);
					} catch (error) {

					}
	}
	getBasicInfo = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToGetDoctorProfile', 'post', params, signupDetails.accessToken, 'getProfile');
	}

	passwordChange = () => {
		let { actions, signupDetails } = this.props;

		let params = {
			"UserGuid": signupDetails.UserGuid,
			"Data": {
				"MobileNo": signupDetails.mobile,
				"UserName": signupDetails.mobile,
				"OldPassword": sha256(this.state.oldPassword),
				"NewPassword": sha256(this.state.newPassword),
				"ConfirmPassword": sha256(this.state.confirmNewPassword),
				"UpdatedBy": "1"
			}
		}
		actions.callLogin('V1/FuncForDrAppToChangePassword', 'post', params, signupDetails.accessToken, 'changePasswords');
	}

	navigateToGetStarted = () => {
		this.signOutFromGoogle();
		this.props.nav.navigation.dispatch(navigateAction);
	}

	signOutFromGoogle = async () => {
		try {
			await AsyncStorage.setItem('profile_complete', 'logout');
			// await GoogleSignin.revokeAccess();
			// await GoogleSignin.signOut();
		} catch (error) {
			console.error(error);
		}
	};

	savePassword = () => {
		if (this.state.newPassword && this.state.confirmNewPassword && this.state.oldPassword) {
			if (this.state.newPassword.length<8) {
				Snackbar.show({ text: 'Password length minimum 8 character', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}else if (!Validator.isStrongPassword(this.state.newPassword)) {
				Snackbar.show({ text: 'New Password must be contain 1 uppercase, 1 lowercase, 1 numeric and 1 special characters', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}else if (weekPasssList.some(item => item.weekPasswordName == this.state.newPassword)) {
				Snackbar.show({ text: 'Please do not use common password', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}else if (this.state.newPassword == this.state.confirmNewPassword) {
				if (this.state.newPassword != this.state.oldPassword) {
					this.passwordChange()
				} else {
					Snackbar.show({ text: 'Old and new password are same', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			} else {
				Snackbar.show({ text: 'Passwords do not match', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}
		} else {
			Snackbar.show({ text: 'Please enter password', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails } = this.props;
			if (tagname === 'getProfile') {
				if (newProps.responseData.statusCode == '0') {
					let data = newProps.responseData.data;
					this.setValueFromResponse(data);
					
				}

			} else if (tagname == 'changePasswords') {
				if (newProps.responseData.statusCode == '-1' || newProps.responseData.statusCode == '0') {
					setTimeout(()=>{
						this.setState({ isModalVisibleChangePassword: false })
					},300)
					setTimeout(()=>{
						this.setState({ isPasswordChanged: true })
					},1000)
					
					// this.props.nav.navigation.navigate("ChangePassword")
				}
				else {
					alert(newProps.responseData.statusMessage);
				}
			}else if(tagname=='GetWeekPasswordList'){
				if(newProps.responseData.data)
				weekPasssList=newProps.responseData.data;
			}
		}
	}
	checkConfpass = (text) =>
	{
		if (this.state.newPassword != text)
		{
			this.setState({confPasswordAlert: 'Password do not match'})
		}
		else{
			this.setState({confPasswordAlert: ''});
		}
		this.setState({confirmNewPassword:text});
	}
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
				{/* <NavigationEvents onDidFocus={() => this.getBasicInfo()} /> */}
				<View style={{ flex: 1 }}>
					<ScrollView>
						<View>
							<View style={{ marginTop: responsiveHeight(3), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 4 }}>
								<View style={{ margin: responsiveWidth(3) }}>

									<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
										<Text style={styles.mainTitle}>Basic Information</Text>
										<TouchableOpacity onPress={() => {
											let { signupDetails } = this.props;
											setLogEvent("doctor_profile", { "edit_profile": "click", UserGuid: signupDetails.UserGuid })
											this.props.nav.navigation.navigate('EditBasicInfo', { item: basicInfoDetails })
										}}>
											<Image source={edit_blue} style={styles.crossIcon} />
										</TouchableOpacity>
									</View>
									<Text style={styles.profileTitle}>Phone Number</Text>
									<Text style={styles.profileTxt}>+91 {signupDetails.mobile}</Text>

									<Text style={styles.profileTitle}>Email address</Text>
									<Text style={styles.profileTxt}>{signupDetails.email}</Text>

									<Text style={styles.profileTitle}>Gender</Text>
									<Text style={styles.profileTxt}>{signupDetails.gender}</Text>

									<Text style={styles.profileTitle}>Date of Birth</Text>
									<Text style={styles.profileTxt}>{signupDetails.dob ? Moment(signupDetails.dob).format('DD-MM-YYYY') : ''}</Text>

									<Text style={styles.profileTitle}>Specialty</Text>
									<Text style={styles.profileTxt}>{signupDetails.drSpeciality}</Text>

									{/* <Text style={styles.profileTitle}>City</Text>
									<Text style={styles.profileTxt}>{this.state.cityState}</Text> */}
								</View>
							</View>

							<View style={{ marginTop: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 4 }}>
								<View style={{ margin: responsiveWidth(3) }}>

									<Text style={styles.mainTitle}>Account Details</Text>

									<Text style={styles.profileTitle}>MCI Registration</Text>
									<View style={{ flexDirection: 'row', }}>
										<Text style={[styles.profileTxt, { flex: 1 }]}>{signupDetails.drRegistrationNo}</Text>
										<Image source={tickGreen} style={{ width: 17, height: 17,resizeMode:'contain' }} />
									</View>

									<Text style={styles.profileTitle}>KYC Status</Text>
									<View style={{ flexDirection: 'row', }}>
										<Text style={[styles.profileTxt, { flex: 1, color: signupDetails.kycStatus == 'Verified' ? Color.green1 : Color.yrColor }]}>{signupDetails.kycStatus ? 'Verified' : 'Not-Verified'}</Text>
										{signupDetails.kycStatus != 'Verified' ? null : <Image source={tickGreen} style={{ width: 17, height: 17,resizeMode:'contain' }} />}
									</View>

									<Text style={styles.profileTitle}>Subscription</Text>
									<Text style={[styles.profileTxt, { color: Color.orange }]}>Expires on {signupDetails.subscription ? Moment(signupDetails.subscription).format('DD MMM YYYY') : ''}</Text>
								</View>
							</View>

							<View style={{ marginTop: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 4, marginBottom: responsiveHeight(3) }}>
								<View style={{ margin: responsiveWidth(3) }}>

									<Text style={styles.mainTitle}>Security</Text>
									<TouchableOpacity style={{ marginTop: responsiveHeight(2) }} onPress={() =>{
										let timeRange = Trace.getTimeRange();
										Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType +"Change_Password",  signupDetails.firebaseLocation);
										Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Change_Password", {'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })
										this.setState({ isModalVisibleChangePassword: true })
									} } >
										<Text style={[styles.profileTxt, { color: Color.primary }]}>Change Password</Text>
									</TouchableOpacity>

									{/* <TouchableOpacity style={{ marginTop: responsiveHeight(2) }}>
										<Text style={[styles.profileTxt, { color: Color.primary }]}>Log out from all devices</Text>
									</TouchableOpacity> */}

									{/* <View style={{ backgroundColor: Color.dividerDrawer, height: 1, marginTop: responsiveHeight(2) }} />

									<TouchableOpacity style={{ marginTop: responsiveHeight(2) }} onPress={() => { this.props.nav.navigation.navigate("Deactivate") }}>
										<Text style={[styles.profileTxt, { color: Color.textDue }]}>Deactivate Account</Text>
									</TouchableOpacity> */}

								</View>
							</View>
						</View>
					</ScrollView>


					<Modal isVisible={this.state.isModalVisibleChangePassword} avoidKeyboard={true}>
						<View style={[styles.modelViewAbout, { height: responsiveHeight(80) }]}>
							<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={this.state.keyboardAvoiding}>
								<ScrollView>
									<View style={styles.modelViewAdditional}>

										<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
											<Text style={styles.modelMainTitle}>Change Password</Text>
											<TouchableOpacity style={{ padding: 10 }} onPress={() =>{
												Trace.stopTrace();
												this.setState({ isModalVisibleChangePassword: false })
											} }>
												<Image source={cross} style={styles.crossIcon} />
											</TouchableOpacity>
										</View>

										<Text style={styles.tiTitle}>Current Password</Text>
										<View>
										<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(2.5), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ currPasswordShowStatus: !this.state.currPasswordShowStatus })} >
										  <Image source={this.state.currPasswordShowStatus ? eye : eyeClose} style={{height:responsiveFontSize(2),width:responsiveFontSize(2),resizeMode:'contain',marginTop:responsiveHeight(.8),tintColor:Color.primary}}/>
										</TouchableOpacity>
										<TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld1, }]}
											placeholder="Enter current password"
											autoCapitalize="none"
											autoCorrect={false}
											secureTextEntry={this.state.currPasswordShowStatus}
											value={this.state.oldPassword}
											onChangeText={text => {
												this.setState({ oldPassword: text });
											}}
											placeholderTextColor={Color.placeHolderColor}
											onBlur={() => this.setState({ fld1: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld1: Color.primary })} onSubmitEditing={() => this.refs.ref1.focus()} />

										</View>
										

										<Text style={styles.tiTitle}>New Password</Text>
										<View>
										<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(2.5), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ newPasswordShowStatus: !this.state.newPasswordShowStatus })} >
										  <Image source={this.state.newPasswordShowStatus ? eye : eyeClose} style={{height:responsiveFontSize(2),width:responsiveFontSize(2),resizeMode:'contain',marginTop:responsiveHeight(.8),tintColor:Color.primary}}/>
							            </TouchableOpacity>
										<TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.fld2, }]}
											placeholder="Enter new password"
											autoCapitalize="none"
											autoCorrect={false}
											secureTextEntry={this.state.newPasswordShowStatus}
											value={this.state.newPassword}
											placeholderTextColor={Color.placeHolderColor}
											//onSubmitEditing={() => this.refs.age.focus()}
											onChangeText={text => {
												this.setState({ newPassword: text });
											}}
											onBlur={() => this.setState({ fld2: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld2: Color.primary })} 
											ref='ref1' onSubmitEditing={() => this.refs.ref2.focus()} />
										</View>

										

										<View style={{ flex: 4 }}>
											<Text style={styles.tiTitle}>Confirm New Password</Text>
											<View>
											<TouchableOpacity style={{ position: 'absolute', marginTop: responsiveHeight(2.5), right: responsiveWidth(2), zIndex: 5 }} onPress={() => this.setState({ confirmPasswordShowStatus: !this.state.confirmPasswordShowStatus })} >
										  <Image source={this.state.confirmPasswordShowStatus ? eye : eyeClose} style={{height:responsiveFontSize(2),width:responsiveFontSize(2),resizeMode:'contain',marginTop:responsiveHeight(.8),tintColor:Color.primary}}/>
							                 </TouchableOpacity>
											 <TextInput returnKeyType="done" onBlur={() => this.setState({ fld3: Color.newBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-50), fld3: Color.primary })} style={[styles.modelTextInput1, { borderColor: this.state.fld3, }]}
												placeholder="Re-enter new password"
												autoCapitalize="none"
												autoCorrect={false}
												secureTextEntry={this.state.confirmPasswordShowStatus}
												//onSubmitEditing={() => this.refs.age.focus()}
												value={this.state.confirmNewPassword}
												onChangeText={text => this.checkConfpass(text)}
												placeholderTextColor={Color.placeHolderColor}
												ref='ref2' />
												{this.state.confPasswordAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.confPasswordAlert}</Text> : null}
											</View>
											
										</View>

										<TouchableOpacity style={styles.modalBtn}  onPress={() => {
											Trace.stopTrace();
											this.setState({ isModalVisibleChangePassword: false })
											setLogEvent("profile_change_password", { "change_password": "save", UserGuid: signupDetails.UserGuid })
											this.savePassword();
										}}>
											<Text style={styles.modalBtnTxt}>Save New Password</Text>
										</TouchableOpacity>
									</View>
								</ScrollView>
							</KeyboardAvoidingView>
						</View>
					</Modal>


					<Modal isVisible={this.state.isPasswordChanged} onRequestClose={() => this.setState({ isPasswordChanged: false })}>
						<View style={[styles.modelViewMessage2]}>
							<Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30,resizeMode:'contain' }} />
							<Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
								Password Changed Successfully
							</Text>
							<TouchableOpacity
								onPress={() => {
									this.setState({ isPasswordChanged: false });
									this.navigateToGetStarted()
								}}
								style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
								<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
							</TouchableOpacity>
						</View>
					</Modal>
				</View>
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
)(BasicInfo);

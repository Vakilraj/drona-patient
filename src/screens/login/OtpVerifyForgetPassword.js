import React, { useState } from 'react';
import {
	SafeAreaView, View,
	Text, Image, TextInput, TouchableOpacity, Platform
} from 'react-native';
import styles from './style';
import CustomFont from '../../components/CustomFont';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Color from '../../components/Colors';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import CrossIcon from '../../../assets/cross_primary.png';
let sliderTimer = null;
//import * as ReadSms from 'react-native-read-sms/ReadSms';
import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';
import EditIcon from '../../../assets/edit_primary.png';
import { sha256 } from 'js-sha256';


let from='', forgetotp = '';;
class OtpVerification extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isChecked: false,
			otp: '',
			isButtonEnable: false,
			otp1: '',
			otp2: '',
			otp3: '',
			otp4: '',
			otp5: '',
			otp6: '',
			showOtpTime: 60,
			resentBtnType: true,
			fld1 : Color.inputdefaultBorder,
			fld2 : Color.inputdefaultBorder,
			fld3 :Color.inputdefaultBorder ,
			fld4 : Color.inputdefaultBorder,
			fld5 : Color.inputdefaultBorder,
			fld6 : Color.inputdefaultBorder,
			doneBtnBorderWidth : 0,
			editNumber : ''
		};
		from=this.props.navigation.state.params.from;
	}
	componentDidMount() {
		this.startTimer();
		// this.startReadSMS();
		// this.checkPermission();
	}

	onCallFocus = (type) =>{
		if(type == '1'){
			this.setState({fld1 : Color.primary})
		}
		else if(type == '2'){
			this.setState({fld2 : Color.primary})	
		}
		else if(type == '3'){
			this.setState({fld3 : Color.primary})	
		}
		else if(type == '4'){
		   this.setState({fld4 : Color.primary})	
	   }
		else if(type == '5'){
		   this.setState({fld5 : Color.primary})	
	   }
		else if(type == '6'){
		   this.setState({fld6 : Color.primary})	
	   }
	// 	if(type == 'location'){
	// 	   this.setState({fld3 : Color.primary})
	//    }
	//    else if(type == 'startyear'){
	// 	   this.setState({fld4 : Color.primary})	
	//    }
	//    else if(type == 'endyear'){
	// 	   this.setState({fld5 : Color.primary})	
	//    }
  }
   onCallBlur = (type) =>{
		if(type == '1'){
			 this.setState({fld1 : Color.inputdefaultBorder})
		 }
		 else if(type == '2'){
			 this.setState({fld2 : Color.inputdefaultBorder})	
		 }
		 else if(type == '3'){
			 this.setState({fld3 : Color.inputdefaultBorder})	
		 }
		 else if(type == '4'){
			this.setState({fld4 : Color.inputdefaultBorder})	
		}
		 else if(type == '5'){
			this.setState({fld5 : Color.inputdefaultBorder})	
		}
		 else if(type == '6'){
			this.setState({fld6 : Color.inputdefaultBorder})	
		}
  }
  
	startTimer=()=>{
		sliderTimer = setInterval(() => {
			try {
				this.setState({ showOtpTime: --this.state.showOtpTime })
				if (this.state.showOtpTime == 0) {
					clearInterval(sliderTimer);
					this.setState({ resentBtnType: false })
				}
			} catch (error) {
				//console.log(error);
			}

		}, 2000);
	}
	componentWillUnmount() {
		try {
			clearInterval(sliderTimer);
		} catch (error) {
			
		}
	}
	verifyOTP = () => {
		let { actions, signupDetails } = this.props;
		let otp = Platform.OS === 'android' ? this.state.otp1 + this.state.otp2 + this.state.otp3 + this.state.otp4 + this.state.otp5 + this.state.otp6 : this.state.otp;
		var otp256 = sha256(otp+"");
		forgetotp = otp;
		let params = {
			"data": {
				"userGuid": signupDetails.UserGuid,
				"reference": from == 'email'? signupDetails.email : signupDetails.mobile,
				"otpValue": otp256
			}
		}
		actions.callLogin('V1/FuncForDrAppToValidateOTP_V2', 'post', params, signupDetails.accessToken, 'verifyOtpForgetPass');
	}
	resentOTP=()=>{
		let { actions, signupDetails } = this.props;
		let params = {
			userGuid: signupDetails.UserGuid,
			version: null,

			Data: {
				"Reference":from == 'email'? signupDetails.email : signupDetails.mobile,
				"UserGuid":signupDetails.UserGuid
				}
		};
		actions.callLogin('V11/FuncForDrAppToSaveAndSendOTP', 'post', params, signupDetails.accessToken, 'ResentOtp');
		this.setState({resentBtnType:true,showOtpTime:60})
		this.startTimer();
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'verifyOtpForgetPass') {
				if (newProps.responseData.statusMessage === 'Success' && newProps.responseData.accessToken) {  // && newProps.responseData.data.isOtpValid
					let { actions, signupDetails } = this.props;
					signupDetails.accessToken = newProps.responseData.accessToken;
					actions.setSignupDetails(signupDetails);
					
					this.props.navigation.navigate('NewPasswordSetup', { fotp: forgetotp});	
				} else {
					alert(JSON.stringify(newProps.responseData.statusMessage))
				}
			}else if(tagname === 'ResentOtp'){
				Snackbar.show({ text: 'OTP sent. Please verify OTP', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			}
		}

	}
	typeNumber = (text) =>{
		this.setState({editNumber : text})
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={{flex:1,backgroundColor:Color.white}}>
				
				<View style={{ flex: 1, backgroundColor : Color.white , margin: responsiveWidth(0) }}>
				<Image source={home_bg}  style={{ height: responsiveFontSize(15), width: responsiveFontSize(15),position:'absolute',top:0,right:0 }} />
					<View style={{ alignItems: 'flex-end', marginRight: responsiveWidth(1), marginTop : responsiveHeight(1.5) }}>
						<TouchableOpacity  onPress={() => this.props.navigation.goBack()} style={{ height: responsiveFontSize(6), width: responsiveFontSize(6), justifyContent: 'center', alignItems: 'center' }} >
							<Image source={CrossIcon} style={{ resizeMode : 'contain', height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
						</TouchableOpacity>
					</View>
					<View style = {{margin : responsiveHeight(3.5)}}>
					<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
					<Text style={{ fontFamily: CustomFont.fontName, marginTop : 25,  fontWeight: CustomFont.fontWeight700 , fontSize: CustomFont.font24, color: Color.fontColor }}>Recovery Code</Text>
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveHeight(3), textAlign: 'justify' }}>Enter the 6-digit OTP sent to your {'\n'}{this.props.navigation.state.params.from=='email' ? 'email address':'Phone number'}</Text>
					{/* <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(7) }}>Enter 4 digit code</Text> */}
					<View>
						<TextInput returnKeyType="done" onChangeText = {this.typeNumber} value={signupDetails.mobile} style = {{paddingLeft : 20,
						 borderRadius : 6, height : responsiveHeight(6.5), 
						 fontFamily : CustomFont.fontName, fontSize : CustomFont.font14,
						 marginTop : 16, backgroundColor : Color.inputBgColor,color:Color.fontColor}}>
						 </TextInput>
						 <TouchableOpacity style = {{position : 'absolute', top : responsiveHeight(3.5), right : 20,}}> 
						 <Image style = {{ resizeMode : 'contain', 
						  height : responsiveHeight(4), width : responsiveWidth(5) }} source = {EditIcon}/>
						 </TouchableOpacity>
						 
						 </View>
					{Platform.OS==='android' ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(5) }}>
						<TextInput returnKeyType="done" onBlur = {() => this.onCallBlur('1')} onFocus = {() => this.onCallFocus('1')} ref="otp1" style={[styles.otpInput, {borderColor : this.state.fld1}]} onChangeText={otp1 => {
							this.setState({ otp1 })
							if (otp1.length == 1) {
								this.refs.otp2.focus();
							}
							if (otp1.length && this.state.otp2.length && this.state.otp3.length && this.state.otp4.length && this.state.otp5 && this.state.otp6) {
								this.setState({ isButtonEnable: true })
							} else {
								this.setState({ isButtonEnable: false })
							}
						}} maxLength={1}  value={this.state.otp1} keyboardType="number-pad"/>
						<TextInput returnKeyType="done" onBlur = {() => this.onCallBlur('2')} onFocus = {() => this.onCallFocus('2')} ref="otp2" style={[styles.otpInput, {borderColor : this.state.fld2}]} onChangeText={otp2 => {
							this.setState({ otp2 })
							if (otp2.length == 1) {
								this.refs.otp3.focus();
							}else{
								this.refs.otp1.focus();
							}
							if (this.state.otp1.length && otp2.length && this.state.otp3.length && this.state.otp4.length && this.state.otp5 && this.state.otp6) {
								this.setState({ isButtonEnable: true })
							} else {
								this.setState({ isButtonEnable: false })
							}
						}} maxLength={1} value={this.state.otp2} keyboardType="number-pad"/>
						<TextInput returnKeyType="done" onBlur = {() => this.onCallBlur('3')} onFocus = {() => this.onCallFocus('3')} ref="otp3" style={[styles.otpInput, {borderColor : this.state.fld3}]} onChangeText={otp3 => {
							this.setState({ otp3 })
							if (otp3.length == 1) {
								this.refs.otp4.focus();
							}else{
								this.refs.otp2.focus();
							}
							if (this.state.otp1.length && this.state.otp2.length && otp3.length && this.state.otp4.length && this.state.otp5 && this.state.otp6) {
								this.setState({ isButtonEnable: true })
							} else {
								this.setState({ isButtonEnable: false })
							}
						}} maxLength={1}  value={this.state.otp3} keyboardType="number-pad"/>
						<TextInput returnKeyType="done" onBlur = {() => this.onCallBlur('4')} onFocus = {() => this.onCallFocus('4')} ref="otp4" style={[styles.otpInput, {borderColor : this.state.fld4}]} onChangeText={otp4 => {
							this.setState({ otp4 })
							if (otp4.length == 1) {
								this.refs.otp5.focus();
							}else{
								this.refs.otp3.focus();
							}
							if (this.state.otp1.length && this.state.otp2.length && this.state.otp3.length && otp4 && this.state.otp5 && this.state.otp6) {
								this.setState({ isButtonEnable: true })
							} else {
								this.setState({ isButtonEnable: false })
							}
						}} maxLength={1}  value={this.state.otp4} keyboardType="number-pad"/>

<TextInput returnKeyType="done" onBlur = {() => this.onCallBlur('5')} onFocus = {() => this.onCallFocus('5')} ref="otp5" style={[styles.otpInput, {borderColor : this.state.fld5}]} onChangeText={otp5 => {
							this.setState({ otp5 })
							if (otp5.length == 1) {
								this.refs.otp6.focus();
							}else{
								this.refs.otp4.focus();
							}
							if (this.state.otp1.length && this.state.otp2.length && this.state.otp3.length && this.state.otp4.length && otp5 && this.state.otp6) {
								this.setState({ isButtonEnable: true })
							} else {
								this.setState({ isButtonEnable: false })
							}
						}} maxLength={1}  value={this.state.otp5} keyboardType="number-pad"/>

<TextInput returnKeyType="done" onBlur = {() => this.onCallBlur('6')} onFocus = {() => this.onCallFocus('6')} ref="otp6" style={[styles.otpInput, {borderColor : this.state.fld6}]} onChangeText={otp6 => {
							this.setState({ otp6 })
							if (otp6.length == 0) {
								this.refs.otp5.focus();
							}
							if (this.state.otp1.length && this.state.otp2.length && this.state.otp3.length && this.state.otp4.length && this.state.otp5 && otp6) {
								this.setState({ isButtonEnable: true })
							} else {
								this.setState({ isButtonEnable: false })
							}
						}} maxLength={1} value={this.state.otp6} keyboardType="number-pad"/>
					</View>:
					<View style={{ flexDirection: 'row',  marginTop: responsiveHeight(3) }}>
						<TextInput returnKeyType="done" style={{flex:1, borderRadius:4,borderColor:Color.otpInputBorder,borderWidth:1,height:responsiveHeight(6),padding:0,fontSize:CustomFont.font16,color: Color.fontColor,textAlign:'center'}}
						 onChangeText={otp => {
							this.setState({ otp });
								this.setState({ isButtonEnable: true })
						}} maxLength={6} value={this.state.otp} textContentType="oneTimeCode" keyboardType="number-pad"/>
						</View>}
					
					<TouchableOpacity style={{ borderColor : Color.buttonBorderColor, borderWidth  :this.state.doneBtnBorderWidth, width: responsiveWidth(87), height: responsiveHeight(5.5), backgroundColor: this.state.isButtonEnable ? Color.primary : Color.lightgray, alignItems: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginTop: responsiveHeight(4),  }}
						onPress={() => this.state.isButtonEnable ? this.verifyOTP() : Snackbar.show({
							text: 'Please enter OTP',
							duration: Snackbar.LENGTH_SHORT,
							backgroundColor: Color.primary
						})
						}>
						<Text style={{ fontWeight  :CustomFont.fontWeight600, fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Continue</Text>
					</TouchableOpacity>

					<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(3.5) }}>
						{this.state.resentBtnType ?
						<TouchableOpacity style = {{justifyContent : 'center', alignItems : 'center', backgroundColor : Color.resendOtpBg, borderRadius : 6, width : responsiveWidth(87), height : responsiveHeight(5.5) }}>
                                <Text  style={{ opacity: .4, fontWeight : CustomFont.fontWeight700, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary}}>Resend OTP in {this.state.showOtpTime}s</Text>
						</TouchableOpacity>
						 :
							<TouchableOpacity style = {{justifyContent : 'center', alignItems : 'center', backgroundColor : Color.resendOtpBg, borderRadius : 6, width : responsiveWidth(87), height : responsiveHeight(5.5) }} onPress={()=> this.resentOTP()}>
								<Text style={{opacity: 1, fontWeight : CustomFont.fontWeight700, fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary, textDecorationLine: 'underline',padding:5 }}>Resend OTP</Text>
							</TouchableOpacity>

						}
						
					</View>

                  
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
)(OtpVerification);

import React, { useState } from 'react';
import {
	SafeAreaView, View,
	Text,
	StatusBar, Image, TouchableOpacity } from 'react-native';
import CustomFont from '../../components/CustomFont';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Color from '../../components/Colors';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import CrossIcon from '../../../assets/cross_primary.png';
import Mobile from '../../../assets/mobile_primary.png';
import Email from '../../../assets/email_primary.png';
import RightArrow from '../../../assets/rightarrow_primary.png';

import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';


let clickOn='';
class ForgetPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobile: '',
			email: '',
			domainName:''
		};
	}
	async componentDidMount() {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": null,
			"DoctorGuid":null,
			"Version": null,
			"Data": {
					"UserCode": signupDetails.userLoginId
					}
			}
		actions.callLogin('V1/FuncForDrAppToGetUserInfoByUserId', 'post', params, '', 'userMobileEmail');
	}

	sendOtp = (from) =>
	{
		clickOn=from;
		let { actions, signupDetails } = this.props;
		let params = {
			"data": {
				"Reference":from == 'email'? signupDetails.email : signupDetails.mobile
			}
		}
		//alert(JSON.stringify(params))
		actions.callLogin('V11/FuncForDrAppToSaveAndSendOTP', 'post', params, signupDetails.accessToken, 'sendOTP');
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
	        if(tagname === 'userMobileEmail')
			{
				let data = newProps.responseData.data;
				let userMobileNo = data.mobileNo;
				if(userMobileNo && userMobileNo.length > 6){
					userMobileNo = userMobileNo.substring(6);
				}
				this.setState({mobile:userMobileNo})
				try{
					let userEmailId = data.email;
					let substrEmail=''
					if(userEmailId && userEmailId.includes("@")){
						let str=userEmailId.split("@");
						let temp=str[0];
						if(temp && temp.length > 2){
							substrEmail = temp.substring(0, 2);
						}else{
							substrEmail=temp;
						}
						this.setState({email:substrEmail,domainName:str[1]})	
					}
				}catch(e){}

				let { actions, signupDetails } = this.props;
				signupDetails.email = data.email;
				signupDetails.mobile = data.mobileNo;
				signupDetails.UserGuid = data.userGuid;
				actions.setSignupDetails(signupDetails);

			}
			else if(tagname === 'sendOTP')
			{
				
				//this.props.navigation.navigate('PasswordChangeSuccess',{from:clickOn})
				this.props.navigation.navigate('OtpVerifyForgetPassword',{from:clickOn})
			}
		}
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
				
				<View style={{ flex: 1, backgroundColor : Color.white , margin: responsiveWidth(0) }}>
				<Image source={home_bg}  style={{ height: responsiveFontSize(15), width: responsiveFontSize(15),position:'absolute',top:0,right:0 }} />
					<View style={{ alignItems: 'flex-end', marginRight: responsiveWidth(1), marginTop : responsiveHeight(1.5) }}>
						<TouchableOpacity  onPress={() => this.props.navigation.goBack()} style={{ height: responsiveFontSize(6), width: responsiveFontSize(6), justifyContent: 'center', alignItems: 'center' }} >
							<Image source={CrossIcon} style={{ resizeMode : 'contain', height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
						</TouchableOpacity>
					</View>
					<View style = {{margin : responsiveHeight(3.5)}}>
					<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
					<Text style={{ fontFamily: CustomFont.fontName, marginTop : 25, fontWeight: CustomFont.fontWeight700 , fontSize: CustomFont.font24, color: Color.fontColor }}>Forgot Password?</Text>
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveHeight(3), textAlign: 'justify' }}>We’ll send you a recovery code to reset your {'\n'}password. Choose which way you want to {'\n'}receive the recovery code</Text>
					<View  style = {{borderRadius : 6, height : responsiveHeight(15),  backgroundColor: Color.white , marginTop: responsiveHeight(6)}}> 
					<TouchableOpacity style={{borderRadius : 6, height : responsiveHeight(15),  backgroundColor: Color.white  }}
					 onPress={()=> this.sendOtp('phone') }>
						<View style={{ flex: 1, paddingLeft : 15, justifyContent : 'center'}}>
						<Text style={{ fontFamily: CustomFont.fontName,fontSize: CustomFont.font16, fontWeight : CustomFont.fontWeight700, color: Color.fontColor }}>Via SMS</Text>
							
						</View>
						<View style={{ flex: 1, paddingLeft : 20,  flexDirection : 'row' }}>
						<Image source={Mobile} style={{ height: responsiveFontSize(4), width : responsiveFontSize(3), resizeMode: 'contain' }} />
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font20, color: Color.primary, marginLeft : 20, marginTop: responsiveHeight(-.5)}}>&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {this.state.mobile}</Text>
						<Image style = {{marginTop  :4, resizeMode : 'contain', marginLeft : responsiveWidth(30), height : responsiveFontSize(2), width : responsiveFontSize(2)}}  source = {RightArrow}/>
						</View>
					</TouchableOpacity>
					</View>

					{/* <View  style = {{borderRadius : 6, height : responsiveHeight(15),  backgroundColor: Color.white , marginTop: responsiveHeight(6)}}> 
					<TouchableOpacity style={{borderRadius : 6, height : responsiveHeight(15),  backgroundColor: Color.white  }}
					 onPress={()=> this.sendOtp('email') }>
						<View style={{ flex: 1, paddingLeft : 15, justifyContent : 'center'}}>
						<Text style={{ fontFamily: CustomFont.fontName,fontSize: CustomFont.font16, fontWeight : CustomFont.fontWeight700, color: Color.fontColor }}>Via Email</Text>
							
						</View>
						<View style={{ flex: 1, paddingLeft : 20,  flexDirection : 'row' }}>
							<View style= {{flex : 1}}>
							   <Image source={Email} style={{ height: responsiveFontSize(4), width : responsiveFontSize(3), resizeMode: 'contain' }} />
							</View>
						
						<View style = {{ flex : 8 ,flexDirection : 'row'}}>
							<View style = {{flex  :7}}> 
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font20, color: Color.primary, marginLeft : 20, marginTop: responsiveHeight(-.5)}}>{this.state.email}&bull;&bull;&bull;&bull;{this.state.domainName}</Text>
							</View>
							<View style = {{flex  :1, marginTop  :4}}> 
							<Image style = {{resizeMode : 'contain', marginRight : responsiveWidth(1), height : responsiveFontSize(2), width : responsiveFontSize(2)}}  source = {RightArrow}/>
							</View>
						
						
						</View>
						</View>
					</TouchableOpacity>
					</View> */}
					
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
)(ForgetPassword);

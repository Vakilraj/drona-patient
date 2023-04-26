import React, { useState } from 'react';
import {
	SafeAreaView,View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity } from 'react-native';
import styles from './style';
import CustomFont from '../../components/CustomFont';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Color from '../../components/Colors';
import { responsiveWidth, responsiveHeight, responsiveFontSize, useResponsiveFontSize } from 'react-native-responsive-dimensions';
import tick from '../../../assets/tick.png';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from 'react-native-encrypted-storage';
import CryptoJS from "react-native-crypto-js";
import { sha256 } from 'js-sha256';
class PasswordChangeSuccess extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			passwordShowStatus: true,
			alertTxt:''
		};
	}
	async componentDidMount() {
		let { actions, signupDetails } = this.props;
		// await AsyncStorage.setItem('fname', signupDetails.fname);
		// await AsyncStorage.setItem('lname', signupDetails.lname);
		// await AsyncStorage.setItem('loginId', signupDetails.userLoginId);
		// await AsyncStorage.setItem('email', signupDetails.email);
		// await AsyncStorage.setItem('mobile', signupDetails.mobile);
		setTimeout(()=>{
			//this.props.navigation.navigate('Login');
		},3000)
	}
	toggleSwitch = () => {
		this.setState({ isEnabled: !this.state.isEnabled })
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'login') {
				if(newProps.responseData.statusMessage==='Success' && newProps.responseData.accessToken){
					let { actions, signupDetails } = this.props;
					signupDetails.accessToken = newProps.responseData.accessToken;
					signupDetails.UserGuid = newProps.responseData.data.userInfo.userGuid;
					signupDetails.password = this.state.password;
					actions.setSignupDetails(signupDetails);
					await AsyncStorage.setItem('password', CryptoJS.AES.encrypt(this.state.password, 'MNKU').toString() );
					await AsyncStorage.setItem('accessToken', CryptoJS.AES.encrypt(newProps.responseData.accessToken, 'MNKU').toString() );
					await AsyncStorage.setItem('userGuid', CryptoJS.AES.encrypt(newProps.responseData.data.userInfo.userGuid, 'MNKU').toString() );
					Snackbar.show({ text: 'Login Successfull', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
					this.props.navigation.navigate('DoctorHome');
				}else{
					//alert(newProps.responseData.statusMessage)
					setTimeout(()=>{
						Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					},500);
				}

			}
		}
	}
	clickOnLogin=() => {
		if(!this.state.password){
			this.setState({alertTxt:'Please enter password'})
		}else{
			let { actions, signupDetails } = this.props;
			let params = {
				"UserGuid":signupDetails.UserGuid,
				"Version":"",
				"Data":{
					"UserName":signupDetails.userLoginId,
					"Password": sha256(this.state.password)
				}
				};
			 actions.callLogin('V1/FuncForDrAppToLoginWithPassword', 'post', params, signupDetails.accessToken, 'login');
			 //this.props.navigation.navigate('DoctorHome');
		}
	}
	gotoLogin = () =>{
		this.props.navigation.navigate('Login');
	}
	render() {
		let { actions, signupDetails,loading } = this.props;
		return (
			<SafeAreaView style={{flex:1,backgroundColor:Color.lightGrayBg}}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
				<View style={{ flex: 1, margin: responsiveWidth(6),alignItems:'center' }}>
					<View style={{height:responsiveFontSize(10),width:responsiveFontSize(10),borderRadius:responsiveFontSize(5),backgroundColor:'#1EA313',alignItems:'center',justifyContent:'center',marginTop:responsiveHeight(18)}}>
<Image source={tick} style={{height:responsiveFontSize(5),width:responsiveFontSize(5),resizeMode:'contain'}}/>
					</View>
					<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font24, color: Color.fontColor,marginTop:responsiveHeight(12),textAlign:'center' }}>Your password has been {'\n'}successfully reset</Text>
					{/* <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor,marginTop:responsiveHeight(6),textAlign:'center' }}>You’ve successfully reset your{'\n'} password. Please log in with{'\n'} your new credentials.</Text> */}
					<TouchableOpacity style={[styles.loginBtn1, {marginTop : responsiveHeight(10)}]} onPress={this.gotoLogin}>
						<Text style={{ color: Color.white, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font16 }}>Continue to Login</Text>
					</TouchableOpacity>
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
)(PasswordChangeSuccess);

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar,BackHandler } from 'react-native';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import success_tick from '../../../assets/success_tick.png';
let isHome = false
class AccountActivatedMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isEnabled: false,
			mobileNo: '',
			male: 'checked',
			female: 'unchecked',
			other: 'unchecked',
		};
	}
	componentDidMount() {
		isHome = this.props.navigation.getParam("from") == "Home"
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			return true
		})
		// setTimeout(()=>{
		// 	isHome = this.props.navigation.getParam("from") == "Home"
		// 	if (isHome)
		// 		this.props.navigation.navigate('DoctorHome')
		// 	else
		// 		this.props.navigation.navigate('AddNewClinicDetails', { clinicName: '', from: 'AddFirst' })
		// 	//this.props.navigation.navigate('AddNewClinic', { selectedState: null });
		// 	//this.props.navigation.navigate('AboutYourselfStep2')
		// },2000)
	}
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<View style={{ flex: 1, backgroundColor: Color.white }}>
			<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 5.5, alignItems: 'center' }}>
					<Image source={success_tick} style={{height:responsiveFontSize(15),width:responsiveFontSize(15),marginTop:responsiveHeight(20)}}/>
					<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font20, color: Color.fontColor, marginTop: responsiveHeight(7),textAlign:'center',fontWeight:'bold' }}>Your account has been {'\n'}activated</Text>
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(5),textAlign:'center',marginLeft:responsiveWidth(6),marginRight:responsiveWidth(6) }}>Create your own web page for your clinic
on DrOnA Health by completing the Clinic Setup</Text>
					
				</View>
				<View style={{ flex: 1, alignItems: 'center'}}>
				<TouchableOpacity style={{ height: responsiveHeight(5.8), width: responsiveWidth(80), alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: Color.primary, }} onPress={()=>{
						if (isHome)
						this.props.navigation.navigate('DoctorHome')
					else
						this.props.navigation.navigate('FinishWebPage',{from:'signup'})
						//this.props.navigation.navigate('AddNewClinicDetails', { clinicName: '', from: 'AddFirst' })
					} }>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Continue</Text>
					</TouchableOpacity>
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
)(AccountActivatedMessage);
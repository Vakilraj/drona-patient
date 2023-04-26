import React, { useState } from 'react';
import {View,Text,Keyboard, StatusBar } from 'react-native';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import * as Progress from 'react-native-progress';
class ApplyClinicSetting extends React.Component {
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
		Keyboard.dismiss(0);
		setTimeout(()=>{
			this.props.navigation.navigate('AboutYourselfStep1')
		
		},2000)
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
	
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<View style={CommonStyle.container}>
			<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{flex:1,alignItems:'center', backgroundColor:'#e3e3ef'}}>
				<Progress.CircleSnail size={responsiveFontSize(8)} progress={.1}  style={{marginTop:responsiveHeight(20)}}/>
				<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.fontColor,marginTop:responsiveHeight(8) }}>Applying clinic settings</Text>
				<Text style={{ fontFamily: CustomFont.fontNameBold, fontSize: CustomFont.font30, color: Color.fontColor,marginTop:responsiveHeight(20),fontWeight:'bold',textAlign:'center' }}>Sit tight we're setting{'\n'} up your account</Text>
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
)(ApplyClinicSetting);
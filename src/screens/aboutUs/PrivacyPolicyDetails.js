import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TouchableOpacity, BackHandler, ScrollView
} from 'react-native';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CommonStyle from '../../components/CommonStyle.js';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import HTML from "react-native-render-html";
class PrivacyPolicyDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			videoArray: [],
			entries: [{ title: 'hh' }],
			activeSlide: 0,
			imageArray: [],
			playPause: true,
			showLoading: false
		};
	}
	async componentDidMount() {

		//alert(JSON.stringify(this.props.navigation.state.params.item));
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
	}


	render() {
		let { actions, signupDetails, loading } = this.props;
		let answerDetails = this.props.navigation.state.params.item;
		
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					
					<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()} >
							<Image source={arrowBack} style={{marginLeft: responsiveWidth(3),  width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1),  resizeMode:'contain' }} />
						</TouchableOpacity>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>Privacy Policy</Text>
					</TouchableOpacity>

					<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>

						<ScrollView>
							<View style={{ margin: responsiveWidth(4), backgroundColor: Color.white, borderRadius: 10, padding: responsiveWidth(4) }}>
								{answerDetails && answerDetails.updatedOn ?
									<Text style={{ FontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.mediumGrayTxt, marginTop: responsiveHeight(2) }}>{answerDetails.updatedOn}</Text>
									: null}
								{/* <Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(2) }}>{answerDetails.policyContent}</Text> */}
								{answerDetails && answerDetails.policyContent ? <HTML source={{ html: answerDetails.policyContent }} /> :<Text style={{marginLeft:responsiveWidth(30),color:Color.fontColor}}>No data found</Text>}
								
							</View>
						</ScrollView>

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
)(PrivacyPolicyDetails);
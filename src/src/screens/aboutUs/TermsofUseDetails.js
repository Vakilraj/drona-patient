import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, BackHandler, ScrollView, Alert
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
class TermsofUseDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tersofUsDetails: null
		};
	}
	async componentDidMount() {
		let item=this.props.navigation.state.params.item;
		if(item){
			this.setState({tersofUsDetails:item.termsContent})
		
		}else{
			let { actions, signupDetails } = this.props;
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"data": {
					"roleType": "Dr"
				}
			}
			actions.callLogin('V1/FuncForDrAppToGetAboutUsDetails', 'post', params, signupDetails.accessToken, 'TermsOfUse');
		}
		
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'TermsOfUse') {
				if (newProps.responseData.statusCode == '0') {
					let data = newProps.responseData.data;
					if (data) {
						this.setState({tersofUsDetails:data.termsOfUse.termsContent})
					}
				}


			}
		}

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
							<Image source={arrowBack} style={{  marginLeft: responsiveWidth(3),  width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1),  resizeMode:'contain' }} />
						</TouchableOpacity>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>Terms of Use</Text>
					</TouchableOpacity>
					<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>

						<ScrollView>
							<View style={{ margin: responsiveWidth(4), backgroundColor: Color.white, borderRadius: 10, padding: responsiveWidth(4) }}>
								{answerDetails && answerDetails.updatedOn ?
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.mediumGrayTxt, marginTop: responsiveHeight(2) }}>{answerDetails.updatedOn}</Text>
									: null}
								
								{this.state.tersofUsDetails ? <HTML source={{ html: this.state.tersofUsDetails }} />:null}
								

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
)(TermsofUseDetails);
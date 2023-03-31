import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image,  TouchableOpacity,  BackHandler,  FlatList
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
import arrow_right from '../../../assets/chevron_right.png';
import privacy_policy from '../../../assets/privacy_policy.png';
import about_dr from '../../../assets/about_dr.png';
import term_of_use from '../../../assets/term_of_use.png';
let aboutDetails = null, tersofUsDetails = null, privacyDetails = null;

class AboutusIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataArray: ['About DrOnA Health', 'Privacy Policy', 'Terms of Use'],
		};
	}
	async componentDidMount() {
		let { actions, signupDetails } = this.props;
		console.log('')
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"data": {
				"roleType": "Dr"
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetAboutUsDetails', 'post', params, signupDetails.accessToken, 'AboutUs');
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'AboutUs') {
				if (newProps.responseData.statusCode == '0') {
					let data = newProps.responseData.data;
					if (data) {
						aboutDetails = data.aboutDrona;
						tersofUsDetails = data.termsOfUse
						privacyDetails = data.privacyPolicy;
					}
				}


			}
		}

	}
	renderList = ({ item, index }) => (
		 

		<TouchableOpacity style={{
			flexDirection: 'row', backgroundColor: Color.white, height: responsiveHeight(9), alignItems: 'center', justifyContent: 'space-between',
			marginLeft: responsiveWidth(4), marginEnd: responsiveWidth(4), marginTop: responsiveWidth(3), borderRadius: 10
		}} onPress={() => {
			if (index === 0) {
				this.props.navigation.navigate('AboutusDetails', { item: aboutDetails })
			} else if (index === 1) {
				this.props.navigation.navigate('PrivacyPolicyDetails', { item: privacyDetails })
			} else if (index === 2) {
				this.props.navigation.navigate('TermsofUseDetails', { item: tersofUsDetails })
			}
		}}>
			<View style={{ flex: 9, alignItems: 'center', flexDirection: 'row' }}>
				{index == 0 ?
				 <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: responsiveFontSize(1.0), marginLeft: 20,height: responsiveHeight(5), width: responsiveHeight(5),backgroundColor:'#FFF1F5',borderRadius:20 }}>
					<Image source={about_dr} style={{ height: responsiveHeight(2.5), width: responsiveHeight(2.5), resizeMode: 'contain' }} />
				</View> :
					<View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: responsiveFontSize(1.0), marginLeft: 20 }}>
						<Image source={index == 1 ? privacy_policy : term_of_use} style={{ height: responsiveHeight(5), width: responsiveHeight(5), resizeMode: 'contain' }} />
					</View>}
				<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight700, marginLeft: 20,marginEnd: responsiveFontSize(4.5), }}>{item}</Text>
			</View>
			<View style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), justifyContent: 'center', alignItems: 'center' }}>
				<Image source={arrow_right} style={{ tintColor: Color.black, height: responsiveFontSize(3), width: responsiveFontSize(3), resizeMode: 'contain', }} />

			</View>

		</TouchableOpacity>

	);
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()} >
							<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3),  width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1),  resizeMode:'contain' }} />
						</TouchableOpacity>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>About Us</Text>
					</TouchableOpacity>
					<FlatList
						data={this.state.dataArray}
						renderItem={this.renderList}
						extraData={this.state}
						keyExtractor={(item, index) => index.toString()}
					/>
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
)(AboutusIndex);
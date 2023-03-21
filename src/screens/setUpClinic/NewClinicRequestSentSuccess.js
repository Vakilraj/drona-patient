import React, { useState } from 'react';
import {
	SafeAreaView, View,
	Text,
	StatusBar, Image, TouchableOpacity
} from 'react-native';
import CustomFont from '../../components/CustomFont';
import Color from '../../components/Colors';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import inclinic_white from '../../../assets/inclinic_white.png';
import tick from '../../../assets/tick.png';
class NewClinicRequestSentSuccess extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clinicName: '',
			address: ''
		};
	}
	async componentDidMount() {
		//this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		let clinicName = this.props.navigation.state.params.clinicName;
		let address = this.props.navigation.state.params.address;
		let city = this.props.navigation.state.params.city;
try {
	let addr='';
	if(address && address!='null'){
		addr=address+', ';
	}
	this.setState({clinicName:clinicName,address: addr+city})
} catch (e) {
	
}
		// let { actions, signupDetails } = this.props;
		// let params = {
		// 	"DoctorGuid": signupDetails.doctorGuid, "Version": null,
		// 	"Data": {
		// 		"ListOfFilter": [{ "Key": "NotificationGuid", "Value": notificationParam.notificationGuid }],
		// 		"SortBy": null, "SortOrder": null, "PageIndex": null, "PageSize": null, "UserType": null, "SearchBy": null, "CreateDate": "0001-01-01T00:00:00"
		// 	}
		// }

		// console.log(JSON.stringify(params));

		//actions.callLogin('V1/FuncForDrAppToGetNotificationList', 'post', params, signupDetails.accessToken, 'readNotification');

	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			//alert(JSON.stringify(newProps.responseData))
			let tagname = newProps.responseData.tag;
			if (tagname === 'readNotification') {
				try {
					let title = newProps.responseData.data[0].title;
					let body = newProps.responseData.data[0].notificationMessage;
					this.setState({ title: title, body: body })
				} catch (e) { }
			}
		}
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content"  />
				<View style={{ flex: 1, margin: responsiveWidth(4), alignItems: 'center' }}>
					<View style={{ height: responsiveFontSize(10), width: responsiveFontSize(10), borderRadius: responsiveFontSize(5), backgroundColor: '#1EA313', alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(7) }}>
						<Image source={tick} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
					</View>
					<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font20, color: Color.fontColor, marginTop: responsiveHeight(4), textAlign: 'center' }}>You’ve sent a {'\n'}request to join a clinic</Text>
					<View style={{ flexDirection: 'row',backgroundColor:'#FFF',borderRadius:4,marginTop: responsiveHeight(6), }}>
						<View style={{ flex: 1,margin:responsiveWidth(4) }}>
							<View style={{height:responsiveFontSize(5),width:responsiveFontSize(5),borderRadius:responsiveFontSize(2.5),backgroundColor:Color.liveBg,alignItems:'center',justifyContent:'center'}}>
								<Image source={inclinic_white} style={{height:responsiveFontSize(1.6),width:responsiveFontSize(1.6),resizeMode:'contain'}}/>
							</View>
						</View>
						<View style={{ flex: 7,marginTop:responsiveWidth(3),marginBottom:responsiveWidth(4) ,marginRight:responsiveWidth(2)   }}>
							<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveHeight(1),}}>{this.state.clinicName}</Text>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.fontColor, marginTop: 3}}>{this.state.address}</Text>

						</View>
					</View>
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(8), textAlign: 'center' }}>We will notify you when the clinic {'\n'}admin accepts your request.</Text>
					<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(8), backgroundColor: Color.primary, marginTop: responsiveHeight(6),width:responsiveWidth(90)}} onPress={() => {
									this.props.navigation.navigate('DoctorHome');
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Okay </Text>
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
)(NewClinicRequestSentSuccess);

import React, { useState } from 'react';
import {
	SafeAreaView, View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, ScrollView, FlatList, BackHandler
} from 'react-native';
import CustomFont from '../../components/CustomFont';
import Color from '../../components/Colors';
import CommonStyle from '../../components/CommonStyle.js';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from 'react-native-encrypted-storage';

import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import { setLogEvent } from '../../service/Analytics';
import CryptoJS from "react-native-crypto-js";
class NotificationDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			body: ''
		};
	}
	async componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () =>{
			this.props.navigation.goBack();
			try {
				this.props.navigation.state.params.Refresh();
			} catch (error) {
				
			}
		})
		//alert(JSON.stringify(this.props.navigation.state.params.item))
		let { actions, signupDetails } = this.props;
		let notificationParam = this.props.navigation.state.params.item;
let accessToken=signupDetails.accessToken ? signupDetails.accessToken: CryptoJS.AES.decrypt(await AsyncStorage.getItem('accessToken'),'MNKU').toString(CryptoJS.enc.Utf8);
		
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid, "Version": null,
			"Data": {
				"ListOfFilter": [{ "Key": "NotificationGuid", "Value": notificationParam.notificationGuid }],
				"SortBy": null, "SortOrder": null, "PageIndex": null, "PageSize": null, "UserType": null, "SearchBy": null, "CreateDate": "0001-01-01T00:00:00"
			}
		}

		//console.log(JSON.stringify(params));

		actions.callLogin('V1/FuncForDrAppToGetNotificationList', 'post', params, accessToken, 'readNotification');

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
					setLogEvent("read_notification")
				} catch (e) { }
			}
		}
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		let notificationParam = this.props.navigation.state.params.item;
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ backgroundColor: Color.white }}>
					{/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
						this.props.navigation.goBack();
					}} >
						<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2) }} />
						<Text style={{ color: Color.white, fontSize: CustomFont.font16, marginLeft: responsiveWidth(4) }}>Notification Details</Text>
					</TouchableOpacity> */}
					<TouchableOpacity onPress={() =>{
this.props.navigation.goBack();
try {
	this.props.navigation.state.params.Refresh();
} catch (error) {
	
}

					} } style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
							<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3),  width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1),  resizeMode:'contain'}} />
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight500, marginLeft: responsiveWidth(4) }}>Notification Details</Text>
					</TouchableOpacity>


				</View>
				<View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>

					<View style={{ flex: 1, margin: responsiveWidth(4),padding:responsiveWidth(4),backgroundColor:Color.white,borderRadius:10 }}>
						<ScrollView>
							<View>
								<Text style={{ color: Color.fontColor, fontSize: CustomFont.font16, marginTop: 7, fontWeight: CustomFont.fontWeight700 }}>{this.state.title}</Text>
								<Text style={{ color: Color.fontColor, fontSize: CustomFont.font14, marginTop: responsiveHeight(2), opacity: .9 , fontWeight: CustomFont.fontWeight500}}>{this.state.body}</Text>
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
)(NotificationDetails);

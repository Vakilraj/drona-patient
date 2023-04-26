import React, { useState } from 'react';
import {
	SafeAreaView, View,
	Text,
	ScrollView,
	StatusBar, Image,  TouchableOpacity, FlatList, BackHandler
} from 'react-native';
import CustomFont from '../../components/CustomFont';
import Color from '../../components/Colors';
import CommonStyle from '../../components/CommonStyle.js';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { responsiveWidth, responsiveHeight, responsiveFontSize, } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/back_blue.png';
import { NavigationEvents } from 'react-navigation';
import { setLogEvent } from '../../service/Analytics';
let selectedIndex = 0,clickOnGroup='latest';
class NotificationIndex extends React.Component {
	constructor(props) {
		super(props);
		selectedIndex = 0;
		clickOnGroup='latest';
		this.state = {
			titleArray: [],
			dataArray: [{ readStatus: true }, { readStatus: false }, { readStatus: true }, { readStatus: true }, { readStatus: false }, { readStatus: true }, { readStatus: true }, { readStatus: true }, { readStatus: true },],
			unreadCountNotification: '',
			latestList: [],
			previousList: []
		};
	}

	async componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		this.geNotificationData();
	}

	geNotificationData = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid, "Version": null,
			"Data": {
				"ListOfFilter": [{ "Key": "NotificationGuid", "Value": null }],
				"SortBy": null, "SortOrder": null, "PageIndex": null, "PageSize": null, "UserType": null, "SearchBy": null, "CreateDate": "0001-01-01T00:00:00"
			}
		}

		//console.log('--------get noti1111------'+JSON.stringify(params));

		actions.callLogin('V1/FuncForDrAppToGetNotificationList_V2', 'post', params, signupDetails.accessToken, 'notificationList');
	}
	getMarkAsRead = () => {
		let { actions, signupDetails } = this.props;
		let params = { "UserGuid": signupDetails.UserGuid, "DoctorGuid": signupDetails.doctorGuid, "Version": null, "PatientGuid": null }

		actions.callLogin('V1/FuncForDrAppToMarkAllAsRead', 'post', params, signupDetails.accessToken, 'MarkAllAsRead');
	}
	Refresh=()=>{
		if(clickOnGroup=='latest'){
			let item=this.state.latestList[selectedIndex]; //previousList
			this.state.latestList.splice(selectedIndex,1);
			let tempArr=[...this.state.previousList];
			tempArr.splice(0,0,item);
			this.setState({previousList:tempArr});
		}



	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'notificationList') {
				//console.log('--------res noti------'+JSON.stringify(newProps.responseData));
				let res = newProps.responseData.data;
				try {
					this.setState({ latestList: res.latestList ? res.latestList : [], previousList: res.previousList ? res.previousList : [], unreadCountNotification: res.latestList ? res.latestList.length : 0 });
				} catch (error) {
					//console.log(error);
				}
			} else if (tagname === 'MarkAllAsRead') {
				//alert(JSON.stringify(newProps.responseData))
				 
				if (newProps.responseData.statusCode == '0') {
					this.geNotificationData()
					setLogEvent("read_notification",{mark_all:true})
					// console.log("INDR  2- ",JSON.stringify(newProps.responseData));
					// let resdata = [...this.state.titleArray];
					// if (resdata) {
					// 	let tempArr = [];
					// 	for (let i = 0; i < resdata.length; i++) {
					// 		resdata[i].isRead = true;
					// 		tempArr.push(resdata[i])
					// 	}
					// 	this.setState({ titleArray: tempArr, unreadCountNotification: '' });
					// }
				}
			}
		}
	}
	//NotificationForRequest  NotificationDetails
	renderList = ({ item, index }) => (
		<TouchableOpacity style={{ marginBottom: 3, backgroundColor: Color.white }} onPress={() => {
				this.props.navigation.navigate('NotificationDetails', { item: item,Refresh:this.Refresh });
				selectedIndex = index;
				clickOnGroup='latest';
		}}>
			<View style={{ flexDirection: 'row', flex: 1 }}>

				{/* <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: responsiveFontSize(1.0), marginLeft: 20, height: responsiveHeight(5), width: responsiveHeight(5), backgroundColor: '#FFF1F5', borderRadius: 20, marginTop: responsiveHeight(2) }}>
					<Image source={sms} style={{ height: responsiveHeight(5), width: responsiveHeight(5), resizeMode: 'contain' }} />
				</View> */}
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.6) }}>
						<View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
							{!item.isRead ? <View style={{ height: 8, width: 9, backgroundColor: Color.liveBg, borderRadius: 4, marginLeft: 12 }} /> : null}
							<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: 10, opacity: !item.isRead ? 1 : .8, fontWeight: !item.isRead ? 'bold' : 'normal' }}>{item.title}</Text>

						</View>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<Image source={arrowBack} style={{ transform: [{ rotate: '180deg' }], marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), height: responsiveHeight(2), width: responsiveHeight(2), tintColor: Color.primary, }} />
						</View>
					</View>
					<Text style={{ fontSize: CustomFont.font12, color: Color.textGrey, marginLeft: 12, marginRight: 10, opacity: !item.isRead ? 1 : .8, fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName }}>{item.notificationMessage}</Text>
					<Text style={{ fontSize: CustomFont.font12, color: Color.text3, marginTop: 4, marginBottom: responsiveHeight(1.6), marginLeft: 12, fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName }}>{item.time}</Text>
				</View>
			</View>

		</TouchableOpacity>
	);
	renderListPrev = ({ item, index }) => (
		<TouchableOpacity style={{ marginBottom: 3, backgroundColor: Color.white }} onPress={() => {
				this.props.navigation.navigate('NotificationDetails', { item: item,Refresh:this.Refresh })
				selectedIndex = index;
				clickOnGroup='prev';
		}}>
			<View style={{ flexDirection: 'row', flex: 1 }}>

				{/* <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: responsiveFontSize(1.0), marginLeft: 20, height: responsiveHeight(5), width: responsiveHeight(5), backgroundColor: '#FFF1F5', borderRadius: 20, marginTop: responsiveHeight(2) }}>
					<Image source={sms} style={{ height: responsiveHeight(5), width: responsiveHeight(5), resizeMode: 'contain' }} />
				</View> */}
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1.6) }}>
						<View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
							
							<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: 10, opacity: .8, fontWeight: 'normal' }}>{item.title}</Text>

						</View>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<Image source={arrowBack} style={{ transform: [{ rotate: '180deg' }], marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2), height: responsiveHeight(2), width: responsiveHeight(2), tintColor: Color.primary, }} />
						</View>
					</View>
					<Text style={{ fontSize: CustomFont.font12, color: Color.textGrey, marginLeft: 12, marginRight: 10, opacity: .8, fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName }}>{item.notificationMessage}</Text>
					<Text style={{ fontSize: CustomFont.font12, color: Color.text3, marginTop: 4, marginBottom: responsiveHeight(1.6), marginLeft: 12, fontWeight: CustomFont.fontWeight500, fontFamily: CustomFont.fontName }}>{item.time}</Text>
				</View>
			</View>

		</TouchableOpacity>
	);
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<SafeAreaView style={CommonStyle.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				{/* <NavigationEvents onDidFocus={() => this.geNotificationData()} /> */}
				<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
					<View style={{ justifyContent: 'space-between', backgroundColor: Color.white, }}>


						<TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: Color.white, flexDirection: 'row', height: responsiveHeight(7), alignItems: 'center' }}>
							<TouchableOpacity onPress={() => this.props.navigation.goBack()} >
								<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), resizeMode: 'contain' }} />
							</TouchableOpacity>
							<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>Notifications</Text>
							{/* <Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight500, marginLeft: responsiveWidth(4) }}> {this.state.unreadCountNotification ? '(' + this.state.unreadCountNotification + ')' : ''}</Text> */}
							{this.state.unreadCountNotification ?
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font10, fontWeight: CustomFont.fontWeight700, backgroundColor: Color.liveBg, borderRadius: 20, paddingTop: 3, paddingBottom: 3, paddingLeft: 8, paddingRight: 8, marginLeft: responsiveWidth(2) }}> {this.state.unreadCountNotification} NEW</Text>
								: null}
						</TouchableOpacity>

					</View>
					<View style={{ alignItems: 'flex-end' }}>
						{this.state.titleArray && this.state.titleArray.length > 0 ?
							<TouchableOpacity style={{ margin: responsiveWidth(1.5) }} onPress={() => this.getMarkAsRead()} >
								<Text style={{ color: Color.primary, fontSize: CustomFont.font16, margin: responsiveWidth(2), fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName }}>Mark all as read </Text>
							</TouchableOpacity> : null}
					</View>
					{(this.state.latestList && this.state.latestList.length > 0 ||
						this.state.previousList && this.state.previousList.length > 0) ?
						<ScrollView>
							<View style={{ flex: 1 }}>

								{this.state.latestList && this.state.latestList.length > 0 ?
									<View>
										<View style={{ flexDirection: 'row', margin: responsiveWidth(3), alignItems: 'center' }}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(2) }}>Latest</Text>
											<TouchableOpacity style={{ position: 'absolute', right: 10 }} onPress={() => this.getMarkAsRead()} >
												<Text style={{ color: Color.primary, fontSize: CustomFont.font16, margin: responsiveWidth(2), fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName }}>Mark all as read </Text>
											</TouchableOpacity>
										</View>
										<View style={{ margin: responsiveWidth(3), backgroundColor: Color.white, borderRadius: 10, marginTop: responsiveWidth(1) }}>
											<FlatList
												style={{ margin: responsiveHeight(1) }}
												contentContainerStyle={{ borderRadius: 10, overflow: 'hidden', }}
												data={this.state.latestList}
												renderItem={this.renderList}
												extraData={this.state}
												keyExtractor={(item, index) => index.toString()}
											/>
										</View>
									</View>
									: null}

								{this.state.previousList && this.state.previousList.length > 0 ?
									<View>
										<View style={{ flexDirection: 'row', margin: responsiveWidth(4), alignItems: 'center' }}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(2) }}>Previous</Text>
										</View>
										<View style={{ margin: responsiveWidth(3), backgroundColor: Color.white, borderRadius: 10, marginTop: responsiveWidth(1) }}>
											<FlatList
												style={{ margin: responsiveHeight(1) }}
												contentContainerStyle={{ borderRadius: 10, overflow: 'hidden', }}
												data={this.state.previousList}
												renderItem={this.renderListPrev}
												extraData={this.state}
												keyExtractor={(item, index) => index.toString()}
											/>
										</View>
									</View>
									: null}
							</View>
						</ScrollView>
						:
						<View style={{ flex: 1, alignItems: 'center' }}><Text style={{ color: Color.primary, fontSize: CustomFont.font16, marginTop: 30 }}>No notification found</Text></View>}

					{/* {this.state.titleArray && this.state.titleArray.length > 0 ?
						<View style={{ margin: responsiveHeight(1), marginTop: 0, backgroundColor: Color.patientBackground, flex: 1, borderRadius: 10 }}>
							<FlatList
								style={{ margin: responsiveHeight(1) }}
								contentContainerStyle={{ borderRadius: 10, overflow: 'hidden', }}
								data={this.state.titleArray}
								renderItem={this.renderList}
								extraData={this.state}
								keyExtractor={(item, index) => index.toString()}
							/>
						</View>
						: <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ color: Color.primary, fontSize: CustomFont.font16, marginTop: 30 }}>No notification found</Text></View>
					} */}
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
)(NotificationIndex);

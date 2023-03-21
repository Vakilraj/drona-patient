import React, { useState } from 'react';
import {
	SafeAreaView, ScrollView,
	View,
	Text, StatusBar, Image, TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import Moment from 'moment';
import Add from '../../../assets/plus.png';
import push from '../../../assets/push_new.png';
import sms_new from '../../../assets/sms.png';
import message from '../../../assets/email_new.png';
import closeIcon from '../../../assets/cross.png';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import message_home from '../../../assets/Messages_Empty.png';
import CustomFont from '../../components/CustomFont';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toolbar from '../../customviews/Toolbar.js';
import { setLogEvent } from '../../service/Analytics';

import { NavigationEvents } from 'react-navigation';
let messageDetailsFullArray = [];

class Messages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messageHistoryDetails: [],
		};
		DRONA.setIsReloadApi(true);
	}
	async componentDidMount() {
		//this.getMessageHistoryList();

	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'MessageHistoryList') {
				let data = newProps.responseData.data;
				messageDetailsFullArray = data.deliveryHistory;
				this.setState({ messageHistoryDetails: messageDetailsFullArray });
				DRONA.setIsReloadApi(false);
			}
		}
	}

	getMessageHistoryList = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"DoctorGuid": signupDetails.doctorGuid,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
		}
		actions.callLogin('V1/FuncForDrAppToGetMessageHistory', 'post', params, signupDetails.accessToken, 'MessageHistoryList');
	}

	formatDate = (dateValue) => {
		let strDate=dateValue.split(" ")[0];
		let strTime=dateValue.split(" ")[1];
		let strRes=strDate.replace("-","/").replace("-","/") +'  '+ Moment(strTime, 'hh:mm').format('LT');
		return strRes;
		//return Moment.utc(dateValue).local().format('YYYY-MMM-DD h:mm A')
	}

	assignMessageType = (type) => {
		let { actions, signupDetails } = this.props;
		signupDetails.messageType = type;
		actions.setSignupDetails(signupDetails);
		this.props.navigation.navigate('NewMessage');
		setLogEvent("new_message", { "userGuid": signupDetails.UserGuid, "messageType": type });
		this.setState({ isModalVisible: false })
	}
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<NavigationEvents onDidFocus={() =>{
					if(DRONA.getIsReloadApi()){
						this.getMessageHistoryList();
					}
				} } />
				<Toolbar
					title={"Messages"}
					onBackPress={() => this.props.navigation.goBack()}
					isNotification={true}
					onNotification={() => this.props.navigation.navigate('Notification')} />

				{this.state.messageHistoryDetails && this.state.messageHistoryDetails.length > 0 ?
					<View style={{ flex: 1, backgroundColor: Color.bgColor, paddingTop: responsiveHeight(2) }}>
						<ScrollView>
							{this.state.messageHistoryDetails.map((item, index) => {
								return (
									<View style={{ flex: 1, }}>
										<View style={{ marginTop: responsiveHeight(0.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, paddingBottom: responsiveWidth(3), backgroundColor: Color.white }}>
											<TouchableOpacity style={{ marginTop: 2, backgroundColor: Color.white, flexDirection: 'row', paddingBottom: 3, paddingTop: 8 }}>
												<View style={{ flex: 1, alignItems: 'center', marginTop: responsiveHeight(1.7), marginLeft: 20, }}>
													<View style={{ ...styles.iconViewPop, marginLeft: 0 }}>
														{item.messageType == 'SMS' ? <Image source={sms_new} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} /> :
															item.messageType == 'Push Notification' ? <Image source={push} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} /> :
																<Image source={message} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />}
													</View>
												</View>
												<View style={{ flex: 6, }}>
													<Text style={{ marginTop: responsiveHeight(1.2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, marginLeft: responsiveWidth(4), color: Color.text1, fontWeight: '500' }}>{item.messageTitle}</Text>
													<View style={{ flex: 1, marginTop: 3, flexDirection: 'row', width: responsiveHeight(40) }}>
														<View style={{ flex: 1, width: '100%', marginStart: 5, borderRadius: 10, color: Color.red, paddingStart: 12, paddingEnd: 12, paddingTop: 2, paddingBottom: 2 }}>
															<Text style={{ fontSize: CustomFont.font10, color: Color.textGrey, fontFamily: CustomFont.fontName, }}>Sent to</Text>
															<Text style={{ fontSize: CustomFont.font12, color: Color.text1, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, marginTop: 3 }}>{item.totalRecipient}</Text>
														</View>
													</View>
												</View>
												<View style={{ flex: 5 }}>
													<View>
														<Text style={{ marginTop: responsiveHeight(1.2), alignItems: 'flex-end', fontFamily: CustomFont.fontName, fontSize: CustomFont.font10, marginLeft: responsiveWidth(4), color: Color.textGrey }}>{this.formatDate(item.sentDate)}</Text>
													</View>
												</View>
											</TouchableOpacity>
										</View>
									</View>
								);
							}, this)}
						</ScrollView>
					</View>
					:
					<View style={{ flex: 1, backgroundColor: Color.bgColor }}>
						<ScrollView>
							<View style={{ flex: 1, marginBottom: responsiveWidth(2), marginTop: responsiveWidth(10) }}>

								<View style={{ flex: 1, margin: responsiveWidth(6), }}>

									<View style={{ margin: responsiveHeight(4), alignItems: 'center' }}>

										<Image source={message_home} style={{ width: responsiveFontSize(25), height: responsiveFontSize(25), resizeMode: 'contain' }} />

										<View style={{ flexDirection: 'row' }}>

											<TouchableOpacity style={{
												backgroundColor: Color.primaryBlue,
												marginTop: responsiveHeight(6), justifyContent: 'center', alignItems: 'center', height: responsiveHeight(7), borderColor: '#C4CDD5',
												width: responsiveWidth(46), borderRadius: responsiveWidth(1.5), borderWidth: 1, flexDirection: 'row',
											}} onPress={() => this.setState({ isModalVisible: true })}>
												<Text style={{ fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font12, fontWeight: 'bold' }}>New Message</Text>
											</TouchableOpacity>
										</View>
									</View>

								</View>
							</View>
						</ScrollView>
					</View>
				}
				<TouchableOpacity style={styles.addPost} onPress={() => this.setState({ isModalVisible: true })}>
					<Image source={Add} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
				</TouchableOpacity>

				<Modal isVisible={this.state.isModalVisible} avoidKeyboard={true}>
					<View style={styles.modelMessageChoose}>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }} onPress={() => this.setState({ isModalVisible: false })}>
							<Text style={{ marginLeft: 20, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName, color: Color.black, fontWeight: '700' }}>New Message Broadcast</Text>

							<View style={{ marginLeft: responsiveWidth(32) }}>
								<Image source={closeIcon} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2) }} />
							</View>
						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), }}
							onPress={() => {
								this.assignMessageType('Push Notification');
							}}>
							<View style={styles.iconViewPop}>
								<Image source={push} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain', }} />
							</View>
							<View style={{ flexDirection: 'column', marginRight: responsiveWidth(15) }}>
								<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '700', fontFamily: CustomFont.fontName, color: Color.black }}>Push Notification </Text>
								<Text style={{ fontFamily: CustomFont.fontName, flexWrap: 'wrap', marginLeft: 20, fontSize: CustomFont.font12, color: Color.text2, opacity: 0.6 }}>Connect with your patients using DrOnA for <Text style={{ fontWeight: 'bold' }}>Free</Text></Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), }}
							onPress={() => {
								this.assignMessageType('SMS')
							}}>
							<View style={styles.iconViewPop}>
								<Image source={sms_new} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
							</View>
							<View style={{ flexDirection: 'column', marginRight: responsiveWidth(15) }}>
								<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '700', fontFamily: CustomFont.fontName, color: Color.black }}>SMS</Text>
								<Text style={{ fontFamily: CustomFont.fontName, flexWrap: 'wrap', marginLeft: 20, fontSize: CustomFont.font12, color: Color.text2, opacity: 0.6 }}>Text patients who shared their phone number and opted for SMS</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3), marginBottom: responsiveHeight(35) }}
							onPress={() => {
								this.assignMessageType('Email')
							}}>
							<View style={styles.iconViewPop}>
								<Image source={message} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
							</View>
							<View style={{ flexDirection: 'column', marginRight: responsiveWidth(15) }}>
								<Text style={{ marginLeft: 20, fontSize: CustomFont.font14, fontWeight: '700', fontFamily: CustomFont.fontName, color: Color.black }}>Email</Text>
								<Text style={{ fontFamily: CustomFont.fontName, flexWrap: 'wrap', marginLeft: 20, fontSize: CustomFont.font12, color: Color.text2, opacity: 0.6 }}>Reach patients who provided their email and opted for it</Text>
							</View>
						</TouchableOpacity>
					</View>
				</Modal>
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
)(Messages);

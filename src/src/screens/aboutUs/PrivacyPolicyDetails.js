import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TouchableOpacity, BackHandler, ScrollView, Linking
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
							<Image source={arrowBack} style={{ marginLeft: responsiveWidth(3), width: responsiveFontSize(3.2), height: responsiveFontSize(3.2), padding: responsiveHeight(1), resizeMode: 'contain' }} />
						</TouchableOpacity>
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, marginLeft: responsiveWidth(4) }}>Privacy Policy</Text>
					</TouchableOpacity>

					<View style={{ flex: 1, backgroundColor: Color.patientBackground }}>

						<ScrollView>
							{/* <View style={{ margin: responsiveWidth(4), backgroundColor: Color.white, borderRadius: 10, padding: responsiveWidth(4) }}>
								{answerDetails && answerDetails.updatedOn ?
									<Text style={{ FontFamily: CustomFont.fontName, fontSize: CustomFont.font10, color: Color.mediumGrayTxt, marginTop: responsiveHeight(2) }}>{answerDetails.updatedOn}</Text>
									: null}
								 <Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(2) }}>{answerDetails.policyContent}</Text> 
								{answerDetails && answerDetails.policyContent ? <HTML source={{ html: answerDetails.policyContent }} /> :<Text style={{marginLeft:responsiveWidth(30),color:Color.fontColor}}>No data found</Text>}
								
							</View> */}
							<View style={{
								marginLeft: responsiveWidth(5),
								marginTop: responsiveHeight(3),
								paddingRight: responsiveWidth(10),
								paddingBottom: responsiveHeight(10)
							}}>
								<Text
									style={{
										fontSize: 24,
										color: '#292B2C',
										marginBottom: responsiveHeight(3),
										fontWeight: CustomFont.fontWeight400
									}}>
									Privacy Policy</Text>
								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginBottom: responsiveHeight(2),
									}}>1</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight600,
										color: '#292B2C',
										marginBottom: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
									    borderBottomWidth: 1.5 
									}}>VISION</Text>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>1.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										We, <Text style={{ fontWeight: 'bold' }}>Appify Infotech LLP</Text>
										, a limited liability partnership incorporated under the Limited Liability Partnership Act, 2008 and having its registered office at 208, Okhla Industrial Estate, Phase-III, New Delhi-110020 (herein-after referred to as <Text style={{ fontWeight: 'bold' }}>"We"</Text> or <Text style={{ fontWeight: 'bold' }}>"Us"</Text> or <Text style={{ fontWeight: 'bold' }}>"Our"</Text> or <Text style={{ fontWeight: 'bold' }}>"Company" </Text>) operating the website namely <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://DrOnAHealth.co.in')}>
											DrOnAHealth.co.in
										</Text> and application namely <Text>DrOnA Health</Text>, are committed to the protection of an individual's privacy and personal information (which identifies or may reasonably be used to identify the individual). It is equally important that We adhere to all data privacy and data protection laws like Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and Information Technology (Intermediaries Guidelines) Rules, 2011, as amended.
									</Text>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>2</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										marginBottom: responsiveHeight(2),
										borderBottomWidth: 1.5 
									}}>OBJECTIVES</Text>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>2.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										This document sets out the policy (herein-after the <Text style={{ fontWeight: 'bold' }}>"Privacy Policy") </Text>
										governing Your visit to Our website namely <Text style={{ color: 'blue', fontWeight: 'bold' }}
											onPress={() => Linking.openURL('https://DrOnAHealth.co.in')}>
											DrOnAHealth.co.in
										</Text> and/or Our application namely <Text style={{ fontWeight: 'bold' }}>DrOnA Health </Text> (herein-after referred to as <Text style={{ fontWeight: 'bold' }}>"Our Website/Application") </Text>
										and explains how the Company collects, possess, transfer, process, store, use and disclose Personal Information/Sensitive Personal Data or Information, as defined in the relevant statutory provisions, provided by You voluntarily and collected, whether via electronic devices (e.g. computer, mobile phone or other consumer electronic device or otherwise and disseminated by Us (herein-after referred to as <Text style={{ fontWeight: 'bold' }}>"Information").</Text>
									</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>2.2</Text>
									<Text style={CommonStyle.customFontStyle} >
										This Privacy Policy describes how Your privacy is respected & protected and applies to inter-alia all stakeholders viz. healthcare professionals, patients, employees, consultants, clients and all visitors to Our Website/Application (herein-after referred to as <Text style={{ fontWeight: 'bold' }}> "Person/s" </Text> or <Text style={{ fontWeight: 'bold' }}>"You" </Text> or <Text style={{ fontWeight: 'bold' }}>"You"). </Text>
										This Privacy Policy also sets the reasonable security practices and procedures adopted by the Company in handling this Information and the entities with whom the Information may be shared.
									</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>2.3</Text>
									<Text style={CommonStyle.customFontStyle} >
										By browsing Our Website/Application and/or providing Information in any other way, You understand and consent that We will collect, use, and disclose Information in accordance with the terms of this Privacy Policy. Please read this Privacy Policy carefully so that You understand Our privacy practices. Questions regarding privacy issues should be directed to Us at <Text style={{ color: 'blue', fontWeight: 'bold' }}
											onPress={() => Linking.openURL('https://DrOnAHealth.co.in')}>
											DrOnAHealth.co.in
										</Text>
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>3</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										borderBottomWidth: 1.5 
									}}>OPURPOSE OF INFORMATION COLLECTED</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>3.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										Information collected by Us, is inter-alia required for the purposes of maintaining Our Website/Application, providing customer support, to allow You to participate in interactive features of Our Website/Application when You choose to do so, to detect, prevent and address technical issues, to monitor the usage of Our Website/Application; selection, record retention, employee evaluation, or other legitimate business purposes for which the Information is reasonably expected to be used, like exploring a business relation/opportunity, identification of prospective vendor/client, feedback/newsletter/communication about Our activities, researching and developing new products and services, demographic survey and other studies, like studies to identify generic behavioral patterns.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>4</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}>NATURE OF INFORMATION COLLECTED</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>4.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										Information collected by Us is generally in the nature of:
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>4.1.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										Contact details, records of communication (whether audio or video) between You and Us.
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>4.1.2</Text>
									<Text style={CommonStyle.customFontStyle} >
										Identifying information including name, address, contact information and other personal information, demographic data including date of birth, gender, country of birth, language spoken at home etc., and may also include health record or other sensitive information, from/about You or other section of public who may be of a particular age, section, region, class and who are likely to join or participate in Our events and/or programs.
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>4.1.3</Text>
									<Text style={CommonStyle.customFontStyle} >
										Information required to conduct Our business activities or fulfilment of legal requirements etc.
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>4.1.4</Text>
									<Text style={CommonStyle.customFontStyle} >
										Cookies and Usage Data.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>5</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}>TYPE OF INFORMATION COLLECTED</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										<Text style={{ fontWeight: 'bold' }}>
											Information Voluntarily Provided: </Text>
										We collect and store Information that is voluntarily supplied to Us, when You respond to Our surveys. We collect all the information requested in the surveys, including any applicable contact information and demographic data such as name, race, age, gender, title, address, email, phone number, medical records and medical history, physical, psychological and mental health condition, payment information such as credit card information etc.
									</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2</Text>
									<Text style={CommonStyle.customFontStyle} >
										<Text style={{ fontWeight: 'bold' }}>
											Information Automatically Collected: </Text>
										We also may collect and store information that is generated automatically as You navigate through Our Website/Application. Our servers (which may be hosted/maintained by a third party service provider) may collect information from Your computer or device, and may include but not limit to:
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										The date and time of visit, web pages and content viewed and links clicked on while navigating within Our sites;
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2.2</Text>
									<Text style={CommonStyle.customFontStyle} >
										Information about the type of content accessed via Our sites or applications;
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2.3</Text>
									<Text style={CommonStyle.customFontStyle} >
										The site visited before and after visiting Our sites;
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2.4</Text>
									<Text style={CommonStyle.customFontStyle} >
										Internet Protocol (IP) address (a numerical address assigned to computer by internet service provider so that other computers connected to the internet can communicate online) that can sometimes be used to derive general geographic area;
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2.5</Text>
									<Text style={CommonStyle.customFontStyle} >
										Search terms entered using Our Website/Application;
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2.6</Text>
									<Text style={CommonStyle.customFontStyle} >
										Unique identifiers, including non-global mobile device identification numbers;
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2.7</Text>
									<Text style={CommonStyle.customFontStyle} >
										Information about computer device such as device type, screen size, browser type, language and other settings, memory capacity, plug-ins, internet domain, TCP configuration parameters, operating system, carrier code, time zone and the names, versions and package IDs of software installed on the device;
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2.8</Text>
									<Text style={CommonStyle.customFontStyle} >
										Information collected through cookies, pixel tags and other tracking technologies; and
									</Text>
								</View>
								<View style={{ marginLeft: responsiveWidth(7), flexDirection: 'row', marginTop: responsiveHeight(2) }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										lineHeight: 30,
									}}>5.2.9</Text>
									<Text style={CommonStyle.customFontStyle} >
										If access to location information is allowed by You and location services are enabled, we may collect location information.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>6</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}> TRANSFER OF DATA</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(7) }}>
									<Text style={CommonStyle.customFontStyle}>6.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										Your Information, may be transferred to - and maintained on - computers located outside Your state, country or other governmental jurisdiction where the data protection laws may differ from those of Your jurisdiction. If You are located outside India and choose to provide information to Us, please note that We transfer Your Information, to India and process it here. Your consent to this policy followed by your submission of such Information represents your agreement to that transfer. Appify Infotech LLP will take all the steps reasonably necessary to ensure that Your Information is treated securely and in accordance with this policy and no transfer of Your Information will take place to an organization or a country unless there are adequate controls in place.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>7</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}> HOW AND WHEN WE COLLECT INFORMATION</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(7) }}>
									<Text style={CommonStyle.customFontStyle}>7.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										It is Our usual practice to collect Information directly from You or Your authorised representative such as a guardian, parent or other responsible person, if You have consented for Us to collect the Information from them. We also collect Information at other points in Our Website/Application and application forms/declarations and from publicly available sources or other third parties like companies engaged in data management and analytics services authorised by You or otherwise legally permissible. Should You be contacted as a result of this, You will be given the opportunity to opt out of any future similar communication.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>8</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}> USE OF COOKIES</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(7) }}>
									<Text style={CommonStyle.customFontStyle}>8.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										Our Website/Application use cookies which are small text files placed on the computer to record Your visit to Our Website/Application. Cookies are used for analytical purposes and recording preferences which allows Us to promote certain advertisements on websites such as Facebook, Google or on third party websites. You may refuse the use of cookies by selecting the appropriate settings on Your browser. You can also opt out of Google's use of cookies by visiting Google's Ads Settings.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>9</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}>SHARING OF INFORMATION</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(7) }}>
									<Text style={{
										fontSize: CustomFont.font14,
										marginLeft: responsiveWidth(1),
										color: '#292B2C',
										fontWeight: CustomFont.fontWeight400,
										lineHeight: 30,
									}}>9.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										The Company may share Information with the following entities:
									</Text>
								</View>
								<View style={{
									marginLeft: responsiveWidth(15),
									flexDirection: 'row',
									marginTop: responsiveHeight(2),
								}}>
									<Text style={{
										fontSize: CustomFont.font14,
										color: '#292B2C',
										fontWeight: CustomFont.fontWeight400,
										lineHeight: 30,
									}}>9.1.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										Governmental Agency or Courts or Regulators as required under the applicable law;
									</Text>
								</View>
								<View style={{
									marginLeft: responsiveWidth(15),
									flexDirection: 'row',
									marginTop: responsiveHeight(2),
								}}>
									<Text style={{
										fontSize: CustomFont.font14,
										color: '#292B2C',
										fontWeight: CustomFont.fontWeight400,
										lineHeight: 30,
									}}>9.1.2</Text>
									<Text style={CommonStyle.customFontStyle} >
										Any agent, contractor, data processors or third party or service provider in connection with the Company's business;
									</Text>
								</View>
								<View style={{
									marginLeft: responsiveWidth(15),
									flexDirection: 'row',
									marginTop: responsiveHeight(2),
								}}>
									<Text style={{
										fontSize: CustomFont.font14,
										color: '#292B2C',
										fontWeight: CustomFont.fontWeight400,
										lineHeight: 30,

									}}>9.1.3</Text>
									<Text style={CommonStyle.customFontStyle} >
										Any other person under duty of confidentiality to the Company viz employees; and
									</Text>
								</View>
								<View style={{
									marginLeft: responsiveWidth(15),
									flexDirection: 'row',
									marginTop: responsiveHeight(2),
								}}>
									<Text style={{
										fontSize: CustomFont.font14,
										color: '#292B2C',
										fontWeight: CustomFont.fontWeight400,
										lineHeight: 30,

									}}>9.1.4</Text>
									<Text style={CommonStyle.customFontStyle} >
										Where we are required or authorised to do so by law.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>10</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}> OPENNESS AND DATA ACCESS</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(8) }}>
									<Text style={CommonStyle.customFontStyle}>10.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										You may inquire as to the nature of data stored or processed by the Company. You will be provided reasonable access to Your Information held by the Company. If any data is inaccurate or incomplete, You may request that the data be amended or modified or updated.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>11</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}> SECURITY MEASURES</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(8) }}>
									<Text style={CommonStyle.customFontStyle}>11.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										This Information is securely stored on Our IT network for the period defined by the applicable statutory provisions or as per Our policy, as the case may be and deleted after the end of this period. The Company, has adopted reasonable security practices and procedures within the Company for the security and protection of Information, in line with the internationally accepted standards which includes, technical, operational and physical security control measures.
									</Text>

									
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(8) }}>
								<Text style={CommonStyle.customFontStyle}>11.2</Text>
									<Text style={CommonStyle.customFontStyle}>
                                        We work to protect the security of Your Information during transmission by
                                        using Secure Sockets Layer (SSL) software, which encrypts Your Information , in
                                        addition to maintaining security of Your Information as per the international
                                        standards on "Information Technology Security Techniques”; “Information Security
                                        Management System-Requirements".</Text>
										
									</View>
									<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(8) }}>
									<Text style={CommonStyle.customFontStyle}>11.3</Text>
										<Text style={CommonStyle.customFontStyle}>
                                        We also frequently get our website/application audited by ISO Certified
                                        third party service providers to ensure application's transactions and the data
                                        it outputs are secure (from any hacking attempts or otherwise), accurate and
                                        valid on internationally recognized security frameworks such as OWASP and more”
                                    	</Text>
										</View>
								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>12</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}> GENERAL GUIDELINES</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(7) }}>
									<Text style={{
										fontSize: CustomFont.font14,
										marginLeft: responsiveWidth(1),
										color: '#292B2C',
										fontWeight: CustomFont.fontWeight400,
										lineHeight: 30,
									}}>12.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										The Company observe the following guidelines when using, receiving, possessing, processing, storing, dealing, disclosing, transferring or handling the Information:
									</Text>
								</View>
								<View style={{
									marginLeft: responsiveWidth(17),
									flexDirection: 'row',
									marginTop: responsiveHeight(2),
								}}>
									<Text style={{
										fontSize: CustomFont.font14,
										color: '#292B2C',
										fontWeight: CustomFont.fontWeight400,
										lineHeight: 30,

									}}>12.1.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										Information will be collected, received, possessed, used, processed, stored, transferred, dealt, handled and disclosed in compliance with applicable statutory provisions;
									</Text>
								</View>
								<View style={{
									marginLeft: responsiveWidth(17),
									flexDirection: 'row',
									marginTop: responsiveHeight(2),
								}}>
									<Text style={{
										fontSize: CustomFont.font14,
										color: '#292B2C',
										fontWeight: CustomFont.fontWeight400,
										lineHeight: 30,

									}}>12.1.2</Text>
									<Text style={CommonStyle.customFontStyle} >
										Information will be used for the purposes for which it has been collected or obtained; and
									</Text>
								</View>
								<View style={{
									marginLeft: responsiveWidth(17),
									flexDirection: 'row',
									marginTop: responsiveHeight(2),
								}}>
									<Text style={{
										fontSize: CustomFont.font14,
										color: '#292B2C',
										fontWeight: CustomFont.fontWeight400,
										lineHeight: 30,

									}}>12.1.3</Text>
									<Text style={CommonStyle.customFontStyle} >
										Appropriate reasonable measures will be taken to prevent unauthorized access, use, processing, and accidental loss, destruction or damage to such Information.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>13</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
									    borderBottomWidth: 1.5 
									}}>LINKS TO OTHER SITES</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(8) }}>
									<Text style={CommonStyle.customFontStyle}>13.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										Our Website/Application may contain links to other sites that are not operated by Us. If You click a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>14</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}> UPDATES</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(8) }}>
									<Text style={CommonStyle.customFontStyle}>14.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										The Company reserves the right to add, revise, amend, modify or delete any part of this Privacy Policy (in part or in full) at its discretion. The updated version of this Privacy Policy in force will be posted on the Our Website/Application from time to time. In the event of any change in the applicable law, this Privacy Policy shall be deemed to be amended or modified to the extent necessary to comply with such amendment or to meet any requirement under the applicable laws. You are advised to review this policy periodically for any changes
									</Text>
								</View>

								<View style={{ flexDirection: 'row' }}>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
									}}>15</Text>
									<Text style={{
										fontSize: CustomFont.font16,
										fontWeight: CustomFont.fontWeight400,
										color: '#292B2C',
										marginTop: responsiveHeight(2),
										marginLeft: responsiveWidth(4),
										 borderBottomWidth: 1.5 
									}}> OPTION TO OPT OUT OR GRIEVANCE REPORTING</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(8) }}>
									<Text style={CommonStyle.customFontStyle}>15.1</Text>
									<Text style={CommonStyle.customFontStyle} >
										Please note that to provide this Information is only a contractual obligation, You can always therefore, deny to provide Us with such information by choosing to opt out of the website or application and/or by withdrawal of Your candidature for employment/other business relation. You also have an option to withdraw the consent to use the Information by the Company. However, in case You chose to provide such information You shall be bound by this Privacy Policy.
									</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginLeft: responsiveWidth(8) }}>
									<Text style={CommonStyle.customFontStyle}>15.2</Text>
									<Text style={CommonStyle.customFontStyle} >
										Any questions, disputes, opt-out requests, grievances with respect to the processing of Information can be referred to the Company at <Text style={{ color: 'blue', fontWeight: 'bold' }}
												onPress={() => Linking.openURL('https://DrOnAHealth.co.in')}>
												DrOnAHealth.co.in
											</Text>
										
									</Text>
								</View>
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
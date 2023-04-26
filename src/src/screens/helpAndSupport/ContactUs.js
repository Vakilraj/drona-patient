import React, { useState } from 'react';
import {
	Linking,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Modal from 'react-native-modal';
import call_pink from '../../../assets/call_pink.png';
import mail_pink from '../../../assets/mail_pink.png';

import call from '../../../assets/call.png';

class CalendarModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false,
		};
	}

	callingOnNumber = () => {
		// const args = {
		// 	number: '9354013224', // String value with the number to call
		// 	prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
		//   }	
		Linking.openURL(`tel:${'+91'+DRONA.getCustomerCareNo()}`) 
		  //Communications.phonecall('+91'+DRONA.getCustomerCareNo(), true)
		  this.setState({ isModalVisible: false })  
	}

	render() {
		return (
			<View>
					<TouchableOpacity style={{position:'absolute', height: responsiveHeight(5.6), width: responsiveWidth(30), borderRadius: responsiveHeight(3), backgroundColor: Color.liveBg, justifyContent: 'center', alignItems: 'center', flexDirection: 'row',bottom:30,right:20 }}
					onPress={()=>this.setState({isModalVisible:true})}
					>
					<Image source={call} style={{ height: responsiveFontSize(1.8), width: responsiveFontSize(1.8), resizeMode: 'center' }} />
					<Text style={{ fontSize: CustomFont.font14, color: Color.white, marginLeft: responsiveWidth(2) }}>Contact Us</Text>
				</TouchableOpacity>

				<Modal isVisible={this.state.isModalVisible} avoidKeyboard={true}>
					<View style={styles.modelView}>
						<TouchableOpacity style={{ alignSelf: 'flex-end', }} onPress={() => this.setState({ isModalVisible: false })}>
							<Image style={{ height: 20, width: 20, marginRight: responsiveWidth(7), marginTop: responsiveHeight(2.6), resizeMode: 'contain' }} />
						</TouchableOpacity>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center',}}  onPress={() => this.callingOnNumber()}>
							<View style={styles.iconView}>
								<Image source={call_pink} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
							</View>
							<Text style={{ marginLeft:responsiveWidth(2), fontSize: CustomFont.font16, fontFamily: CustomFont.fontName, color: Color.fontColor }}>Call our support</Text>
						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }} onPress={() =>{
							 Linking.openURL('mailto:'+DRONA.getCustomerCareEmail()+'?subject=DrOnA Support Center&body=Hi Team,');
							 //Communications.email([DRONA.getCustomerCareEmail()],null,null,'DrOnA Support Center','Hi Team, ')
							this.setState({ isModalVisible: false });

						}}
						>
							<View style={styles.iconView}>
								<Image source={mail_pink} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
							</View>
							<Text style={{ marginLeft: responsiveWidth(2), fontSize: CustomFont.font16, fontFamily: CustomFont.fontName, color: Color.fontColor }} >Send us an email</Text>
						</TouchableOpacity>
					</View>
				</Modal>
			</View>
		);
	}

}
export default CalendarModal;

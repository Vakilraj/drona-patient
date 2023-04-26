import React, { useState } from 'react';
import { View,
	Text, Image, TouchableOpacity,Linking
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import Modal from 'react-native-modal';
import call_pink from '../../../assets/call_pink.png';
import mail_pink from '../../../assets/mail_pink.png';
import closeIcon from '../../../assets/cross.png';

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
		Linking.openURL(`tel:${'+91918585855656'}`)
		  this.setState({ isModalVisible: false })  
	}

	render() {
		return (
			<View>
				<TouchableOpacity style={[styles.restore,{flexDirection:'row'}]} onPress={()=>this.setState({isModalVisible:true})}>
					{/* <Image source={info} style={{height:responsiveFontSize(2),width:responsiveFontSize(2)}}/> */}
						<Text style={{ fontFamily: CustomFont.fontName, color: Color.primary, fontSize: CustomFont.font14,fontWeight:'bold', marginLeft:7 }}>Get Help</Text>
					</TouchableOpacity>

				<Modal isVisible={this.state.isModalVisible} avoidKeyboard={true} onRequestClose={() => this.setState({isModalVisible:false})}>
					<View style={styles.modelView}>
						<TouchableOpacity style={{ alignSelf: 'flex-end', }} onPress={() => this.setState({ isModalVisible: false })}>
							<Image style={styles.bsIcon} source={closeIcon} style={{ height: 20, width: 20, marginRight: responsiveWidth(7), marginTop: responsiveHeight(2.6), resizeMode: 'contain' }} />
						</TouchableOpacity>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center',}}  onPress={() => this.callingOnNumber()}>
							<View style={styles.iconView}>
								<Image source={call_pink} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain' }} />
							</View>
							<Text style={{ marginLeft:responsiveWidth(2), fontSize: CustomFont.font16, fontFamily: CustomFont.fontName, color: Color.fontColor }}>Call our support</Text>
						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }} onPress={() =>{
							 Communications.email(['help@dronahealth.co.in'],null,null,'DrOnA Support Center','Hi Team, ')
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

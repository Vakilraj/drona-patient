import React, { useState } from 'react';
import { View, Text, Keyboard, TouchableOpacity, Image, BackHandler, SafeAreaView, StatusBar, } from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import finishWebPage from '../../../assets/finishWebPage.png';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';

import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';
import steps2 from '../../../assets/steps2.png';
class FinishWebPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
			
		};
	}
	componentDidMount() {
		Keyboard.dismiss(0);
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			return true
		})
	}
	
	render() {
		let { actions, signupDetails } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
					<View style={{ flex: 1 }}>
						<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
						<View style={{ flex: 1, margin: responsiveWidth(4), }}>
							<View style={{ alignItems: 'flex-end', marginRight: responsiveWidth(1), marginTop: responsiveHeight(1) }}>
								<Image source={steps2} style={{ height: responsiveFontSize(3), width: responsiveFontSize(4), resizeMode: 'contain' }} />
							</View>

							<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />

							<Text style={styles.getstartedTxt}>Finish Your Webpage Setup </Text>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(3),lineHeight:responsiveHeight(3) }}>You are now a part of this exclusive community of <Text style={{fontFamily:CustomFont.fontNameBold}}>10,000+</Text> Doctors who manage their clinics with DrOnA Health</Text>
							<View style={{ flex: 1.5, alignItems: 'center' }}>
							<Image style={{ height: responsiveHeight(40), width: responsiveWidth(90), resizeMode: 'contain' }} source={finishWebPage} />
							</View>
							<TouchableOpacity style={[styles.becomeamember, {marginBottom:responsiveHeight(2)}]} onPress={() => this.props.navigation.navigate('ClinicSetupStep1', { from: this.props.navigation.getParam("from") ? this.props.navigation.getParam("from") : "signup" })}>
								<Text style={{ fontFamily: CustomFont.fontNameBold, color: Color.white, fontSize: CustomFont.font16 }}>Continue to Clinic Setup</Text>
							</TouchableOpacity>
							
							
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
)(FinishWebPage);
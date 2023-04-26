import AsyncStorage from 'react-native-encrypted-storage';
//import { GoogleSignin } from '@react-native-community/google-signin';
import React from 'react';
import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import tick from '../../../assets/tick.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import * as apiActions from '../../redux/actions/apiActions';
import * as signupActions from '../../redux/actions/signupActions';
import styles from './style';


const navigateAction = StackActions.reset({
	index: 0,
	actions: [NavigationActions.navigate({ routeName: 'GetStarted' })],
});


class AssistantPasswordChangeSuccess extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			passwordShowStatus: true,
			alertTxt: ''
		};
	}

	navigateToGetStarted = () => {
		this.signOutFromGoogle();
		this.props.navigation.dispatch(navigateAction);
	}

	signOutFromGoogle = async () => {
		try {
			await AsyncStorage.setItem('profile_complete', 'logout');
			// await GoogleSignin.revokeAccess();
			// await GoogleSignin.signOut();
		} catch (error) {
			console.error(error);
		}
	};
	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<View style={{ flex: 1, margin: responsiveWidth(6), alignItems: 'center' }}>
					<View style={{ height: responsiveFontSize(13), width: responsiveFontSize(13), borderRadius: responsiveFontSize(5), backgroundColor: '#97D396', alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(18), borderRadius: 50 }}>
						<Image source={tick} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), resizeMode: 'contain' }} />
					</View>
					<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font24, color: Color.fontColor, marginTop: responsiveHeight(12), textAlign: 'center' }}>Your password has been{'\n'}successfully changed</Text>
					<TouchableOpacity style={[styles.loginBtn1, { marginTop: responsiveHeight(10) }]} onPress={this.navigateToGetStarted}>
						<Text style={{ color: Color.white, fontWeight: CustomFont.fontWeight700, fontSize: CustomFont.font16 }}>Okay</Text>
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
)(AssistantPasswordChangeSuccess);

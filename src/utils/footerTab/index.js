import React, { Component } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';

import home from '../../../assets/hometab/home.png';
import home_done from '../../../assets/hometab/home_done.png';
import patient from '../../../assets/hometab/patient.png';
import patient_done from '../../../assets/hometab/patient_done.png';
import community from '../../../assets/hometab/community.png';
import community_done from '../../../assets/hometab/community_done.png';
import appoinment_done from '../../../assets/hometab/appoinment_done.png';
import appoinment from '../../../assets/hometab/appoinment.png';
import eCard from '../../../assets/hometab/ecard.png';
import eCard_done from '../../../assets/hometab/ecard_done.png';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
class footerIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: props.selected ? props.selected : 2,

		};
		
	}
	clickOnTab = (index) => {
		this.setState({ selectedIndex: index });
		this.props.ClickOnMeter(index);
		let { actions, signupDetails } = this.props;
						signupDetails.globalTabIndex = index;
						actions.setSignupDetails(signupDetails)
	}

	render() {
		let { signupDetails ,loading } = this.props;
		return (
			<View>
				{signupDetails.isAssistantUser ? <View style={{ flexDirection: 'row', marginTop: responsiveHeight(2.6), height: responsiveHeight(8), width: responsiveWidth(100) }}>
					<View style={{ flex: 1, borderTopStartRadius: responsiveHeight(1.5), backgroundColor: 'white' }}>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.clickOnTab(0)} disabled={loading}>
						<Image source={home} style={{width:responsiveWidth(5),height: responsiveWidth(5),resizeMode:'contain',tintColor:signupDetails.globalTabIndex == 0 ? Color.primary:Color.footerBtnColor}}/>
					<Text style={{ fontSize: CustomFont.font10, color: signupDetails.globalTabIndex == 0 ? Color.primary : Color.fontColor }}>Home</Text>
						</TouchableOpacity>
					</View>

					<View style={{ flex: 1, backgroundColor: 'white' }}>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.clickOnTab(1)} disabled={loading}>
						<Image source={appoinment} style={{width:responsiveWidth(5),height: responsiveWidth(5),resizeMode:'contain',tintColor:signupDetails.globalTabIndex == 1 ? Color.primary:Color.footerBtnColor}}/>
					<Text style={{ fontSize: CustomFont.font10, color: signupDetails.globalTabIndex == 1 ? Color.primary : Color.fontColor }}>Appointments</Text>
						</TouchableOpacity>

					</View>

					<View style={{ flex: 1, backgroundColor: 'white' }}>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.clickOnTab(2)} disabled={loading}>
						<Image source={patient} style={{width:responsiveWidth(6),height: responsiveWidth(6),resizeMode:'contain',tintColor:signupDetails.globalTabIndex == 2 ? Color.primary:Color.footerBtnColor}}/>
					<Text style={{ fontSize: CustomFont.font10, color: signupDetails.globalTabIndex == 2 ? Color.primary : Color.fontColor }}>Patients</Text>
						</TouchableOpacity>
					</View>

					
					<View style={{ flex: 1, borderTopEndRadius: responsiveHeight(1.5), backgroundColor: 'white' }}>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.clickOnTab(3)} disabled={loading}>
						<Image source={eCard} style={{width:responsiveWidth(6),height: responsiveWidth(6),resizeMode:'contain',tintColor:signupDetails.globalTabIndex == 3 ? Color.primary:Color.footerBtnColor}}/>
					<Text style={{ fontSize: CustomFont.font10, color: signupDetails.globalTabIndex == 3 ? Color.primary : Color.fontColor }}>E-Cards</Text>
						</TouchableOpacity>
					</View>
				</View> : 

				<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2.6), height: responsiveHeight(8), width: responsiveWidth(100) }}>
				<View style={{ flex: 1, borderTopStartRadius: responsiveHeight(1.5), backgroundColor: 'white' }}>
					<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.clickOnTab(0)} disabled={loading}>
					<Image source={ appoinment} style={{width:responsiveWidth(5),height: responsiveWidth(5),resizeMode:'contain',tintColor:signupDetails.globalTabIndex == 0 ? Color.primary:Color.footerBtnColor}}/>
				<Text style={{ fontSize: CustomFont.font10, color: signupDetails.globalTabIndex == 0 ? Color.primary : Color.fontColor }}>Appointments</Text>
					</TouchableOpacity>

				</View>
				<View style={{ flex: 1, borderTopEndRadius: responsiveHeight(3), backgroundColor: 'white' }}>
					<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.clickOnTab(1)} disabled={loading}>
					<Image source={ patient} style={{width:responsiveWidth(6),height: responsiveWidth(6),resizeMode:'contain',tintColor:signupDetails.globalTabIndex == 1 ? Color.primary:Color.footerBtnColor}}/>
				<Text style={{ fontSize: CustomFont.font10, color: signupDetails.globalTabIndex == 1 ? Color.primary : Color.fontColor }}>Patients</Text>
					</TouchableOpacity>
				</View>
				<View style={{ flex: 1, borderTopStartRadius: responsiveHeight(6), borderTopEndRadius: responsiveHeight(6), alignItems: 'center', justifyContent: 'center', backgroundColor: Color.white, height: responsiveHeight(8), width: responsiveHeight(10) }}>
					<View style={{
						flex: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.lightBackground, height: responsiveHeight(10), width: responsiveHeight(10),
						borderBottomEndRadius: responsiveHeight(6.5), borderBottomStartRadius: responsiveHeight(6.5)
					}}>
						<TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: signupDetails.globalTabIndex == 2 ? Color.primary:'white', width: responsiveHeight(8), marginRight: 2, height: responsiveHeight(8), borderRadius: responsiveHeight(4), marginBottom: responsiveHeight(2.5) }} onPress={() => this.clickOnTab(2)} disabled={loading}>
						<Image source={ home} style={{width:responsiveWidth(6),height: responsiveWidth(6),resizeMode:'contain',tintColor:signupDetails.globalTabIndex == 2 ? Color.white:Color.footerBtnColor}}/>
						</TouchableOpacity>
					</View>
					<View style={{
						flex: 1, backgroundColor: 'white',
					}}></View>
				</View>
				{signupDetails.isAssistantUser ? null:<View style={{ flex: 1, borderTopStartRadius: responsiveHeight(3), backgroundColor: 'white' }}>
					<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.clickOnTab(3)} disabled={loading}>
					<Image source={community} style={{width:responsiveWidth(6),height: responsiveWidth(6),resizeMode:'contain',tintColor:signupDetails.globalTabIndex == 3 ? Color.primary:Color.footerBtnColor}}/ >
				<Text style={{ fontSize: CustomFont.font10, color: signupDetails.globalTabIndex == 3 ? Color.primary : Color.fontColor }}>Medical News</Text>
					</TouchableOpacity>
				</View> }
				
				<View style={{ flex: 1, borderTopStartRadius: signupDetails.isAssistantUser ? responsiveHeight(3):0, borderTopEndRadius: responsiveHeight(1.5), backgroundColor: 'white' }}>
					<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.clickOnTab(4)} disabled={loading}>
					<Image source={ eCard} style={{width:responsiveWidth(6),height: responsiveWidth(6),resizeMode:'contain',tintColor:signupDetails.globalTabIndex == 4 ? Color.primary:Color.footerBtnColor}}/>
				<Text style={{ fontSize: CustomFont.font10, color: signupDetails.globalTabIndex == 4 ? Color.primary : Color.fontColor }}>E-Cards</Text>
					</TouchableOpacity>
				</View>
			</View> }
			</View>

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
)(footerIndex);
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import success_tick from '../../../assets/success_tick.png';
let isFirstTime = false;

class ClinicSetupMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	componentDidMount() {
		isFirstTime=this.props.navigation.state.params.from=='firstTime';
	}

	render() {
		let { actions, signupDetails } = this.props;
		return (
			<View style={{ flex: 1, backgroundColor: Color.white }}>
				<View style={{ flex: 5, alignItems: 'center' }}>
					<Image source={success_tick} style={{height:responsiveFontSize(15),width:responsiveFontSize(15),marginTop:responsiveHeight(20)}}/>
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font22, color: Color.fontColor, marginTop: responsiveHeight(7),textAlign:'center',fontWeight:'bold' }}>{isFirstTime?'Your account has been \n activated':'Your Clinic details has been \n saved.' }</Text>
					{isFirstTime ? <Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(2),textAlign:'center' }}>Create your own web page for your clinic {'\n'}
on DrOnA Health by completing the Clinic Setup</Text>:null}
					
				</View>
				<View style={{ flex: 1, alignItems: 'center'}}>
					{isFirstTime ? <TouchableOpacity style={{ height: responsiveHeight(5.8), width: responsiveWidth(80), alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: '#f0e6fc', }} 
				onPress={()=>{
						this.props.navigation.navigate('DoctorHome');
						//this.props.navigation.navigate('SetUpClinic', { from: 'AddFirst' });
						}}>
				<Text style={{ fontFamily: CustomFont.fontNameSemiBold, color: Color.primary, fontSize: CustomFont.font16 }}>Continue to Home</Text>
				</TouchableOpacity> :

				<TouchableOpacity style={{ height: responsiveHeight(5.8), width: responsiveWidth(80), alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: Color.primary, }} 
				onPress={()=>{
						this.props.navigation.navigate('SetUpClinic',{ tabActive: 0, from: 'first' });
						//this.props.navigation.navigate('SetUpClinic', { from: 'AddFirst' });
						}}>
				<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16 }}>Continue</Text>
				</TouchableOpacity>

					}
				
				</View>
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
)(ClinicSetupMessage);

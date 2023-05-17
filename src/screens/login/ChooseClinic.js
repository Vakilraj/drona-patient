import React from 'react';
import {
	SafeAreaView, View,
	Text, Image, TextInput, TouchableOpacity, FlatList, StatusBar, Platform, ScrollView,
} from 'react-native';
import styles from './style';
import CustomFont from '../../components/CustomFont';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toolbar from '../../customviews/Toolbar.js';


import Color from '../../components/Colors';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import app_icon from '../../../assets/app_icon.png';
import home_bg from '../../../assets/home_bg.png';
import clinic_image from '../../../assets/clinic_image.png';
import arrow_right_clinic from '../../../assets/arrow_right_clinic.png';
import AsyncStorage from 'react-native-encrypted-storage';
import edit_primary from '../../../assets/edit_primary.png';
import { NavigationEvents } from 'react-navigation';
let from = ''
class ChooseClinic extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showView:false,
			dataArray: [],
			doctorName: '',
		};
	}
	componentDidMount() {
		this.getClinicList()

	}

	componentWillUnmount() {
	}
	getClinicList = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": '',//signupDetails.doctorGuid
			"Version": "",
			"Data": {
				"FcmToken": ''
			}
		};
		actions.callLogin('V12/FuncForDrAppToGetMultiClinicDetailsInfo', 'post', params, signupDetails.accessToken, 'GetMultiClinicList');
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'GetMultiClinicList') {
				if (newProps.responseData.statusCode == 0) {
					let tmpArr = newProps.responseData.data && newProps.responseData.data.multiClinicDetailsInfo ? newProps.responseData.data.multiClinicDetailsInfo : [];
					if (tmpArr && tmpArr.length == 1) {
						let { actions, signupDetails } = this.props;
						signupDetails.clinicGuid = tmpArr[0].clinicGuid;
						signupDetails.clinicName = tmpArr[0].clinicName;
						actions.setSignupDetails(signupDetails);
						DRONA.setSelectedIndexClinic(0)
						this.props.navigation.navigate('DoctorHome');
					}
					else {
						this.setState({ dataArray: tmpArr,showView:true, doctorName:newProps.responseData.data.doctorName });

					}
				}
			}
		}

	}
	nameFormat = (item) => {
		let str = '';
		try {
			if (item.clinicName.includes(' ')) {
				let strArr = item.clinicName.trim().split('  ');
				if (strArr[1]) {
					str = strArr[0].substr(0, 1).toUpperCase() + strArr[1].substr(0, 1).toUpperCase()
				} else {
					str = strArr[0].substr(0, 2).toUpperCase();
				}
			} else {
				str = item.clinicName.substr(1, 2)
			}
		} catch (e) { }
		return str
	}
	renderList = ({ item, index }) => (
		<TouchableOpacity style={{ flexDirection: 'row', backgroundColor: Color.lightGrayBg, marginTop: responsiveHeight(1.6), borderRadius: 10 }} onPress={() => {
			let { actions, signupDetails } = this.props;
			signupDetails.clinicGuid = item.clinicGuid;
			signupDetails.clinicName = item.clinicName;
			actions.setSignupDetails(signupDetails);
			DRONA.setSelectedIndexClinic(index)
			AsyncStorage.setItem('clinicGuid', item.clinicGuid);
			this.props.navigation.navigate('DoctorHome');
		}}>
			<View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
			<View style={{width: responsiveWidth(10), height: responsiveWidth(10), borderRadius: responsiveWidth(6), backgroundColor: '#EEE8FB', justifyContent: 'center', alignItems: 'center'}} >
							{item.clinicImageUrl ?
								<Image style={{ width: responsiveWidth(11), height: responsiveWidth(11), borderRadius: responsiveWidth(6), justifyContent: 'center', alignItems: 'center' }} source={{ uri: item.clinicImageUrl }} /> :
								<Text style={{ fontSize: CustomFont.font14, color: Color.profileImageText, fontFamily: CustomFont.fontName, fontWeight: '400', justifyContent: 'center', alignItems: 'center' }}>{this.nameFormat(item)}</Text>}
						</View>
			</View>
			<View style={{ flex: 6, }}>
				<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.fontColor, marginTop: responsiveHeight(1.6), }}>{item.clinicName}</Text>
				<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'normal', fontSize: CustomFont.font12, color: Color.textItem, marginTop: responsiveHeight(1), }}>{item.clinicAddress}</Text>
				<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'normal', fontSize: CustomFont.font12, color: Color.textItem, marginTop: responsiveHeight(1), marginBottom: responsiveHeight(1.6) }}>Clinic No. : {item.clinicNumber}</Text>
			</View>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Image source={arrow_right_clinic} style={{ height: responsiveFontSize(2), width: responsiveFontSize(3), resizeMode: 'contain', marginRight: responsiveWidth(3) }} />
			</View>


		</TouchableOpacity>

	);
	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
				{/* <NavigationEvents onDidFocus={() => {
					from = this.props.navigation.state.params.from;
					this.setState({ fromNavigate: from })
				}} /> */}
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				{this.state.showView ? <View style={{ flex: 1 }}>
					<Image source={home_bg} style={{ height: responsiveFontSize(15), width: responsiveFontSize(15), position: 'absolute', top: 0, right: 0 }} />
					<View style={{ flex: 1, margin: responsiveWidth(4), marginTop: responsiveWidth(3) }}>
						<TouchableOpacity style={{ marginTop: responsiveHeight(3) }} onPress={()=>this.props.navigation.goBack()}>
							<Image source={app_icon} style={{ height: responsiveFontSize(5), width: responsiveFontSize(5) }} />
						</TouchableOpacity>

						<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font16, color: Color.fontColor, marginTop: responsiveHeight(2) }}>Hi Dr.{this.state.doctorName} please select your clinic</Text>
						{this.state.dataArray && this.state.dataArray.length>0 ? <FlatList
							style={{ marginTop: 10 }}
							data={this.state.dataArray}
							renderItem={this.renderList}
							extraData={this.state}
							keyExtractor={(item, index) => index.toString()}
						/>:null}
						
					</View>
				</View> :null}
				

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
)(ChooseClinic);
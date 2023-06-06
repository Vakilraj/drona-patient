import React from 'react';
import {
	SafeAreaView, View,
	Text, Image, TextInput, TouchableOpacity, FlatList, StatusBar, Platform, BackHandler,
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
import edit_primary from '../../../assets/edit_primary.png';
import inclinic_consult from '../../../assets/inclinic_consult.png';
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from 'react-native-encrypted-storage';
class ChooseClinicBeforeEdit extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dataArray: []
		};
		//DRONA.setIsReloadApi(true);
	}
	componentDidMount() {
		//this.getClinicList();
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.back())
	}
	back=()=>{
		try {
			DRONA.setIsReloadApi(this.state.dataArray.length!=DRONA.getClinicList().length);
		} catch (error) {
		}
		this.props.navigation.goBack()
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
		actions.callLogin('V12/FuncForDrAppToGetMultiClinicDetailsInfo', 'post', params, signupDetails.accessToken, 'GetMultiClinicDetailsInfoEdit');
	}
	componentWillUnmount() {
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'GetMultiClinicDetailsInfoEdit') {
				if (newProps.responseData.statusCode == 0) {
					let tmpArr = newProps.responseData.data && newProps.responseData.data.multiClinicDetailsInfo ? newProps.responseData.data.multiClinicDetailsInfo : [];
					
						this.setState({ dataArray: tmpArr });
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
		<TouchableOpacity style={{ flexDirection: 'row', backgroundColor: Color.white, marginTop: responsiveHeight(1.6), borderRadius: 10 }}  onPress={() => {
			// let { actions, signupDetails } = this.props;
			// signupDetails.clinicGuid = item.clinicGuid;
			// signupDetails.clinicName = item.clinicName;
			// actions.setSignupDetails(signupDetails);
			DRONA.setClinicGuid(item.clinicGuid);
			//DRONA.setSelectedIndexClinic(index)
			//AsyncStorage.setItem('clinicGuid', item.clinicGuid);
			this.props.navigation.navigate('SetUpClinic', { tabActive: 0, from: 'first', });
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
			<View style={{ flex:1.5, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
						<Image source={edit_primary} style={{ height: responsiveFontSize(1.8), width: responsiveFontSize(1.8), resizeMode: 'contain', marginRight: responsiveWidth(1) }} />
						<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.primary, marginRight: responsiveWidth(3) }}>Edit</Text>	
			</View>
		</TouchableOpacity>

	);
	render() {
		let { signupDetails } = this.props;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Color.statusBarNewColor }}>
				<NavigationEvents onDidFocus={() => {
					//if (DRONA.getIsReloadApi())
					this.getClinicList();
				}} />
				<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
				<Toolbar title={"Edit Clinic"} onBackPress={() =>this.back()} />
				<View style={{ flex: 1,margin: responsiveWidth(4) }}>
					{signupDetails.isAssistantUser ? null:<TouchableOpacity style={{backgroundColor:Color.white,borderRadius:5,alignItems:'center',flexDirection:'row' }} onPress={()=>this.props.navigation.navigate('ClinicSetupStep1', { from: 'add' })}>
					<Image source={inclinic_consult} style={{ height: responsiveFontSize(3.6), width: responsiveFontSize(3.6), resizeMode: 'contain', margin: responsiveWidth(2),tintColor:Color.primary }} />
						<Text style={{ fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14, color: Color.primary, }}>Add New Clinic</Text>
					</TouchableOpacity>}
					
					{this.state.dataArray && this.state.dataArray.length>0 ? <FlatList
							data={this.state.dataArray}
							renderItem={this.renderList}
							extraData={this.state}
							keyExtractor={(item, index) => index.toString()}
						/>:null}
						
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
)(ChooseClinicBeforeEdit);
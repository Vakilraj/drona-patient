import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text, Image, TouchableOpacity, StatusBar,BackHandler
} from 'react-native';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import arrowBack from '../../../assets/back_blue.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import BasicInfo from './BasicInfo'
import AdditionalInfo from './AdditionalInfo'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'
let basicInfoDetails = null;
import { NavigationActions, NavigationEvents, StackActions } from 'react-navigation';
class Patients extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dataArray: [],
			dateTab: [],
			isModalVisible: false,
			imageSource: null,
			resDataFromServer: null
		};
	}
	async componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
		//this.getBasicInfo();
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails } = this.props;
			if (tagname === 'getProfile') {
				if (newProps.responseData.statusCode == '0') {
					let data = newProps.responseData.data;
					this.setState({resDataFromServer:data});
					basicInfoDetails = data.basicInfo;
				}

			}
		}
	}
	getBasicInfo = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToGetDoctorProfile', 'post', params, signupDetails.accessToken, 'getProfile');
	}
	nameFormat = (fname, lname) => {
		let str = '';
		try {
			if (fname && lname) {
				str = fname.substr(0, 1).toUpperCase() + lname.substr(0, 1).toUpperCase();
			} else {
				str = fname.substr(0, 2).toUpperCase();
			}
		} catch (e) { }
		return str
	}
	render() {
		let { actions, signupDetails } = this.props;

		return (
			<SafeAreaView style={{ flex: 1, }}>
				<NavigationEvents onDidFocus={() => this.getBasicInfo()} />
				<View style={styles.container}>
					<StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />

					{/* <NavigationEvents onDidFocus={() => this.getAppoinmentedList()} /> */}
					<View style={{ flex: 1, }}>
						<View style={{ flexDirection: 'row', zIndex: 999, marginTop: 13, marginBottom: 13 }}>
							<TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => this.props.navigation.goBack()} >
								<Image source={arrowBack} style={{ width: responsiveHeight(3), height: responsiveHeight(3), marginLeft: responsiveWidth(3), marginTop: responsiveHeight(.8), marginBottom: responsiveWidth(2) }} />
							</TouchableOpacity>
							<TouchableOpacity style={{ flex: 1.5, justifyContent: "center", alignItems: 'center' }} onPress={() => this.props.navigation.navigate('EditBasicInfo', { item: basicInfoDetails })}>
								{signupDetails.profileImgUrl ? <View>
									<Image source={{ uri: signupDetails.profileImgUrl }} style={{ height: responsiveFontSize(4.5), width: responsiveFontSize(4.5), borderRadius: responsiveFontSize(2.75), }} />
								</View> :
									<View style={{ height: responsiveFontSize(5), width: responsiveFontSize(5), borderRadius: responsiveFontSize(2.5), borderColor: Color.lightGrayBg, borderWidth: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:Color.grayCircle }}>
									<Text style={{ fontSize: CustomFont.font14, color: Color.fontColor }}>{this.nameFormat(signupDetails.fname, signupDetails.lname)}</Text>
									</View>
								}
							</TouchableOpacity>
							<View style={{ flex: 5, }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeight700, color: Color.yrColor }}>Dr. {signupDetails.fname} {signupDetails.lname}</Text>
								<Text style={{ fontSize: CustomFont.font12, color: Color.datecolor, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, }}>{signupDetails.drSpeciality}</Text>
							</View>
						</View>
{this.state.resDataFromServer ? <ScrollableTabView

renderTabBar={() => (
	<ScrollableTabBar/>
)}
tabBarTextStyle={{fontSize:CustomFont.font16}}
tabBarInactiveTextColor={Color.optiontext}
tabBarActiveTextColor={Color.primary}
tabBarUnderlineStyle={{backgroundColor: Color.primary, width: responsiveWidth(10), borderRadius: 4,}}
initialPage={0}
>
<BasicInfo resDataFromServer = {this.state.resDataFromServer} tabLabel={'Basic Details'} nav={{ navigation: this.props.navigation }}  />
<AdditionalInfo resDataFromServer = {this.state.resDataFromServer} tabLabel={'Additional Info'} nav={{ navigation: this.props.navigation }} />
</ScrollableTabView> :<ScrollableTabView

renderTabBar={() => (
	<ScrollableTabBar/>
)}
tabBarTextStyle={{fontSize:CustomFont.font16}}
tabBarInactiveTextColor={Color.optiontext}
tabBarActiveTextColor={Color.primary}
tabBarUnderlineStyle={{backgroundColor: Color.primary, width: responsiveWidth(10), borderRadius: 4,}}
initialPage={0}
>
<BasicInfo resDataFromServer = {this.state.resDataFromServer} tabLabel={'Basic Details'} nav={{ navigation: this.props.navigation }} />
<AdditionalInfo resDataFromServer = {this.state.resDataFromServer} tabLabel={'Additional Info'} nav={{ navigation: this.props.navigation }} />
</ScrollableTabView>}
						


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
)(Patients);


// const mapStateToProps = state => ({
// 	signupDetails: state.signupReducerConfig.signupDetails,
// 	responseData: state.apiResponseDataConfig.responseData,
// 	loading: state.apiResponseDataConfig.loading,
// });

// const ActionCreators = Object.assign(
// 	{},
// 	apiActions, signupActions
// );
// const mapDispatchToProps = dispatch => ({
// 	actions: bindActionCreators(ActionCreators, dispatch),
// });

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps,
// )(Patients);

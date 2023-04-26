import React, { useState } from 'react';
import {
	SafeAreaView,View,
	Text,Image, TouchableOpacity, BackHandler } from 'react-native';
import arrowBack from '../../../../assets/back_blue.png';
import styles from './../style';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';

import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DropDownPicker from 'react-native-dropdown-picker';

class NewMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataContenTypeArr: [],
		};
	}
	async componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())

		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Data": {
				"ListOfFilter": [{ "Key": "ContentTypeGuid", "Value": null }]
			}
		}
		actions.callLogin('V1/FuncForDrAppToGetContentTypeList', 'post', params, signupDetails.accessToken, 'GetContentTypeList');
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'GetContentTypeList') {
				let data = newProps.responseData.data.contentTypeList;
				this.setState({ dataContenTypeArr: data.contentTypeList })

				if (data && data.length > 0) {
					let tempArr = [];
					for (let i = 0; i < data.length; i++) {
						tempArr.push({ label: data[i].contentTypeTitle, value: data[i].contentTypeGuid, 
							content: data[i].content })
					}
					this.setState({ dataContenTypeArr: tempArr });
				}
			}
		}
	}

	renderList = ({ item, index }) => (
		<TouchableOpacity onPress={() => { this.props.navigation.navigate('NewMessageForm', { item: item }) }} style={{ height: responsiveHeight(5), marginTop: responsiveHeight(1.6) }}>
			<Text style={{ fontFamily: CustomFont.fontName, textAlign: 'left', fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: responsiveHeight(1.6), }}>{item.contentTypeTitle}</Text>
		</TouchableOpacity>
	);

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={{ flex: 1, backgroundColor: Color.bgColor }}>
					<View style={{ flexDirection: 'row', backgroundColor: Color.white, paddingBottom: responsiveHeight(1.5) }}>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.goBack()}>
								<Image source={arrowBack} style={{ height: responsiveWidth(4.5), width: responsiveWidth(5), paddingTop: responsiveWidth(2) }} />
							</TouchableOpacity>
						</View>
						<TouchableOpacity style={{ flex: 7, flexDirection: 'row', alignItems: 'center', }}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.black, marginLeft: responsiveWidth(2), paddingTop: responsiveWidth(1),fontWeight:'700' }}>New Message</Text>
						</TouchableOpacity>
					</View>

					<View style={{ flex: 1, backgroundColor: Color.newBgColor }}>
						<View style={{ flex: 1, margin: responsiveWidth(4), backgroundColor: Color.white, borderRadius: responsiveWidth(1.5) }}>
							<View style={{ borderRadius: responsiveWidth(2), backgroundColor: Color.white, paddingBottom: responsiveHeight(5) }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.text2, marginLeft: responsiveWidth(4), marginTop: responsiveWidth(2), fontWeight: 'bold' }}>Broadcast Message</Text>
							</View>
							<Text style={{ marginBottom: responsiveWidth(2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textItem, marginLeft: responsiveWidth(4), }}>Content Type</Text>
							
							{this.state.dataContenTypeArr && this.state.dataContenTypeArr.length > 0 ?
								<DropDownPicker zIndex={10}
									items={this.state.dataContenTypeArr}
									containerStyle={{ borderRadius: responsiveWidth(2), height: responsiveHeight(7), marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4), }}
									style={{ backgroundColor: '#ffffff', color: Color.textGrey }}
									itemStyle={{
										justifyContent: 'flex-start'
									}}
									dropDownStyle={{ backgroundColor: '#ffffff', zIndex: 4 }}
									onChangeItem={item => {
										selectedContentTypeGuid = item.value;
										selectedContentType = item.label;
										this.props.navigation.navigate('NewMessageForm', { item: item })
									}}
									globalTextStyle={{color:Color.fontColor}}
									placeholder="Select Content Type"
									placeholderTextColor = {Color.placeHolderColor}
								/> : null}

						</View>
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
)(NewMessage);

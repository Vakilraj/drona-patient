import React from 'react';
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';

import Color from '../components/Colors';
import CustomFont from '../components/CustomFont';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as apiActions from '../redux/actions/apiActions';
import * as signupActions from '../redux/actions/signupActions';

import cross_new from '../../assets/cross_new1.png';
import three_dot from '../../assets/three_dot.png';



import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import Validator from './Validator';

let currentDate = '';
let item = null, selectedReson = '', prvLength = -1, sincePattern = '', selectedInputTxtLength = 5;
let sinceDataPatternArr = [{ label: '1 day', value: '1 day', isSelect: true }, { label: '1 week', value: '1 week', isSelect: false }, { label: '1 month', value: '1 month', isSelect: false }, { label: '1 year', value: '1 year', isSelect: true }]
class CustomModalOne extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible3Dots: false,
			noShowModel: false,
			cancelAppointmentModel: false,
			cancelAppointmentModelData: [{ itemValue: "Mild", select: false }, { itemValue: "Moderate", select: false }, { itemValue: "Severe", select: false }],
			ModelData: [{ itemValue: "Data One", select: false }, { itemValue: "Data Two", select: false }, { itemValue: "Data Three", select: false }],
			timePrefix: 'Today',
			isDuplicateItemOpened: false,
			sinceDropdownArr: sinceDataPatternArr,
			sinceText: '',
			showStateSince: true
		};
		sincePattern = ''
		item = props.item;
	}
	async componentDidMount() {

	}

	renderCancelModelItem = (item, index) => {
		return (
			<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }} onPress={() => {
				for (let i = 0; i < this.state.cancelAppointmentModelData.length; i++) {
					this.state.cancelAppointmentModelData[i].select = false;
				}
				this.state.cancelAppointmentModelData[index].select = true;
				selectedReson = this.state.cancelAppointmentModelData[index].itemValue;
				this.setState({ cancelAppointmentModelData: this.state.cancelAppointmentModelData })
			}}>
				<CheckBox
					disabled={false}
					value={item.select}
					onValueChange={(newValue) => {
						for (let i = 0; i < this.state.cancelAppointmentModelData.length; i++) {
							this.state.cancelAppointmentModelData[i].select = false;
						}
						this.state.cancelAppointmentModelData[index].select = true;
						selectedReson = this.state.cancelAppointmentModelData[index].itemValue;
						this.setState({ cancelAppointmentModelData: this.state.cancelAppointmentModelData })
					}}
					tintColors={{ true: Color.primary, false: Color.unselectedCheckBox }}
					style={{ height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), color: Color.mediumGrayTxt, marginLeft: 2 }}

				/>
				<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext, marginLeft: 10, fontWeight: CustomFont.fontWeight400, fontFamily: CustomFont.fontName, }}>{item.itemValue}</Text>
			</TouchableOpacity>
		)
	}

	async UNSAFE_componentWillReceiveProps(newProps) {

	}
	Refresh = (data) => {
		this.props.RefreshPatient(data);
	}

	dismissDialog = () => {
		this.setState({ showStateSince: false });
	}

	handleSinceData = (text) => {
		if (text && Validator.isMobileValidate(text)) {
			this.setState({ sinceText: text });
			sinceDataPatternArr[0].value = text == 1 ? text + ' day' : text + ' days'
			sinceDataPatternArr[0].label = text == 1 ? text + ' day' : text + ' days'
			sinceDataPatternArr[1].value = text == 1 ? text + ' week' : text + ' weeks'
			sinceDataPatternArr[1].label = text == 1 ? text + ' week' : text + ' weeks'
			sinceDataPatternArr[2].value = text == 1 ? text + ' month' : text + ' months'
			sinceDataPatternArr[2].label = text == 1 ? text + ' month' : text + ' months'
			sinceDataPatternArr[3].value = text == 1 ? text + ' year' : text + ' years'
			sinceDataPatternArr[3].label = text == 1 ? text + ' year' : text + ' years'
			this.setState({ sinceDropdownArr: sinceDataPatternArr, showStateSince: true })
		}
		this.setState({ sinceText: text });
		prvLength = text.length;
	}

	clickOnState = (item) => {
		sincePattern = item.value
		selectedInputTxtLength = sincePattern.length
		this.setState({ sinceText: item.label, showStateSince: false, CustomInput: true })
	}

	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<View onStartShouldSetResponder={() => this.dismissDialog()}>
				<TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(12), justifyContent: 'center', alignItems: 'center', marginTop: 7, marginBottom: 7 }}
					onPress={() => this.setState({ isModalVisible3Dots: true })}>
					<Image source={three_dot} style={{ height: responsiveHeight(4), width: responsiveHeight(4), resizeMode: 'contain' }} />
				</TouchableOpacity>
				<Modal isVisible={this.state.isModalVisible3Dots} avoidKeyboard={true}
					onRequestClose={() => this.setState({ isModalVisible3Dots: false })}>
					<View style={[styles.modelView3dots, { height: responsiveHeight(120) }]}>
						<ScrollView>
							<View style={{ marginBottom: responsiveHeight(32) }}>
								<View style={{ margin: responsiveWidth(5) }}>
									<View style={{ height: responsiveHeight(7), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
										<View >
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: CustomFont.fontWeight700, }}>Symptoms</Text>
										</View>
										<TouchableOpacity onPress={() => this.setState({ isModalVisible3Dots: false })}>
											<Image source={cross_new} style={{ tintColor: Color.primary, height: responsiveHeight(4), width: responsiveHeight(4), margin: 10, resizeMode: 'contain' }} />
										</TouchableOpacity>
									</View>


									<View>
										<Text style={{ color: Color.patientSearchName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '700', marginTop: 10 }}>
											Since</Text>
										<TextInput onBlur={this.callIsBlur2} onFocus={this.callIsFucused2} keyboardType={'phone-pad'} style={[styles.createInputStyle, { flex: 1, borderColor: this.state.InpborderColor2 }]} placeholder="one day" placeholderTextColor={Color.placeHolderColor} value={this.state.sinceText} maxLength={selectedInputTxtLength} onChangeText={(text) => this.handleSinceData(text)} ref='search' returnKeyType='done' />
										<View style={{ flex: 1 }}>
											{this.state.sinceText && this.state.sinceDropdownArr && this.state.sinceDropdownArr.length > 0 && this.state.showStateSince ?
												<View style={{
													borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderWidth: 1, borderLeftColor: Color.createInputBorder, borderRightColor: Color.createInputBorder,
													borderBottomColor: Color.createInputBorder, borderTopColor: Color.white, marginTop: responsiveHeight(-.8)
												}}><FlatList style={{ backgroundColor: '#fafafa' }}
													data={this.state.sinceDropdownArr}
													renderItem={({ item, index }) => (
														<TouchableOpacity style={{ height: responsiveHeight(7), justifyContent: 'flex-start' }}
															onPress={() => this.clickOnState(item)}>
															<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font16, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(3) }}>{item.value}</Text>
														</TouchableOpacity>
													)}
													keyExtractor={(item, index) => index.toString()}
													/>
												</View> : null}
										</View>
										<Text style={{ color: Color.patientSearchName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '700', marginTop: 15, }}>
											Severity
										</Text>
										<View style={{ marginBottom: responsiveHeight(5) }}>
											<FlatList
												data={this.state.cancelAppointmentModelData}
												renderItem={({ item, index }) => this.renderCancelModelItem(item, index)}
												keyExtractor={(item, index) => index.toString()}
											/>
										</View>
										<Text style={{ color: Color.patientSearchName, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: '700', marginBottom: 10 }}>
											Notes</Text>
										<TextInput returnKeyType="done" style={{ height: responsiveHeight(10), borderColor: Color.createInputBorder, borderWidth: 1.5, borderRadius: 5, backgroundColor: Color.white, fontSize: CustomFont.font14, color: Color.placeHolderColor, paddingLeft: 10, paddingRight: 10 }} multiline={true} placeholder="Enter Notes" placeholderTextColor={Color.placeHolderColor} ></TextInput>
										<View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(11), backgroundColor: Color.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
											<TouchableOpacity style={{ alignItems: 'center', marginBottom: responsiveHeight(2.5), justifyContent: 'center', borderRadius: 5, height: responsiveHeight(6), width: responsiveWidth(93), backgroundColor: '#5715D2', marginTop: 20 }} onPress={() => {
												console.log('Button Pressed')
											}}>
												<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Save</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						</ScrollView>
					</View>
				</Modal >
			</View >
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
)(CustomModalOne);

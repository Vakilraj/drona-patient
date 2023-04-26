import Moment from 'moment';
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
import down from '../../assets/down.png';
import three_dot from '../../assets/three_dot.png';

import cross_txt from '../../assets/cross_primary.png';


import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import { setLogEvent } from '../service/Analytics';

let currentDate = '';
let item = null, selectedReson = '';
class CustomModalTwo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisibleInstructionInvest: false,
			noShowModel: false,
			cancelAppointmentModel: false,
			cancelAppointmentModelData: [{ itemValue: "Mild", select: false }, { itemValue: "Moderate", select: false }, { itemValue: "Severe", select: false }],
			ModelData: [{ itemValue: "Data One", select: false }, { itemValue: "Data Two", select: false }, { itemValue: "Data Three", select: false }],
			timePrefix: 'Today',
			isDuplicateItemOpened: false,
		};
		item = props.item;
	}
	async componentDidMount() {

	}

	async UNSAFE_componentWillReceiveProps(newProps) {

	}
	Refresh = (data) => {
		this.props.RefreshPatient(data);
	}
	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<View>
				<TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(12), justifyContent: 'center', alignItems: 'center', marginTop: 7, marginBottom: 7 }}
					onPress={() => this.setState({ isModalVisibleInstructionInvest: true })}>
					<Image source={three_dot} style={{ height: responsiveHeight(4), width: responsiveHeight(4), resizeMode: 'contain' }} />
				</TouchableOpacity>
				<Modal isVisible={this.state.isModalVisibleInstructionInvest} avoidKeyboard={true}
					onRequestClose={() => this.setState({ isModalVisibleInstructionInvest: false })}>
					<View style={[styles.modelView3dots, { height: responsiveHeight(50) }]}>
						<ScrollView>
							<View style={{ marginBottom: responsiveHeight(32) }}>
								<View style={{ margin: responsiveWidth(5) }}>
									<View style={{ height: responsiveHeight(7), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
										<View >
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: CustomFont.fontWeight700, }}>CT Scan</Text>
										</View>
										<TouchableOpacity onPress={() => this.setState({ isModalVisibleInstructionInvest: false })}>
											<Image source={cross_new} style={{ tintColor: Color.primary, height: responsiveHeight(4), width: responsiveHeight(4), margin: 10, resizeMode: 'contain' }} />
										</TouchableOpacity>
									</View>


									<View>
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
				</Modal>
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
)(CustomModalTwo);

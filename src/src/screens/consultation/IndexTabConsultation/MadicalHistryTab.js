import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TouchableOpacity,
	FlatList, SectionList, ScrollView, BackHandler
} from 'react-native';
import styles from '../style';
import Moment from 'moment';
import * as signupActions from '../../../redux/actions/signupActions';
import * as apiActions from '../../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import arrowBack from '../../../../assets/back_blue.png';
import clockIcon from '../../../../assets/ic_past_encounter.png';
import rxIcon from '../../../../assets/rx.png'
import claIcon from '../../../../assets/ic_medical_histroy.png';
import upArrow from '../../../../assets/uparrow.png';
import downArrow from '../../../../assets/downarrow.png';
import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
var _ = require('lodash');
import Trace from '../../../service/Trace'
import ThreeDotsModal from '../ThreeDotsModal';
import { setLogEvent } from '../../../service/Analytics';
import needle from '../../../../assets/needle.png';
import ic_inclinic from '../../../../assets/ic_inclinic.png';
import vector_phone from '../../../../assets/vector_phone.png';

import Snackbar from 'react-native-snackbar';
import Edit from '../../../../assets/edit_primary.png';

let date = null, ifClickOnEdit = false, patientGuid = '', item = null;
class CN extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			medicalHistory: [{ type: 'Problems', ProblemsAndFamilyArr: [{conditionName:' Loading.. '}] },
			{ type: 'Family History', ProblemsAndFamilyArr: [{conditionName:' Loading.. '}] }],
			medicalHistoryDetalsArray: [],
			isMedicalHistryExpand: false,

		};

	}
	async componentDidMount() {
		if (this.props.responseDataIndexTab)
			this.setValueFromResponse(this.props.responseDataIndexTab)
	}
	setValueFromResponse = (data) => {
					let medicalHistArr = data.medicalHistoryInfoYearly;
					if (medicalHistArr && medicalHistArr.length > 0) {
						let tmpMediArr = []
						let tmpMediDetailsArr = []
						for (let i = 0; i < medicalHistArr.length; i++) {
							let jsonObj = {
								title: medicalHistArr[i].year,
								data: [
									{
										ProblemsArr: medicalHistArr[i].patientConditions,
										FamilyHistArr: medicalHistArr[i].familyHistoryCondition,
									}]
							}
							tmpMediDetailsArr.push(jsonObj);
							if (i == 0) {
								tmpMediArr = [{ type: 'Problems', ProblemsAndFamilyArr: medicalHistArr[i].patientConditions },
								{ type: 'Family History', ProblemsAndFamilyArr: medicalHistArr[i].familyHistoryCondition }]
							}
						}
						this.setState({ medicalHistoryDetalsArray: tmpMediDetailsArr, medicalHistory: tmpMediArr })
					} else {
						this.setState({
							medicalHistoryDetalsArray: [], medicalHistory: [{ type: 'Problems', ProblemsAndFamilyArr: [] },
							{ type: 'Family History', ProblemsAndFamilyArr: [] }]
						})
					}
	}
	
	expandMedicalHistory = (item, index, section) => {
		return (
			<View>
				<View style={{ marginTop: 10 }}>
					<Text style={{
						fontFamily: CustomFont.fontName,
						fontSize: CustomFont.font12, color: Color.textGrey
					}}>Problem</Text>
					<View style={{ flexWrap: 'wrap', flexDirection: 'row', marginLeft: -10, marginTop: responsiveHeight(0), marginBottom: responsiveHeight(1) }}>
						{item.ProblemsArr && item.ProblemsArr.length > 0 && item.ProblemsArr.map((innerItem) => (
							<View style={{
								marginLeft: 10, marginTop: 15, paddingTop: 8, paddingBottom: 8,
								paddingLeft: 20, paddingRight: 20, borderWidth: 1, borderColor: Color.lineColor, borderRadius: 12,
							}}>
								<Text style={{
									fontFamily: CustomFont.fontName,
									fontSize: CustomFont.font14, color: Color.black
								}}>{innerItem.conditionName}</Text>
							</View>
						))}
					</View>

				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textGrey }}>Family History</Text>
					<View style={{ flexWrap: 'wrap', flexDirection: 'row', marginLeft: -10, marginTop: responsiveHeight(0), marginBottom: responsiveHeight(1) }}>
						{item.FamilyHistArr && item.FamilyHistArr.length > 0 && item.FamilyHistArr.map((innerItem) => (
							<View style={{
								marginLeft: 10, marginTop: 15, paddingTop: 8, paddingBottom: 8,
								paddingLeft: 20, paddingRight: 20, borderWidth: 1, borderColor: Color.lineColor, borderRadius: 12,
							}}>
								<Text style={{
									fontFamily: CustomFont.fontName,
									fontSize: CustomFont.font14, color: Color.black
								}}>{innerItem.conditionName}</Text>
							</View>
						))}
					</View>

				</View>
			</View>
		);
	}

	medicalHistoryExpandPress = () => {
		this.setState({ isMedicalHistryExpand: !this.state.isMedicalHistryExpand })
	}

	render() {
		return (
			<View style={{ flex: 1,margin:responsiveWidth(3),backgroundColor:Color.white,borderRadius:10 }}>
						
						<View style={styles.cardHeaderView}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image style={{
									height: responsiveHeight(5),
									width: responsiveHeight(5), resizeMode: 'contain',
								}} source={claIcon} />
								<Text style={{color:Color.fontColor,marginLeft: responsiveWidth(5), fontFamily: CustomFont.fontName,
									fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeightBold
								}}>Medical History</Text>
								{this.state.medicalHistoryDetalsArray.length > 0 && this.state.medicalHistory.length > 0 ? <TouchableOpacity onPress={() => this.medicalHistoryExpandPress()} style={{
									marginLeft: responsiveWidth(28), height: responsiveHeight(5),
									alignItems: 'center', justifyContent: 'center',
									width: responsiveHeight(5)
								}}>
									<Image style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', }}
										source={this.state.isMedicalHistryExpand ? upArrow : downArrow} />
								</TouchableOpacity> : null}

							</View>

							{
							this.state.isMedicalHistryExpand ? <View style={{marginTop:responsiveHeight(2)}}>
								<SectionList
									stickySectionHeadersEnabled={false}
									sections={this.state.medicalHistoryDetalsArray}
									renderItem={({ item, index, section }) => this.expandMedicalHistory(item, index, section)}
									renderSectionHeader={({ section }) => <Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: 'bold', marginBottom: 6, marginTop: 6 }}>{section.title}</Text>}
									keyExtractor={(item, index) => index} />
							</View> : <View style={{marginTop:responsiveHeight(2)}}>
								{this.state.medicalHistory && this.state.medicalHistory.length > 0 ? <FlatList style={{}}
									data={this.state.medicalHistory}
									nestedScrollEnabled={true}
									renderItem={({ item, index }) => (
										<View style={{}}>
											<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.textGrey, marginTop: index > 0 ? 20 : 0 }}>{item.type}</Text>
											{item.ProblemsAndFamilyArr && item.ProblemsAndFamilyArr.length > 0 ? <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginLeft: -10, marginTop: responsiveHeight(0), marginBottom: responsiveHeight(1) }}>
												{item.ProblemsAndFamilyArr && item.ProblemsAndFamilyArr.length > 0 && item.ProblemsAndFamilyArr.map((innerItem) => (
													<View style={{
														marginLeft: 10, marginTop: 15, paddingTop: 8, paddingBottom: 8,
														paddingLeft: 20, paddingRight: 20, borderWidth: 1, borderColor: Color.lineColor, borderRadius: 12,
													}}>
														<Text style={{
															fontFamily: CustomFont.fontName,
															fontSize: CustomFont.font14, color: Color.black
														}}>{innerItem.conditionName}</Text>
													</View>
												))}
											</View> :
												<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.black, marginTop: 10 }}>{item.type == 'Problems' ? 'Problems not found' : 'Family history not found'}</Text>
											}


										</View>
									)}
									keyExtractor={(item, index) => index.toString()}
								/> : <Text style={{ fontSize: CustomFont.font16, color: Color.primary, marginLeft: responsiveWidth(10), marginTop: responsiveHeight(5) }}>Medical history not found</Text>}

							</View>
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
)(CN);
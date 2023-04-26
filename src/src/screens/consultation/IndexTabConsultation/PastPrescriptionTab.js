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
			prescriptionArr: [],
			pastEncounterDetailsArr: [],
			isPrescriptionExpand: false,

		};

	}
	async componentDidMount() {
		if (this.props.responseDataIndexTab)
			this.setValueFromResponse(this.props.responseDataIndexTab)
	}
	setValueFromResponse = (data) => {
		let tempArr = data.prescriptionInfoYearly;
					let tmpPrescArr = []
					let prescDetailsArr = []
					if (tempArr && tempArr.length > 0) {
						for (let i = 0; i < tempArr.length; i++) {

							let jsonObj = {
								title: tempArr[i].prescriptionDetails && tempArr[i].prescriptionDetails.length > 0 ? tempArr[i].prescriptionYear : '',
								data: tempArr[i].prescriptionDetails
							}

							prescDetailsArr.push(jsonObj);
							try {
								if (tempArr[i].prescriptionDetails && tempArr[i].prescriptionDetails.length > 0) {
									for (let j = 0; j < tempArr[i].prescriptionDetails.length; j++) {
										if (tmpPrescArr.length < 3)
											tmpPrescArr.push(tempArr[i].prescriptionDetails[j])
									}
								}
							} catch (error) {

							}
						}
						this.setState({ pastEncounterDetailsArr: prescDetailsArr, prescriptionArr: tmpPrescArr,showDynamicMsg:'' })
					} else {
						this.setState({ pastEncounterDetailsArr: [], prescriptionArr: [],showDynamicMsg:'Past prescription not found' })
					}
	}
	pickSingleItem = (item) => {
		this.props.nav.navigation.navigate("PastEncountersDetail", { data: item, from: 'Vitals', item: this.props.item})
	}

	renderItemExpand = (item, index, section) => {
		return (
			<View>
				{
					index == 0 ? <FlatList showsHorizontalScrollIndicator={false} style={{ marginLeft: responsiveWidth(-2), marginBottom: responsiveHeight(2.5) }}
						data={section.data}
						//horizontal={true}
						numColumns={3}
						renderItem={({ item, indexInner }) => (

							<TouchableOpacity style={{
								padding: 7, alignItems: 'center', height: responsiveHeight(18),
								width: responsiveWidth(26.4), marginLeft: indexInner == 0 ? 0 : responsiveWidth(2), marginTop: responsiveWidth(4),
								borderColor: Color.lineColor, borderWidth: 1, borderRadius: 5
							}}
								onPress={() => this.pickSingleItem(item)}>
								<View style={{ flex: 1.2 }}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font14,fontWeight:CustomFont.fontWeight600 }}>{Moment(item.prescriptionDate).format('DD MMM ‘YY')}</Text>
								</View>
								<View style={{ flex: 5 }}>
									<Image style={{
										marginTop: responsiveHeight(-2), height: responsiveHeight(15),
										width: responsiveWidth(8), resizeMode: 'contain',marginBottom:10
									}} source={rxIcon} />
								</View>
								<View style={{ flex: 1, justifyContent: 'center' }}>
									<Text numberOfLines={2} style={{
										fontFamily: CustomFont.fontName,
										color: Color.textGrey, fontSize: CustomFont.font12, textAlign: 'center',fontWeight:CustomFont.fontWeight600
									}}>{item.appointmentType}</Text>
								</View>
							</TouchableOpacity>
						)}
						keyExtractor={(item, index) => index.toString()}
					/> : null
				}

			</View>
		);
	}
	prescriptionExpandPress = () => {
		this.setState({ isPrescriptionExpand: !this.state.isPrescriptionExpand })

	}

	render() {
		return (<View style={{ flex: 1,margin:responsiveWidth(3),backgroundColor:Color.white,borderRadius:10 }}>
						<View style={styles.cardHeaderView}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image style={{
									height: responsiveHeight(5),
									width: responsiveHeight(5), resizeMode: 'contain',
								}} source={clockIcon} />
								<Text style={{color:Color.fontColor,marginLeft: responsiveWidth(5), fontFamily: CustomFont.fontName,
									fontSize: CustomFont.font16, fontWeight: CustomFont.fontWeightBold
								}}>Past Prescriptions</Text>
								{this.state.pastEncounterDetailsArr.length > 0 || this.state.prescriptionArr.length > 0 ? <TouchableOpacity onPress={() => this.prescriptionExpandPress()} style={{
									marginLeft: responsiveWidth(23), height: responsiveHeight(5),
									alignItems: 'center', justifyContent: 'center',
									width: responsiveHeight(5)
								}}>
									<Image style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', }}
										source={this.state.isPrescriptionExpand ? upArrow : downArrow} />
								</TouchableOpacity> : null}

							</View>
							{
							!this.state.isPrescriptionExpand ?
							<View style={{ flexDirection: 'row',marginTop:responsiveHeight(2) }}>
										{this.state.prescriptionArr && this.state.prescriptionArr.length > 0 ? <FlatList style={{}}
											data={this.state.prescriptionArr}
											horizontal={true}
											renderItem={({ item, index }) => (
												<TouchableOpacity style={{
													padding: 7, alignItems: 'center', height: responsiveHeight(18),
													width: responsiveWidth(26.4), marginLeft: index == 0 ? 0 : responsiveWidth(2),
													borderColor: Color.lineColor, borderWidth: 1, borderRadius: 5
												}}
													onPress={() => this.pickSingleItem(item)}>
													<View style={{ flex: 1.2 }}>
														<Text style={{ fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font14,fontWeight:CustomFont.fontWeight600 }}>{Moment(item.prescriptionDate).format('DD MMM ‘YY')}</Text>
													</View>
													<View style={{ flex: 5 }}>
														<Image style={{
															marginTop: responsiveHeight(-2), height: responsiveHeight(15),
															width: responsiveWidth(8), resizeMode: 'contain'
														}} source={rxIcon} />
													</View>
													<View style={{ flex: 1, justifyContent: 'center',marginBottom:10 }}>
														<Text numberOfLines={2} style={{
															fontFamily: CustomFont.fontName,
															color: Color.textGrey, fontSize: CustomFont.font12, textAlign: 'center',fontWeight:CustomFont.fontWeight600
														}}>{item.appointmentType}</Text>
													</View>
												</TouchableOpacity>
											)}
											keyExtractor={(item, index) => index.toString()}
										/> : <Text style={{ fontSize: CustomFont.font16, color: Color.primary, marginLeft: responsiveWidth(10), marginTop: responsiveHeight(5) }}>{this.state.showDynamicMsg}</Text>}

									</View> : <View style={{marginTop:responsiveHeight(2)}}>
									<SectionList
										showsVerticalScrollIndicator={false}
										stickySectionHeadersEnabled={false}
										sections={this.state.pastEncounterDetailsArr}
										renderItem={({ item, index, section }) => this.renderItemExpand(item, index, section)}
										renderSectionHeader={({ section }) => <Text style={{ fontSize: CustomFont.font14, color: Color.fontColor, fontWeight: 'bold', marginBottom: 6, marginTop: 6 }}>{section.title}</Text>}
										keyExtractor={(item, index) => index} />
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
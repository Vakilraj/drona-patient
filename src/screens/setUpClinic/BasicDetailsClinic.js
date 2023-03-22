import React, { useState } from 'react';
import {
	View,
	Text, Image, TextInput, TouchableOpacity,  ScrollView, FlatList, Platform
} from 'react-native';
import styles from './style';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Moment from 'moment';
var _ = require('lodash');
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import EditBlue from '../../../assets/edit_new_blue.png';
import empty_clinic from '../../../assets/empty_clinic.png';
import { NavigationEvents } from 'react-navigation';

let weekdayArr = [];
let inClinicGuid = '', virtualGuid = '';
let consultationFeeInc = '', followUpFeeInc = '', followUpValidForInc = '0', isVirtualInclinicFeeSame = true;
let consultationFeeVir = '', followUpFeeVir = '', followUpValidForVir = '0', slotLengthFromArray = '';


let isDateSorted = 0;

class BasicDetailsClinic extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			clinicList: DRONA.getClinicList(),
			dorctoList: [],
			dataConsultantObjClinic: null,
			dataConsultantObjVirtual: null,
			dateTimeArrClinic: [],
			dateTimeArrVirtual: [],
			clinicName: '',
			clinicAddress: '',
			clinicNumber: '',
			clinicProfilePic: '',
			bankDetails: null,
			upiDetails: null,
			consultationType: [],

			dataArray: [],
			slotLength: '',
			showInclinicFeesCard: false,
			showVirtualFeesCard: false,

			consultationFeeInc:'',
			followUpFeeInc:'',
			followUpValidForInc:'',

			consultationFeeVir:'',
			followUpFeeVir:'',
			followUpValidForVir:'',
		};
		weekdayArr = [];
		counter = -1;
		DRONA.setIsDrTimingsUpdated(true);
	}
	componentDidMount() {
		isDateSorted = 0;

		//this.getClinicData();
	}

	sortDate = (days) =>{
		let finalDateStr='';
		let tempDateArr = [];
		// if(isDateSorted == 0){
		// isDateSorted = 1;
		if(days.includes(', ')){
        let daysArr = days.split(', ')
		if(daysArr.includes('Mon')){
			 tempDateArr.push('Mon')
		}
		if(daysArr.includes('Tue')){
			 tempDateArr.push('Tue')
		}
		if(daysArr.includes('Wed')){
			 tempDateArr.push('Wed')
		}
		if(daysArr.includes('Thu')){
			 tempDateArr.push('Thu')
		}
		if(daysArr.includes('Fri')){
			 tempDateArr.push('Fri')
		}if(daysArr.includes('Sat')){
			 tempDateArr.push('Sat')
		}
		if(daysArr.includes('Sun')){
           tempDateArr.push('Sun')
		}
		for(let j = 0 ; j < tempDateArr.length ; j++){
			  if(j == tempDateArr.length -1){
                  finalDateStr = finalDateStr + tempDateArr[j];
			  }
			  else{
                finalDateStr = finalDateStr + tempDateArr[j] + ', ';
			  }
			}
		} else{
			finalDateStr=days;
		}
		return finalDateStr; 
	}

	getDays = (tmpArr) => {
		let str = '';
		// let tmp = [{ doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Mon', isOpen: false },
		// { doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Tue', isOpen: false },
		// { doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Wed', isOpen: false },
		// { doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Thu', isOpen: false },
		// { doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Fri', isOpen: false },
		// { doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Sat', isOpen: false },
		// { doctorScheduleGuid: "", dayEnumGuid: "", groupNo: 0, checkInTime: "", checkOutTime: "", dayEnum: 'Sun', isOpen: false },]
		if (tmpArr && tmpArr.length > 0) {

			for (let i = 0; i < tmpArr.length; i++) {
				if (i == 0)
					str = tmpArr[i].dayEnum;
				else
					str += ', ' + tmpArr[i].dayEnum;
				// if (tmpArr[i].dayEnum == 'Mon' || tmpArr[i].dayEnum == 'MON') {
				// 	tmp[0].isOpen = true;
				// } else if (tmpArr[i].dayEnum == 'Tue') {
				// 	tmp[1].isOpen = true;
				// } else if (tmpArr[i].dayEnum == 'Wed') {
				// 	tmp[2].isOpen = true;
				// } else if (tmpArr[i].dayEnum == 'Thu') {
				// 	tmp[3].isOpen = true;
				// } else if (tmpArr[i].dayEnum == 'Fri') {
				// 	tmp[4].isOpen = true;
				// } else if (tmpArr[i].dayEnum == 'Sat') {
				// 	tmp[5].isOpen = true;
				// } else if (tmpArr[i].dayEnum == 'Sun') {
				// 	tmp[6].isOpen = true;
				// }
				// if (!weekdayArr.includes(tmpArr[i].dayEnum)) {
				// 	weekdayArr.push(tmpArr[i].dayEnum)
				// }
			}
		}
		return str;
	}
	getTimeSlots = (tempSession, tmpObj, checkInOutTime) => {
		let timeSlotGroupNo = tmpObj.timeSlotGroupNo;

		if (tempSession && tempSession.length > 0) {
			var check_orders = tempSession.filter(order => (order.timeSlotGroupNumber == timeSlotGroupNo));
			if (check_orders && check_orders.length == 0) {
				tempSession.push({
					"timeSlotGroupNumber": timeSlotGroupNo,
					"daySlots": checkInOutTime,
					"consultationType":
						[{ timeSlotGuid: "", consultationTypeGuid: inClinicGuid, startDate: null, endDate: "", "label": "In-Clinic", "isOpen": false, "isDisabled": false },
						{ timeSlotGuid: "", consultationTypeGuid: virtualGuid, startDate: null, endDate: "", "label": "Virtual", "isOpen": false, "isDisabled": false }
						]
				})
			}
		} else {
			tempSession.push({
				"timeSlotGroupNumber": timeSlotGroupNo,
				"daySlots": checkInOutTime,
				"consultationType":
					[{ timeSlotGuid: "", consultationTypeGuid: inClinicGuid, startDate: null, endDate: "", "label": "In-Clinic", "isOpen": false, "isDisabled": false },
					{ timeSlotGuid: "", consultationTypeGuid: virtualGuid, startDate: null, endDate: "", "label": "Virtual", "isOpen": false, "isDisabled": false }
					]
			})
		}
		try {
			if (tmpObj.consultationTypeGuid == inClinicGuid) {
				tempSession[timeSlotGroupNo - 1].consultationType[0].isOpen = true;
				tempSession[timeSlotGroupNo - 1].consultationType[0].timeSlotGuid = tmpObj.timeSlotGuid;
				tempSession[timeSlotGroupNo - 1].consultationType[0].consultationTypeGuid = tmpObj.consultationTypeGuid;
			} else {
				tempSession[timeSlotGroupNo - 1].consultationType[1].isOpen = true;
				tempSession[timeSlotGroupNo - 1].consultationType[1].timeSlotGuid = tmpObj.timeSlotGuid;
				tempSession[timeSlotGroupNo - 1].consultationType[1].consultationTypeGuid = tmpObj.consultationTypeGuid;
			}
		} catch (e) { }


		return tempSession;
	}
	async UNSAFE_componentWillReceiveProps(newProps) {

		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'getDrTimings' && newProps.responseData.statusCode == '0') {
				DRONA.setIsDrTimingsUpdated(false);
				consultationFeeInc = ''; followUpFeeInc = ''; followUpValidForInc = '0'; isVirtualInclinicFeeSame = true;
consultationFeeVir = ''; followUpFeeVir = ''; followUpValidForVir = '0'; slotLengthFromArray = '';
				let data = newProps.responseData.data;
				if (data) {
					try {
						let consultationTypes = data.consultationTypes;
						if (consultationTypes[0].consultationTypeName == 'In Clinic') {
							inClinicGuid = consultationTypes[0].consultationTypeGuid;
						}
						if (consultationTypes[1].consultationTypeName == 'Virtual') {
							virtualGuid = consultationTypes[1].consultationTypeGuid;
						}
						isVirtualInclinicFeeSame = data.isVirtualInclinicFeeSame;
						let tempArr = [];
						let consultationTimeslots = data.consultationTimeslots; //null; //
						if (consultationTimeslots && consultationTimeslots.length > 0) {
							consultationTimeslots = _.orderBy(consultationTimeslots, ['timeSlotGroupNo'], 
							['asc']);
							let obj0 = null
							let obj1 = null
							let obj2 = null
							let obj3 = null
							let obj4 = null
							let obj5 = null
							let obj6 = null

							let session0 = [];
							let session1 = [];
							let session2 = [];
							let session3 = [];
							let session4 = [];
							let session5 = [];
							let session6 = [];
							for (let i = 0; i < consultationTimeslots.length; i++) {

								let groupNo = consultationTimeslots[i].doctorSchedules[0].groupNo;
								let checkInOutTime = { checkInTime: consultationTimeslots[i].doctorSchedules[0].checkInTime, checkOutTime: consultationTimeslots[i].doctorSchedules[0].checkOutTime }
								if (groupNo == 0) {
									if (!obj0)
									obj0 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session0 = this.getTimeSlots(session0, consultationTimeslots[i], checkInOutTime);
								}else if (groupNo == 1) {
									if (!obj1)
										obj1 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session1 = this.getTimeSlots(session1, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 2) {
									if (!obj2)
										obj2 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session2 = this.getTimeSlots(session2, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 3) {
									if (!obj3)
										obj3 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session3 = this.getTimeSlots(session3, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 4) {
									if (!obj4)
										obj4 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session4 = this.getTimeSlots(session4, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 5) {
									if (!obj5)
										obj5 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session5 = this.getTimeSlots(session5, consultationTimeslots[i], checkInOutTime);
								} else if (groupNo == 6) {
									if (!obj6)
										obj6 = this.getDays(consultationTimeslots[i].doctorSchedules);
									session6 = this.getTimeSlots(session6, consultationTimeslots[i], checkInOutTime);
								}

								try {
									if (!consultationFeeInc) {
										if (consultationTimeslots[i].consultationTypeGuid == inClinicGuid) {
											consultationFeeInc = consultationTimeslots[i].consultationFee;
											followUpFeeInc = consultationTimeslots[i].followUpFee;
											followUpValidForInc = consultationTimeslots[i].followUpValidFor;
										}
									}
									if (!consultationFeeVir) {
										if (consultationTimeslots[i].consultationTypeGuid == virtualGuid) {
											consultationFeeVir = consultationTimeslots[i].consultationFee;
											followUpFeeVir = consultationTimeslots[i].followUpFee;
											followUpValidForVir = consultationTimeslots[i].followUpValidFor;
										}
									}

									if (!slotLengthFromArray) {
										slotLengthFromArray = consultationTimeslots[i].slotDuration;
									}

								} catch (e) { }
							}

							if (obj0)
								tempArr.push({ doctorSchedules: obj0, session: session0 });
							if (obj1)
								tempArr.push({ doctorSchedules: obj1, session: session1 });
							if (obj2)
								tempArr.push({ doctorSchedules: obj2, session: session2 });
							if (obj3)
								tempArr.push({ doctorSchedules: obj3, session: session3 });
							if (obj4)
								tempArr.push({ doctorSchedules: obj4, session: session4 });
							if (obj5)
								tempArr.push({ doctorSchedules: obj5, session: session5 });
							if (obj6)
								tempArr.push({ doctorSchedules: obj6, session: session6 });
							this.setState({ dataArray: tempArr, slotLength: slotLengthFromArray });

							
							//console.log('-------after parse' + JSON.stringify(tempArr));
						} else {
							this.setState({ dataArray: [] });

						}


					} catch (e) { }

					if (consultationFeeInc) {
						this.setState({ showInclinicFeesCard: true,consultationFeeInc:consultationFeeInc,followUpFeeInc:followUpFeeInc,followUpValidForInc:followUpValidForInc })
					}
					if (consultationFeeVir) {
						this.setState({ showVirtualFeesCard: true,consultationFeeVir:consultationFeeVir,followUpFeeVir:followUpFeeVir,followUpValidForVir:followUpValidForVir })
					}

				}








				// try {
				// 	if (data && data.consultationTypeData && data.consultationTypeData.length > 0) {
				// 		consultationTypeGuidInClinic = data && data.consultationTypeData && data.consultationTypeData[0].consultationTypeGuid
				// 		consultationTypeGuidVirtual = data && data.consultationTypeData && data.consultationTypeData[1].consultationTypeGuid
				// 	}

				// } catch (error) {

				// }
				// if (data.consultationType && data.consultationType.length > 0) {
				// 	try {
				// 		this.setState({ consultationType: data.consultationType });
				// 	} catch (e) {
				// 	}
				// } else {
				// 	this.setState({ consultationType: [] });
				// }

			}
		}

	}
	getScheduleArr = (dtmArr) => {
		let tmArr = [];
		try {
			// let dataConsult = data.consultationType[0];
			// let dtmArr = dataConsult.doctorTimings && dataConsult.doctorTimings.doctorSchedule ? dataConsult.doctorTimings.doctorSchedule : [];


			if (dtmArr && dtmArr.length > 0) {
				for (let i = 0; i < dtmArr.length; i++) {
					let str = '';
					let dayslot = dtmArr[i].daySlots;
					for (let j = 0; j < dayslot.length; j++) {
						//str += this.getDateFormat(dayslot[j].checkInTime) + ' - ' + this.getDateFormat(dayslot[j].checkOutTime) + ', ';
						str += dayslot[j].checkInTime + '   to   ' + dayslot[j].checkOutTime + ', ';
					}

					tmArr.push({ dayName: dtmArr[i].dayEnum, time: str.replace(/,\s*$/, "") });
				}
				//this.setState({ dataConsultantObjClinic: dataConsult, dateTimeArrClinic: tmArr });
			}

		} catch (e) {

		}
		return tmArr;
	}
	getDateFormat = (val) => {
		let str = '';
		if (val.includes(':')) {
			let strArr = val.split(':')
			str = strArr[0] + '.' + strArr[1];
			str = Moment(str, ["HH.mm"]).format("hh:mm A");
		} else {
			str = val;
		}

		return str;
	}
	renderListForDateTime = ({ item, index }) => (
		<View style={{ flexDirection: 'row', margin: responsiveWidth(3), alignItems: 'center' }}>
			{/* <Image source={time} style={{ height: responsiveWidth(4), height: responsiveWidth(4), resizeMode: 'contain', marginTop: 3 }} /> */}
			<View style={{ flex: 1 }}>
				<Text style={{ fontSize: CustomFont.font14,color:Color.fontColor }}>{item.dayName}</Text>
			</View>
			<View style={{ flex: 2.6 }}>
				<Text style={{ fontSize: CustomFont.font14, fontWeight: '600', color:Color.fontColor }}>{item.time}</Text>
			</View>

		</View>
	);
	getScheduleDate = (val) => {
		let str = '';
		if (val) {
			str = Moment(val.startDate).format('DD MMM YY') + ' to ' + Moment(val.endDate).format('DD MMM YY');
		}
		return str;
	}
	renderListSession = ({ item, index }) => (
		<View style={{ marginTop: responsiveHeight(2.5), }}>
			<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext }}>{index == 0 ? 'Morning Session' : index == 1 ? 'Evening Session' : 'Another Session'}</Text>
			<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 10 }}>{item.daySlots.checkInTime + '    to   ' + item.daySlots.checkOutTime}</Text>
			<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext, marginTop: 10 }}>{item.consultationType[0].isOpen && item.consultationType[1].isOpen ? '(Virtual & In-Clinic)' : item.consultationType[0].isOpen ? 'In-Clinic' : 'Virtual'}</Text>


		</View>

	);
	renderList = ({ item, index }) => {
		let { signupDetails } = this.props;
		return (
			<View>
				<View style={{ margin: responsiveWidth(3) }}>
					{index == 0 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
						<Text style={{ fontFamily: CustomFont.fontNameBold, fontWeight: '700', fontSize: CustomFont.font14, color: Color.fontColor }}>Consultation Timings</Text>
						{signupDetails.isAssistantUser && !signupDetails.isAllowClinicDetailsAssistant ? null :
							<View style={{ alignItems: 'flex-end', flex: 1.5 }}>
								<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
									this.props.nav.navigation.navigate('ClinicSetupStep2', { from: 'edit' });
								}}>
									<Image source={EditBlue} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', margin: 7 }} />
									<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.primary }}>Edit</Text>
								</TouchableOpacity>
							</View>}
					</View> : null}
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 10 }}>Days</Text>
					{/* <Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 5 }}>{item.doctorSchedules}</Text> */}
					<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 5 }}>{this.sortDate(item.doctorSchedules)}</Text>
					<FlatList
						data={item.session}
						renderItem={this.renderListSession}
						extraData={this.state}
						keyExtractor={(item, index) => index.toString()}
						style={{ marginBottom: 15 }}
					/>
					{index == this.state.dataArray.length - 1 ? <View>
						<Text style={{ fontFamily: CustomFont.fontNameBold, fontWeight: '700', fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 10 }}>Slot Length</Text>
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 15 }}>Slot Length</Text>
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 10, marginBottom: 10 }}>{this.state.slotLength} minutes</Text>
					</View> : null

					}


				</View>




			</View>
		)
	};
	getClinicData = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": DRONA.getClinicGuid(),
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToGetDoctorConsultationTimings', 'post', params, signupDetails.accessToken, 'getDrTimings');
	}
	renderSeparator = () => {
		return <View style={{ height: 1, width: '90%', backgroundColor: Color.dividerDrawer, marginLeft: responsiveWidth(5) }} />;
	};
	render() {
		let { signupDetails } = this.props;
		//alert(signupDetails.isAssistantUser && !signupDetails.isAllowClinicDetailsAssistant)
		// let { actions, signupDetails, loading } = this.props;
		// let { dataConsultantObjClinic } = this.state;
		// let { dataConsultantObjVirtual } = this.state;
		//alert(signupDetails.isAssistantUser)
		return (
			<View style={{ flex: 1, backgroundColor: Color.newBgColor,minHeight:Platform.OS=='android'? responsiveHeight(74): responsiveHeight(70)}}>
				<NavigationEvents onDidFocus={() =>{
					if(DRONA.getIsDrTimingsUpdated())
					this.getClinicData();

				} } />
				<ScrollView>
					<View style={{ flex: 1,minHeight:responsiveHeight(90) }}>

						{this.state.dataArray && this.state.dataArray.length > 0 ? <View>
							<FlatList
								data={this.state.dataArray}
								showsVerticalScrollIndicator={false}
								renderItem={this.renderList}
								extraData={this.state}
								ItemSeparatorComponent={this.renderSeparator}
								keyExtractor={(item, index) => index.toString()}
								style={{ marginBottom: 10, margin: responsiveWidth(3), borderRadius: 6, backgroundColor: Color.white }}
							/>



							<View style={{ margin: responsiveWidth(3), borderRadius: 6, backgroundColor: Color.white }}>
								<View style={{ margin: responsiveWidth(3) }}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
										<Text style={{ fontFamily: CustomFont.fontNameBold, fontWeight: '700', fontSize: CustomFont.font14, color: Color.fontColor }}>Fees</Text>
										{signupDetails.isAssistantUser && !signupDetails.isAllowClinicDetailsAssistant ? null :
										<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
											this.props.nav.navigation.navigate('ClinicSetupStep2', { from: 'editFees' });
										}}>
											<Image source={EditBlue} style={{ height: responsiveFontSize(2), width: responsiveFontSize(2), resizeMode: 'contain', margin: 7 }} />
									<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.primary }}>Edit</Text>
										</TouchableOpacity>}
									</View>
									{this.state.showInclinicFeesCard ? <View>
										<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 10 }}>In-Clinic Consultation</Text>

										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 15 }}>Consultation Fees</Text>
										<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7 }}>₹ {this.state.consultationFeeInc}</Text>

										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 10 }}>Follow-Up Fees</Text>
										<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7 }}>₹ {this.state.followUpFeeInc}</Text>

										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 10 }}>Follow-Up Days</Text>
										<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, marginBottom: 10 }}>{this.state.followUpValidForInc} days</Text>
									</View> : null}

									{this.state.showVirtualFeesCard ? <View>
										<View style={{ height: 1, width: '90%', backgroundColor: Color.dividerDrawer, marginLeft: responsiveWidth(5),marginTop:10,marginBottom:10 }} />
										<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 15 }}>Virtual Consultation</Text>

										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 15 }}>Consultation Fees</Text>
										<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7 }}>₹ {this.state.consultationFeeVir}</Text>

										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 10 }}>Follow-Up Fees</Text>
										<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7 }}>₹ {this.state.followUpFeeVir}</Text>

										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 10 }}>Follow-Up Days</Text>
										<Text style={{ fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, color: Color.fontColor, marginTop: 7, marginBottom: 10 }}>{this.state.followUpValidForVir} days</Text>
									</View> : null}


								</View>

							</View>
						</View> :
							<View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
								<Image source={empty_clinic} style={{ height: responsiveFontSize(30), width: responsiveFontSize(30), resizeMode: 'contain', marginTop: responsiveHeight(3) }} />
								{signupDetails.isAssistantUser && !signupDetails.isAllowClinicDetailsAssistant ? null :
									<TouchableOpacity style={{ height: responsiveHeight(6), width: responsiveWidth(40), justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, borderRadius: 5 }}
										onPress={() => {
											this.props.nav.navigation.navigate('ClinicSetupStep2', { from: 'editFees' });
										}}>
										<Text style={{ color: Color.white, fontSize: CustomFont.font14 }}>Add New Timings</Text>
									</TouchableOpacity>}
							</View>}


					</View>
				</ScrollView>
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
)(BasicDetailsClinic);

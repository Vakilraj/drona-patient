import React, { useState } from 'react';
import {
	View,
	Text, Image, TouchableOpacity, ScrollView
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';
import Moment from 'moment';
import _ from 'lodash';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import plus_new from '../../../assets/plus_new.png';
import edit_new from '../../../assets/edit_primary.png';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import { CalendarList } from 'react-native-calendars';
import Trace from '../../service/Trace'

let availableDateArr = [], diffDays = 0, unAvailableObj = {};
let selectedDay = '', followUpArr = [];
class FollowUpModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisibleFollowUp: false,
			selectedDateArr: {},
			dateForfullCalendar: '',
			followUpDate: '',
			followUpGuid: null,
			maxDateOnCalendar: null,
			selectedIndex: -1,

		};
	}

	async componentDidMount() {
		selectedDay = Moment(new Date()).format('YYYY-MM-DD');
		let data = this.props.nav;
		if (data.followUpDate) {
			//this.setState({ followUpDate: Moment(data.followUpDate).format('DD MMM YYYY') });
			if(data.followUpDate == "0001-01-01T00:00:00")
			{
				this.setState({ followUpDate: '' });
			}
			else
			{
				this.setState({ followUpDate: Moment(data.followUpDate).format('DD MMM YYYY') });
			}
		}
	}
	setDataAndCalculate = () => {
		let data = this.props.nav;
		if (data.followUpDate) {
			//this.setState({ followUpDate: Moment(data.followUpDate).format('DD MMM YYYY') });
			let dateArr = data.dayStatus ? data.dayStatus :[];
			//let dateArr = [{"day":"Sun","status":true},{"day":"Mon","status":false},{"day":"Tue","status":true},{"day":"Wed","status":false},{"day":"Thu","status":true},{"day":"Fri","status":true},{"day":"Sat","status":true}];
			let maxDate = '';
			availableDateArr = [];
			if (dateArr.length > 0) {
				followUpArr = dateArr;
				let dateObject = {};
				for (let i = 0; i < 90; i++) {
					var today = new Date()
					var priorDate = today.setDate(today.getDate() + i + 1)
					let increaseDate = Moment(priorDate).format('YYYY-MM-DD');
					var weekDayName = Moment(increaseDate).format('ddd');
					if (weekDayName == 'Sun') {
						let dayObj = _.find(dateArr, { day: weekDayName })
						if(!dayObj.status)
						dateObject[increaseDate] = { disabled: true, disableTouchEvent: true };
						else{
							if (!availableDateArr.includes(increaseDate)) {
								availableDateArr.push(increaseDate);
							}
						}
					} else if (weekDayName == 'Mon') {
						let dayObj = _.find(dateArr, { day: weekDayName })
						if(!dayObj.status)
						dateObject[increaseDate] = { disabled: true, disableTouchEvent: true };
						else{
							if (!availableDateArr.includes(increaseDate)) {
								availableDateArr.push(increaseDate);
							}
						}
					} else if (weekDayName == 'Tue') {
						let dayObj = _.find(dateArr, { day: weekDayName })
						if(!dayObj.status)
						dateObject[increaseDate] = { disabled: true, disableTouchEvent: true };
						else{
							if (!availableDateArr.includes(increaseDate)) {
								availableDateArr.push(increaseDate);
							}
						}
					} else if (weekDayName == 'Wed') {
						let dayObj = _.find(dateArr, { day: weekDayName })
						if(!dayObj.status)
						dateObject[increaseDate] = { disabled: true, disableTouchEvent: true };
						else{
							if (!availableDateArr.includes(increaseDate)) {
								availableDateArr.push(increaseDate);
							}
						}
					} else if (weekDayName == 'Thu') {
						let dayObj = _.find(dateArr, { day: weekDayName })
						if(!dayObj.status)
						dateObject[increaseDate] = { disabled: true, disableTouchEvent: true };
						else{
							if (!availableDateArr.includes(increaseDate)) {
								availableDateArr.push(increaseDate);
							}
						}
					} else if (weekDayName == 'Fri') {
						let dayObj = _.find(dateArr, { day: weekDayName })
						if(!dayObj.status)
						dateObject[increaseDate] = { disabled: true, disableTouchEvent: true };
						else{
							if (!availableDateArr.includes(increaseDate)) {
								availableDateArr.push(increaseDate);
							}
						}
					} else if (weekDayName == 'Sat') {
						let dayObj = _.find(dateArr, { day: weekDayName })
						if(!dayObj.status)
						dateObject[increaseDate] = { disabled: true, disableTouchEvent: true };
						else{
							if (!availableDateArr.includes(increaseDate)) {
								availableDateArr.push(increaseDate);
							}
						}
					}

					if (i == 89)
						maxDate = Moment(priorDate).format('YYYY-MM-DD');
				}
				unAvailableObj = dateObject;
				this.setState({ selectedDateArr: dateObject });
				this.setState({ maxDateOnCalendar: maxDate });

			}else{
				for (let i = 0; i < 90; i++) {
					var today = new Date()
					var priorDate = today.setDate(today.getDate() + i + 1)
					let increaseDate = Moment(priorDate).format('YYYY-MM-DD');
					if (!availableDateArr.includes(increaseDate)) {
						availableDateArr.push(increaseDate);
					}
				}
			}
			
			this.setState({ dateForfullCalendar: Moment(new Date()).format('DD MMM') })
		}


		if (data && data.followUpGuid) {
			this.setState({ followUpGuid: data.followUpGuid })
		}
		setTimeout(() => {
			this.setState({ isModalVisibleFollowUp: true })
		}, 500)

	}
	clickOnDone = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Data": {
				"AppointmentGuid": signupDetails.appoinmentGuid,
				"FollowUpDate": selectedDay, "FollowUpGuid": null, "FollowUpDescription": "Demo"
			}
		}
		actions.callLogin('V1/FuncForDrAppToAddFollowUp', 'post', params, signupDetails.accessToken, 'AddFollowUp');
		setTimeout(() => {
			this.setState({ isModalVisibleFollowUp: false });
		}, 1000)
		Trace.stopTrace();
	}
	timeSetOnCalendar = (day) => {
		//if (availableDateArr.length > day) {
		selectedDay = availableDateArr[day];
		let tempobj = { ...unAvailableObj }
		tempobj[selectedDay] = { selected: true };
		this.setState({ selectedDateArr: tempobj })
		this.setState({ dateForfullCalendar: Moment(selectedDay).format('DD MMM') })
		// } else {
		// 	Snackbar.show({ text: 'Date not available', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		// }
		this.setState({ selectedIndex: day })
	}
	getUnAvailableDate = () => {
		let data = this.props.nav;
		if (data.availableDateList && data.availableDateList.length > 0) {
			//let lastDate=data.availableDateList[]
		}
	}
	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			if (tagname === 'AddFollowUp') {
				if (newProps.responseData.statusCode == 0) {
					//Snackbar.show({ text: 'Follow-up date submit successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					this.setState({ followUpDate: Moment(selectedDay).format('DD MMM YYYY'), followUpGuid: true })
				} else {
					//Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			}
		}
	}

	render() {
		let { actions, signupDetails, loading } = this.props;
		return (
			<View>
				<TouchableOpacity onPress={() => {
					selectedDay = Moment(new Date()).format('YYYY-MM-DD');
					let timeRange = Trace.getTimeRange();
					Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType +"Followup",  signupDetails.firebaseLocation);
					Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Followup", {'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.drSpeciality })

					this.setDataAndCalculate();

				}} style={{ backgroundColor: Color.white, marginTop: responsiveHeight(1.5), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: 10, marginBottom: responsiveHeight(2) }}>

					<View style={{ margin: responsiveWidth(5) }}>

						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<Text style={{ fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight700, color: Color.yrColor, fontFamily: CustomFont.fontName }}>Followup</Text>

							{signupDetails.isAssistantUser ? null : <Image source={this.state.followUpDate ? edit_new : plus_new} style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5), margin: 5, resizeMode: 'contain' }} />}

						</View>
						{this.state.followUpDate ? <Text style={{ fontSize: CustomFont.font14, color: Color.fontColor,fontFamily: CustomFont.fontName }}>{this.state.followUpDate}</Text> : null}

					</View>
				</TouchableOpacity>

				<Modal isVisible={this.state.isModalVisibleFollowUp}
					onRequestClose={() => this.setState({ isModalVisibleFollowUp: false })} >
					<View style={{ backgroundColor: Color.white, borderRadius: 7, alignSelf: 'center', width:responsiveWidth(95)}}>
						<ScrollView>
							<View style={{ flex: 1, flexDirection: 'column' }}>
								<View style={{ width: '100%', backgroundColor: Color.primaryBlue, borderTopLeftRadius: 7, borderTopRightRadius: 7, }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, color: Color.white, marginTop: 10, marginLeft: 15, marginBottom: 10 }}>{this.state.dateForfullCalendar}</Text>
								</View>
								<View style={{ width: '100%', backgroundColor: Color.white, }}>
									<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2), marginLeft: 7, marginRight: 7 }}>
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
										<TouchableOpacity style={[styles.modalTopDay, { backgroundColor: this.state.selectedIndex == 0 ? Color.accountTypeSelBg : Color.white, borderColor: this.state.selectedIndex == 0 ? Color.liveBg : Color.lightBlueBorder }]} onPress={() => this.timeSetOnCalendar(0)}>
												<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, }}>1 day</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalTopDay, { backgroundColor: this.state.selectedIndex == 1 ? Color.accountTypeSelBg : Color.white, borderColor: this.state.selectedIndex == 1 ? Color.liveBg : Color.lightBlueBorder }]} onPress={() => this.timeSetOnCalendar(1)}>
												<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, }}>2 days</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalTopDay, { backgroundColor: this.state.selectedIndex == 2 ? Color.accountTypeSelBg : Color.white, borderColor: this.state.selectedIndex == 2 ? Color.liveBg : Color.lightBlueBorder }]} onPress={() => this.timeSetOnCalendar(2)}>
												<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, }}>3 days</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalTopDay, { backgroundColor: this.state.selectedIndex == 4 ? Color.accountTypeSelBg : Color.white, borderColor: this.state.selectedIndex == 4 ? Color.liveBg : Color.lightBlueBorder }]} onPress={() => this.timeSetOnCalendar(4)}>
												<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, }}>5 days</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalTopDay, { backgroundColor: this.state.selectedIndex == 6 ? Color.accountTypeSelBg : Color.white, borderColor: this.state.selectedIndex == 6 ? Color.liveBg : Color.lightBlueBorder }]} onPress={() => this.timeSetOnCalendar(6)}>
												<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, }}>1 week</Text>
											</TouchableOpacity>
										</ScrollView>
									</View>
								</View>



								<View style={{ width: '100%', flexDirection: 'row', marginTop: 7, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1, marginLeft: responsiveWidth(3) }}>Sun</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Mon</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Tue</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Wed</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Thu</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Fri</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Sat</Text>
								</View>
								<CalendarList
									// Callback which gets executed when visible months change in scroll view. Default = undefined
									minDate={new Date()}
									maxDate={this.state.maxDateOnCalendar}
									onVisibleMonthsChange={(months) => { }}
									// Max amount of months allowed to scroll to the past. Default = 50
									pastScrollRange={0}
									// Max amount of months allowed to scroll to the future. Default = 50
									futureScrollRange={2}
									// Enable or disable scrolling of calendar list
									scrollEnabled={true}
									// Enable or disable vertical scroll indicator. Default = false
									showScrollIndicator={false}
									hideDayNames={true}
									monthFormat={'MMM yyyy'}
									//markingType={'period'}
									headerStyle={{ color: Color.red }}
									yearTitleStyle={{ color: Color.red }}
									theme={{
										monthTextColor: Color.fontColor,
										arrowColor: '#165c96',
										todayTextColor: '#33a8e2',
										selectedDayTextColor: 'white',
										selectedDayBackgroundColor: '#FF6197',
									}}
									markedDates={this.state.selectedDateArr}

									onDayPress={day => {
										selectedDay = day.dateString;
										try {
											let tempobj = { ...unAvailableObj }
											tempobj[day.dateString] = { selected: true };
											this.setState({ selectedDateArr: tempobj })
											this.setState({ dateForfullCalendar: Moment(day.dateString).format('DD MMM') })
											this.setState({ selectedIndex: -1 })
										} catch (e) { }
									}}
									style={{ height: responsiveHeight(53) }}
								/>

							</View>
						</ScrollView>
						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(1.4), justifyContent: 'flex-end', width: '100%' }}>
							<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() =>{
							Trace.stopTrace();
							this.setState({ isModalVisibleFollowUp: false })
							} }>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
							</TouchableOpacity>

							<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6), marginRight: 10 }} onPress={() => {
								if(selectedDay)
								this.clickOnDone()
								else
								Snackbar.show({ text: 'Please select date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
							}}>
								<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Done </Text>
							</TouchableOpacity>

						</View>
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
)(FollowUpModal);

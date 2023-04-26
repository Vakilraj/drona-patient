import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, BackHandler, FlatList, ScrollView, Platform
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';
import Moment from 'moment';

import Color from '../../../components/Colors';
import CustomFont from '../../../components/CustomFont';
import CalendarImage from '../../../../assets/calendar.png';
import calendar_blue from '../../../../assets/calendar_blue.png';
import closeIcon from '../../../../assets/close.png';
import dwIcon from '../../../../assets/dw_icon.png';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
let currentDate = '', endingDate = ''; // for date range
let selectedDay = '';  // for single date
let firstClickFlag = 0;
let startDateSelection = '', endDateSelection = '', counter = 0;
var today = new Date();
class CalendarModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false,
			isModalVisibleForAsk: false,
			isModalVisibleSingle: false,
			selectedDateArr: [],
			selectedDate: this.props.nav == 'single' ? 'Select Date' : 'Select Date Or Date range',

			showHeaderDate: '',
			dateForfullCalendar: '',
			selectedDateHeader: ''
		};
		endingDate = '';
		currentDate = '';
		startDateSelection = '';
		endDateSelection = '';
		counter = 0;
	}
	async componentDidMount() {
		currentDate = Moment(new Date()).format('YYYY-MM-DD');

		let showDate = Moment(new Date()).format('DD MMM YYYY');
		selectedDay = currentDate;
		this.setState({ showHeaderDate: showDate })
		//DRONA.setStartDate(currentDate);
	}
	timeSetOnCalendar = (addingDay) => {
		let dateObject = {};
		dateObject[Moment(new Date()).format('YYYY-MM-DD')] = { startingDay: true, color: Color.primaryBlue, textColor: 'white' };
		for (let i = 0; i < addingDay; i++) {
			var today = new Date()
			var priorDate = today.setDate(today.getDate() + i + 1)
			let increaseDate = Moment(priorDate).format('YYYY-MM-DD');
			if (i === addingDay - 1) {
				dateObject[increaseDate] = { endingDay: true, color: Color.primaryBlue, textColor: 'white' };
			} else {
				dateObject[increaseDate] = { color: Color.calendarBgColor, textColor: Color.fontColor };
			}
			endingDate = increaseDate;
		}
		//DRONA.setEndDate(endingDate);
		this.setState({ selectedDateArr: dateObject })
		Snackbar.show({ text: 'You have selected ' + addingDay + ' days', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
	}
	timeSetOnCalendarOnSelection = (addingDay) => {
		currentDate = startDateSelection;
		let dateObject = {};
		dateObject[startDateSelection] = { startingDay: true, color: Color.liveBg, textColor: 'white' };
		for (let i = 0; i < addingDay; i++) {
			let increaseDate = Moment(startDateSelection, "YYYY-MM-DD").add(i + 1, 'days').format('YYYY-MM-DD')
			if (i === addingDay - 1) {
				dateObject[increaseDate] = { endingDay: true, color: Color.liveBg, textColor: 'white' };
			} else {
				dateObject[increaseDate] = { color: '#FAE5EC', textColor: Color.fontColor };
			}
			endingDate = increaseDate;
		}
		//DRONA.setEndDate(endingDate);
		this.setState({ selectedDateArr: dateObject })
		Snackbar.show({ text: 'You have selected ' + addingDay + ' days', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		try {
			this.setState({ selectedDateHeader: Moment(currentDate).format('DD MMM') + ' - ' + Moment(endingDate).format('DD MMM') })
		} catch (e) { }

	}
	clickOnDone = () => {
		//DRONA.setStartDate(currentDate);selectedDay
		if (this.state.isModalVisibleSingle) {
			this.setState({ isModalVisibleSingle: false, selectedDate: this.state.showHeaderDate, isModalVisibleForAsk: false });
			this.props.Refresh({ startDate: selectedDay, endingDate: '' });
		} else {
			if (!currentDate) {
				Snackbar.show({ text: 'Please select start date ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			} else if (!endingDate) {
				Snackbar.show({ text: 'Please select end date ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
			} else {
				this.setState({ isModalVisible: false, selectedDate: Moment(currentDate).format('DD MMM YYYY') + ' - ' + Moment(endingDate).format('DD MMM YYYY'), isModalVisibleForAsk: false });
				// this.props.Refresh(this.state);
				this.props.Refresh({ startDate: currentDate, endingDate: endingDate });
			}
		}


	}
	render() {
		let { actions, signupDetails, loading } = this.props;

		return (
			<View>
				<TouchableOpacity style={{ flexDirection: 'row', borderRadius: 4, borderColor: Color.createInputBorder, alignItems: 'center', borderWidth: 1, marginTop: responsiveHeight(1.6), height: responsiveHeight(7), backgroundColor: Color.white }}
					onPress={() => {
						if (this.props.nav == 'single') {
							this.setState({ isModalVisibleSingle: true })

						} else {
							this.setState({ isModalVisibleForAsk: true })  //isModalVisible
						}
					}}>
					<View style={{ flex: 1 }}>
						<Image source={CalendarImage} style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), marginTop: responsiveHeight(1) }} />
					</View>
					<View style={{ flex: 7 }}>
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.grayTxt, marginLeft: responsiveWidth(2) }}>{this.state.selectedDate}</Text>
					</View>
					<View style={{ flex: 1, alignItems: 'flex-end' }}>
						<Image source={dwIcon} style={{ marginRight: responsiveWidth(4) }} />
					</View>
				</TouchableOpacity>

				{/* ---------------ask calendar----------------- */}
				<Modal isVisible={this.state.isModalVisibleForAsk} avoidKeyboard={true}>
					<View style={styles.modelViewMessage}>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(3) }}
							onPress={() => {
								// if(Platform.OS=='android')
								// this.setState({isModalVisibleForAsk: false});
								this.setState({ isModalVisibleSingle: true });

							}}>
							<Image source={CalendarImage} style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), resizeMode: 'contain', marginLeft: 10, marginTop: responsiveHeight(1.5) }} />
							<Text style={{ marginLeft: 20, fontSize: CustomFont.font16, fontWeight: 'bold', fontFamily: CustomFont.fontName, color: Color.fontColor }}>Select Single Date</Text>

						</TouchableOpacity>

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', }}
							onPress={() => {
								// if(Platform.OS=='android')
								// this.setState({isModalVisibleForAsk: false});
								this.setState({ isModalVisible: true });

							}}>
							<Image source={CalendarImage} style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), resizeMode: 'contain', marginLeft: 10, marginTop: responsiveHeight(1.5) }} />
							<Text style={{ marginLeft: 20, fontSize: CustomFont.font16, fontWeight: 'bold', fontFamily: CustomFont.fontName, color: Color.fontColor }}>Select Multiple Dates</Text>

						</TouchableOpacity>


						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1) }} onPress={() => this.setState({ isModalVisibleForAsk: false })}>
							<Image source={closeIcon} style={{ height: responsiveFontSize(4), width: responsiveFontSize(4), resizeMode: 'contain', marginLeft: 10, }} />
							<Text style={{ marginLeft: 20, fontSize: CustomFont.font16, fontWeight: 'bold', fontFamily: CustomFont.fontName, color: Color.fontColor }}>Cancel </Text>
						</TouchableOpacity>


					</View>


					{/* ---------------single calendar----------------- */}
					<Modal isVisible={this.state.isModalVisibleSingle} >
						<View style={{ backgroundColor: Color.white, borderRadius: 7, alignItems: 'center' }}>
							<ScrollView>
								<View style={{ flex: 1, flexDirection: 'column' }}>
									<View style={{ width: '100%', backgroundColor: Color.primaryBlue, borderTopLeftRadius: 7, borderTopRightRadius: 7, }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font24, color: Color.fontColor, color: Color.white, marginTop: 15, marginBottom: 15, marginLeft: 15 }}>{this.state.showHeaderDate}</Text>
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
									<Calendar
										theme={{
											monthTextColor: Color.fontSize,
											todayTextColor: Color.primary,
											selectedDayTextColor: Color.white,
											selectedDayBackgroundColor: Color.liveBg,
										arrowColor: Color.primary,
										}}
										markedDates={{
											[this.state.dateForfullCalendar]: { selected: true },
										}}
										onDayPress={day => {
											//alert(day.dateString)
											selectedDay = day.dateString
											let showDate = Moment(selectedDay).format('DD MMM YYYY');
											this.setState({ dateForfullCalendar: day.dateString, showHeaderDate: showDate })
										}}
										hideDayNames={true}
										minDate={today}
									/>
									<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(3), justifyContent: 'flex-end', width: '100%' }}>
										<TouchableOpacity style={{ backgroundColor: Color.community_loader, alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisibleSingle: false, isModalVisibleForAsk: false })}>
											<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel</Text>
										</TouchableOpacity>

										<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6), marginRight: 10 }} onPress={() => {
											this.clickOnDone();
										}}>
											<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Done </Text>
										</TouchableOpacity>
									</View>
								</View>
							</ScrollView>

						</View>
					</Modal>


					{/* ---------------date range calendar----------------- */}
					<Modal isVisible={this.state.isModalVisible} >
						<View style={{ backgroundColor: Color.white, borderRadius: 7, alignItems: 'center', flex: 1 }}>
							<View style={{ width: '100%', backgroundColor: Color.primaryBlue, borderTopLeftRadius: 7, borderTopRightRadius: 7, }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.fontColor, color: Color.white, marginTop: 10, marginLeft: 15, marginBottom: 7 }}>{this.state.selectedDateHeader}</Text>
							</View>
							<ScrollView>
								<View style={{ flex: 1, flexDirection: 'column', width: responsiveWidth(92) }}>

									<View style={{ width: '100%', flexDirection: 'row', marginTop: 7, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), marginTop: responsiveHeight(4) }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1, marginLeft: responsiveWidth(3) }}>Sun</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Mon</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Tue</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Wed</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Thu</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Fri</Text>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Sat</Text>
									</View>
									<CalendarList
									theme={{
										monthTextColor: Color.primary,
										arrowColor: Color.primary,
										todayTextColor: Color.primary,
										selectedDayTextColor: 'white',
										selectedDayBackgroundColor: Color.liveBg,
										
									}}
										// Callback which gets executed when visible months change in scroll view. Default = undefined
										minDate={new Date()}
										onVisibleMonthsChange={(months) => { }}
										// Max amount of months allowed to scroll to the past. Default = 50
										pastScrollRange={0}
										// Max amount of months allowed to scroll to the future. Default = 50
										futureScrollRange={12}
										// Enable or disable scrolling of calendar list
										scrollEnabled={true}
										// Enable or disable vertical scroll indicator. Default = false
										showScrollIndicator={false}
										hideDayNames={true}
										monthFormat={'MMM yyyy'}
										markingType={'period'}
										markedDates={this.state.selectedDateArr}
										onDayPress={day => {
											try {
												if (counter % 2 == 0) {
													startDateSelection = day.dateString;
													this.setState({ selectedDateArr: { [startDateSelection]: { startingDay: true, color: Color.liveBg, textColor: 'white' } } })
												} else {
													endDateSelection = day.dateString;

													let dt1 = new Date(endDateSelection);
													let dt2 = new Date(startDateSelection);
													var diff = dt1.getTime() - dt2.getTime();
													var daydiff = parseInt(diff / (1000 * 60 * 60 * 24));
													if (daydiff > 0) {
														this.timeSetOnCalendarOnSelection(daydiff)
													} else {
														startDateSelection = endDateSelection;
														this.timeSetOnCalendarOnSelection(Math.abs(daydiff))
													}

												}
												counter++;
											} catch (e) { }
										}}
									/>

								</View>
							</ScrollView>
							<View style={{ flexDirection: 'row', marginTop: responsiveHeight(1), marginBottom: responsiveHeight(4), justifyContent: 'flex-end', width: '100%' }}>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisible: false, isModalVisibleForAsk: false })}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
								</TouchableOpacity>

								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(6), marginRight: 10 }} onPress={() => {
									this.clickOnDone()
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>Done</Text>
								</TouchableOpacity>

							</View>
						</View>
					</Modal>

				</Modal>
			</View>
		);
	}

}
export default CalendarModal;

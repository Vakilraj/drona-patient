import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StatusBar, Image, TextInput, TouchableOpacity, ScrollView
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import styles from './style';
import Moment from 'moment';

import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import CalendarImage from '../../../assets/calender_icon.png';
import dwIcon from '../../../assets/dw_icon.png';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
let currentDate = '', endingDate = '';
let startDateSelection = '', endDateSelection = '', counter = 0;

class CalendarModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false,
			selectedDateArr: [],
			selectedDate: 'From Date - To Date',
			selectedDateHeader:'',
			dateRange1 : false,
			dateRange2 : false,
			dateRange3 : false,
			dateRange4 : false,
		};
		endingDate = '';
		currentDate = '';
		startDateSelection = '';
		endDateSelection = '';
		counter = 0;
	}
	async componentDidMount() {
		currentDate = Moment(new Date()).format('YYYY-MM-DD');
		//DRONA.setStartDate(currentDate);
		let str= this.props.nav && this.props.nav.val ? this.props.nav.val : null;
		//alert(str)
		if(str){
			this.setState({selectedDate:str});
		}
		// for(let i=0;i<10;i++){
		// 	var today = new Date()
		// var priorDate = new Date().setDate(today.getDate()+i)
		// console.log(Moment(priorDate).format('YYYY-MM-DD'));
		// }


		// this.setState({selectedDateArr:{
		// 	'2021-01-30': { startingDay: true, color: Color.primaryBlue, textColor: 'white' },
		// 	'2021-01-31': { color: Color.calendarBgColor, textColor: Color.fontColor},
		// 	'2021-02-01': { color: Color.calendarBgColor, textColor:  Color.fontColor },
		// 	'2021-02-02': { color: Color.calendarBgColor, textColor:  Color.fontColor },
		// 	'2021-02-03': { color: Color.calendarBgColor, textColor:  Color.fontColor },
		// 	'2021-02-04': { color: Color.calendarBgColor, textColor:  Color.fontColor },
		// 	'2021-02-05': { endingDay: true, color: Color.primaryBlue, textColor: 'white' },

		// }})
		//alert(n);
	}
	timeSetOnCalendar = (addingDay) => {
		if(addingDay == '7'){
         this.setState({dateRange1:true, dateRange2:false,dateRange3:false,dateRange4:false})
		}else if(addingDay == '15'){
          this.setState({dateRange1:false, dateRange2:true,dateRange3:false,dateRange4:false})
		}
		else if(addingDay == '30'){
			this.setState({dateRange1:false, dateRange2:false,dateRange3:true,dateRange4:false})
		}
		else{
          this.setState({dateRange1:false, dateRange2:false,dateRange3:false,dateRange4:true})
		}
		let dateObject = {};
		dateObject[Moment(new Date()).format('YYYY-MM-DD')] = { startingDay: true, color: Color.liveBg, textColor: 'white' };
		for (let i = 0; i < addingDay; i++) {
			var today = new Date()
			var priorDate = today.setDate(today.getDate() + i + 1)
			let increaseDate = Moment(priorDate).format('YYYY-MM-DD');
			if (i === addingDay - 1) {
				dateObject[increaseDate] = { endingDay: true, color: Color.liveBg, textColor: 'white' };
			} else {
				dateObject[increaseDate] = { color: Color.selectedBackgroundColor, textColor: Color.fontColor };
			}
			endingDate = increaseDate;
		}
		DRONA.setEndDate(endingDate);
		this.setState({ selectedDateArr: dateObject })
		Snackbar.show({ text: 'You have selected ' + addingDay + ' days', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		try{
this.setState({selectedDateHeader:Moment(new Date()).format('DD MMM') +' - '+Moment(endingDate).format('DD MMM') })
		}catch(e){}
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
				dateObject[increaseDate] = { color: Color.selectedBackgroundColor, textColor: Color.fontColor };
			}
			endingDate = increaseDate;
		}
		DRONA.setEndDate(endingDate);
		this.setState({ selectedDateArr: dateObject })
		Snackbar.show({ text: 'You have selected ' + addingDay + ' days', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		try{
			this.setState({selectedDateHeader:Moment(currentDate).format('DD MMM') +' - '+Moment(endingDate).format('DD MMM') })
					}catch(e){}
	}
	clickOnDone = () => {
		if(endingDate){
			DRONA.setStartDate(currentDate);
			this.setState({ isModalVisible: false, selectedDate: Moment(currentDate).format('DD MMM YYYY') + ' - ' +  Moment(endingDate).format('DD MMM YYYY') });
		}else{
			Snackbar.show({ text: 'Please selected ending date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}
		

	}
	render() {
		let { actions, signupDetails, loading } = this.props;

		return (
			<View>
				<TouchableOpacity style={{justifyContent:'space-between', flexDirection: 'row', borderRadius: 4, borderColor: Color.createInputBorder, alignItems: 'center', borderWidth: 1, marginTop: responsiveHeight(1.6), height: responsiveHeight(7),marginBottom:20 }}
					onPress={() => this.setState({ isModalVisible: true })}>
						
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.grayTxt, marginLeft: responsiveWidth(3) }}>{this.state.selectedDate}</Text>
					<Image source={CalendarImage} style={{height:responsiveFontSize(4),width:responsiveFontSize(4),marginRight:20 }} />
				</TouchableOpacity>

				<Modal isVisible={this.state.isModalVisible} onRequestClose={() => this.setState({isModalVisible:false})} >
					<View style={{ backgroundColor: Color.white, borderRadius: 7, alignItems: 'center',flex:1 }}>
					<View style={{ width: '100%', height : responsiveHeight(8), justifyContent : 'center', backgroundColor: Color.primaryBlue, borderTopLeftRadius: 7, borderTopRightRadius: 7, }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontWeight : CustomFont.fontWeight700, fontSize: CustomFont.font24, color: Color.fontColor, color: Color.white, marginLeft: 15, }}>{this.state.selectedDateHeader}</Text>
								</View>
						<ScrollView>
							<View style={{ flex: 1, flexDirection: 'column' }}>
								<View style={{ width: '100%', backgroundColor: Color.patientSearchBackgroundLight, }}>
									<View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), marginBottom: responsiveHeight(2), marginLeft: 7, marginRight: 7 }}>
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
											<TouchableOpacity style={[styles.modalTopDay, {backgroundColor : this.state.dateRange1 ? Color.selectedBackgroundColor : Color.white,
											 borderColor : this.state.dateRange1 ? Color.selectedBorderColor : Color.inputdefaultBorder}]} onPress={() => this.timeSetOnCalendar(7)}>
												<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext, }}>7 Days</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalTopDay, {backgroundColor : this.state.dateRange2 ? Color.selectedBackgroundColor : Color.white,
												borderColor : this.state.dateRange2 ? Color.selectedBorderColor : Color.inputdefaultBorder}]} onPress={() => this.timeSetOnCalendar(15)}>
												<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext, }}>2 Weeks</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalTopDay, {
												backgroundColor : this.state.dateRange3 ? Color.selectedBackgroundColor : Color.white,
												borderColor : this.state.dateRange3 ? Color.selectedBorderColor : Color.inputdefaultBorder}]} onPress={() => this.timeSetOnCalendar(30)}>
												<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext, }}>1 Month</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalTopDay, {
												backgroundColor : this.state.dateRange4 ? Color.selectedBackgroundColor : Color.white,
												borderColor : this.state.dateRange4 ? Color.selectedBorderColor : Color.inputdefaultBorder}]} onPress={() => this.timeSetOnCalendar(90)}>
												<Text style={{ fontSize: CustomFont.font14, color: Color.optiontext, }}>3 Months</Text>
											</TouchableOpacity>
										</ScrollView>
									</View>
								</View>



								<View style={{ width: '100%', flexDirection: 'row', marginTop: 7, marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1, marginLeft: responsiveWidth(3) }}>Mon</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Tue</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Wed</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Thu</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Fri</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Sat</Text>
									<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.lightGrayTxt, flex: 1 }}>Sun</Text>
								</View>
								<CalendarList
									// Callback which gets executed when visible months change in scroll view. Default = undefined
									minDate={new Date()}
									onVisibleMonthsChange={(months) => { console.log('now these months are visible', months); }}
									// Max amount of months allowed to scroll to the past. Default = 50
									pastScrollRange={0}
									// Max amount of months allowed to scroll to the future. Default = 50
									futureScrollRange={6}
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
													if(daydiff>90){
														--counter;
														Snackbar.show({ text: 'Maximum date range is 90 days', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
													}else{
														this.timeSetOnCalendarOnSelection(daydiff)
													}
													
												} else {
													startDateSelection = endDateSelection;
													daydiff=Math.abs(daydiff);
													if(daydiff>90){
														--counter;
														Snackbar.show({ text: 'Maximum date range is 90 days', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
													}else{
														this.timeSetOnCalendarOnSelection(daydiff)
													}
												}

											}
											counter++;
										} catch (e) { }
									}}
								/>
								
							</View>
						</ScrollView>
						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(5), marginBottom: responsiveHeight(1.4), justifyContent: 'flex-end', width: '100%' }}>
									<TouchableOpacity style={{backgroundColor : Color.calenderCancelBtnBg, alignItems: 'center', justifyContent: 'center', borderRadius: 6, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisible: false })}>
										<Text style={{ fontFamily: CustomFont.fontName, fontWeight : CustomFont.fontWeight700, color: Color.primary, fontSize: CustomFont.font14, textAlign: 'center' }}>Cancel </Text>
									</TouchableOpacity>

									<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 6, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primaryBlue, marginLeft: responsiveWidth(3), marginRight: 10 }} onPress={() => {
										this.clickOnDone()
									}}>
										<Text style={{ fontFamily: CustomFont.fontName, fontWeight : CustomFont.fontWeight700, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center' }}>Done </Text>
									</TouchableOpacity>

								</View>
					</View>
				</Modal>
			</View>
		);
	}

}
export default CalendarModal;
import React, { useState } from 'react';
import {
	ScrollView,
	View,
	Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Keyboard, FlatList, Alert,
} from 'react-native';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import edit_blue from '../../../assets/edit_new_blue.png';
import add from '../../../assets/increment.png';
import down from '../../../assets/down.png';
import up from '../../../assets/up.png';
import cross from '../../../assets/cross_blue.png';
import crossPink from '../../../assets/cross_pink.png';
import search_gray from '../../../assets/search_gray.png';

import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import CheckBox from '@react-native-community/checkbox';
import { setLogEvent } from '../../service/Analytics';
import Moment from 'moment';

let awardsGuid = null;
let fullArrayService = [], fullArraySpeciality = [];
let drEducationGuid = null, currentYear = '', drExperienceGuid = null;
let delIndex = 0;
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
let presentYear = new Date().getFullYear();
import Validator from '../../components/Validator';



class AdditionalInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isModalVisibleAbout: false,
			isModalVisibleRegards: false,
			isModalVisibleSpecialization: false,
			isModalVisibleServices: false,
			aboutData: '',
			serviceSearch: '',
			specialisationSearch: '',
			educationData: '',
			experienceData: '',
			awardsDataArray: [],
			awardsTitle: '',
			awardsProvider: '',
			awardsYear: '',
			selectedServiceArr: [],
			ServiceArr: [],
			selectedSpecializationArr: [],
			SpecializationArr: [],
			specializationName: '',
			serviceName: '',
			keyboardAvoidingHeight: 0,
			aboutBorderColor: Color.newBorder,
			fld1: Color.newBorder,
			fld2: Color.newBorder,
			fld3: Color.newBorder,
			fld4: Color.newBorder,
			fld5: Color.newBorder,
			isAboutDetail: false,
			isEducationDetail: false,
			isExperienceDetail: false,
			isServiceDetail: false,
			isSpecialitiesDetail: false,
			isAwardRecoginition: false,
			isModalVisibleEducation: false,
			univerBClor: Color.newBorder,
			degreeBColor: Color.newBorder,
			fieldDegreeBColor: Color.newBorder,
			locationBColor: Color.newBorder,
			year1: Color.newBorder,
			year2: Color.newBorder,
			educationArr: [],
			university: '',
			degree: '',
			fieldOfStydy: '',
			location: '',
			startYear: '',
			endYear: '',
			startYearAlert: '',
			endYearAlert: '',
			isAddEducation: true,
			isAddAward: true,
			isAddWork: true,
			isModalVisibleExperience: false,
			jobTitle: '',
			company: '',
			expLocation: '',
			expStartYear: '',
			expEndYear: '',
			checkBoxFlag: false,
			jobTitleColor: Color.newBorder,
			HospitalColor: Color.newBorder,
			expLocationColor: Color.newBorder,
			expYear1: Color.newBorder,
			expYear2: Color.newBorder,
			keyboardAvoiding: 0,
			dynamicTop: 0
		};
	}

	componentDidMount() {
		//this.getAdditionalInfo();
		try {
			currentYear = Moment(new Date()).format('YYYY');
		} catch (e) { }
		if (this.props.resDataFromServer)
			this.setValueFromResponse(this.props.resDataFromServer)
	}
	setValueFromResponse = (data) => {
		let about = data.aboutDoctor;
		let education = '', experience = '';
		educationList = data.educationDetails;
		experienceList = data.experienceDetails;
		if (data.educationDetails && data.educationDetails.length > 0) {
			for (let i = 0; i < data.educationDetails.length; i++) {
				if (i == 0)
					education = data.educationDetails[i].degree;
				else
					education += ', ' + data.educationDetails[i].degree;
			}
		}
		try {
			if (data.experienceDetails && data.experienceDetails.length > 0) {
				for (let i = 0; i < data.experienceDetails.length; i++) {
					let yrs = ''
					yrs = data.experienceDetails[i].endYear - data.experienceDetails[i].startYear;
					if (i == 0) {
						experience = data.experienceDetails[i].title + '\n' + yrs + ' Yrs Exp, ' + data.experienceDetails[i].company + ', ' + data.experienceDetails[i].location;
					} else {
						experience += '\n\n' + data.experienceDetails[i].title + '\n' + yrs + ' Yrs Exp, ' + data.experienceDetails[i].company + ', ' + data.experienceDetails[i].location;
					}

				}
			}
		} catch (e) { }

		this.setState({ aboutData: about, educationData: data.educationDetails, experienceData: data.experienceDetails, awardsDataArray: data.awards });

		try {
			if (data.selectedServiceList && data.selectedServiceList != 'null') {
				this.setState({ selectedServiceArr: data.selectedServiceList });
			}
			if (data.selectedSpecialisationList && data.selectedSpecialisationList != 'null') {
				this.setState({ selectedSpecializationArr: data.selectedSpecialisationList });
			}

			fullArraySpeciality = _.differenceBy(data.specialisationList, data.selectedSpecialisationList, 'specialisationGuid');
			fullArrayService = _.differenceBy(data.serviceList, data.selectedServiceList, 'servicesGuid');

			this.setState({ ServiceArr: fullArrayService, SpecializationArr: fullArraySpeciality });

		} catch (e) { }
		//fullArrayService = data.serviceList;
		//fullArraySpeciality = data.specialisationList;

		if (this.state.isEducationDetail)
			this.setState({ isEducationDetail: data.educationDetails && data.educationDetails.length })

		if (this.state.isExperienceDetail)
			this.setState({ isExperienceDetail: data.experienceDetails && data.experienceDetails.length })

	}
	getAdditionalInfo = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"Data": null
		}
		actions.callLogin('V1/FuncForDrAppToGetDoctorProfile', 'post', params, signupDetails.accessToken, 'getProfileAdditional');
	}

	onCallFocus = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.primary })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.primary })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.primary })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.primary })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.primary })
		} else if (type == 'fos') {
			this.setState({ fieldDegreeBColor: Color.primary })
		}
		else if (type == 'location') {
			this.setState({ locationBColor: Color.primary })
		}
		else if (type == 'startyear') {
			this.setState({ year1: Color.primary })
		}
		else if (type == 'endyear') {
			this.setState({ year2: Color.primary })
		} else if (type == 'expLocation') {
			this.setState({ expLocationColor: Color.primary })
		}
		else if (type == 'expStartYear') {
			this.setState({ expYear1: Color.primary })
		}
		else if (type == 'expEndYear') {
			this.setState({ expYear2: Color.primary })
		}
	}
	onCallBlur = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.inputdefaultBorder })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.inputdefaultBorder })
		}
		else if (type == '3') {
			this.setState({ fld3: Color.inputdefaultBorder })
		}
		else if (type == '4') {
			this.setState({ fld4: Color.inputdefaultBorder })
		}
		else if (type == '5') {
			this.setState({ fld5: Color.inputdefaultBorder })
		} else if (type == 'fos') {
			this.setState({ fieldDegreeBColor: Color.inputdefaultBorder })
		}
		else if (type == 'location') {
			this.setState({ locationBColor: Color.inputdefaultBorder })
		}
		else if (type == 'startyear') {
			this.setState({ year1: Color.inputdefaultBorder })
		}
		else if (type == 'endyear') {
			this.setState({ year2: Color.inputdefaultBorder })
		} else if (type == 'expLocation') {
			this.setState({ expLocationColor: Color.inputdefaultBorder })
		}
		else if (type == 'expStartYear') {
			this.setState({ expYear1: Color.inputdefaultBorder })
		}
		else if (type == 'expEndYear') {
			this.setState({ expYear2: Color.inputdefaultBorder })
		}
		this.setState({ dynamicTop: 0 })
	}

	deleteEducation = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"Data": {
				"DrEducationGuid": drEducationGuid

			}
		}
		actions.callLogin('V1/FuncForDrAppToDeleteDrEducation', 'post', params, signupDetails.accessToken, 'deleteEducation');
	}

	saveEducation = () => {
		if (!this.state.university) {
			Snackbar.show({ text: 'Please enter University or Institute', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.degree) {
			Snackbar.show({ text: 'Please enter Degree', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.fieldOfStydy) {
			Snackbar.show({ text: 'Please enter fields of study', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.location) {
			Snackbar.show({ text: 'Please enter location', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.startYear) {
			Snackbar.show({ text: 'Please enter start year', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (this.state.startYear.length != 4) {
			Snackbar.show({ text: 'Start year should be in 4 digits', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.endYear) {
			Snackbar.show({ text: 'Please enter end year', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (this.state.endYear.length != 4) {
			Snackbar.show({ text: 'End year should be in 4 digits', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (parseInt(this.state.startYear) > parseInt(this.state.endYear)) {
			Snackbar.show({ text: 'End year always greater than start year', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}

		else {
			let { actions, signupDetails } = this.props;
			let params = {
				"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
				"Data": {
					"DrEducationGuid": drEducationGuid,
					"University": this.state.university,
					"Degree": this.state.degree,
					"FieldOfStudy": this.state.fieldOfStydy,
					"Location": this.state.location,
					"StartYear": this.state.startYear,
					"EndYear": this.state.endYear
				}

			}
			actions.callLogin('V1/FuncForDrAppToAddUpdateEducation', 'post', params, signupDetails.accessToken, 'saveEducationDetails');
			this.setState({ isModalVisibleEducation: false })
		}
	}

	clickOnService = (item, index) => {
		//SelectedIndex = index
		let tempserviceArr = [...this.state.ServiceArr];
		let selectedTempserviceArr = [...this.state.selectedServiceArr];
		selectedTempserviceArr.push(item)
		tempserviceArr.splice(index, 1);
		this.setState({ selectedServiceArr: selectedTempserviceArr, ServiceArr: tempserviceArr })
		// setTimeout(()=>{
		// 	let tt = [...this.state.ServiceArr];
		// fullArrayService=tt;
		// },300)
		try {
			fullArrayService = _.differenceBy(fullArrayService, [item], 'servicesGuid');
		} catch (error) { }
	}
	removeSelectedSevice = (item, index) => {
		let tempserviceArr = [...this.state.ServiceArr];
		let selectedTempserviceArr = [...this.state.selectedServiceArr];
		tempserviceArr.push(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ selectedServiceArr: selectedTempserviceArr, ServiceArr: tempserviceArr });
		fullArrayService.push(item)
		// setTimeout(()=>{
		// 	let tt = [...this.state.ServiceArr];
		// fullArrayService=tt;
		// },300)
	}
	SearchService = (text) => {
		var searchResult = _.filter(fullArrayService, function (item) {
			return item.servicesName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		this.setState({
			ServiceArr: searchResult, serviceName: text
		});
	}

	//specialisation
	clickOnSpecialization = (item, index) => {
		//SelectedIndex = index
		let tempserviceArr = [...this.state.SpecializationArr];
		let selectedTempserviceArr = [...this.state.selectedSpecializationArr];
		selectedTempserviceArr.push(item)
		tempserviceArr.splice(index, 1);
		this.setState({ selectedSpecializationArr: selectedTempserviceArr, SpecializationArr: tempserviceArr })
		try {
			fullArraySpeciality = _.differenceBy(fullArraySpeciality, [item], 'specialisationGuid');
		} catch (error) { }
	}
	removeSelectedSpecialization = (item, index) => {
		let tempserviceArr = [...this.state.SpecializationArr];
		let selectedTempserviceArr = [...this.state.selectedSpecializationArr];
		tempserviceArr.push(item)
		selectedTempserviceArr.splice(index, 1);
		this.setState({ selectedSpecializationArr: selectedTempserviceArr, SpecializationArr: tempserviceArr })
		fullArraySpeciality.push(item)
	}
	SearchSpecialization = (text) => {
		var searchResult = _.filter(fullArraySpeciality, function (item) {
			return item.specialisationName.toLowerCase().indexOf(text.toLowerCase()) > -1;
		});
		this.setState({
			SpecializationArr: searchResult, specializationName: text
		});
	}



	//get Specialisation Search Data
	getSpecialisationSearchData = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"Version": "",
			"Data": {
				"SearchText": ""
			}
		}
		actions.callLogin('V1/FuncForDrAppToSearchSpecialisation', 'post', params, signupDetails.accessToken, 'searchSpecialisation');

	}

	saveAbout = () => {
		if (!this.state.aboutData) {
			Snackbar.show({ text: 'Please enter about yourself', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			let { actions, signupDetails } = this.props;
			let params = {
				"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
				"Data": { "AboutDoctor": this.state.aboutData }
			}
			actions.callLogin('V1/FuncForDrAppToUpdateAboutDoctor', 'post', params, signupDetails.accessToken, 'saveAboutDetails');
		}
	}
	saveService = () => {
		if (!this.state.selectedServiceArr) {
			Snackbar.show({ text: 'Please select service', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			let { actions, signupDetails } = this.props;
			let params = {
				"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
				"Version": "",
				"Data": this.state.selectedServiceArr
			}

			actions.callLogin('V1/FuncForDrAppToAddServices', 'post', params, signupDetails.accessToken, 'saveServiceDetails');
		}
	}
	saveSpeciality = () => {
		if (!this.state.selectedSpecializationArr) {
			Snackbar.show({ text: 'Please select specialization', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			let { actions, signupDetails } = this.props;
			let params = {
				"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
				"Version": "",
				"Data": this.state.selectedSpecializationArr
			}

			actions.callLogin('V1/FuncForDrAppToAddSpecialisation', 'post', params, signupDetails.accessToken, 'saveSpecialityDetails');
		}
	}

	educationRefresh = () => {
		this.getAdditionalInfo();
	}
	experienceRefresh = () => {
		this.getAdditionalInfo();
	}
	saveAwards = () => {
		let d = new Date();
		let n = d.getFullYear();
		if (!this.state.awardsTitle) {
			Snackbar.show({ text: 'Please enter award title', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.awardsProvider) {
			Snackbar.show({ text: 'Please enter provider', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.awardsYear) {
			Snackbar.show({ text: 'Please enter year of recognition', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (this.state.awardsYear > n) {
			Snackbar.show({ text: 'Please enter less than current year', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}
		else if (this.state.awardsYear.length < 4) {
			Snackbar.show({ text: 'Year should be 4 digit', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}
		else {
			let { actions, signupDetails } = this.props;
			let params = {
				"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
				"Version": "",
				"Data": {
					"AwardsGuid": awardsGuid,
					"Title": this.state.awardsTitle,
					"Provider": this.state.awardsProvider,
					"YearOfRecognition": this.state.awardsYear
				}
			}
			// console.log(JSON.stringify(params));
			actions.callLogin('V1/FuncForDrAppToSaveUpdateDrAwardsInfo', 'post', params, signupDetails.accessToken, 'SaveUpdateDrAwardsInfo');
		}
	}

	deleteAwards = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"Data": {
				"AwardsGuid": awardsGuid
			}
		}

		actions.callLogin('V1/FuncForDrAppToDeleteDrAwardsInfo', 'post', params, signupDetails.accessToken, 'deleteAwards');
	}
	openDialogEditAwards = (item, index) => {
		delIndex = index;
		awardsGuid = item.awardsGuid;
		this.setState({
			awardsTitle: item.title,
			awardsProvider: item.provider,
			awardsYear: item.yearOfRecognition,
			isModalVisibleRegards: true
		})
	}


	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'getProfileAdditional') {
				if (newProps.responseData.statusCode == '0') {
					let data = newProps.responseData.data;
					this.setValueFromResponse(data);

				}

			} else if (tagname === 'saveAboutDetails') {
				if (newProps.responseData.statusCode == '0') {
					//	this.getAdditionalInfo();
					Snackbar.show({ text: 'About details saved successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
				this.setState({ isModalVisibleAbout: false })
			} else if (tagname === 'SaveUpdateDrAwardsInfo') {
				this.setState({ isModalVisibleRegards: false });
				if (newProps.responseData.statusCode == '0') {
					//this.getAdditionalInfo();
					//
					let tempAwardsArr = [];
					tempAwardsArr = this.state.awardsDataArray;
					if (awardsGuid == null) {
						let data = newProps.responseData.data;
						let tempAwardsObj = {};
						tempAwardsObj.awardsGuid = data.awardsGuid
						tempAwardsObj.title = this.state.awardsTitle
						tempAwardsObj.provider = this.state.awardsProvider
						tempAwardsObj.yearOfRecognition = this.state.awardsYear

						tempAwardsArr.push(tempAwardsObj)
						this.setState({ awardsDataArray: tempAwardsArr })
					}
					else {
						let tempAwardsObj = {};
						tempAwardsObj.awardsGuid = awardsGuid
						tempAwardsObj.title = this.state.awardsTitle
						tempAwardsObj.provider = this.state.awardsProvider
						tempAwardsObj.yearOfRecognition = this.state.awardsYear

						for (let i = 0; i < tempAwardsArr.length; i++) {
							console.log('------- ' + 'Edit awards')
							if (awardsGuid == tempAwardsArr[i].awardsGuid) {
								tempAwardsArr.splice(i, 1, tempAwardsObj);
								break;
							}
						}
						this.setState({ awardsDataArray: tempAwardsArr })

					}
					Snackbar.show({ text: 'Awards details saved successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}

			} else if (tagname === 'deleteAwards') {
				if (newProps.responseData.statusCode == '0') {
					//	this.getAdditionalInfo();
					//
					console.log('------->>>>>> ' + delIndex)
					let tempAwadsDelArr = [];
					tempAwadsDelArr = this.state.awardsDataArray;
					tempAwadsDelArr.splice(delIndex, 1);
					this.setState({ awardsDataArray: tempAwadsDelArr })
					//
					Snackbar.show({ text: 'Awards deleted successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
				this.setState({ isModalVisibleRegards: false })
			} else if (tagname === 'saveServiceDetails') {
				if (newProps.responseData.statusCode == '0') {
					this.getAdditionalInfo();
					Snackbar.show({ text: 'Service details saved successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					this.setState({ isModalVisibleServices: false })
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			} else if (tagname === 'saveSpecialityDetails') {
				if (newProps.responseData.statusCode == '0') {
					this.getAdditionalInfo();
					Snackbar.show({ text: 'Speciality details saved successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					this.setState({ isModalVisibleSpecialization: false })
				} else {
					Snackbar.show({ text: newProps.responseData.statusMessage, duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
				}
			} else if (tagname == 'saveEducationDetails') {
				if (newProps.responseData.statusCode == '-1') {
					//	Snackbar.show({ text: 'Education details saved successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					//this.getAdditionalInfo();
					//
					let tempEduArr = [];
					tempEduArr = this.state.educationData;
					if (drEducationGuid == null) {
						let data = newProps.responseData.data;
						let tempEduObj = {};
						tempEduObj.drEducationGuid = data.drEducationGuid
						tempEduObj.degree = this.state.degree
						tempEduObj.fieldOfStudy = this.state.fieldOfStydy
						tempEduObj.location = this.state.location
						tempEduObj.startYear = this.state.startYear
						tempEduObj.endYear = this.state.endYear
						tempEduObj.university = this.state.university
						tempEduArr.push(tempEduObj)
						this.setState({ educationData: tempEduArr })
					}
					else {
						let tempEduObj = {};
						tempEduObj.drEducationGuid = drEducationGuid
						tempEduObj.degree = this.state.degree
						tempEduObj.fieldOfStudy = this.state.fieldOfStydy
						tempEduObj.location = this.state.location
						tempEduObj.startYear = this.state.startYear
						tempEduObj.endYear = this.state.endYear
						tempEduObj.university = this.state.university
						for (let i = 0; i < tempEduArr.length; i++) {
							console.log('------- ' + 'Edit')
							if (drEducationGuid == tempEduArr[i].drEducationGuid) {
								tempEduArr.splice(i, 1, tempEduObj);
								break;
							}
						}
						this.setState({ educationData: tempEduArr })

					}

					//
					this.setState({ isModalVisibleEducation: false })
				}
			} else if (tagname == 'deleteEducation') {
				if (newProps.responseData.statusCode == '0') {
					Snackbar.show({ text: 'Education details deleted successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					//this.getAdditionalInfo();
					//
					console.log('------->>>>>> ' + delIndex)
					let tempEduDelArr = [];
					tempEduDelArr = this.state.educationData;
					tempEduDelArr.splice(delIndex, 1);
					this.setState({ educationData: tempEduDelArr })
					//
					this.setState({ isModalVisibleEducation: false })
				}
			} else if (tagname == 'saveExperienceDetails') {
				if (newProps.responseData.statusCode == '-1') {
					Snackbar.show({ text: 'Experience details saved successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					//this.getAdditionalInfo();
					//
					let tempExpArr = [];
					tempExpArr = this.state.experienceData;
					console.log('Experience Array ' + JSON.stringify(tempExpArr))
					if (drExperienceGuid == null) {
						let data = newProps.responseData.data;
						let tempExpObj = {};
						tempExpObj.drExperienceGuid = data.drExperienceGuid
						tempExpObj.title = this.state.jobTitle
						tempExpObj.isCurrentlyWorking = this.state.checkBoxFlag
						tempExpObj.location = this.state.expLocation
						tempExpObj.startYear = this.state.expStartYear
						tempExpObj.endYear = this.state.checkBoxFlag ? currentYear : this.state.expEndYear
						tempExpObj.company = this.state.company
						tempExpArr.push(tempExpObj)
						this.setState({ experienceData: tempExpArr })


					}
					else {
						let tempExpObj = {};
						tempExpObj.drExperienceGuid = drExperienceGuid
						tempExpObj.title = this.state.jobTitle
						tempExpObj.isCurrentlyWorking = this.state.checkBoxFlag
						tempExpObj.location = this.state.expLocation
						tempExpObj.startYear = this.state.expStartYear
						tempExpObj.endYear = this.state.checkBoxFlag ? currentYear : this.state.expEndYear
						tempExpObj.company = this.state.company
						for (let i = 0; i < tempExpArr.length; i++) {
							console.log('------- ' + 'EditExp')
							if (drExperienceGuid == tempExpArr[i].drExperienceGuid) {
								tempExpArr.splice(i, 1, tempExpObj);
								break;
							}
						}
						this.setState({ experienceData: tempExpArr })

					}

					//

					this.setState({ isModalVisibleExperience: false })
					// alert(JSON.stringify(tagname));
				}
			} else if (tagname == 'deleteExperience') {
				if (newProps.responseData.statusCode == '0') {
					Snackbar.show({ text: 'Experience details deleted successfully', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
					//this.getAdditionalInfo();

					//
					console.log('------->>>>>> ' + delIndex + 'For Exp')
					let tempExpDelArr = [];
					tempExpDelArr = this.state.experienceData;
					tempExpDelArr.splice(delIndex, 1);
					this.setState({ experienceData: tempExpDelArr })
					//
					this.setState({ isModalVisibleExperience: false })
				}
			}
		}
	}

	editExperience = (item, index) => {
		delIndex = index;
		drExperienceGuid = item.drExperienceGuid;
		this.setState({
			jobTitle: item.title,
			company: item.company,
			expLocation: item.location,
			expStartYear: item.startYear,
			expEndYear: item.endYear,
			checkBoxFlag: item.isCurrentlyWorking,
			isModalVisibleExperience: true
		})
	}

	deleteExperience = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"UserGuid": signupDetails.UserGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"Version": "",
			"Data": {
				"DrExperienceGuid": drExperienceGuid

			}
		}
		//console.log(JSON.stringify(params));
		actions.callLogin('V1/FuncForDrAppToDeleteDrExperience', 'post', params, signupDetails.accessToken, 'deleteExperience');
	}

	saveExperience = () => {
		if (!this.state.jobTitle) {
			Snackbar.show({ text: 'Please enter Job title', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.company) {
			Snackbar.show({ text: 'Please enter company', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.expLocation) {
			Snackbar.show({ text: 'Please enter location', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.expStartYear) {
			Snackbar.show({ text: 'Please enter start year', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (this.state.expStartYear > presentYear) {
			Snackbar.show({ text: 'Start date should be less than current date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}else if (this.state.expStartYear.length != 4) {
			Snackbar.show({ text: 'Start year should be in 4 digits', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (this.state.expStartYear < 1920) {
			Snackbar.show({ text: 'Start date should be actual', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.checkBoxFlag && !this.state.expEndYear) {
			Snackbar.show({ text: 'Please enter end year', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}
		else if (this.state.expEndYear > presentYear) {
			Snackbar.show({ text: 'End date should be less than current date', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.checkBoxFlag && this.state.expEndYear.length != 4) {
			Snackbar.show({ text: 'End year should be in 4 digits', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else if (!this.state.checkBoxFlag && parseInt(this.state.expStartYear) > parseInt(this.state.expEndYear)) {
			Snackbar.show({ text: 'End year always greater than start year', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}

		else {
			let { actions, signupDetails } = this.props;
			let params = {
				"RoleCode": signupDetails.roleCode,
			"UserGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
				"Data": {
					"DrExperienceGuid": drExperienceGuid,
					"Title": this.state.jobTitle,
					"Company": this.state.company,
					"Location": this.state.expLocation,
					"StartYear": this.state.expStartYear,
					"EndYear": this.state.checkBoxFlag ? currentYear : this.state.expEndYear,
					"IsCurrentlyWorking": this.state.checkBoxFlag
				}
			}
			//alert(JSON.stringify(params));
			actions.callLogin('V1/FuncForDrAppToAddUpdateExperience', 'post', params, signupDetails.accessToken, 'saveExperienceDetails');
			this.setState({ isModalVisibleExperience: false })
		}
	}

	renderListAwards = ({ item, index }) => (
		<View style={{ marginTop: responsiveWidth(5) }}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ flex: 12 }}>
					<Text style={[styles.additionalTitle, { marginStart: 0 }]}>{item.title}</Text>
				</View>
				<View style={{ flex: 2 }}>
					<TouchableOpacity style={styles.editView} onPress={() => {
						let { signupDetails } = this.props;
						setLogEvent("doctor_profile", { "award_update": "click", UserGuid: signupDetails.UserGuid })
						this.setState({ isAddAward: false }); this.openDialogEditAwards(item, index)
					}}>
						<Image source={edit_blue} style={styles.editIcon} />
						<Text style={styles.addEditTxt}>{"Edit"}</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Text style={styles.subAdditionalTxt}>{item.provider}</Text>
			<Text style={styles.subAdditionalTxt}>{item.yearOfRecognition}</Text>
		</View>
	);

	renderListWorkExperience = ({ item, index }) => (
		<View style={{ marginTop: responsiveWidth(5) }}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ flex: 12 }}>
					<Text style={[styles.additionalTitle, { marginStart: 0 }]}>{item.title}</Text>
				</View>
				<View style={{ flex: 2 }}>
					<TouchableOpacity style={styles.editView} onPress={() => {
						let { signupDetails } = this.props;
						setLogEvent("doctor_profile", { "update_work_experience": "click", UserGuid: signupDetails.UserGuid })
						this.setState({ isAddWork: false }); this.editExperience(item, index)
					}}>
						<Image source={edit_blue} style={styles.editIcon} />
						<Text style={styles.addEditTxt}>{"Edit"}</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Text style={styles.subAdditionalTxt}>{item.company} {item.location ? ', ' + item.location : ''}</Text>
			<Text style={styles.subAdditionalTxt}>{item.startYear} - {item.isCurrentlyWorking ? "Present" : item.endYear}</Text>
		</View>
	);

	renderListEducation = ({ item, index }) => (
		<View style={{ marginTop: responsiveWidth(5) }}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ flex: 12 }}>
					<Text style={[styles.additionalTitle, { marginStart: 0 }]}>{item.degree} {item.university ? ', ' + item.university : ''}</Text>
				</View>
				<View style={{ flex: 2 }}>
					<TouchableOpacity style={styles.editView} onPress={() => {
						let { signupDetails } = this.props;
						setLogEvent("doctor_profile", { "update_education": "click", UserGuid: signupDetails.UserGuid })
						this.setState({ isAddEducation: false }); this.editEducation(item, index)
					}}>
						<Image source={edit_blue} style={styles.editIcon} />
						<Text style={styles.addEditTxt}>{"Edit"}</Text>
					</TouchableOpacity>
				</View>
			</View>
			{item.location ? <Text style={styles.subAdditionalTxt}>{item.location}</Text> : null}
			{item.startYear ? <Text style={styles.subAdditionalTxt}>{item.startYear} - {item.endYear}</Text> : null}

		</View>
	);

	editEducation = (item, index) => {
		delIndex = index;
		drEducationGuid = item.drEducationGuid;
		this.setState({
			university: item.university,
			degree: item.degree,
			fieldOfStydy: item.fieldOfStudy,
			location: item.location,
			startYear: item.startYear,
			endYear: item.endYear,
			isModalVisibleEducation: true
		})
	}

	getSelectedSpecializationTxt = () => {
		let tmpArr = [...this.state.selectedSpecializationArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].specialisationName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}
	getSelectedServicesTxt = () => {
		let tmpArr = [...this.state.selectedServiceArr];
		let str = '';
		if (tmpArr && tmpArr.length > 0) {
			for (let i = 0; i < tmpArr.length; i++) {
				str += tmpArr[i].servicesName + ', '
			}
		}
		return str.replace(/,\s*$/, "");
	}
	aboutFocus = () => {
		// this.setState({ aboutBorderColor: Color.primary })
	}
	aboutBlur = () => {
		this.setState({ aboutBorderColor: Color.buttonBorderColor })
	}


	render() {
		return (
			<View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
				{/* <NavigationEvents onDidFocus={() => this.getAppoinmentedList()} /> */}
				<View style={{ flex: 1 }}>
					<ScrollView keyboardShouldPersistTaps='always'>
						<View>
							<View style={[styles.cardAdditional, { marginTop: responsiveHeight(3) }]}>
								<View style={{ margin: responsiveWidth(3) }}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<TouchableOpacity style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => { if (this.state.aboutData && this.state.aboutData.length) this.setState({ isAboutDetail: !this.state.isAboutDetail }) }}>
											<Image style={styles.down} source={!this.state.isAboutDetail ? down : up} />
											<Text style={styles.additionalTitle}>About</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.editView} onPress={() => this.setState({ isModalVisibleAbout: true, })}>
											<Image source={this.state.aboutData && this.state.aboutData.length ? edit_blue : add} style={[styles.editIcon, { opacity: this.state.aboutData && this.state.aboutData.length ? 1 : 0.8 }]} />
											<Text style={[styles.addEditTxt, { fontWeight: '700' }]}>{this.state.aboutData && this.state.aboutData.length ? "Edit" : "Add"}</Text>
										</TouchableOpacity>
									</View>
									{
										!this.state.isAboutDetail ? null :
											<View>
												<View style={styles.additionalDivider} />
												<Text style={styles.additionalTxt}>{this.state.aboutData}</Text>
											</View>
									}
								</View>
							</View>

							<View style={styles.cardAdditional}>
								<View style={{ margin: responsiveWidth(3) }}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<TouchableOpacity style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => { if (this.state.educationData && this.state.educationData.length) this.setState({ isEducationDetail: !this.state.isEducationDetail }) }}>
											<Image style={styles.down} source={!this.state.isEducationDetail ? down : up} />
											<Text style={styles.additionalTitle}>Education</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.editView} onPress={() => {
											drEducationGuid = null;
											this.setState({
												university: '',
												degree: '',
												fieldOfStydy: '',
												location: '',
												startYear: '',
												endYear: '',
												isModalVisibleEducation: true, isAddEducation: true
											})
											let { signupDetails } = this.props;
											setLogEvent("doctor_profile", { "education": "add", UserGuid: signupDetails.UserGuid })
										}}>
											<Image source={add} style={[styles.editIcon, { opacity: 0.8 }]} />
											{/* <Image source={this.state.educationData && this.state.educationData.length ? edit_blue : add} style={[styles.editIcon, { opacity: 0.8 }]} /> */}
											<Text style={[styles.addEditTxt, { fontWeight: '700' }]}>Add</Text>
											{/* <Text style={[styles.addEditTxt, { fontWeight: '700' }]}>{this.state.educationData && this.state.educationData.length ? "Edit" : "Add"}</Text> */}
										</TouchableOpacity>
									</View>
									{
										!this.state.isEducationDetail ? null :
											<View>
												<View style={styles.additionalDivider} />
												<FlatList
													data={this.state.educationData}
													renderItem={this.renderListEducation}
													extraData={this.state}
													keyExtractor={(item, index) => index.toString()}
												/>
											</View>
									}
								</View>
							</View>

							<View style={styles.cardAdditional}>
								<View style={{ margin: responsiveWidth(3) }}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<TouchableOpacity style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
											if (this.state.selectedSpecializationArr && this.state.selectedSpecializationArr.length)
												// let { signupDetails } = this.props;
												// if (this.state.selectedSpecializationArr && this.state.selectedSpecializationArr.length)
												// 	setLogEvent("doctor_profile", { "update_specialization": "click", UserGuid: signupDetails.UserGuid })
												// else
												// 	setLogEvent("doctor_profile", { "specialization": "click", UserGuid: signupDetails.UserGuid })
												if (this.state.selectedServiceArr && this.state.selectedServiceArr.length) this.setState({ isServiceDetail: !this.state.isServiceDetail })
										}}>
											<Image style={styles.down} source={!this.state.isSpecialitiesDetail ? down : up} />
											<Text style={styles.additionalTitle}>Specialization</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.editView} onPress={() => this.setState({ isModalVisibleSpecialization: true, })}>
											<Image source={this.state.selectedSpecializationArr && this.state.selectedSpecializationArr.length ? edit_blue : add} style={[styles.editIcon, { opacity: 0.8 }]} />
											<Text style={[styles.addEditTxt, { fontWeight: '700' }]}>{this.state.selectedSpecializationArr && this.state.selectedSpecializationArr.length ? "Edit" : "Add"}</Text>


										</TouchableOpacity>
									</View>
									{
										!this.state.isSpecialitiesDetail ? null :
											<View>
												<View style={styles.additionalDivider} />
												<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
													{this.state.selectedSpecializationArr.map((item, index) => {
														return (
															<View style={styles.itemSelectedView} >
																<Text style={styles.itemSelectedTxt}>{item.specialisationName}</Text>
															</View>
														);
													}, this)}
												</View>
											</View>
									}
								</View>
							</View>

							<View style={styles.cardAdditional}>
								<View style={{ margin: responsiveWidth(3) }}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<TouchableOpacity style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
											let { signupDetails } = this.props;
											if (this.state.selectedServiceArr && this.state.selectedServiceArr.length)
												setLogEvent("doctor_profile", { "update_services": "click", UserGuid: signupDetails.UserGuid })
											else
												setLogEvent("doctor_profile", { "services": "click", UserGuid: signupDetails.UserGuid })
											if (this.state.selectedServiceArr && this.state.selectedServiceArr.length)
												this.setState({ isServiceDetail: !this.state.isServiceDetail })
										}}>
											<Image style={styles.down} source={!this.state.isServiceDetail ? down : up} />
											<Text style={styles.additionalTitle}>Services</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.editView} onPress={() => this.setState({ isModalVisibleServices: true, })}>
											<Image source={this.state.selectedServiceArr && this.state.selectedServiceArr.length ? edit_blue : add} style={[styles.editIcon, { opacity: this.state.selectedServiceArr && this.state.selectedServiceArr.length ? 1 : 0.8 }]} />
											<Text style={[styles.addEditTxt, { fontWeight: '700' }]}>{this.state.selectedServiceArr && this.state.selectedServiceArr.length ? "Edit" : "Add"}</Text>
										</TouchableOpacity>
									</View>
									{
										!this.state.isServiceDetail ? null :
											<View>
												<View style={styles.additionalDivider} />
												<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
													{this.state.selectedServiceArr.map((item, index) => {
														return (
															<View style={styles.itemSelectedView} >
																<Text style={styles.itemSelectedTxt}>{item.servicesName}</Text>
															</View>
														);
													}, this)}
												</View>
											</View>
									}
								</View>
							</View>

							<View style={styles.cardAdditional}>
								<View style={{ margin: responsiveWidth(3) }}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<TouchableOpacity style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
											if (this.state.experienceData && this.state.experienceData.length) {
												this.setState({ isExperienceDetail: !this.state.isExperienceDetail })
											}
										}}>
											<Image style={styles.down} source={!this.state.isExperienceDetail ? down : up} />
											<Text style={styles.additionalTitle}>Work Experience</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.editView} onPress={() => {
											drExperienceGuid = null;
											this.setState({
												jobTitle: "",
												company: "",
												expLocation: "",
												expStartYear: "",
												expEndYear: "",
												checkBoxFlag: false,
												isModalVisibleExperience: true,
												isAddWork: true
											})
											let { signupDetails } = this.props;
											setLogEvent("doctor_profile", { "work_experience": "add", UserGuid: signupDetails.UserGuid })
										}}>
											<Image source={add} style={[styles.editIcon, { opacity: 0.8 }]} />
											<Text style={[styles.addEditTxt, { fontWeight: '700' }]}>Add</Text>
											{/* <Text style={[styles.addEditTxt, { fontWeight: '700' }]}>{this.state.experienceData && this.state.experienceData.length ? "Edit" : "Add"}</Text> */}

										</TouchableOpacity>
									</View>
									{
										!this.state.isExperienceDetail ? null :
											<View>
												<View style={styles.additionalDivider} />
												{/* <Text style={styles.additionalTxt}>{this.state.experienceData}</Text> */}
												<FlatList
													data={this.state.experienceData}
													renderItem={this.renderListWorkExperience}
													extraData={this.state}
													keyExtractor={(item, index) => index.toString()}
												/>
											</View>
									}
								</View>
							</View>

							<View style={styles.cardAdditional}>
								<View style={{ margin: responsiveWidth(3) }}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<TouchableOpacity style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => { if (this.state.awardsDataArray && this.state.awardsDataArray.length) this.setState({ isAwardRecoginition: !this.state.isAwardRecoginition }) }}>
											<Image style={styles.down} source={!this.state.isAwardRecoginition ? down : up} />
											<Text style={styles.additionalTitle}>Awards & Recognitions</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.editView} onPress={() => {
											awardsGuid = null;
											this.setState({
												awardsTitle: '',
												awardsProvider: '',
												awardsYear: '',
												isModalVisibleRegards: true,
												isAddAward: true,
											})
											let { signupDetails } = this.props;
											setLogEvent("doctor_profile", { "award_and_recognization": "add", UserGuid: signupDetails.UserGuid })
										}}>
											<Image source={add} style={[styles.editIcon, { opacity: 0.8 }]} />
											<Text style={[styles.addEditTxt, { fontWeight: '700' }]}>Add</Text>
											{/* <Text style={[styles.addEditTxt, { fontWeight: '700' }]}>{this.state.awardsDataArray && this.state.awardsDataArray.length ? "Edit" : "Add"}</Text> */}


										</TouchableOpacity>
									</View>
									{
										!this.state.isAwardRecoginition ? null :
											<View>
												<View style={styles.additionalDivider} />
												<FlatList
													data={this.state.awardsDataArray}
													renderItem={this.renderListAwards}
													extraData={this.state}
													keyExtractor={(item, index) => index.toString()}
												/>
											</View>
									}
								</View>
							</View>
						</View>
					</ScrollView>
				</View>
				{/* -----------about modal------------------- */}
				<Modal isVisible={this.state.isModalVisibleAbout} avoidKeyboard={true}>
					<View style={styles.modelViewAbout}>
						<ScrollView>
							<View style={styles.modelViewAdditional}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
									<Text style={styles.modelMainTitle}>Add About</Text>
									<TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ isModalVisibleAbout: false })}>
										<Image source={cross} style={{ height: 14, width: 14 }} />
									</TouchableOpacity>
								</View>
								<View style={{ flex: 1 }}>
									<TextInput returnKeyType="done" onFocus={this.aboutFocus} onBlur={this.aboutBlur} style={[styles.modelTextInput, { borderColor: this.state.aboutBorderColor, }]}
										placeholder="Write about yourself" placeholderTextColor={Color.placeHolderColor} multiline={true} value={this.state.aboutData} onChangeText={aboutData => {
											this.setState({ aboutData });

										}} maxLength={2000} onSubmitEditing={() => { Keyboard.dismiss() }}  blurOnSubmit={true}/>
									<View style={{ alignItems: 'flex-end' }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight400, fontSize: CustomFont.font12, color: Color.optiontext, marginTop: 8, }}>{this.state.aboutData.length} / 2000</Text>
									</View>
								</View>
								<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, height: responsiveHeight(7), backgroundColor: Color.primary, marginTop: responsiveHeight(3) }} onPress={() => {
									let { signupDetails } = this.props;
									setLogEvent("about", { "save": "click", UserGuid: signupDetails.UserGuid })
									this.saveAbout();
								}}>
									<Text style={{ fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, color: Color.white, fontSize: CustomFont.font14, textAlign: 'center' }}>Save</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				</Modal>

				{/* -----------specialization modal------------------- */}
				<Modal isVisible={this.state.isModalVisibleSpecialization} avoidKeyboard={true}>
					<View style={[styles.modelViewAbout, { height: responsiveHeight(100), marginTop: responsiveHeight(15) }]}>
						<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={-200}>
							<ScrollView>
								<View style={styles.modelViewAdditional}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
										<Text style={styles.modelMainTitle}>Add Specialization</Text>
										<TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ isModalVisibleSpecialization: false })}>
											<Image source={cross} style={styles.crossIcon} />
										</TouchableOpacity>
									</View>
									<View style={{ flex: 1 }}>
										{/* value={this.state.aboutData} */}

										{/* <TextInput onBlur={() => this.onCallBlur('2')} onFocus={() => this.onCallFocus('2')} style={[styles.modelTextInput, { borderColor: this.state.fld1, padding: 6, height: responsiveHeight(6), marginBottom: responsiveHeight(4) }]}
											placeholder="Search specialization(s)"
											placeholderTextColor={Color.placeHolderColor}
											onChangeText={(specializationName) => { return this.SearchSpecialization(specializationName); }} value={this.state.specializationName} /> */}


										<View style={[styles.modelTextInput, { height: responsiveHeight(6), flexDirection: 'row', marginBottom: responsiveHeight(4), alignItems: 'center', backgroundColor: Color.lightPurple, borderWidth: 0 }]}>
											<Image source={search_gray} style={styles.crossIcon} />
											<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('2')} onFocus={() => this.onCallFocus('2')} style={{ marginTop: 5, height: responsiveHeight(6), alignSelf: 'center', marginStart: 14, color: Color.fontColor }}
												placeholder="Search specialization(s)"
												placeholderTextColor={Color.placeHolderColor}
												onChangeText={(specializationName) => { return this.SearchSpecialization(specializationName); }} value={this.state.specializationName}
											/>
										</View>


										<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
											{this.state.selectedSpecializationArr.map((item, index) => {
												return (
													<View style={styles.itemSelectModelView} >
														<Text style={styles.itemSelectedTxt}>{item.specialisationName}</Text>
														<TouchableOpacity onPress={() => {
															this.removeSelectedSpecialization(item, index)
															let { signupDetails } = this.props;
															setLogEvent("specialization", { "delete": "click", UserGuid: signupDetails.UserGuid })
														}}>
															<Image source={crossPink} style={[styles.crossIcon, { resizeMode: 'contain', marginRight: responsiveWidth(3) }]} />
														</TouchableOpacity>

													</View>
												);
											}, this)}
										</View>
										<Text style={styles.sugeTxt}>Suggestions</Text>

										<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
											{this.state.SpecializationArr.map((item, index) => {
												return (
													<TouchableOpacity style={[styles.itemSelectModelView, { backgroundColor: Color.white, borderColor: Color.primary, marginRight: responsiveWidth(3) }]} onPress={() => this.clickOnSpecialization(item, index)} >
														<Text style={styles.itemSelectedTxt}>{item.specialisationName}</Text>
													</TouchableOpacity>
												);
											}, this)}
										</View>
									</View>
									<TouchableOpacity style={styles.modalBtn} onPress={() => {
										let { signupDetails } = this.props;
										setLogEvent("specialization", { "save": "click", UserGuid: signupDetails.UserGuid })
										this.saveSpeciality();
									}}>
										<Text style={styles.modalBtnTxt}>Save</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						</KeyboardAvoidingView>
					</View>
				</Modal>

				{/* -----------service modal------------------- */}
				<Modal isVisible={this.state.isModalVisibleServices} avoidKeyboard={true}>
					<View style={[styles.modelViewAbout, { height: responsiveHeight(100), marginTop: responsiveHeight(15) }]}>
						<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : null} keyboardVerticalOffset={-200}>
							<ScrollView>
								<View style={styles.modelViewAdditional}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
										<Text style={styles.modelMainTitle}>Add Services</Text>
										<TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ isModalVisibleServices: false })}>
											<Image source={cross} style={styles.crossIcon} />
										</TouchableOpacity>
									</View>
									<View style={{ flex: 1 }}>
										{/* value={this.state.aboutData} */}
										<View style={[styles.modelTextInput, { height: responsiveHeight(6), flexDirection: 'row', marginBottom: responsiveHeight(4), alignItems: 'center', backgroundColor: Color.lightPurple, borderWidth: 0 }]}>
											<Image source={search_gray} style={styles.crossIcon} />
											<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('1')} onFocus={() => this.onCallFocus('1')} style={{ marginTop: 5, height: responsiveHeight(6), alignSelf: 'center', marginStart: 14, color: Color.fontColor }}
												placeholder="Search for services"
												placeholderTextColor={Color.placeHolderColor}
												onChangeText={(serviceName) => { return this.SearchService(serviceName); }} value={this.state.serviceName}
											/>
										</View>


										<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
											{this.state.selectedServiceArr.map((item, index) => {
												return (
													<View style={styles.itemSelectModelView} >
														<Text style={styles.itemSelectedTxt}>{item.servicesName}</Text>
														<TouchableOpacity onPress={() => {
															this.removeSelectedSevice(item, index)
															let { signupDetails } = this.props;
															setLogEvent("service", { "delete": "click", UserGuid: signupDetails.UserGuid })
														}}>
															<Image source={crossPink} style={[styles.crossIcon, { resizeMode: 'contain', marginRight: responsiveWidth(3) }]} />
														</TouchableOpacity>
													</View>
												);
											}, this)}
										</View>
										<Text style={styles.sugeTxt}>Suggestions</Text>

										<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
											{this.state.ServiceArr.map((item, index) => {
												return (
													<TouchableOpacity style={[styles.itemSelectModelView, { backgroundColor: Color.white, borderColor: Color.primary, marginRight: responsiveWidth(3) }]} onPress={() => this.clickOnService(item, index)} >
														<Text style={styles.itemSelectedTxt}>{item.servicesName}</Text>
													</TouchableOpacity>
												);
											}, this)}
										</View>
									</View>
									<TouchableOpacity style={styles.modalBtn} onPress={() => {
										let { signupDetails } = this.props;
										setLogEvent("service", { "save": "click", UserGuid: signupDetails.UserGuid })
										this.saveService();
									}}>
										<Text style={styles.modalBtnTxt}>Save</Text>
									</TouchableOpacity>

								</View>
							</ScrollView>
						</KeyboardAvoidingView>
					</View>
				</Modal>

				{/* -----------Rewards  modal------------------- */}
				<Modal isVisible={this.state.isModalVisibleRegards} avoidKeyboard={true}>
					<View style={[styles.modelViewAbout, { height: responsiveHeight(60) }]}>
						<KeyboardAwareScrollView >
							<ScrollView>
								<View style={styles.modelViewAdditional}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
										<Text style={styles.modelMainTitle}>Add Awards & Recognitions</Text>
										<TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ isModalVisibleRegards: false })}>
											<Image source={cross} style={styles.crossIcon} />
										</TouchableOpacity>
									</View>
									<Text style={styles.tiTitle}>Award Name</Text>
									<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('3')} onFocus={() => this.onCallFocus('3')} style={[styles.modelTextInput1, { borderColor: this.state.fld3, }]}
										placeholder="Enter Award Name" placeholderTextColor={Color.placeHolderColor} value={this.state.awardsTitle} onChangeText={awardsTitle => {
											this.setState({ awardsTitle });
										}} />

									<View style={{ flexDirection: 'row' }}>
										<View style={{ flex: 1.75 }}>
											<Text style={styles.tiTitle}>Awarder</Text>
											<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('4')} onFocus={() => this.onCallFocus('4')} style={[styles.modelTextInput1, { borderColor: this.state.fld4, }]}
												placeholder="Enter Name" placeholderTextColor={Color.placeHolderColor} value={this.state.awardsProvider} onChangeText={awardsProvider => {
													this.setState({ awardsProvider });
												}} />
										</View>

										<View style={{ flex: 2.5, marginStart: 18 }}>
											<Text style={styles.tiTitle}>Year of Recognition</Text>
											<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('5')} onFocus={() => this.onCallFocus('5')} style={[styles.modelTextInput1, { borderColor: this.state.fld5, }]}
												placeholder="YYYY" placeholderTextColor={Color.placeHolderColor} value={this.state.awardsYear} onChangeText={awardsYear => {
													if (awardsYear) {
														if (Validator.isDecimalYear(awardsYear)) {
																this.setState({ awardsYear });		
														}
													}
													else{
														this.setState({ awardsYear });
													}
												}} maxLength={4} />
										</View>
									</View>

									{this.state.isAddAward ? <TouchableOpacity style={styles.modalBtn} onPress={() => { this.saveAwards(); }}>
										<Text style={styles.modalBtnTxt}>Save</Text>
									</TouchableOpacity> :

										<View style={{ flexDirection: "row" }}>
											<TouchableOpacity style={[styles.modalBtn, { flex: 1, backgroundColor: Color.goldPink }]} onPress={() => {
												Alert.alert(
													'Delete Message',
													'Are you sure want to delete?',
													[
														{
															text: 'Cancel',
															onPress: () => console.log('Cancel Pressed'),
															style: 'cancel',
														},
														{
															text: 'Yes',
															onPress: () => {
																let { signupDetails } = this.props;
																setLogEvent("award_recognition", { "delete": "click", UserGuid: signupDetails.UserGuid })
																this.deleteAwards();
															},
														},
													],
													{ cancelable: false },
												);
											}}>
												<Text style={[styles.modalBtnTxt, { color: Color.weekdaycellPink }]}>Delete</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalBtn, { flex: 1, marginStart: 16, }]} onPress={() => {
												let { signupDetails } = this.props;
												setLogEvent("award_recognition", { "save": "click", UserGuid: signupDetails.UserGuid })
												this.saveAwards();
											}}>
												<Text style={styles.modalBtnTxt}>Save</Text>
											</TouchableOpacity>
										</View>}
								</View>
							</ScrollView>
						</KeyboardAwareScrollView>
					</View>
				</Modal>

				{/*--------- Add Education Modal-------------- */}
				<Modal isVisible={this.state.isModalVisibleEducation} avoidKeyboard={true}>
					<View style={{
						backgroundColor: Color.white,
						borderTopStartRadius: 20,
						borderTopEndRadius: 20,
						width: responsiveWidth(101),
						marginStart: -20,
						marginTop: this.state.dynamicTop,
						bottom: responsiveHeight(-20),
						height: responsiveHeight(130)
					}}>
						<View style={{ flex: 1 }}>
							<ScrollView>
								<View style={{ margin: responsiveWidth(5) }}>

									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
										<Text style={styles.modelMainTitle}>Add Education</Text>
										<TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ isModalVisibleEducation: false })}>
											<Image source={cross} style={styles.crossIcon} />
										</TouchableOpacity>
									</View>

									<Text style={styles.tiTitle}>University / Institution</Text>
									<TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.univerBClor, }]}
										placeholder="Enter University/Institution Name" placeholderTextColor={Color.placeHolderColor} value={this.state.university} onChangeText={university => {
											this.setState({ university });
										}} onBlur={() => this.setState({ dynamicTop: 0, univerBClor: Color.inputdefaultBorder })} onFocus={() => this.setState({ dynamicTop: responsiveHeight(38), univerBClor: Color.primary })} onSubmitEditing={() => this.refs.ref1.focus()} />

									<Text style={styles.tiTitle}>Degree</Text>
									<TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.degreeBColor, }]}
										placeholder="Enter Degree Name" placeholderTextColor={Color.placeHolderColor} value={this.state.degree} onChangeText={degree => {
											this.setState({ degree });
										}} onBlur={() => this.setState({ degreeBColor: Color.inputdefaultBorder })} onFocus={() => this.setState({ dynamicTop: responsiveHeight(38), degreeBColor: Color.primary })} ref='ref1' onSubmitEditing={() => this.refs.ref2.focus()} />

									<Text style={styles.tiTitle}>Field of Study</Text>
									<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('fos')} onFocus={() => {
										this.setState({ dynamicTop: responsiveHeight(38) });
										this.onCallFocus('fos')
									}} style={[styles.modelTextInput1, { borderColor: this.state.fieldDegreeBColor, }]}
										placeholder="Enter Field of Study" placeholderTextColor={Color.placeHolderColor} value={this.state.fieldOfStydy} onChangeText={fieldOfStydy => {
											this.setState({ fieldOfStydy });
										}} ref='ref2' onSubmitEditing={() => this.refs.ref3.focus()} />

									<Text style={styles.tiTitle}>Location</Text>
									<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('location')} onFocus={() => {
										this.setState({ dynamicTop: responsiveHeight(38) });
										this.onCallFocus('location')
									}} style={[styles.modelTextInput1, { borderColor: this.state.locationBColor, }]}
										placeholder="Enter Location" placeholderTextColor={Color.placeHolderColor} value={this.state.location} onChangeText={location => {
											this.setState({ location });
										}} ref='ref3' onSubmitEditing={() => this.refs.ref4.focus()} />
									<View style={{ flexDirection: 'row', }}>
										<View style={{ flex: 1 }}>
											<Text style={styles.tiTitle}>Start Year</Text>
											<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('startyear')} onFocus={() => {
												//this.setState({dynamicTop: responsiveHeight(38)});
												this.onCallFocus('startyear')
											}} style={[styles.modelTextInput1, { borderColor: this.state.year1, }]}
												placeholder="YYYY" placeholderTextColor={Color.placeHolderColor} value={this.state.startYear} onChangeText={startYear => {
													if (startYear) {
														if (Validator.isDecimalYear(startYear)) {
																this.setState({ startYear });		
														}
													}
													else{
														this.setState({ startYear });
													}
													
													
													// this.setState({ startYear });
													// if (startYear.length != 4 || startYear === '') {
													// 	this.setState({ startYearAlert: '' })
													// } else {
													// 	if (parseInt(startYear) < 1900)
													// 		this.setState({ startYearAlert: 'Year always greater than 1900' })
													// }

												}} maxLength={4} ref='ref4' onSubmitEditing={() => this.refs.ref5.focus()} />
											{this.state.startYearAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.startYearAlert}</Text> : null}
										</View>

										<View style={{ flex: 1, marginStart: 16 }}>
											<Text style={styles.tiTitle}>End Year</Text>
											<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('endyear')} onFocus={() => {
												//this.setState({dynamicTop: responsiveHeight(38)});
												this.onCallFocus('endyear')
											}} style={[styles.modelTextInput1, { borderColor: this.state.year2, }]}
												placeholder="YYYY" placeholderTextColor={Color.placeHolderColor} value={this.state.endYear} onChangeText={endYear => {
													if (endYear) {
														if (Validator.isDecimalYear(endYear)) {
																this.setState({ endYear });		
														}
													}
													else{
														this.setState({ endYear });
													}
													
													// this.setState({ endYear });
													// if (endYear.length != 4 || endYear === '') {
													// 	this.setState({ endYearAlert: '' })
													// } else {
													// 	if (parseInt(endYear) > currentYear)
													// 		this.setState({ endYearAlert: 'Year should not greater than ' + currentYear })
													// }
												}} maxLength={4} ref='ref5' />
											{this.state.endYearAlert ? <Text style={{ marginLeft: 5, fontSize: CustomFont.font12, color: Color.red }}>{this.state.endYearAlert}</Text> : null}
										</View>
									</View>



									{this.state.isAddEducation ? <TouchableOpacity style={styles.modalBtn} onPress={() => { this.saveEducation(); }}>
										<Text style={styles.modalBtnTxt}>Save</Text>
									</TouchableOpacity> :

										<View style={{ flexDirection: "row" }}>
											<TouchableOpacity style={[styles.modalBtn, { flex: 1, backgroundColor: Color.goldPink }]} onPress={() => {
												Alert.alert(
													'Delete Message',
													'Are you sure want to delete?',
													[
														{
															text: 'Cancel',
															onPress: () => console.log('Cancel Pressed'),
															style: 'cancel',
														},
														{
															text: 'Yes',
															onPress: () => {
																let { signupDetails } = this.props;
																setLogEvent("work_experience", { "delete": "click", UserGuid: signupDetails.UserGuid })
																this.deleteEducation();
															},
														},
													],
													{ cancelable: false },
												);
											}}>
												<Text style={[styles.modalBtnTxt, { color: Color.weekdaycellPink }]}>Delete</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalBtn, { flex: 1, marginStart: 16, }]} onPress={() => {
												let { signupDetails } = this.props;
												setLogEvent("education", { "save": "click", UserGuid: signupDetails.UserGuid })
												this.saveEducation();
											}}>
												<Text style={styles.modalBtnTxt}>Save</Text>
											</TouchableOpacity>
										</View>}
								</View>
							</ScrollView>
						</View>
					</View>
				</Modal>

				{/* {-------Work Experience Modal----------} */}
				<Modal isVisible={this.state.isModalVisibleExperience} avoidKeyboard={true} onRequestClose={() => this.setState({ isModalVisibleExperience: false })}>
					<View style={[styles.modelViewAbout, { height: responsiveHeight(90) }]}>
						<View style={{ flex: 1 }}>
							<ScrollView>
								<View style={styles.modelViewAdditional}>

									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
										<Text style={styles.modelMainTitle}>Add Work Experience</Text>
										<TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ isModalVisibleExperience: false })}>
											<Image source={cross} style={styles.crossIcon} />
										</TouchableOpacity>
									</View>

									<Text style={styles.tiTitle}>Job Title</Text>
									<TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.jobTitleColor, }]}
										placeholder="Enter Job title " placeholderTextColor={Color.placeHolderColor} value={this.state.jobTitle} onChangeText={jobTitle => {
											this.setState({ jobTitle });
										}} onBlur={() => this.setState({ jobTitleColor: Color.inputdefaultBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-40), jobTitleColor: Color.primary })} onSubmitEditing={() => this.refs.ref1.focus()} />


									<Text style={styles.tiTitle}>Hospital/Institute</Text>
									<TextInput returnKeyType="done" style={[styles.modelTextInput1, { borderColor: this.state.HospitalColor, }]}
										placeholder="Enter hospital/institute name" placeholderTextColor={Color.placeHolderColor} value={this.state.company} onChangeText={company => {
											this.setState({ company });
										}} onBlur={() => this.setState({ HospitalColor: Color.inputdefaultBorder })} onFocus={() => this.setState({ keyboardAvoiding: responsiveHeight(-20), HospitalColor: Color.primary })} ref='ref1' onSubmitEditing={() => this.refs.ref2.focus()} />

									<View style={{ flexDirection: 'row', }}>
										<View style={{ flex: 3 }}>
											<Text style={styles.tiTitle}>Location</Text>
											<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('expLocation')} onFocus={() => {
												this.setState({ keyboardAvoiding: responsiveHeight(-7) })
												this.onCallFocus('expLocation')
											}} style={[styles.modelTextInput1, { borderColor: this.state.expLocationColor, }]}
												placeholder="Enter Location" placeholderTextColor={Color.placeHolderColor} value={this.state.expLocation} onChangeText={expLocation => {
													this.setState({ expLocation });
												}} ref='ref2' onSubmitEditing={() => this.refs.ref3.focus()} />

										</View>

										<View style={{ flex: 2, marginStart: 16 }}>
											<Text style={styles.tiTitle}>Start Year</Text>
											<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('expStartYear')} onFocus={() => {
												this.setState({ keyboardAvoiding: responsiveHeight(-7) });
												this.onCallFocus('expStartYear')
											}} style={[styles.modelTextInput1, { borderColor: this.state.expYear1, }]}
												placeholder="YYYY" placeholderTextColor={Color.placeHolderColor} value={this.state.expStartYear}  onChangeText={expStartYear => {
													if (expStartYear) {
													if (Validator.isDecimalYear(expStartYear)) {
															this.setState({ expStartYear });		
													}
												}
												else{
													this.setState({ expStartYear });
												}
											}} ref='ref3' maxLength={4} />
										</View>

										{/* <View style={{ flex: 1, alignItems: 'center' }}>
												<Text style={{ height: 1, width: 7, backgroundColor: Color.fontColor, marginTop: responsiveHeight(10.1) }} />
											</View> */}
										<View style={{ flex: 2, marginStart: 16 }}>
											<Text style={styles.tiTitle}>End Year</Text>
											{this.state.checkBoxFlag ?
												<Text style={{
													borderWidth: 1, borderColor: Color.grayBorder, padding: 7, height: responsiveHeight(6), fontSize: CustomFont.font14, borderRadius: 5, color: Color.fontColor,
													marginTop: responsiveHeight(1.3), paddingTop: responsiveHeight(1.8)
												}}>Till Date</Text> :
												<TextInput returnKeyType="done" onBlur={() => this.onCallBlur('expEndYear')} onFocus={() => {
													this.setState({ keyboardAvoiding: responsiveHeight(-7) });
													this.onCallFocus('expEndYear')
												}} style={[styles.modelTextInput1, { borderColor: this.state.expYear2, }]}
													placeholder="YYYY" placeholderTextColor={Color.placeHolderColor} value={this.state.expEndYear} onChangeText={expEndYear => {
														if (expEndYear) {
														if (Validator.isDecimalYear(expEndYear)) {
																this.setState({ expEndYear });		
														}
													}
													else{
														this.setState({ expEndYear });
													}
												}} maxLength={4} />}

										</View>
									</View>
									<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 13 }}>
										<CheckBox
											value={this.state.checkBoxFlag}
											onValueChange={(newValue) => {
												this.setState({ checkBoxFlag: newValue })
												if(newValue){
													this.setState({expEndYear:currentYear});
												}else{
													this.setState({expEndYear:''});
												}
												
											}}
											onCheckColor={Color.primary}
											tintColors={{true : Color.primary,false:Color.newBorder}}
											onTintColor={Color.primary}
											tintColor={Color.newBorder}
											style={{ color: Color.mediumGrayTxt, height: responsiveFontSize(2.6), width: responsiveFontSize(2.6),tintColor:Color.primary }}
										//onCheckColor={{color:Color.primary}}
										/>
										<Text style={{ fontSize: CustomFont.font12, color: Color.fontColor, marginLeft: 10 }} onPress={()=>{
											this.setState({checkBoxFlag:!this.state.checkBoxFlag});
											if(!this.state.checkBoxFlag){
												this.setState({expEndYear:currentYear});
											}else{
												this.setState({expEndYear:''});
											}
										}}>Currently working in this role</Text>
									</View>

									{this.state.isAddWork ? <TouchableOpacity style={styles.modalBtn} onPress={() => { this.saveExperience(); }}>
										<Text style={styles.modalBtnTxt}>Save</Text>
									</TouchableOpacity> :

										<View style={{ flexDirection: "row" }}>
											<TouchableOpacity style={[styles.modalBtn, { flex: 1, backgroundColor: Color.goldPink }]} onPress={() => {
												Alert.alert(
													'Delete Message',
													'Are you sure want to delete?',
													[
														{
															text: 'Cancel',
															onPress: () => console.log('Cancel Pressed'),
															style: 'cancel',
														},
														{
															text: 'Yes',
															onPress: () => {
																let { signupDetails } = this.props;
																setLogEvent("work_experience", { "delete": "click", UserGuid: signupDetails.UserGuid })
																this.deleteExperience();
															},
														},
													],
													{ cancelable: false },
												);
											}}>
												<Text style={[styles.modalBtnTxt, { color: Color.weekdaycellPink }]}>Delete</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.modalBtn, { flex: 1, marginStart: 16, }]} onPress={() => {
												let { signupDetails } = this.props;
												setLogEvent("work_experience", { "save": "click", UserGuid: signupDetails.UserGuid })
												this.saveExperience();
											}}>
												<Text style={styles.modalBtnTxt}>Save</Text>
											</TouchableOpacity>
										</View>}
								</View>
							</ScrollView>
						</View>
					</View>
				</Modal>
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
)(AdditionalInfo);


import React, { useState } from 'react';
import {
	ScrollView,
	View, FlatList,
	Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Alert, BackHandler
} from 'react-native';
import styles from './style';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import back_blue from '../../../assets/back_blue.png';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share'
import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { NavigationEvents } from 'react-navigation';
import search_gray from '../../../assets/search_gray.png';
import CrossTxt from '../../../assets/cross_insearch.png';
import CloseIcon from '../../../assets/cross_primary.png';
import cross_new from '../../../assets/cross_new.png';
import plus_new from '../../../assets/plus_new.png';
import edit_new from '../../../assets/edit_primary.png';
import cross_select from '../../../assets/cross_pink.png';
import arrow_right from '../../../assets/chevron_right.png';
import WhatsAppIcon from '../../../assets/whatsapp.png';
import Snackbar from 'react-native-snackbar';
import Validator from '../../components/Validator';
import ThreeDotsModal from './ThreeDotsModal';
import { setLogEvent } from '../../service/Analytics';
import { Separator } from 'native-base';
import Trace from '../../service/Trace'
let FulltreatmentArr = [], currentMedicationFullArray = [], AllergiesFullArray = [], NotesData = '', NotesGuid = '', FamilyFullArr = [],
	FamilyConditionFullArr = [], selectedfamilyCondition = [];
let appoinmentGuid = "";
let appointmentStatus = null;
let normalListBackup = [], selectedListBackup = [];

let pName = '';
let pGender = '';
let pMobile = '';
let age = '';
let sessionCount = '';
let clinicDetails = {};
var sessionData = [];
let totalAmount = 0;
let dueAmount = 0;
let paidAmount = 0;
let pdfIconArr = [{
	urlname: '',
	url: "https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/thetho.png?sv=2018-03-28&sr=f&sig=83MchmkVQjsscADRUJi407Gvwvd4QurunB%2F2hpcNogE%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&637992701505481821"
},

{
	urlname: '',
	url: "https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/thetho.png?sv=2018-03-28&sr=f&sig=83MchmkVQjsscADRUJi407Gvwvd4QurunB%2F2hpcNogE%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&637992701505481821"
},
{
	urlname: '',
	url: "https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/thetho.png?sv=2018-03-28&sr=f&sig=83MchmkVQjsscADRUJi407Gvwvd4QurunB%2F2hpcNogE%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&637992701505481821"
},
{
	urlname: '',
	url: "https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/thetho.png?sv=2018-03-28&sr=f&sig=83MchmkVQjsscADRUJi407Gvwvd4QurunB%2F2hpcNogE%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&637992701505481821"
},
{
	urlname: '',
	url: "https://mnkdronacommonstorage.file.core.windows.net/mnkdronacommonfileshare/mnkdronacommondirectorydev/thetho.png?sv=2018-03-28&sr=f&sig=83MchmkVQjsscADRUJi407Gvwvd4QurunB%2F2hpcNogE%3D&se=9999-12-31T23%3A59%3A59Z&sp=r&637992701505481821"
}]
let doctorRegistrationNo = '';
let doctorDegree = '';



class medicalHistory extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

			fld1: Color.borderColor,
			fld2: Color.borderColor,
			fld4: Color.borderColor,
			isModalShowAddTreatment: false,
			isModalShowAddTreatmentCreate: false,
			serachTreatment: '',
			// treatmentArrAdd: [
			// 	{ name: 'Root Canal Treatment (RCT)111' },
			// 	{ name: 'Peridontal Treatment' },
			// 	{ name: 'Conservative Treatment' },
			// 	{ name: 'Endodontal Treatment' },
			// 	{ name: 'Operative Treatment' },
			// 	{ name: 'add' }
			// ],
			treatmentArrAdd: [],
			itemName: '',
			amount: '',
			addTreatmentModal: false,
			toothNumberTxt: '',
			costTxt: '',

			treatmentName: 'Root Canal Treatment',
			toothNumber: '12, 13',
			totalCost: '₹5000',
			treatmentArr: [{}], // This is remain when API implementation will done
			addedNewTreatmentGuid: '',
			dynamicTop: 0,



		};
	}

	componentDidMount() {
		let { signupDetails } = this.props;
		//
		let timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +'Treatment_Plan_List',  signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Treatment_Plan_List", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
		//
		appoinmentGuid = this.props.data && this.props.data.pastAppointmentGuid ? this.props.data.pastAppointmentGuid : signupDetails.appoinmentGuid
		appointmentStatus = this.props.item && this.props.item.appointmentStatus ? this.props.item.appointmentStatus : '';
		let dataItem = this.props.item;
		pName = dataItem.patientName;
		pGender = dataItem.gender;
		pMobile = dataItem.phoneNumber;
		age = dataItem.age;
		let tempClinicArr = DRONA.getClinicList();
		clinicDetails = tempClinicArr[0];
		console.log("Clinic details " + JSON.stringify(clinicDetails))
		setTimeout(()=>{
			this.getTreatmentMainList();
		},500)
	}
	componentWillUnmount(){
		Trace.stopTrace()
	}
	Refresh = (count) => {
		if (count > 1)
			this.getTreatmentMainList();
	}
	getTreatmentMainList = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"userGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"PatientGuid": signupDetails.patientGuid,
			"Version": "",
		}
		actions.callLogin('V1/FuncForDrAppToGetTreatmentDetails', 'post', params, signupDetails.accessToken, 'gettreatlist');
	}

	async UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.responseData && newProps.responseData.tag) {
			let tagname = newProps.responseData.tag;
			let { actions, signupDetails, loading } = this.props;
			if (tagname === 'gettreatlist') {
				try {
					if (newProps.responseData.statusCode == '0') {
						let data = newProps.responseData.data;
						if (data.length > 0 && data != null) {
							try {
								if(data[0].registrationNumber.includes(",")){
									let tempArr = data[0].registrationNumber.split(',');
									doctorRegistrationNo = tempArr[0];
									doctorDegree = tempArr[1] ?  ', '+ tempArr[1]:'';
								}
								else{
									doctorRegistrationNo = data[0].registrationNumber
								}
							} catch (error) {
								
							}
							
							
							//alert(data[0].registrationNumber)
							if (Object.keys(data[data.length - 1]).length != 0) {
								data.push({})
							}
							setTimeout(() => {
								this.setState({ treatmentArr: data });

							}, 100);
						}
					}
				} catch (e) { }
			}
			else if (tagname === 'treatapilist') {
				try {
					if (newProps.responseData.statusCode == '0') {
						let data = newProps.responseData.data;
						let tempArr = data;
						tempArr.push({ treatmentName: 'add' });
						this.setState({ treatmentArrAdd: tempArr })
						this.setState({ isModalShowAddTreatment: true });
						FulltreatmentArr = tempArr;
					}
				} catch (e) { }
			}
			else if (tagname === 'cnewtreatment') {
				let data = newProps.responseData.data;

				try {
					if (newProps.responseData.statusCode == 0) {
						this.setState({ addedNewTreatmentGuid: data.treatmentGuid })
						setTimeout(() => {
							this.setState({ addTreatmentModal: true });
						}, 500)

					}
				} catch (e) { }
			}
			else if (tagname === 'savefinaltreatment') {
				let data = newProps.responseData.data;

				try {
					if (newProps.responseData.statusCode == 0) {
						this.setState({ addedNewTreatmentGuid: data.treatmentGuid })
						this.getTreatmentMainList()
					}
				} catch (e) { }
			}



		}
	}


	addTreatmentClick = () => {
		// this.setState({ isModalShowAddTreatment: true });
		//this.props.nav.navigation.navigate('TimeSlotTreatment');
		//alert('This section is now under development')

		let { signupDetails } = this.props;
		//
		let timeRange = Trace.getTimeRange();
		Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType +'Add_Treatment_Popup',  signupDetails.firebaseLocation)
		Trace.setLogEventWithTrace(signupDetails.firebaseUserType +"Add_Treatment_Popup", { 'TimeRange' : timeRange , 'Mobile' : signupDetails.firebasePhoneNumber,'Age' : signupDetails.firebaseDOB, 'Speciality' :  signupDetails.firebaseSpeciality })
		this.callAPIForGettingTreatmentList();
		
	}
	callAPIForGettingTreatmentList = () => {
		let { actions, signupDetails } = this.props;
		let params = {
			"userGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"PatientGuid": signupDetails.patientGuid,
			"Version": "",
		}
		actions.callLogin('V1/FuncForDrAppToGetTreatmentList', 'post', params, signupDetails.accessToken, 'treatapilist');
	}
	callSaveAPI = () => {
		this.setState({ addTreatmentModal: false })
		let { actions, signupDetails } = this.props;
		let params = {
			"userGuid": signupDetails.UserGuid,
			"DoctorGuid": signupDetails.doctorGuid,
			"ClinicGuid": signupDetails.clinicGuid,
			"PatientGuid": signupDetails.patientGuid,
			"Version": "",
			"Data": {
				"ToothNumber": this.state.toothNumberTxt,
				"Cost": this.state.costTxt,
				"TreatmentGuid": this.state.addedNewTreatmentGuid
			}
		}
		actions.callLogin('V1/FuncForDrAppToAddTreatmentDetails', 'post', params, signupDetails.accessToken, 'savefinaltreatment');
	}

	callCreateNewTreatmentAPI = () => {
		let { actions, signupDetails } = this.props;
		if (!this.state.itemName.trim()) {
			Snackbar.show({ text: 'Please enter Item name', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		}
		else if (!this.state.costTxt.trim()) {
			Snackbar.show({ text: 'Please enter Cost', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
		} else {
			let params = {
				"UserGuid": signupDetails.UserGuid,
				"DoctorGuid": signupDetails.doctorGuid,
				"ClinicGuid": signupDetails.clinicGuid,
				"PatientGuid": signupDetails.patientGuid,
				"Version": "",
				"Data": {
					"TreatmentName": this.state.itemName,
					"Cost": this.state.costTxt
				}
			}
			actions.callLogin('V1/FuncForDrAppToAddNewTreatment', 'post', params, signupDetails.accessToken, 'cnewtreatment');
			this.setState({ isModalShowAddTreatmentCreate: false });
		}
	}


	callOnFocus = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.primary })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.primary })
		}

	}
	callOnBlur = (type) => {
		if (type == '1') {
			this.setState({ fld1: Color.borderColor })
		}
		else if (type == '2') {
			this.setState({ fld2: Color.borderColor })
		}
	}
	typeToothNumber = (text) => {
		if (text) {
			if (Validator.isNumberWithComma(text) && !text.startsWith(',') && !text.includes(',,') ) {
				this.setState({ toothNumberTxt: text })
			}
		} else {
			this.setState({ toothNumberTxt: text })
		}
	}
	goToNextScreen = (item, index) => {
		//alert('kk')
		this.props.nav.navigation.navigate('AddDentistAppoinment', { item: item, Refresh: this.Refresh });
	}

	sessionListView = (sessionList) => {
		if (sessionList != null) {
			let temp = []
			for (var i = 0; i < sessionList.length; i++) {
				let index = i + 1;
				const htmlCode = `
				<tr style = "border:1px  solid #EFE1FB; height : 50px">
				<td style = "width:20%">
				<p style = "text-align : center" >`+ sessionList[i].appointmentDate + `</p>
				</td>
				<td style = "width:15%">
				<p style = "text-align : center" >`+ index + `</p>
				</td>
				<td style = "width:40%; padding-right : 10px">
				<p style = "text-align : left" >`+ sessionList[i].workDone + `</p>
				</td>
				<td style = "width:25%; border-left :1px  solid #EFE1FB; height : auto ">
				<p style = "text-align : right ; padding-right : 30px" ><b>`+ sessionList[i].amountPaid + `</b></p>
				</td></tr>
				 `
				temp.push(htmlCode)
			}
			return temp.join("")
		}
		else {
			return "";
		}

	}
	goToSummary = async (item, index) => {
		let doctorFullName  =  '';
		let {signupDetails } = this.props;
		//console.log(JSON.stringify(this.state.treatmentArr[index].treatmentAppointment))
		sessionData = this.state.treatmentArr[index].treatmentAppointment;
		sessionCount = sessionData != null ?  sessionData.length.toString() : '0';
		totalAmount = this.state.treatmentArr[index].cost;
		dueAmount = this.state.treatmentArr[index].balanceAmount;
		paidAmount = this.state.treatmentArr[index].paid;
        if(signupDetails.fullName.includes("Dr.") || signupDetails.fullName.includes("dr."))
		doctorFullName = signupDetails.fullName
		else
		doctorFullName = 'Dr. ' +  signupDetails.fullName
		if (this.state.treatmentArr[index].shareIconUrl) {
			pdfIconArr = this.state.treatmentArr[index].shareIconUrl
		}
		else {
		}
		const htmlCode = `
		<style>
		table, th, td {
		  border-collapse: collapse;
		}
		th, td {
		  padding: 5px;
		  text-align: left;
		vertical-align:top;
		}
		table > tr
		{
		line-height:7px;
		}
		</style>
	<div style="width:100%; border-bottom:1px solid #EFE1FB; padding: 10px">
	<table style="width:100%">
	<tr>	
	        <td style = "vertical-align: top; width:10%">
			<img width="40" height: auto src= `+ pdfIconArr[2].url + `}/>
			</td>
			<td style = "width:40%;vertical-align: top">
			 <h2 style="color: #5019CF;">` + signupDetails.clinicName + `</h2>
			 <p style=""> ` + clinicDetails.clinicAddress + `</p>
			 <p style=""> ` + clinicDetails.clinicCity + ", " + clinicDetails.clinicState +`</p>
			 <p style="">` + clinicDetails.clinicNumber + `</p>
			 </td>
			 <td style = "vertical-align: top; width:10%">
			<img width="25" height: auto src= `+ pdfIconArr[4].url + `}/>
			</td>
			 <td style = "width:40%">
			 <h2 style="color: #5019CF">` + doctorFullName  +  doctorDegree +  `</h2>
			 <p style="">` + signupDetails.drSpeciality + `</p>
			 <p style="">Reg.No.    ` + doctorRegistrationNo + `</p>
			 </td>
	</tr>
	</table>
	</div>
	<div style="width:100%; margin-top : 5px; border-bottom:1px solid #EFE1FB;  padding: 10px">
	<table style="width:100%">
	<tr>	
			<td  style= "width:10%; vertical-align: top">
			<img width="25" height: auto src= `+ pdfIconArr[1].url + `}/>
			</td>
			<td style= "width:40%">
			 <h2 style="color: #5019CF">Patient</h2>
			 </td>
			 <td style = "vertical-align: top; width:10%">
			<img width="25" height: auto src= `+ pdfIconArr[3].url + `}/>
			</td>
			 <td style= "width:40%">
			 <h2 style="color: #5019CF">Treatment</h2>
			 </td>
	</tr>
	</table>

	<table style="width:100%">
	<tr>
	<td style = "width:10%">
	</td> 
			<td style= "width:10%">
			 <p>Name</p>
			 </td>
			 <td style= "width:35%; padding-left: 2%">
			 <p style=""><b>` + pName + `</b></p>
			 </td>
			 <td style= "width:10%">
			 <p style="">Name</p>
			 </td>
			 <td style= "width:35%; padding-left: 2%">
			 <p style=""><b>` + item.treatmentName + `</b></p>
			 </td>
	</tr>

	<tr>	
	<td style = "width:10%">
	</td> 
	<td style= "width:10%;">
	 <p style="">Gender</p>
	 </td>
	 <td style= "width:40%;  padding-left: 2%"">
	 <p style=""><b>` + pGender + `</b></p>
	 </td>
	 <td style= "width:10%;">
	 <p style="">Sessions</p>
	 </td>
	 <td style= "width:40%; padding-left: 2%"">
	 <p style=""><b>` + sessionCount + `</b></p>
	 </td>
</tr>

<tr>	
<td style = "width:10%">
	</td> 
<td style= "width:10%; ">
 <p style="">Age</p>
 </td>
 <td style= "width:25%; padding-left: 2%"">
 <p style=""><b>` + age + `</b></p>
 </td>
 <td style= "width:12%; ">
 <p style="">Tooth No.</p>
 </td>
 <td style= "width:41%; padding-left: 2%; padding-right:2%">
 <p style="word-break: break-all; width: 80%"><b>` + item.toothNumber + `</b></p>
 </td>
</tr>

<tr>	
<td style = "width:10%">
	</td> 
<td style= "width:10%; ">
 <p style="">Contact</p>
 </td>
 <td style= "width:40%; padding-left: 2%"">
 <p style=""><b>` + pMobile + `</b></p>
 </td>
 <td style= "width:10%;">
 <p style="">Amount</p>
 </td>
 <td style= "width:40%; padding-left: 2%"">
 <p style=""><b>Rs ` + item.cost + `</b></p>
 </td>
</tr>
	</table>
	</div>


<table style="width:100%; margin-top : 40px">
<tr>
		<td style = "vertical-align: top; width:10%" >
		<img width="25" height: auto src= `+ pdfIconArr[0].url + `}/>
		</td>
		<td width="90%">
		 <h2 style="color: #5019CF">` + item.treatmentName + `</h2>
		 </td>
</tr>
</table>


<div style="width:100%; margin-top : 5px; border:1px  solid #EFE1FB; border-radius: 10px;  padding-left: 10px, padding-right: 10px">	
<table style="width:100%; border-radius:5">
<tr style = "background-color : #EEEEEE">	
		<td style = "width:20%">
		 <p  style = "text-align : center" ><b>Date</b></p>
		 </td>
		 <td style = "width:15%">
		 <p style = "text-align : center"><b>Session No.</b></p>
		 </td>
		 <td style = "width:40%">
		 <p style = "text-align : center"><b>Treatment Details</b></p>
		 </td>
		 <td style = "width:25%; padding-right : 30px">
		 <p style = "text-align : right"><b>Amount (INR)</b></p>
		 </td>
</tr>
<tr>	
`+ this.sessionListView(sessionData) + `
</tr>

<tr style = "border:1px  solid #EFE1FB; height : 70px">	
		<td style = "width:20%">
		 <p style = "text-align : center"></p>
		 </td>
		 <td style = "width:15%">
		 <p style = "text-align : center"></p>
		 </td>
		 <td style = "width:40%">
		 <p style = "text-align : right; padding-top : 20px ">Total Amount Paid</p>
		 </td>
		 <td style = "width:25%">
		 <p style = "text-align : right ; padding-right : 30px; padding-top : 20px; font-size : 20px"><b>` + paidAmount  + `</b></p>
		 </td>
</tr>

<tr style = "border:1px  solid #EFE1FB; height : 50px">	
		<td style = "width:20%">
		 <p style = "text-align : center"></p>
		 </td>
		 <td style = "width:15%">
		 <p style = "text-align : center"></p>
		 </td>
		 <td style = "width:40%">
		 <p style = "text-align : right; padding-top : 8px">Balance Due</p>
		 </td>
		 <td style = "width:25%">
		 <p style = "text-align : right  ; padding-top : 8px; padding-right : 30px"><b>` + dueAmount + `</b></p>
		 </td>
</tr>

</table>

   </table>`
		let options = {
			html: htmlCode,
			fileNamey: 'test1',
			directory: 'Documents',

		};


		let file = await RNHTMLtoPDF.convert(options)
		console.log('PDF created ========= > ' + JSON.stringify(file.filePath));
		if (file != '') {
			RNFetchBlob.fs
				.readFile(file.filePath, 'base64')
				.then((data) => {
					//console.log('pdf for base64 ' + JSON.stringify(data))

					const base64Data = 'data:application/pdf;base64,' + data

					const shareOptions = {
						title: 'Share Treament Summary',
						// message: 'some message',
						url: base64Data,
						filename: 'Treatment_summary', // only for base64 file in Android
					};

					if (data) {
						
						Share.open(shareOptions)
							.then((res) => {
								console.log("m,m,m,m,")
								console.log(res);
							})
							.catch((err) => {
								err && console.log('HI ' + JSON.stringify(err));
							});

					}
					//
				})
				.catch((err) => { console.log('Error  ' + JSON.stringify(err)) });
		}
	}


	clickOnItem = (item, index) => {
		this.setState({
			treatmentName: item.treatmentName,
			addedNewTreatmentGuid: item.treatmentGuid,
			costTxt: item.cost.toString(), toothNumberTxt: ''
		})
		this.setState({ isModalShowAddTreatment: false });
		setTimeout(() => {
			console.log('Name and Guid =====>>>> ' + this.state.treatmentName + ' --- ' + this.state.addedNewTreatmentGuid)
			this.setState({ addTreatmentModal: true });
		}, 500)
	}

	funSTreatment = (sText) => {
		var searchResult = _.filter(FulltreatmentArr, function (item) {
			return item.treatmentName.toLowerCase().indexOf(sText.toLowerCase()) > -1;
		});

		this.setState({
			treatmentArrAdd: searchResult
		});
	}
	renderTreatmentList = ({ item, index }) => (
		<View>
			{
				index == this.state.treatmentArr.length - 1 ?
					<TouchableOpacity onPress={this.addTreatmentClick} style={{
						backgroundColor: Color.calenderCancelBtnBg, alignItems: 'center', marginTop: responsiveHeight(3),
						marginLeft: responsiveWidth(1.5),
						marginRight: responsiveWidth(1.5),
						justifyContent: 'center', padding: responsiveWidth(3), borderRadius: responsiveWidth(2), marginTop: responsiveWidth(4)
					}}>
						<Text style={{ fontWeight: CustomFont.fontWeight600, color: Color.primary, fontFamily: CustomFont.fontNameSemiBold, fontSize: CustomFont.font14, }}>Add Treatment</Text>
					</TouchableOpacity> :
					<TouchableOpacity onPress={() => this.goToNextScreen(item, index)} style={{
						padding: responsiveWidth(2), borderRadius: responsiveWidth(2), borderWidth: 1, borderColor: '#EFE1FB',
						marginTop: responsiveHeight(3), marginLeft: responsiveWidth(1.5), marginRight: responsiveWidth(1.5), marginTop: responsiveWidth(4)
					}}>
						<View style={{ flexDirection: 'row', marginTop: responsiveHeight(.5) }}>
							<Text style={{ flex: 11, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.optiontext }}>{item.treatmentName}</Text>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Image style={{ resizeMode: 'contain', height: responsiveFontSize(2.5), width: responsiveFontSize(2.5) }} source={arrow_right} /></View>
						</View>
						<View style={{ marginTop: responsiveHeight(1.5) }}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext }}>Tooth Number: {item.toothNumber}</Text>
						</View>
						<View style={{ marginTop: responsiveHeight(1.5) }}>
							<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext }}>Status: {item.status}</Text>
						</View>

						<View style={{ alignItems: 'center', flexDirection: 'row', marginTop: responsiveHeight(1.5) }}>
							<View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext }}>Total: ₹{item.cost}</Text>
							</View>
							<View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
								<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext }}>Paid: ₹{item.paid}</Text>
							</View>
							<View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
								<Text style={{ fontWeight: CustomFont.fontWeightBold, fontFamily: CustomFont.fontName, fontSize: CustomFont.font12, color: Color.optiontext }}>Balance: ₹{item.balanceAmount}</Text>
							</View>
						</View>
						<TouchableOpacity onPress={() => this.goToSummary(item, index)} style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
							<Image source={WhatsAppIcon} style={{ height: responsiveHeight(5), width: responsiveWidth(5), resizeMode: 'contain' }} />
							<Text style={{ marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, fontSize: CustomFont.font16, color: Color.primary, fontWeight: CustomFont.fontWeightBold }}>Share Summary via WhatsApp</Text>
						</TouchableOpacity>
					</TouchableOpacity>
			}

		</View>
	);
	renderList = ({ item, index }) => (
		<View>
			{
				item.treatmentName == 'add' ? <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', marginTop: responsiveHeight(1.8), height: responsiveHeight(6) }} onPress={() => {
					this.setState({ isModalShowAddTreatment: false, })
					setTimeout(() => {
						this.setState({ isModalShowAddTreatmentCreate: true })

					}, 1000)

				}}>
					<Image source={plus_new} style={{ tintColor: Color.black, height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), resizeMode: 'contain', marginRight: 10, tintColor: Color.primary }} />
					<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.primary, fontWeight: 'bold' }}>Create New Treatment</Text>
				</TouchableOpacity> :
					<TouchableOpacity style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between', alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: '#e1ccf9', marginTop: responsiveHeight(1.8), height: responsiveHeight(6) }} onPress={() => this.clickOnItem(item, index)}>
						<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, color: Color.fontColor, marginLeft: 10, marginRight: 10 }}>{item.treatmentName}</Text>
						<Image source={arrow_right} style={{ tintColor: Color.black, height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), resizeMode: 'contain', marginRight: 10, tintColor: Color.primary }} />
					</TouchableOpacity>
			}
		</View>
	)

	render() {
		let { actions, signupDetails } = this.props;
		return (
			<View style={{ flex: 1, backgroundColor: Color.lightGrayBg }}>
				{/* <NavigationEvents onDidFocus={() => this.getTreatmentMainList()} /> */}
				<View style={{ borderRadius: responsiveWidth(4), backgroundColor: Color.white, marginLeft: responsiveWidth(3), marginTop: responsiveHeight(2), marginRight: responsiveWidth(3) }}>
					{
						this.state.treatmentArr.length > 1 ? <Text style={{ margin: responsiveWidth(2), marginTop: responsiveHeight(2), color: Color.fontColor, fontFamily: CustomFont.fontName, fontWeight: 'bold', fontSize: CustomFont.font14 }}>Treatment Plans</Text> : null
					}
					<FlatList
						data={this.state.treatmentArr}
						renderItem={this.renderTreatmentList}
						extraData={this.state}
						style={{ marginBottom: responsiveHeight(5), marginTop: responsiveHeight(-1) }}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>

				<Modal isVisible={this.state.isModalShowAddTreatment} avoidKeyboard={true}>
					<View style={styles.modelView}>
						<View style={{ margin: 20, marginBottom: responsiveHeight(26) }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
								<Text style={styles.addtxt}>Add Treatment</Text>
								<TouchableOpacity onPress={() => 
								{
									Trace.stopTrace();
									this.setState({ isModalShowAddTreatment: false })
								}}>
									<Image style={{ resizeMode: 'contain', height: responsiveFontSize(2.5), width: responsiveFontSize(2.5), marginRight: 5 }} source={CloseIcon} />
								</TouchableOpacity>
							</View>
							<View style={[styles.searchView, { borderColor: this.state.fld4, borderWidth: 1, backgroundColor: Color.white, margin: 0, marginTop: 20 }]}>
								<TextInput returnKeyType="done"
									onFocus={() => this.callOnFocus('4')}
									onBlur={() => this.callOnBlur('4')}
									placeholderTextColor={Color.placeHolderColor}
									style={styles.searchInput} placeholder="Search treatments" value={this.state.serachTreatment}
									onChangeText={(serachTreatment) => {
										// let { signupDetails } = this.props;
										// setLogEvent("patient_consultation", { "search_diagnosis": "search", UserGuid: signupDetails.UserGuid, "keyword": diagnosticSearchTxt })
										this.setState({ serachTreatment })
										this.funSTreatment(serachTreatment)
									}}
								/>

								{this.state.serachTreatment ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ serachTreatment: '' }); }}>
									<Image style={{ ...styles.crossSearch, tintColor: Color.primary, }} source={cross_new} />
								</TouchableOpacity> : null}
							</View>
							<FlatList
								data={this.state.treatmentArrAdd}
								ItemSeparatorComponent={this.renderSeparator}
								renderItem={this.renderList}
								extraData={this.state}
								keyExtractor={(item, index) => index.toString()}
								style={{ height: responsiveHeight(50), marginBottom: responsiveHeight(60), marginTop: responsiveHeight(3) }}
							/>
						</View>
					</View>



				</Modal>

				<Modal isVisible={this.state.isModalShowAddTreatmentCreate} avoidKeyboard={true}>
					<View style={styles.modelView}>
						<View style={{ margin: 25, marginBottom: responsiveHeight(26) }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
								<TouchableOpacity onPress={() => this.setState({ isModalShowAddTreatmentCreate: false })}>
									<Image style={{ resizeMode: 'contain', height: responsiveFontSize(4), width: responsiveFontSize(4), marginRight: 10 }} source={back_blue} />
								</TouchableOpacity>
								<Text style={styles.addtxt}>Create New Treatment</Text>
								<Text />

							</View>
							<Text style={styles.inputHeader}>Item Name</Text>
							<TextInput onFocus={() => this.callOnFocus('1')}
								onBlur={() => this.callOnBlur('1')}
								style={[styles.createInputStyle, { borderColor: this.state.fld1 }]} placeholder="Enter Item Name" placeholderTextColor={Color.placeHolderColor} onChangeText={itemName => {
									this.setState({ itemName });
									this.setState({ treatmentName: itemName })
								}} value={this.state.itemName} returnKeyType="done" />

							<Text style={styles.inputHeader}>Cost</Text>
							<TextInput onFocus={() => this.callOnFocus('2')}
								onBlur={() => this.callOnBlur('2')}
								style={[styles.createInputStyle, { borderColor: this.state.fld2, }]} placeholder="Enter Amount" placeholderTextColor={Color.placeHolderColor} onChangeText={costTxt => {
									if (costTxt) {
										if (Validator.isMobileValidate(costTxt)) {
											this.setState({ costTxt });
										}
									} else
										this.setState({ costTxt });
									}} value={this.state.costTxt} keyboardType="number-pad" returnKeyType="done" maxLength={7} />
							<TouchableOpacity
								onPress={() => {
									this.callCreateNewTreatmentAPI();
								}}
								style={{ marginTop: responsiveHeight(2.5), borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, height: responsiveHeight(6), marginBottom: responsiveHeight(20) }}>
								<Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName, fontWeight: '600' }}>Create</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				<Modal isVisible={this.state.addTreatmentModal}
					onPress={() => {
						this.setState({ addTreatmentModal: false });
					}}>

					<View style={styles.modelViewAddTreatment}>
						<ScrollView style={{ marginTop: responsiveHeight(2) }}>
							<View style={{ marginTop: this.state.dynamicTop }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
									<View style={{ padding: 7 }}>
										<Text style={{ fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700', marginLeft: 10 }}>Add Treatment</Text>
									</View>
									<TouchableOpacity style={{ padding: 7 }} onPress={() => {
										this.setState({ addTreatmentModal: false });
									}}>
										<Image source={cross_new} style={{ height: responsiveWidth(4), width: responsiveWidth(4), marginRight: 10, resizeMode: 'contain' }} />
									</TouchableOpacity>
								</View>
								<View style={{ marginTop: responsiveHeight(4), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
									<TextInput returnKeyType="done" style={{
										height: responsiveHeight(7),
										fontSize: CustomFont.font14,
										color: Color.fontColor,
										textAlign: 'left',
										paddingLeft: 10,
										borderRadius: 10,
										backgroundColor: Color.accountTypeSelBg,
										fontWeight: CustomFont.fontWeight400,
										fontFamily: CustomFont.fontName, borderColor: Color.weekdaycellPink, borderWidth: 1
									}}
										value={this.state.treatmentName}
										editable={false}
										// placeholder={"DD/MM/YYYY"}
										placeholderTextColor={Color.datecolor}
									/>
								</View>

								<View style={{ borderRadius: 10, borderColor: '#EFE1FB', padding: responsiveWidth(2), paddingTop: responsiveHeight(2), paddingBottom: responsiveHeight(2), borderWidth: 1, marginTop: responsiveHeight(6), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
									<Text style={{ color: Color.fontColor, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeightBold }}>Tooth Number</Text>
									<TextInput returnKeyType="done" onChangeText={this.typeToothNumber} style={{
										height: responsiveHeight(7),
										fontSize: CustomFont.font14,
										color: Color.fontColor,
										textAlign: 'left',
										paddingLeft: 10,
										borderRadius: 10,
										marginTop: responsiveHeight(1.5),
										// backgroundColor : Color.accountTypeSelBg,
										fontWeight: CustomFont.fontWeight400,
										fontFamily: CustomFont.fontName, borderColor: Color.borderColor, borderWidth: 1
									}}
										value={this.state.toothNumberTxt}
										placeholder={"Enter 12,13"}
										placeholderTextColor={Color.datecolor}
										maxLength={80}
									/>
								</View>

								<View style={{ borderRadius: 10, borderColor: '#EFE1FB', padding: responsiveWidth(2), paddingTop: responsiveHeight(2), paddingBottom: responsiveHeight(2), borderWidth: 1, marginTop: responsiveHeight(6), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3) }}>
									<Text style={{ color: Color.fontColor, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeightBold }}>Cost</Text>
									<TextInput returnKeyType="done" onChangeText={costTxt => {
															if (costTxt) {
																if (Validator.isMobileValidate(costTxt)) {
																	this.setState({ costTxt });
																}
															} else
																this.setState({ costTxt });
															}} style={{
										height: responsiveHeight(7),
										fontSize: CustomFont.font14,
										color: Color.fontColor,
										textAlign: 'left',
										paddingLeft: 10,
										borderRadius: 10,
										marginTop: responsiveHeight(1.5),
										// backgroundColor : Color.accountTypeSelBg,
										fontWeight: CustomFont.fontWeight400,
										fontFamily: CustomFont.fontName, borderColor: Color.borderColor, borderWidth: 1
									}}
										value={this.state.costTxt}
										placeholder={"Enter Manually"}
										placeholderTextColor={Color.datecolor}
										onFocus={() => {
											this.setState({ dynamicTop: responsiveHeight(-10) })
										}}
										onBlur={() => {
											this.setState({ dynamicTop: 0 })
										}}
										maxLength={7}
										keyboardType={'number-pad'}
									/>
								</View>

								<View style={{ marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2), marginBottom: responsiveHeight(20), marginTop: responsiveHeight(10) }}>
									<TouchableOpacity style={{ marginBottom: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: responsiveWidth(1.5), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', alignItems: 'center', height: responsiveHeight(5.5), backgroundColor: Color.primaryBlue, marginTop: responsiveWidth(4) }}
										onPress={() => {
											//this.setState({addTreatmentModal:false})
											let correctToothNumber = true;
											if (this.state.toothNumberTxt.indexOf(',') > -1) {
												let tempArr = this.state.toothNumberTxt.split(',');

												for (let i = 0; i < tempArr.length; i++) {
													if (tempArr[i].length > 2) {
														correctToothNumber = false;
													}

												}
												if (this.state.toothNumberTxt.charAt(this.state.toothNumberTxt.length - 1) == ',' || this.state.toothNumberTxt.charAt(0) == ',') {
													correctToothNumber = false;
												}

											}
											else {
												if (this.state.toothNumberTxt.length > 2) {
													correctToothNumber = false;
												}
											}
											if (this.state.toothNumberTxt == '') {
												Snackbar.show({ text: 'Please enter tooth number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											} else if (this.state.toothNumberTxt.includes(' ')) {
												Snackbar.show({ text: 'Please enter valid tooth number ', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											}
											else if (this.state.toothNumberTxt.length > 86) {
												Snackbar.show({ text: 'Please enter valid tooth number', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											}
											else if (!correctToothNumber) {
												Snackbar.show({ text: 'Please enter tooth number in valid format', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											} else if (this.state.costTxt == '') {
												Snackbar.show({ text: 'Please enter cost', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											}
											else if (this.state.costTxt.includes(' ')) {
												Snackbar.show({ text: 'Cost can not includs space', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
											}
											else {
												this.callSaveAPI()
											}

										}}>
										<Text style={{ fontWeight: CustomFont.fontWeightBold, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(0), color: Color.white, }}>Save</Text>
									</TouchableOpacity>
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
)(medicalHistory);

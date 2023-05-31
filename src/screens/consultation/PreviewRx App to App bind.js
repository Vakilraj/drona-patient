import React from 'react';
import {
    Image, SafeAreaView, Text,
    TouchableOpacity, View, Platform, BackHandler, FlatList, PermissionsAndroid,Linking
} from 'react-native';
import { DataTable } from 'react-native-paper';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/arrowBack_white.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import PDFView from 'react-native-view-pdf';
import { ScrollView } from 'react-native-gesture-handler';

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Language from '../../utils/Language.js';
import * as signupActions from '../../redux/actions/signupActions';
import * as apiActions from '../../redux/actions/apiActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Moment from 'moment';
import { red100 } from 'react-native-paper/lib/typescript/styles/colors';
const resourceType = 'file';
let flag = 0;
let clinicInfo = '';
let doctorInfo = '';
var time = new Date().getTime();
var date = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();

let patientInfo = '';
let symptomList = '';
let vitalList = '';
let medicalHistoryList = '';
let findingList = '';
let medicineList = '';
let prescriptionNote = '';
let instructionsList = '';
let investigationList = '';
let diagnosisList = '';
let followUpItem = '';
let registrationNumber = '';
let eSign = '';
let prescriptionHeading = '';
let symptomHead = '';
let vitalHead = '';
let medicalHistoryHead = '';
let findingHead = '';
let investigationAdvise = '';
let instructionHead = '';
let diagionsisHead = '';
let notes = '';
let medicine = '';
let timingAndDur = '';
let Rx = '';
let noteStr = '';
let consultTypeValue = '';
let followupHead = '', from = '';
let procedureList = '', procedureHead = '';
let selectedConditions = [], selectedMedications = [], selectedAllergies = [], selectedFamilyHistory = [], patientCondition = [];

import Trace from '../../service/Trace'
let timeRange = '';
let billingPreviewData = {};
class PreviewRx extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            filePath: '',
            resources: { file: '' },
            prescriptionDataFullArray: [],
            billingDetailsFullArray: [],
            successPdfGeneration: false,
            successPdfGenerationMsg: '',
            languageArr: [
                { value: 'en', index: 0, label: 'English', isTempSelected: false },
                { value: 'be', index: 1, label: 'Bengali', isTempSelected: false },
                { value: 'hi', index: 2, label: 'Hindi', isTempSelected: false },
                { value: 'ma', index: 3, label: 'Marathi', isTempSelected: false },
                { value: 'ta', index: 4, label: 'Tamil', isTempSelected: false },
                { value: 'te', index: 5, label: 'Telegu', isTempSelected: false },
                { value: 'gu', index: 6, label: 'Gujarati', isTempSelected: false },
            ],
            dynamicTop: 7,
            showNormalPrescription: true,
        };
        flag == 0;
        this.backHandler=null;
    }

    async componentDidMount() {

        let { signupDetails } = this.props;
        timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Prescription_Preview', signupDetails.firebaseLocation)
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Prescription_Preview", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

        //
        from = this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.from ? this.props.navigation.state.params.from : '';
        if (from == 'normalPrescription') {
            try {
                let tempIndex = await AsyncStorage.getItem('lanIndex');
                Language.language.setLanguage(this.state.languageArr[tempIndex].value)
            } catch (error) {
            }
            billingPreviewData = this.props.navigation.state?.params?.billingPreviewData;
            console.log('-----'+JSON.stringify(billingPreviewData));
            if (billingPreviewData) {
                this.billingPreviewDataFun()
            }
        } else {
            this.setState({ showNormalPrescription: false })
        }
        consultTypeValue = signupDetails.consultType;
        let filePath = this.props.navigation.state.params.PreviewPdfPath;
        if (filePath) {
            if (filePath.includes('/')) {
                let str = filePath.split('/');
                let name = str[str.length - 1];
                this.setState({ resources: { file: name } });
            } else {
                this.setState({ resources: { file: filePath } });
            }
        }
        this.setState({
            filePath: filePath,
        })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }
    billingPreviewDataFun = () => {
        
        let prescriptionDataFullArray = billingPreviewData.prescriptionData;

        time = new Date().getTime();
        time = Moment(time).format('h:mm:ss a')
        date = new Date().getDate();
        date = date < 10 ? '0' + date : '' + date
        month = new Date().getMonth() + 1;
        month = month < 10 ? '0' + month : '' + month
        year = new Date().getFullYear();

        vitalList = prescriptionDataFullArray.vitalList != null ? prescriptionDataFullArray.vitalList : [];
        medicalHistoryList = prescriptionDataFullArray != null ? prescriptionDataFullArray : [];
        clinicInfo = prescriptionDataFullArray.clinicInfo != null ? prescriptionDataFullArray.clinicInfo : []
        doctorInfo = prescriptionDataFullArray.doctorInfo != null ? prescriptionDataFullArray.doctorInfo : [];
        patientInfo = prescriptionDataFullArray.patientInfo != null ? prescriptionDataFullArray.patientInfo : [];
        symptomList = prescriptionDataFullArray.symptomList != null ? prescriptionDataFullArray.symptomList : [];
        findingList = prescriptionDataFullArray.findingList != null ? prescriptionDataFullArray.findingList : [];
        medicineList = prescriptionDataFullArray.medicineList != null ? prescriptionDataFullArray.medicineList : [];
        prescriptionNote = prescriptionDataFullArray.prescriptionNote != null ? prescriptionDataFullArray.prescriptionNote : [];
        instructionsList = prescriptionDataFullArray.instructionsList != null ? prescriptionDataFullArray.instructionsList : [];
        investigationList = prescriptionDataFullArray.investigationList != null ? prescriptionDataFullArray.investigationList : [];
        diagnosisList = prescriptionDataFullArray.diagnosisList != null ? prescriptionDataFullArray.diagnosisList : [];
        procedureList = prescriptionDataFullArray.procedureList != null ? prescriptionDataFullArray.procedureList : [];
        followUpItem = prescriptionDataFullArray.followUp;
        registrationNumber = doctorInfo ? doctorInfo.registrationNumber : '';
        eSign = prescriptionDataFullArray != null ? prescriptionDataFullArray.esignature : null;
        prescriptionHeading = Language.language.pres;
        symptomHead = Language.language.symptoms;
        findingHead = Language.language.findings;
        investigationAdvise = Language.language.advisedinvestigation;
        instructionHead = Language.language.instructions;
        diagionsisHead = Language.language.diagnosis;
        notes = Language.language.notes;
        medicine = Language.language.medicine;
        timingAndDur = Language.language.timingandduration;
        noteStr = Language.language.note;
        followupHead = Language.language.followup;
        procedureHead = Language.language.procedures;

        vitalHead = Language.language.vital;
        medicalHistoryHead = Language.language.medicalHistory;
        Rx = Language.language.Rx;
        try {
            selectedConditions = medicalHistoryList.selectedConditions
            selectedMedications = medicalHistoryList.selectedCurrentMedicationList
            selectedAllergies = medicalHistoryList.selectedAllergies
            selectedFamilyHistory = medicalHistoryList.selectedFamilyHistory
        } catch (error) {

        }

    }
    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentWillUnmount() {
        Trace.stopTrace()
        this.backHandler.remove();
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
       
    }

    symptomsView = (symptomList, from) => {
        let temp = []

        for (var i = 0; i < symptomList.length; i++) {
            let tempStr = '';
            if (symptomList[i].severityName)
                tempStr = symptomList[i].severityName;
            if (symptomList[i].since)
                tempStr += tempStr ? ', ' + symptomList[i].since : symptomList[i].since;
            if (symptomList[i].notes)
                tempStr += tempStr ? ', ' + symptomList[i].notes : symptomList[i].notes;
            if (tempStr)
                tempStr = '(' + tempStr + ')'
            if (i == 0) {
                // const htmlCode = symptomList[i].symptomName;
                const htmlCode = symptomList[i].symptomName + ' ' + tempStr;
                temp.push(htmlCode)
            }
            else {
                const htmlCode = ', ' + symptomList[i].symptomName + ' ' + tempStr;
                temp.push(htmlCode)
            }
        }
        if (from == 'pdf') {
            const htmlCode = `
    <table style="width:100%;margin-top: 5px" >
        <tr>
            <th style="width:15%;">`+ symptomHead + ` :</th>
            <td style= "text-transform: capitalize;">`+ temp.join(", ") + `</td>
        </tr>
    </table>
    `
            return htmlCode
        } else {
            return temp.join("");

        }


    }

    findingView = (findingList, from) => {

        let temp = []

        for (var i = 0; i < findingList.length; i++) {
            let tempStr = '';
            if (findingList[i].severityName)
                tempStr = findingList[i].severityName;
            if (findingList[i].since)
                tempStr += tempStr ? ', ' + findingList[i].since : findingList[i].since;
            if (findingList[i].notes)
                tempStr += tempStr ? ', ' + findingList[i].notes : findingList[i].notes;
            if (tempStr)
                tempStr = '(' + tempStr + ')'
            if (i == 0) {
                //const htmlCode = findingList[i].findingName;
                const htmlCode = findingList[i].findingName + ' ' + tempStr;
                temp.push(htmlCode)
            }
            else {
                // const htmlCode = ', ' + findingList[i].findingName;
                const htmlCode = ', ' + findingList[i].findingName + ' ' + tempStr;
                temp.push(htmlCode)
            }
        }

        if (from === 'pdf') {
            const htmlCodeForFinding = `
        <table style="width:100%;margin-top: 5px" >
  <tr>
    <th style="width:15%;">`+ findingHead + ` :</th>
   <td style= "text-transform: capitalize;">`+ temp.join(", ") + `</td>  
  </tr> 
</table> 
        `
            return htmlCodeForFinding;
        } else {
            return temp.join("")
        }
    }
    procedureView = (procedureList) => {
        let temp = []

        for (var i = 0; i < procedureList.length; i++) {
            if (i == 0) {
                const htmlCode = procedureList[i].procedureName;
                temp.push(htmlCode)
            }
            else {
                const htmlCode = ', ' + procedureList[i].procedureName;
                temp.push(htmlCode)
            }
        }

        if (from === 'pdf') {
            const htmlCodeProcedure = `
			<table style="width:100%;margin-top: 5px" >
				<tr>
					<th style="width:15%;">`+ procedureHead + ` :</th>
					<td style= "text-transform: capitalize;">`+ temp.join(", ") + `</td>
				</tr>
			</table>
			`
            return htmlCodeProcedure;
        } else {
            return temp.join("")
        }
    }

    vitalView = (vitalList, from) => {
        let temp = []

        for (var i = 0; i < vitalList.length; i++) {
            if (vitalList[i].vitalName == 'BMI') {
                vitalList[i].vitalUnit = 'kg/m²'
            }
            if (vitalList[i].vitalName == 'Temperature') {
                vitalList[i].vitalUnit = '°F'
            }
            if (i == 0) {
                const htmlCode = vitalList[i].vitalName + ': ' + vitalList[i].vitalValue + ' ' + vitalList[i].vitalUnit;
                temp.push(htmlCode)
            }
            else {
                const htmlCode = ', ' + vitalList[i].vitalName + ': ' + vitalList[i].vitalValue + ' ' + vitalList[i].vitalUnit;
                temp.push(htmlCode)
            }
        }
        const htmlCodeForVitals = `
			<table style="width:100%;margin-top: 5px" >
				<tr>
					<th style="width:15%;">`+ vitalHead + ` :</th>
					<td style="text-transform: capitalize;">`+ temp.join(", ") + `</td>
				</tr>
			</table>
			`
        if (from === 'pdf') {
            return htmlCodeForVitals
        } else {
            return temp.join("")
        }


    }
    // symptomsView = (symptomList) => {
    //     let temp = []

    //     for (var i = 0; i < symptomList.length; i++) {

    //         const htmlCode = '• ' + symptomList[i].symptomName + '\n';

    //         temp.push(htmlCode)
    //     }
    //     return temp.join("")
    // }

    // findingView = (findingList) => {

    //     let temp = []

    //     for (var i = 0; i < findingList.length; i++) {

    //         const htmlCode = '• ' + findingList[i].findingName + '\n';

    //         temp.push(htmlCode)
    //     }
    //     return temp.join("")
    // }

    diagnosisView = (diagnosisList, from) => {

        let temp = []

        for (var i = 0; i < diagnosisList.length; i++) {
            let tempStr = '';
            if (diagnosisList[i].diagnosisStatus)
                tempStr = diagnosisList[i].diagnosisStatus;
            if (diagnosisList[i].since)
                tempStr += tempStr ? ', ' + diagnosisList[i].since : diagnosisList[i].since;
            if (diagnosisList[i].notes)
                tempStr += tempStr ? ', ' + diagnosisList[i].notes : diagnosisList[i].notes;
            if (tempStr)
                tempStr = '(' + tempStr + ')'
            if (i == 0) {
                //const htmlCode = diagnosisList[i].diagnosisName;
                const htmlCode = diagnosisList[i].diagnosisName + ' ' + tempStr;
                temp.push(htmlCode)
            } else {
                //const htmlCode = ', ' + diagnosisList[i].diagnosisName;
                const htmlCode = ', ' + diagnosisList[i].diagnosisName + ' ' + tempStr;
                temp.push(htmlCode)
            }
        }
        const htmlCodeForDiagnosis = `
        <table style="width:100%;margin-top: 5px" >
          <tr>
        <th style="width:15%;">`+ diagionsisHead + ` :</th>
        <td style= "text-transform: capitalize;">`+ temp.join(", ") + `</td>  
          </tr> 
        </table>
                `
        if (from === 'pdf') {
            return htmlCodeForDiagnosis
        } else {
            return temp.join("")
        }

    }


    followUpView = (followUpItem, from) => {
        let temp = ''
        if (followUpItem) {
            let followupFormatDate = followUpItem.followUpDate.split("T")[0];
            temp = Moment(followupFormatDate).format('DD-MM-YYYY');
        }

        if (from == 'pdf') {
            const htmlCodeFollowUpView = `
			<table style="width:100%;margin-top: 5px" >
	  <tr>
		<th style="width:15%;vertical-align:top">`+ followupHead + ` :</th>
	   <td style="vertical-align:text">`+ temp + `</td>  
	  </tr> 
	</table>
			`
            return htmlCodeFollowUpView;
        } else {
            return temp;
        }


    }

    investigationsView = (investigationList, from) => {
        let temp = []
        for (var i = 0; i < investigationList.length; i++) {
            // const htmlCode = '• ' + investigationList[i].investigationName + '\n';
            // temp.push(htmlCode)
            if (i == 0) {
                //const htmlCode = investigationList[i].investigationName;
                const htmlCode = (investigationList[i].investigationName) + ' ' + (investigationList[i].notes ? '(' + investigationList[i].notes + ')' : '');
                temp.push(htmlCode)
            } else {
                //const htmlCode = ', ' + investigationList[i].investigationName;
                const htmlCode = ', ' + (investigationList[i].investigationName) + ' ' + (investigationList[i].notes ? '(' + investigationList[i].notes + ')' : '');
                temp.push(htmlCode)
            }
        }
        if (from === 'pdf') {
            const htmlCodeForInvestigations = `
        <table style="width:100%;margin-top: 5px" >
        <tr>
          <th style="width:15%;vertical-align:text-top">`+ investigationAdvise + `:</th>
         <td style="vertical-align:text-top; text-transform: capitalize;">`+ temp.join(", ") + `</td>  
        </tr> 
      </table>
        `
            return htmlCodeForInvestigations;
        } else {
            return temp.join("")
        }
    }

    instructionView = (instructionsList, from) => {
        let temp = []
        for (var i = 0; i < instructionsList.length; i++) {
            // const htmlCode = '• ' + instructionsList[i].instructionsName + '\n';
            // temp.push(htmlCode)
            if (i == 0) {
                const htmlCode = instructionsList[i].instructionsName;
                temp.push(htmlCode)
            } else {
                const htmlCode = ', ' + instructionsList[i].instructionsName;
                temp.push(htmlCode)
            }
        }

        if (from === 'pdf') {
            const htmlCodeInstruction = `
                    <table style="width:100%;margin-top: 5px" >
                    <tr>
                      <th style="width:15%;vertical-align:top">`+ instructionHead + ` :</th>
                     <td style="vertical-align:text; text-transform: capitalize;">`+ temp.join(", ") + `</td>  
                    </tr> 
                  </table>
                    `
            return htmlCodeInstruction
        } else {
            return temp.join("")
        }
    }

    doctorSpeciality = (doctorInfo) => {
        let htmlCode = '';
        if (doctorInfo.doctorSpeciality) {
            htmlCode = doctorInfo.doctorSpeciality[0].specialtyName;
        }
        return htmlCode;
    }

    doctorEducationView = (doctorInfo) => {
        let temp = []
        if (doctorInfo.doctorEducation != null && doctorInfo.doctorEducation.length > 0) {
            for (var i = 0; i < doctorInfo.doctorEducation.length; i++) {
                let tmpStr = ''
                if (doctorInfo.doctorEducation[i].degree) {
                    tmpStr = '' + doctorInfo.doctorEducation[i].degree;
                }
                if (doctorInfo.doctorEducation[i].fieldofStudy) {
                    tmpStr += ', ' + doctorInfo.doctorEducation[i].fieldofStudy;
                }
                if (doctorInfo.doctorEducation[i].location) {
                    tmpStr += ', ' + doctorInfo.doctorEducation[i].location;
                }
                temp.push(tmpStr)
            }
        }
        return temp
    }
    doctorEducationViewWithoutAddress = (doctorInfo) => {
        let temp = []
        if (doctorInfo.doctorEducation != null && doctorInfo.doctorEducation.length > 0) {
            for (var i = 0; i < doctorInfo.doctorEducation.length; i++) {
                let tmpStr = ''
                if (doctorInfo.doctorEducation[i].degree) {
                    tmpStr = '' + doctorInfo.doctorEducation[i].degree;
                }
                temp.push(tmpStr)
            }
        }
        return temp && temp.length > 0 ? temp.join() : '';
    }

    selectedList = (selectedConditions, selectedMedications, selectedAllergies, selectedFamilyHistory, from) => {
        let temp = []; let selConditionArr = []; let selMedicationArr = []; let selAllergyArr = []; let selFamilyHistoryArr = [];
        let selectedConditionName, selectedMedicationsName, selectedAllergiesName
        if (selectedConditions && selectedConditions.length > 0) {
            for (var i = 0; i < selectedConditions.length; i++) {
                selectedConditionName = selectedConditions[i].conditionName
                const htmlCode = ' ' + selectedConditionName;
                selConditionArr.push(htmlCode)
            }
        }
        if (selectedMedications && selectedMedications.length > 0) {
            for (var i = 0; i < selectedMedications.length; i++) {
                selectedMedicationsName = selectedMedications[i].medicineName
                const htmlCode = ' ' + selectedMedicationsName;
                selMedicationArr.push(htmlCode)
            }
        }
        if (selectedAllergies && selectedAllergies.length > 0) {
            for (var i = 0; i < selectedAllergies.length; i++) {
                selectedAllergiesName = selectedAllergies[i].allergyName
                const htmlCode = " " + selectedAllergiesName;
                selAllergyArr.push(htmlCode)
            }
        }
        if (selectedFamilyHistory && selectedFamilyHistory.length > 0) {
            for (var i = 0; i < selectedFamilyHistory.length; i++) {
                const parentName = selectedFamilyHistory[i].familyHistoryName;
                const patientConditionArr = selectedFamilyHistory[i].patientCondition
                let tempVarOne = '';
                if (patientConditionArr && patientConditionArr.length > 0)
                    for (var j = 0; j < patientConditionArr.length; j++) {
                        if (j == 0)
                            tempVarOne = patientConditionArr[j].conditionName;
                        else
                            tempVarOne += ', ' + patientConditionArr[j].conditionName;
                    }
                selFamilyHistoryArr.push(parentName + ': ' + tempVarOne)
            }
        }
        if (selConditionArr && selConditionArr.length)
            temp.push(selConditionArr)
        if (selMedicationArr && selMedicationArr.length)
            temp.push(selMedicationArr)
        if (selAllergyArr && selAllergyArr.length)
            temp.push(selAllergyArr)
        if (selFamilyHistoryArr && selFamilyHistoryArr.length)
            temp.push(selFamilyHistoryArr.join("; "));


        if (from === 'pdf') {
            const htmlCode = `
        <table style="width:100%;margin-top: 5px" >
           <tr>
         <th style="width:15%;">`+ medicalHistoryHead + ` :</th>
           <td style= "text-transform: capitalize;">`+ temp.join("; ") + `</td>
         </tr>
        </table>
               `
            return temp && temp.length > 0 ? htmlCode : '';
        } else {
            return temp.join("; ")
        }

    }

    MedicineList = (item, index) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, borderColor: '#ddd', borderWidth: 1 }}>
                    <Text style={{ color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, marginRight: responsiveWidth(2) }}>{index + 1}</Text>
                </View>
                <View style={{ flex: 4, borderColor: '#ddd', borderWidth: 1 }}>
                    <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, marginRight: responsiveWidth(2) }}><Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{item.medicineName + '\n'}</Text><Text style={{ fontStyle: 'italic' }}>({item.medicineDesc})</Text></Text>
                </View>
                <View style={{ flex: 3, borderColor: '#ddd', borderWidth: 1 }}>
                    <Text style={{ color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(2) }}>{item.dosagePattern} {!item.medicineTimingFrequency || item.medicineTimingFrequency == 'No Preference' ? null : ' (' + item.medicineTimingFrequency + ')'} {'\n' + 'dose: ' + item.dosages + ', ' + item.durationType}</Text>
                    {/* <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(2) }}>{item.dosagePattern} {!item.medicineTimingFrequency || item.medicineTimingFrequency == 'No Preference' ? null : ' (' + item.medicineTimingFrequency + ')'} {'\n' + 'dose: ' + item.dosages + ', ' + item.durationValue + ' ' + item.durationType}</Text> */}
                </View>
                <View style={{ flex: 2, borderColor: '#ddd', borderWidth: 1 }}>
                    <Text style={{ color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(2) }}>{item.note}</Text>
                </View>
            </View>
        )
    }
    callCreatePdf = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.createPDF(billingPreviewData.prescriptionData)
            } else {
                Alert.alert('Permission Denied!', 'You need to give storage permission to download the file',[
                    { text: "OK", onPress: () => Linking.openSettings() }
                ]);
            }
        } else {
            this.createPDF(billingPreviewData.prescriptionData)
        }
    }
    showOriginalValueView = (value) => {
        let temp = []
        if (value) {
            const htmlCode =
                `` + value + ``
            temp.push(htmlCode)
        } else {
            const htmlCode = `
        &nbsp 
        `
            temp.push(htmlCode)
        }
        return temp
        //return value;
    }
    showmedicineListViewList = (medicineList) => {
        if (medicineList && medicineList.length > 0) {
            let temp = []
            for (var i = 0; i < medicineList.length; i++) {
                let index = i + 1
                const htmlCode = `
				 <tr>
				 <td style="width:8%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;">`+ index + `</td>
				 <td style="width:35%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;text-transform: capitalize;"><b>`+ medicineList[i].medicineName + ` ` + `</b></br>` + `(<i>` + medicineList[i].medicineDesc + `</i>)` + `</td>
					<td style="width:40%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;text-transform: capitalize;"> `+ (medicineList[i].dosagePattern) + (!medicineList[i].medicineTimingFrequency || medicineList[i].medicineTimingFrequency == 'No Preference' ? '' : ' (' + medicineList[i].medicineTimingFrequency + ')') + ` </br> ` + 'dose: ' + medicineList[i].dosages + `, ` + medicineList[i].durationValue + ` ` + medicineList[i].durationType + ` </td>
					<td style="width:25%, padding: 8px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;text-transform: capitalize;">`+ medicineList[i].note + `</td>
				  </tr>
				 `
                temp.push(htmlCode)
            }

            const htmlCode = `
			<table style="width:100%;margin-top: 20px" >  
		<tr style="display: table-row; vertical-align: inherit;border-color: inherit; ">
			<th width="8%" style="background-color: #14091529;color: #000;text-align: left;font-size: 12px;font-weight: 700;
		  border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ Rx + ` </th>
			<th width="35%" style="background-color: #14091529;color: #000;text-align: left;font-size: 12px;font-weight: 700;
		  border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ medicine + ` </th>
			<th width="40%" style="background-color: #14091529;color: #000;text-align: letf;font-size: 12px;font-weight: 700;
		  border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ timingAndDur + `</th>
			<th width="25%" style="background-color: #14091529;color: #000;text-align: left;font-size: 12px;font-weight: 700;
		  border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ notes + `</th>      
		</tr>
	   </tr>

	   <tr>
	   `+ temp + `
	    </tr>
	  </table>
			`
            return htmlCode
        }
        else {
            return ''
        }

    }
    getNotes = (prescriptionNote) => {
        if (prescriptionNote.prescriptionNoteName) {
            const htmlCode = `
            <table style="width:100%;margin-top: 5px" >
               <tr>
             <th style="width:15%;">`+ medicalHistoryHead + ` :</th>
               <td style= "text-transform: capitalize;">`+ prescriptionNote.prescriptionNoteName + `</td>
             </tr>
            </table>
                   `
            return htmlCode;
        } else
            return ''

    }
    createPDF = async (prescriptionDataFullArray, billingDetailsFullArray) => {
        const htmlCode = `
    <style>
      table, th, td {
  border-collapse: collapse;
}
th, td {
  padding: 5px;
  text-align: left;
}
</style>
     
    <h1>`+ prescriptionHeading + `</h1>
    <table style="width:100%">
    <tr>
            <td max-width="20%">
                 <img width="100" height="100" src=`+ clinicInfo.clinicImageUrl + ` />		  
            </td>
            <td width="50%" style="vertical-align:top; ">			
                  <h2>`+ clinicInfo.clinicName + `</h2>
                  <p>`+ clinicInfo.clinicAddress + `</p>
                  `+ clinicInfo.clinicNumber + `
            </td>
            <td width="30%" style="vertical-align:top;">
                    <h2>Dr. `+  doctorInfo.firstName  + ` ` +  doctorInfo.lastName + `</h2>
                    `+ this.doctorSpeciality(doctorInfo) + `
                    `+ this.doctorEducationView(doctorInfo) + `
                    <p>Reg no. : ` + registrationNumber + `</p>
            </td>
    </tr>
   </table>

     <hr style="height:3px"/>

    <table style="width:100%">
    <tr>
      <td width="70%" ><b>Name:</b> `+  patientInfo.firstName + ` ` +  patientInfo.lastName + `</td>		  
      <td width="30%" ><b>Date:</b> `+ date + `-` + month + `-` + year + `</td>
    </tr>

    <tr>
        <td><b>Sex/Age:</b> `+ patientInfo.gender + `, ` + patientInfo.age + `</td>
        <td><b>Mobile:</b> `+  patientInfo.contactNumber + `</td>
    </tr>

    <tr>
        <td><b>Consult ID:</b> `+ patientInfo?.patientCode + `</td>
        <td><b>Consult Type:</b> `+ consultTypeValue + `</td>
    </tr>

  </table>

     <hr style="height:3px"/>

     `+ this.vitalView(vitalList, 'pdf') + `
     `+ this.selectedList(selectedConditions, selectedMedications, selectedAllergies, selectedFamilyHistory, 'pdf') + `
     `+ this.symptomsView(symptomList, 'pdf') + `
     `+ this.findingView(findingList, 'pdf') + `
     `+ this.diagnosisView(diagnosisList, 'pdf') + `
     `+ this.showmedicineListViewList(medicineList) + `
     `+ this.investigationsView(investigationList, 'pdf') + `
     `+ this.instructionView(instructionsList, 'pdf') + `
      `+ this.procedureView(procedureList, 'pdf') + `
      `+ this.getNotes(prescriptionNote) + `
      `+ this.followUpView(followUpItem, 'pdf') + `
  <table style="width:100%;margin-bottom:0px">
  <tr>  
  <td width="80%"/>
  <td width="20%">
    <img width="150" height="40" src=`+ eSign + ` />
  </td>
  </tr>
  </table>

  <table style="width:100%;margin-top:0px">
  <tr>  
  <td width="80%"/>
  <td width="20%">
  Dr. `+  doctorInfo.firstName + ` ` +  doctorInfo.lastName + this.doctorSpeciality(doctorInfo) + this.doctorEducationViewWithoutAddress(doctorInfo) + `<p>Reg no. : ` + registrationNumber + `</p>
  </td>
  </tr>
  </table>
</table>`

        let options = {
            html: htmlCode,

            fileNamey: 'test',
            directory: 'Documents',

        };

        let file = await RNHTMLtoPDF.convert(options);
        console.log('-------' + JSON.stringify(file))
        //DRONA.setIsReloadApi(false);
        this.props.navigation.navigate('BillingComplete', { filePath: file.filePath, prevScreenName: from, billingPreviewData: billingPreviewData })
        // this.props.nav.navigation.navigate('PreviewRx', { PreviewPdfPath: file?.filePath, from: 'normalPrescription', consultId: patientInfo?.patientCode });
    }

    clinicInfoNo = (clinicNoInfo) => {
        let temp = []

        if (clinicNoInfo > 0) {
            let htmlCode = `<p>Clinic Ph. No: ` + clinicNoInfo + `</p>`
            temp.push(htmlCode)
            return htmlCode;
        }
        else {
            let htmlCode = ` &nbsp `
            temp.push(htmlCode)
            return htmlCode;
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.patientBackground }}>
                <View style={{ flex: 1, backgroundColor: Color.patientBackground }}>

                    <View style={{ flexDirection: 'row', backgroundColor: Color.white, justifyContent: 'space-between', height: responsiveHeight(7), alignItems: 'center', zIndex: 999 }}>
                        <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image source={arrowBack} style={{ height: responsiveWidth(4), width: responsiveWidth(5), tintColor: Color.primary, marginLeft: 5 }} />
                            <Text style={{ color: Color.black, fontSize: CustomFont.font16, fontWeight: 'bold', marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>Prescription</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.showNormalPrescription ? <View style={{ flex: 1, backgroundColor: Color.white, }}>
                        <ScrollView>
                            <View style={{ flex: 1, minHeight: responsiveHeight(42) }}>
                                <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font18, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, }}>{prescriptionHeading}</Text>
                                <View style={{ flexDirection: 'row', marginTop: responsiveWidth(2), }}>
                                    <View style={{ flex: 3, borderWidth: 1, borderColor: Color.grayBorder, marginLeft: responsiveWidth(5), marginBottom: responsiveHeight(2), maxHeight: responsiveHeight(15) }}>
                                        <Image source={{ uri: clinicInfo.clinicImageUrl }} style={{ width: responsiveWidth(22), height: responsiveHeight(15) }} />
                                    </View>
                                    <View style={{ flex: 5, }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, }}>{clinicInfo.clinicName ? clinicInfo.clinicName : null}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{clinicInfo.clinicAddress ? clinicInfo.clinicAddress : null}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>Clinic Ph. No: {clinicInfo.clinicNumber ? clinicInfo.clinicNumber : null}</Text>
                                    </View>
                                    <View style={{ flex: 5 }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{doctorInfo.firstName ? doctorInfo.firstName + ' ' + doctorInfo.lastName : null}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{this.doctorSpeciality(doctorInfo)}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{this.doctorEducationView(doctorInfo)}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>Reg no. {registrationNumber}</Text>
                                    </View>
                                </View>

                                <View style={{ paddingTop: responsiveHeight(1), paddingBottom: responsiveHeight(1), marginLeft: responsiveWidth(5), marginRight: responsiveWidth(5), flexDirection: 'row', borderColor: Color.grayTxt, borderTopWidth: 1, borderBottomWidth: 1, marginTop: 0, marginBottom: responsiveWidth(2), }}>
                                    <View style={{ flex: 6, }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Name: </Text>{patientInfo.firstName ? patientInfo.firstName + ' ' + patientInfo.lastName : null}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Sex/Age:</Text> {patientInfo.gender ? patientInfo.gender + ', ' + patientInfo.age : null}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Consult ID:</Text> {patientInfo?.patientCode}</Text>
                                    </View>
                                    <View style={{ flex: 6 }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Date:</Text> {date ? date + `-` + month + `-` + year : null} {time ? time : null}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Mobile:</Text> {patientInfo.contactNumber ? patientInfo.contactNumber : null}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Consult Type:</Text> {consultTypeValue}</Text>
                                    </View>
                                </View>
                                {(vitalList && vitalList.length > 0) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginTop: 0, }}><Text style={{ fontWeight: 'bold' }}>{vitalList && vitalList.length > 0 ? vitalHead : ''}: </Text> {this.vitalView(vitalList, '')}</Text>
                                    </View>
                                    : null}
                                {(selectedConditions && selectedConditions.length > 0) || (selectedMedications && selectedMedications.length > 0) || (selectedAllergies && selectedAllergies.length > 0) || (selectedFamilyHistory && selectedFamilyHistory.length > 0) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), textTransform: 'capitalize', maxWidth: responsiveWidth(90) }}><Text style={{ fontWeight: 'bold' }}>{medicalHistoryHead}: </Text>{this.selectedList(selectedConditions, selectedMedications, selectedAllergies, selectedFamilyHistory)}</Text>
                                    </View>
                                    : null}

                                {(symptomList && symptomList.length > 0) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), maxWidth: responsiveWidth(90) }}><Text style={{ fontWeight: 'bold' }}>{symptomList && symptomList.length > 0 ? symptomHead : ''}: </Text> {this.symptomsView(symptomList)}</Text>
                                    </View>
                                    : null}

                                {(findingList && findingList.length > 0) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), maxWidth: responsiveWidth(90) }}><Text style={{ fontWeight: 'bold' }}>{findingList && findingList.length > 0 ? findingHead : ''}: </Text> {this.findingView(findingList)}</Text>
                                    </View>
                                    : null}

                                {/* {(symptomList && symptomList.length > 0) || (findingList && findingList.length > 0) ? 
                                <View style={{  flexDirection: 'row' }}>
                                    <View style={{ flex: 3, }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{symptomList && symptomList.length > 0 ? symptomHead : ''}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginTop: 10, }}>{this.symptomsView(symptomList)}</Text>
                                    </View>
                                    <View style={{ flex: 3 }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{findingList && findingList.length > 0 ? findingHead : ''}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginTop: 10 }}>{this.findingView(findingList)}</Text>
                                    </View>
                                </View>:null} */}

                                {diagnosisList && diagnosisList.length ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, maxWidth: responsiveWidth(90) }}><Text style={{ fontWeight: 'bold' }}>{diagionsisHead}: </Text> {this.diagnosisView(diagnosisList)}</Text>
                                    </View>
                                    : null}

                                {medicineList && medicineList.length > 0 ? <View style={{ marginLeft: responsiveWidth(5), marginRight: responsiveWidth(5), marginTop: responsiveWidth(2) }}>
                                    <View style={{ backgroundColor: '#14091529', flexDirection: 'row' }}>
                                        <View style={{ flex: 1, borderColor: '#f1f1f1', borderWidth: 1, }}>
                                            <Text style={{ padding: 5, color: Color.black, marginLeft: responsiveWidth(1), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(0) }}>{Rx}</Text>
                                        </View>
                                        <View style={{ flex: 4, borderColor: '#f1f1f1', borderWidth: 1 }}>
                                            <Text style={{ padding: 5, color: Color.black, marginLeft: responsiveWidth(2), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{medicine}</Text>
                                        </View>
                                        <View style={{ flex: 3, borderColor: '#f1f1f1', borderWidth: 1 }}>
                                            <Text style={{ padding: 5, color: Color.black, marginLeft: responsiveWidth(2), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{timingAndDur}</Text>
                                        </View>
                                        <View style={{ flex: 2, borderColor: '#f1f1f1', borderWidth: 1 }}>
                                            <Text style={{ padding: 5, color: Color.black, marginLeft: responsiveWidth(2), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{noteStr}</Text>
                                        </View>
                                    </View>
                                    <FlatList
                                        data={medicineList}
                                        renderItem={({ item, index }) => this.MedicineList(item, index)}
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View> : null}

                                {investigationList && investigationList.length > 0 ? <View style={{ marginTop: 5 }}>
                                    <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, maxWidth: responsiveWidth(90) }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{investigationAdvise}:</Text> {this.investigationsView(investigationList)}</Text>
                                </View> : null}

                                {instructionsList && instructionsList.length > 0 ?
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, maxWidth: responsiveWidth(90) }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{instructionHead}: </Text>{this.instructionView(instructionsList)}</Text>

                                    </View> : null}

                                {(procedureList && procedureList.length > 0) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), maxWidth: responsiveWidth(90) }}><Text style={{ fontWeight: 'bold' }}>{procedureList && procedureList.length > 0 ? procedureHead : ''}: </Text> {this.procedureView(procedureList)}</Text>
                                    </View>
                                    : null}

                                {prescriptionNote.prescriptionNoteName ?
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, maxWidth: responsiveWidth(90) }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), fontWeight: 'bold' }}>{notes}:</Text> {prescriptionNote.prescriptionNoteName}</Text>
                                    </View> : null}

                                {followUpItem ?
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{followupHead}: </Text>{this.followUpView(followUpItem)}</Text>

                                    </View> : null}




                            </View>
                            {eSign ?
                                <View>
                                    <View style={{ flexDirection: 'row', marginRight: responsiveWidth(5), marginTop: this.state.dynamicTop }}>
                                        <View style={{ flex: 6, }}>
                                        </View>
                                        <View style={{ flex: 3, borderColor: Color.grayTxt, borderWidth: 1, }}>
                                            <Image source={{ uri: eSign }} style={{ height: responsiveHeight(5), marginRight: 5, resizeMode: 'contain' }} />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 6, }}>
                                        </View>
                                        <View style={{ flex: 4 }}>
                                            <Text style={{ color: Color.black, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginLeft: responsiveWidth(3) }}>Dr. {doctorInfo.firstName ? doctorInfo.firstName + ' ' + doctorInfo.lastName : null}</Text>
                                            <Text style={{ color: Color.black, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginLeft: responsiveWidth(3) }}>{this.doctorSpeciality(doctorInfo)}</Text>
                                            <Text style={{ color: Color.black, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginLeft: responsiveWidth(3) }}>{this.doctorEducationViewWithoutAddress(doctorInfo)}</Text>
                                            <Text style={{ color: Color.black, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginLeft: responsiveWidth(3) }}>Reg no. {registrationNumber}</Text>
                                        </View>
                                    </View>

                                </View> : null}
                        </ScrollView>

                    </View> : <View style={{ backgroundColor: Color.patientBackground, flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <PDFView
                                fadeInDuration={250.0}
                                style={{ flex: 1, margin: 15 }}
                                resource={Platform.OS === 'android' ? this.state.filePath : this.state.resources[resourceType]}
                                resourceType={resourceType}
                            />
                        </View>
                    </View>}


                    <View style={{ flexDirection: 'row', padding: 10, backgroundColor: Color.white, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (from == 'normalPrescription')
                                    this.props.navigation.goBack();
                                else {
                                    this.props.navigation.goBack(null);
                                    this.props.navigation.goBack(null);
                                }
                            }}
                            style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.cancelButtonBg, width: '35%', height: responsiveHeight(6) }}>
                            <Text style={{ color: Color.primary, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600 }}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.callCreatePdf();
                                //this.props.navigation.navigate('BillingComplete', { filePath: this.state.filePath, prevScreenName: from })
                            }}
                            style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, width: '60%', height: responsiveHeight(6) }}>
                            <Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600 }}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
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
)(PreviewRx);

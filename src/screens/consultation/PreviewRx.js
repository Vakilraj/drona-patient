import React from 'react';
import {
    Image, SafeAreaView, Text,
    TouchableOpacity, View, Platform, BackHandler, FlatList,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import arrowBack from '../../../assets/arrowBack_white.png';
import Color from '../../components/Colors';
import CustomFont from '../../components/CustomFont';
import PDFView from 'react-native-view-pdf';
import { ScrollView } from 'react-native-gesture-handler';
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
let timeRange = '', consultId = '';
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
    }

    getFuncForDrAppToConsulatationBillingPreview = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "RoleCode": signupDetails.roleCode,
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "Version": "",
            "Data": {
                "version": null,
                "AppointmentGuid": signupDetails.appoinmentGuid,
            }
        }
        actions.callLogin('V14/FuncForDrAppToConsulatationBillingPreview', 'post', params, signupDetails.accessToken, 'consulatationBillingPreviewDataVIEW');
    }
    componentDidMount() {

        let { signupDetails } = this.props;
        timeRange = Trace.getTimeRange();
        Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.drSpeciality, signupDetails.firebaseUserType + 'Prescription_Preview', signupDetails.firebaseLocation)
        Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Prescription_Preview", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.drSpeciality })

        //
        from = this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.from ? this.props.navigation.state.params.from : '';
        if (from == 'normalPrescription') {
            this.getFuncForDrAppToConsulatationBillingPreview();
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
        consultId = this.props.navigation.state.params.consultId;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
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
        try {
            let tempIndex = await AsyncStorage.getItem('lanIndex');
            Language.language.setLanguage(this.state.languageArr[tempIndex].value)
        } catch (error) {
        }
        if (newProps.responseData && newProps.responseData.tag) {
            let tagname = newProps.responseData.tag;
            if (tagname === 'consulatationBillingPreviewDataVIEW') {

                let data = newProps.responseData.data;


                let billingDetailsFullArray = data.billingDetails;
                let prescriptionDataFullArray = data.prescriptionData;


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
        }
    }

    symptomsView = (symptomList) => {
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
        return temp.join("")
    }

    findingView = (findingList) => {

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
        return temp.join("")
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
        return temp.join("")
    }

    vitalView = (vitalList) => {
        let temp = []

        for (var i = 0; i < vitalList.length; i++) {
            if (i == 0) {
                const htmlCode = vitalList[i].vitalName + ': ' + vitalList[i].vitalValue;
                temp.push(htmlCode)
            }
            else {
                const htmlCode = ', ' + vitalList[i].vitalName + ': ' + vitalList[i].vitalValue;
                temp.push(htmlCode)
            }
        }
        return temp.join("")
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

    diagnosisView = (diagnosisList) => {

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
        return temp.join("")
    }


    followUpView = (followUpItem) => {
        let temp = []
        if (followUpItem) {
            let followupFormatDate = followUpItem.followUpDate.split("T")[0];
            followupFormatDate = Moment(followupFormatDate).format('DD-MM-YYYY');
            followupHead = Language.language.followup;
            const htmlCode = followupFormatDate;

            temp.push(htmlCode)
        }
        return temp
    }

    investigationsView = (investigationList) => {
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
        return temp.join("")
    }

    instructionView = (instructionsList) => {
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
        return temp.join("")
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

    selectedList = (selectedConditions, selectedMedications, selectedAllergies, selectedFamilyHistory) => {
        let temp = []
        let selectedConditionName, selectedMedicationsName, selectedAllergiesName
        const selCondition = selectedConditions
        for (var i = 0; i < selCondition.length; i++) {
            selectedConditionName = selCondition[i].conditionName
            const htmlCode = ' ' + selectedConditionName + ",";
            temp.push(htmlCode)
        }
        const selMedication = selectedMedications
        for (var i = 0; i < selMedication.length; i++) {
            selectedMedicationsName = selMedication[i].medicineName
            const htmlCode = ' ' + selectedMedicationsName + ",";
            temp.push(htmlCode)
        }
        const selAllergies = selectedAllergies
        for (var i = 0; i < selAllergies.length; i++) {
            selectedAllergiesName = selAllergies[i].allergyName
            const htmlCode = " " + selectedAllergiesName + ",";
            temp.push(htmlCode)
        }

        let tempVar
        const selFamilyHistory = selectedFamilyHistory
        for (var i = 0; i < selFamilyHistory.length; i++) {
            const htmlCode = selFamilyHistory[i].familyHistoryName;
            const htmlSecCode = selFamilyHistory[i].patientCondition
            let tempVarOne = '';
            for (var j = 0; j < htmlSecCode.length; j++) {
                tempVar = htmlSecCode[j].conditionName
                tempVarOne = tempVarOne + tempVar + ', '
            }
            temp.push(htmlCode + ': ' + tempVarOne)
        }
        return temp.join("")

    }

    MedicineList = (item, index) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, borderColor: '#ddd', borderWidth: 1 }}>
                    <Text style={{ color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, marginRight: responsiveWidth(2) }}><Text style={{ fontWeight: 'bold' }}>{index + 1}</Text></Text>
                </View>
                <View style={{ flex: 4, borderColor: '#ddd', borderWidth: 1 }}>
                    <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, marginRight: responsiveWidth(2) }}>• <Text style={{ fontWeight: 'bold' }}>{item.medicineName + ' ' + item.strength + '\n'}</Text> <Text style={{ fontStyle: 'italic' }}>({item.medicineDesc})</Text></Text>
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
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Consult ID:</Text> {consultId}</Text>
                                    </View>
                                    <View style={{ flex: 6 }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Date:</Text> {date ? date + `-` + month + `-` + year : null} {time ? time : null}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Mobile:</Text> {patientInfo.contactNumber ? patientInfo.contactNumber : null}</Text>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>Consult Type:</Text> {consultTypeValue}</Text>
                                    </View>
                                </View>
                                {(vitalList && vitalList.length > 0) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginTop: 0, }}><Text style={{ fontWeight: 'bold' }}>{vitalList && vitalList.length > 0 ? vitalHead : ''}: </Text> {this.vitalView(vitalList)}</Text>
                                    </View>
                                    : null}
                                {(medicalHistoryList) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginTop: 0, textTransform: 'capitalize' }}><Text style={{ fontWeight: 'bold' }}>{medicalHistoryList ? medicalHistoryHead : ''}: </Text>{this.selectedList(selectedConditions, selectedMedications, selectedAllergies, selectedFamilyHistory)}</Text>
                                    </View>
                                    : null}

                                {(symptomList && symptomList.length > 0) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginTop: 0, }}><Text style={{ fontWeight: 'bold' }}>{symptomList && symptomList.length > 0 ? symptomHead : ''}: </Text> {this.symptomsView(symptomList)}</Text>
                                    </View>
                                    : null}

                                {(findingList && findingList.length > 0) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginTop: 0 }}><Text style={{ fontWeight: 'bold' }}>{findingList && findingList.length > 0 ? findingHead : ''}: </Text> {this.findingView(findingList)}</Text>
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
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ fontWeight: 'bold' }}>{diagionsisHead}: </Text> {this.diagnosisView(diagnosisList)}</Text>
                                    </View>
                                    : null}

                                {medicineList && medicineList.length > 0 ? <View style={{ marginLeft: responsiveWidth(5), marginRight: responsiveWidth(5), marginTop: responsiveWidth(2) }}>
                                    <View style={{ backgroundColor: '#14091529', flexDirection: 'row' }}>
                                        <View style={{ flex: 1, borderColor: '#f1f1f1', borderWidth: 1, }}>
                                            <Text style={{ padding: 5, color: Color.black, marginLeft: responsiveWidth(1), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(0) }}>{Rx}</Text>
                                        </View>
                                        <View style={{ flex: 4, borderColor: '#f1f1f1', borderWidth: 1 }}>
                                            <Text style={{ padding: 5, color: Color.black, marginLeft: responsiveWidth(2), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{medicine}:</Text>
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
                                    <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{investigationAdvise}:</Text> {this.investigationsView(investigationList)}</Text>
                                </View> : null}

                                {instructionsList && instructionsList.length > 0 ?
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{instructionHead}: </Text>{this.instructionView(instructionsList)}</Text>

                                    </View> : null}

                                {(procedureList && procedureList.length > 0) ?
                                    <View>
                                        <Text style={{ textTransform: 'capitalize', color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginTop: 0, }}><Text style={{ fontWeight: 'bold' }}>{procedureList && procedureList.length > 0 ? procedureHead : ''}: </Text> {this.procedureView(procedureList)}</Text>
                                    </View>
                                    : null}

                                {prescriptionNote.prescriptionNoteName ?
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(5), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), fontWeight: 'bold' }}>{notes}:</Text> {prescriptionNote.prescriptionNoteName}</Text>
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
                                            <Text style={{ color: Color.black, fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight700, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), marginLeft: responsiveWidth(3) }}>{this.doctorEducationView(doctorInfo)}</Text>
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
                                this.props.navigation.navigate('BillingComplete', { filePath: this.state.filePath, prevScreenName: from })
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

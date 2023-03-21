import React from 'react';
import {
  Image, SafeAreaView, Text,
  TouchableOpacity, View, Platform, BackHandler, FlatList, TextInput
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
import down from '../../../assets/down.png';
import up from '../../../assets/uparrow.png';
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
let findingHead = '';
let investigationAdvise = '';
let instructionHead = '';
let diagionsisHead = '';
let notes = '';
let medicine = '';
let timingAndDur = '';
let noteStr = '';
let consultTypeValue = '';
let followupHead = '', from = '';
import Trace from '../../service/Trace'
let timeRange = '', consultId = '';
class Templates extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      load:false,
      // dataArray: ['Upper Respiratory Tract Infection (URTI)', 'Ulcers', 'Ear Ache'],
      dataArray: ['Upper Respiratory Tract Infection (URTI)'],

      isTemplate: false,
      fld1: Color.inputdefaultBorder,
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
    //this is dev param guid- when use stag need to 
    let params = {
      "RoleCode": 10,
      "UserGuid": "8ff1f5e1-1be7-11ec-9bc3-0022486b91c8",
      "DoctorGuid": "e8a698db-2a8d-11ed-adb4-40c6245e6e0d",
      "ClinicGuid": "182e2617-2a8e-11ed-adb4-40c6245e6e0d",
      "Version": "",
      "Data":
      {
        "version": null,
        "AppointmentGuid": "9aeda9e5-a91a-11ed-88d2-563711b03f2a"
      }
      // "RoleCode": signupDetails.roleCode,
      // "UserGuid": signupDetails.UserGuid,
      //       "DoctorGuid": signupDetails.doctorGuid,
      //       "ClinicGuid": signupDetails.clinicGuid,
      //       "Version": "",
      //       "Data": {
      //           "version": null,
      //           "AppointmentGuid": signupDetails.appoinmentGuid,
    }
    actions.callLogin('V1/FuncForDrAppToConsulatationBillingPreview', 'post', params, signupDetails.accessToken, 'consulatationBillingPreviewDataVIEW');
  }
  componentDidMount() {
    let { signupDetails } = this.props;
    timeRange = Trace.getTimeRange();
    Trace.startTrace(timeRange, signupDetails.firebasePhoneNumber, signupDetails.firebaseDOB, signupDetails.firebaseSpeciality, signupDetails.firebaseUserType + 'Prescription_Preview', signupDetails.firebaseLocation)
    Trace.setLogEventWithTrace(signupDetails.firebaseUserType + "Prescription_Preview", { 'TimeRange': timeRange, 'Mobile': signupDetails.firebasePhoneNumber, 'Age': signupDetails.firebaseDOB, 'Speciality': signupDetails.firebaseSpeciality })

    from = this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.from ? this.props.navigation.state.params.from : '';

    this.getFuncForDrAppToConsulatationBillingPreview();
    consultTypeValue = signupDetails.consultType;
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
        followUpItem = prescriptionDataFullArray.followUp;
        registrationNumber = doctorInfo ? doctorInfo.registrationNumber : '';
        eSign = prescriptionDataFullArray != null ? prescriptionDataFullArray.esignature : null;
        prescriptionHeading = Language.language.pres;
        symptomHead = 'Symptoms';
        findingHead = Language.language.findings;
        investigationAdvise = Language.language.advisedinvestigation;
        instructionHead = Language.language.instructions;
        diagionsisHead = Language.language.diagnosis;
        notes = Language.language.notes;
        medicine = Language.language.medicine;
        timingAndDur = Language.language.timingandduration;
        noteStr = Language.language.note;
        followupHead = Language.language.followup;
        try {

        } catch (error) {

        }
      }
    }
  }

  symptomsView = (symptomList) => {
    let temp = []

    for (var i = 0; i < symptomList.length; i++) {
      if (i == 0) {
        const htmlCode = symptomList[i].symptomName;
        temp.push(htmlCode)
      }
      else {
        const htmlCode = ', ' + symptomList[i].symptomName;
        temp.push(htmlCode)
      }
    }
    return temp.join("")
  }

  findingView = (findingList) => {

    let temp = []

    for (var i = 0; i < findingList.length; i++) {

      if (i == 0) {
        const htmlCode = findingList[i].findingName;
        temp.push(htmlCode)
      }
      else {
        const htmlCode = ', ' + findingList[i].findingName;
        temp.push(htmlCode)
      }
    }
    return temp.join("")
  }

  diagnosisView = (diagnosisList) => {

    let temp = []

    for (var i = 0; i < diagnosisList.length; i++) {
      if (i == 0) {
        const htmlCode = diagnosisList[i].diagnosisName;
        temp.push(htmlCode)
      } else {
        const htmlCode = ', ' + diagnosisList[i].diagnosisName;
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
      if (i == 0) {
        const htmlCode = investigationList[i].investigationName;
        temp.push(htmlCode)
      } else {
        const htmlCode = ', ' + investigationList[i].investigationName;
        temp.push(htmlCode)
      }
    }
    return temp.join("")
  }

  instructionView = (instructionsList) => {
    let temp = []
    for (var i = 0; i < instructionsList.length; i++) {
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
          tmpStr = ' ' + doctorInfo.doctorEducation[i].degree;
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


  MedicineList = (item, index) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 4, borderColor: '#ddd', borderWidth: 1 }}>
          <Text style={{ color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(2) }}>• <Text style={{ fontWeight: 'bold' }}>{item.medicineName + ' ' + item.strength + '\n'}</Text> {item.medicineDesc}</Text>
        </View>
        <View style={{ flex: 3, borderColor: '#ddd', borderWidth: 1 }}>
          <Text style={{ color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(2) }}>{item.dosagePattern} {item.medicineTimingFrequency == 'No Preference' ? null : ' (' + item.medicineTimingFrequency + ')'} {'\n' + 'dose: ' + item.dosages + ', ' + item.durationValue + ' ' + item.durationType}</Text>
        </View>
        <View style={{ flex: 2, borderColor: '#ddd', borderWidth: 1 }}>
          <Text style={{ color: Color.black, marginLeft: responsiveWidth(2), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(2) }}>{item.note}</Text>
        </View>
      </View>
    )
  }

  renderList = ({ item, index }) => (
    <View style={{ flex: 1 }}>
    <ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity style={{ width: '55%', paddingRight: 5, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: responsiveWidth(6), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight700, color: Color.yrColor }}>{item}</Text>
          <Image style={{ width: 10, height: 5.63, padding: 0,tintColor:Color.primary }} source={!this.state.isTemplate ? down : up} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if(this.state.isTemplate === false)
            this.setState({isTemplate: true})
            else
            this.setState({isTemplate: false})
          }}
          style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, width: '25%', height: responsiveHeight(5) }}>
          <Text style={{ color: Color.white, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight600 }}>Load</Text>
        </TouchableOpacity>
      </View>

      {
			!this.state.isTemplate ? null :
      <View style={{marginBottom: 0, backgroundColor: Color.white, }}>   
          <View style={{ minHeight: responsiveHeight(165) }}>
            {(symptomList && symptomList.length > 0) ?
              <View style={{ marginTop: responsiveHeight(0) }}>
                <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(3), marginTop: 0, }}><Text style={{ fontWeight: 'bold' }}>{symptomList && symptomList.length > 0 ? symptomHead : ''}: </Text> {this.symptomsView(symptomList)}</Text>
              </View>
              : null}

            {(findingList && findingList.length > 0) ?
              <View style={{ marginTop: responsiveHeight(1) }}>
                <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(3), marginTop: 0 }}><Text style={{ fontWeight: 'bold' }}>{findingList && findingList.length > 0 ? findingHead : ''}: </Text> {this.findingView(findingList)}</Text>
              </View>
              : null}

            {diagnosisList && diagnosisList.length ?
              <View style={{ flexDirection: 'row', marginTop: responsiveHeight(1) }}>
                <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(3), }}><Text style={{ fontWeight: 'bold' }}>{diagionsisHead}: </Text> {this.diagnosisView(diagnosisList)}</Text>
              </View>
              : null}

            {medicineList && medicineList.length > 0 ? <View style={{ marginLeft: responsiveWidth(0), marginRight: responsiveWidth(3), marginTop: responsiveWidth(2) }}>
              <View style={{ backgroundColor: '#14091529', flexDirection: 'row', marginTop: responsiveHeight(1) }}>
                <View style={{ flex: 4, borderColor: '#f1f1f1', borderWidth: 1 }}>
                  <Text style={{ padding: 5, color: Color.black, marginLeft: responsiveWidth(0), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{medicine}:</Text>
                </View>
                <View style={{ flex: 3, borderColor: '#f1f1f1', borderWidth: 1 }}>
                  <Text style={{ padding: 5, color: Color.black, marginLeft: responsiveWidth(0), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{timingAndDur}</Text>
                </View>
                <View style={{ flex: 2, borderColor: '#f1f1f1', borderWidth: 1 }}>
                  <Text style={{ padding: 5, color: Color.black, marginLeft: responsiveWidth(0), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5) }}>{noteStr}</Text>
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

            {investigationList && investigationList.length > 0 ? <View style={{ marginTop: responsiveHeight(1) }}>
              <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(3), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{investigationAdvise}:</Text> {this.investigationsView(investigationList)}</Text>
            </View> : null}

            {instructionsList && instructionsList.length > 0 ?
              <View style={{ marginTop: responsiveHeight(1) }}>
                <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(3), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{instructionHead}: </Text>{this.instructionView(instructionsList)}</Text>

              </View> : null}

            {followUpItem ?
              <View style={{ marginTop: responsiveHeight(1) }}>
                <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(3), fontWeight: 'bold', fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}>{followupHead}: </Text>{this.followUpView(followUpItem)}</Text>

              </View> : null}

            {prescriptionNote.prescriptionNoteName ?
              <View style={{ marginTop: responsiveHeight(1) }}>
                <Text style={{ color: Color.black, marginLeft: responsiveWidth(0), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, }}><Text style={{ color: Color.black, marginLeft: responsiveWidth(3), fontSize: CustomFont.font12, fontFamily: CustomFont.fontName, marginRight: responsiveWidth(5), fontWeight: 'bold' }}>{notes}:</Text> {prescriptionNote.prescriptionNoteName}</Text>
              </View> : null}
          </View>  
      </View>
}

      </ScrollView>
    </View>
  );

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.patientBackground }}>
        <View style={{ flex: 1, backgroundColor: Color.patientBackground }}>
          <View style={{ flexDirection: 'row', backgroundColor: Color.white, justifyContent: 'space-between', height: responsiveHeight(7), alignItems: 'center', zIndex: 999 }}>
            <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
              <Image source={arrowBack} style={{ height: responsiveWidth(4), width: responsiveWidth(5), tintColor: Color.primary, marginLeft: 5 }} />
              <Text style={{ color: Color.black, fontSize: CustomFont.font16, fontWeight: 'bold', marginLeft: responsiveWidth(4), fontFamily: CustomFont.fontName, }}>Templates</Text>
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: Color.patientSearchBackgroundLight }}>
            <TextInput returnKeyType="done"
              onFocus={this.callOnFocus}
              onBlur={this.callOnBlur}
              maxLength={10}
              //keyboardType={'phone-pad'}
              placeholderTextColor={Color.placeHolderColor}
              style={{
                margin: 10, padding: 0, backgroundColor: Color.patientSearchBg, height: responsiveHeight(5.5), borderRadius: 5, paddingLeft: 10, paddingRight: 10, marginLeft: responsiveWidth(4),
                marginRight: responsiveWidth(4), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName,
                color: Color.patientSearch, fontWeight: '400', letterSpacing: 1
              }} placeholder="Search Templates" value={this.state.searchTxt}
              onChangeText={(searchTxt) => {
                // this.setState({ patientNumber: searchTxt });
                // return this.SearchFilterFunction(searchTxt);
              }} />
          </View>

          <View style={{flex:1, backgroundColor: Color.white, marginTop: responsiveHeight(0.3) }}>
            <View style={{ marginLeft: responsiveWidth(4), marginRight: responsiveWidth(3), }}>
              {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}> */}
                <FlatList
                  data={this.state.dataArray}
                  renderItem={this.renderList}
                  // extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                />
              {/* </View> */}
            </View>
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
)(Templates);

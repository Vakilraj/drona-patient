import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, Button,
} from 'react-native';

import Login from './screens/login'
import ForgetPassword from './screens/login/ForgetPassword'
import DoctorHome from './screens/doctorHome'
import SearchPatients from './screens/appoinment/SearchPatients'
import SideBar from '../src/screens/drawerContainer/DrawerContainer';

import OtpVerification from './screens/signup/OtpVerification'
import LoginWithOtp from './screens/signup/LoginWithOtp'

import GetStarted from './screens/getStarted'
import createAccount from './screens/signup/createAccount'
import ApplyClinicSetting from './screens/signup/ApplyClinicSetting'
import AboutYourselfStep1 from './screens/signup/AboutYourselfStep1'
import BecomeAMember from './screens/signup/BecomeAMember'
import PayForMemberShip from './screens/signup/PayForMemberShip'
import AccountActivatedMessage from './screens/signup/AccountActivatedMessage'
import SetUpClinic from './screens/setUpClinic'
import ClinicList from './screens/setUpClinic/ClinicList'
import AddNewClinic from './screens/setUpClinic/AddNewClinic'
import AddNewClinicDetails from './screens/setUpClinic/AddNewClinicDetails'
import NewClinicRequestSentSuccess from './screens/setUpClinic/NewClinicRequestSentSuccess'
import AppoinmentTimesShow from './screens/appoinment/AppoinmentTimesShow'
import ConfirmAppointment from './screens/appoinment/ConfirmAppointment'
import AddNewPatients from './screens/appoinment/AddNewPatients'
import {init} from '../src/utils/Global';
import HelpAndSupport from './screens/helpAndSupport'
import QuestionList from './screens/helpAndSupport/QuestionList'
import AnswerDetails from './screens/helpAndSupport/AnswerDetails'
import SearchQuestion from './screens/helpAndSupport/SearchQuestion'
import Notification from './screens/notification'
import NotificationDetails from './screens/notification/NotificationDetails'
import NotificationForRequest from './screens/notification/NotificationForRequest'
import AboutUs from './screens/aboutUs'
import AboutusDetails from './screens/aboutUs/AboutusDetails'
import PrivacyPolicyDetails from './screens/aboutUs/PrivacyPolicyDetails'
import TermsofUseDetails from './screens/aboutUs/TermsofUseDetails'
import OtpVerifyForgetPassword from './screens/login/OtpVerifyForgetPassword'
import NewPasswordSetup from './screens/login/NewPasswordSetup'
import PasswordChangeSuccess from './screens/login/PasswordChangeSuccess'
import Profile from './screens/profile'
import EditBasicInfo from './screens/profile/EditBasicInfo'
import ChangePassword from './screens/profile/changePassword'
import PicturePureview from './screens/appoinment/PicturePureview'
import Messages from './screens/doctorHome/Messages'
import NewMessage from './screens/doctorHome/messageTab/NewMessage'
import NewMessageForm from './screens/doctorHome/messageTab/NewMessageForm'
import Recipient from './screens/doctorHome/messageTab/Recipient'
import SavedPost from './screens/doctorHome/communityTab/SavedPost'
import Comments from './screens/doctorHome/communityTab/Comments'
import Consultation from './screens/consultation'
import ConsultationTab from './screens/consultation/ConsultationTab'
import MedicineDetails from './screens/consultation/MedicineDetails'
import ECardHome from './screens/eCard/eCardHome'
import EditCard from './screens/eCard/editCard'
import PreviewCard from './screens/eCard/previewCard'
import Billing from './screens/consultation/billing/billingBlank'
import NewBill from './screens/consultation/billing/newBill'
import BillingList from './screens/consultation/billing/billingList'
 import PastEncounters from './screens/consultation/pastEncounters/PastEncounters'
 import PastEncountersDetail from './screens/consultation/pastEncounters/PastEncountersDetail'
import Setting from './screens/setting'
import NotificationSetting from './screens/setting/notificationSetting'
import SettingAppointments from './screens/setting/settingAppointments'
import PrescriptionTemplate from './screens/setting/prescriptionTemplate'
import PreviewPdf from './screens/setting/prescriptionTemplate/PreviewPdf'
import PreviewRx from './screens/consultation/PreviewRx'
import BillingComplete from './screens/consultation/BillingComplete';
import PrivateNotes from './screens/consultation/PrivateNotes';
import FileListHome from './screens/consultation/files';
import AddFiles from './screens/consultation/files/addFiles.js';
import FilePreview from './screens/consultation/files/filePreview.js';
import Preview1 from './screens/consultation/billing/PreviewRx'

import AddAssistant from './screens/setUpClinic/AddAssistant'
import AssistantProfile from './screens/profile/AssistantProfile'
import AssistantPasswordSetup from './screens/login/AssistantPasswordSetup'
import AssistantPasswordChangeSuccess from './screens/login/AssistantPasswordChangeSuccess'
import AssistantSignupComplete from './screens/login/AssistantSignupComplete'
import Signature from './screens/signature'
import DrawSignature from './screens/signature/drawSignature.js'
import ConfirmSignature from './screens/signature/confirmSignature.js'
import SignatureSettings from './screens/signature/signatureSettings.js'
import ClinicSetupMessage from './screens/setUpClinic/ClinicSetupMessage'
import ClinicSetupStep1 from './screens/setUpClinic/ClinicSetupStep1'
import ClinicSetupStep2 from './screens/setUpClinic/ClinicSetupStep2'
import ClinicSetupStep3 from './screens/setUpClinic/ClinicSetupStep3'
import WebPagePreview from './screens/setUpClinic/WebPagePreview'
import VaccinationList from './screens/consultation/vaccination/vaccinationList'
import GenerateQrCode from './screens/qrCode/GenerateQrCode'
import DisplayQrCode from './screens/qrCode/DisplayQrCode'
import EarningScreen from './screens/doctorHome/Earnning.js';
import PregnancyList from './screens/consultation/pregnancy/pregnancyList'
import AddPrescription from './screens/consultation/handWritingPrescription/AddPrescription'
import AddNewMedicine from './screens/consultation/AddNewMedicine' 
import TimeSlotTreatment from './screens/consultation/dentistTreatment/TimeSlotTreatment' 
import AddDentistAppoinment from './screens/consultation/dentistTreatment/AddDentistAppoinment' 
import WorkdoneSave from './screens/consultation/dentistTreatment/WorkdoneSave' 
import WorkdoneDetails from './screens/consultation/dentistTreatment/WorkdoneDetails' 
import TreatmentPlanSummary from './screens/consultation/dentistTreatment/TreatmentPlanSummary'
import FinishWebPage from './screens/signup/FinishWebPage'
import ChooseClinic from './screens/login/ChooseClinic'
import ChooseClinicBeforeEdit from './screens/setUpClinic/ChooseClinicBeforeEdit'
import AllPrescriptionList from './screens/consultation/AllPrescriptionList'
import AddFamilyMember from './screens/appoinment/AddFamilyMember'
import LoadTemplate from './screens/consultation/LoadTemplate'


init();

import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { setupScreenName } from './service/Analytics';

const Drawer = createDrawerNavigator(
  {
    DoctorHome: { screen: DoctorHome, }
  },
  {
    //drawerWidth: responsiveWidth(60),
    initialRouteName: 'DoctorHome',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentOptions: { activeTintColor: '#e91e63' },
    contentComponent: props => <SideBar {...props} />,
    //screenOptions:{gestureEnabled: false}
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  },
  {
    onDrawerToggled: isOpen => {
    },
  },
);
const AppNavigator = createStackNavigator(
  {
    Drawer: {
      screen: Drawer
    },
    Login: { screen: Login,},
    ForgetPassword: { screen: ForgetPassword,},
    OtpVerification: { screen: OtpVerification, },
    GetStarted: { screen: GetStarted },
    createAccount: { screen: createAccount },
    ApplyClinicSetting: { screen: ApplyClinicSetting },
    AboutYourselfStep1: { screen: AboutYourselfStep1 },
    BecomeAMember: { screen: BecomeAMember },
    PayForMemberShip: { screen: PayForMemberShip },
    AccountActivatedMessage: { screen: AccountActivatedMessage },
    SearchPatients: { screen: SearchPatients },
    LoginWithOtp: { screen: LoginWithOtp },
    SetUpClinic: { screen: SetUpClinic },
    ClinicList: { screen: ClinicList },
    AddNewClinic: { screen: AddNewClinic },
    AppoinmentTimesShow: { screen: AppoinmentTimesShow},
    ConfirmAppointment: { screen: ConfirmAppointment },
    HelpAndSupport: { screen: HelpAndSupport },
    QuestionList: { screen: QuestionList },
    AnswerDetails: { screen: AnswerDetails },
    SearchQuestion: { screen: SearchQuestion },
    Notification: { screen: Notification },
    NotificationDetails: { screen: NotificationDetails },
    AddNewPatients: { screen: AddNewPatients },
    AboutUs: { screen: AboutUs },
    AboutusDetails: { screen: AboutusDetails },
    PrivacyPolicyDetails: { screen: PrivacyPolicyDetails },
    TermsofUseDetails: { screen: TermsofUseDetails},
    OtpVerifyForgetPassword: { screen: OtpVerifyForgetPassword },
    NewPasswordSetup: { screen: NewPasswordSetup },
    PasswordChangeSuccess: { screen: PasswordChangeSuccess },
    Profile: { screen: Profile },
    EditBasicInfo: { screen: EditBasicInfo },
    AddNewClinicDetails: { screen: AddNewClinicDetails },
    NotificationForRequest: { screen: NotificationForRequest },
    NewClinicRequestSentSuccess: { screen: NewClinicRequestSentSuccess },
    PicturePureview: { screen: PicturePureview },
    Messages: { screen: Messages },
    NewMessage: { screen: NewMessage },
    NewMessageForm: { screen: NewMessageForm },
    Recipient: { screen: Recipient },
    SavedPost: { screen: SavedPost },
    Comments: { screen: Comments },
    Consultation: { screen: Consultation },
    ConsultationTab: { screen: ConsultationTab },
    MedicineDetails: { screen: MedicineDetails },
    ECardHome: { screen: ECardHome },
    EditCard: { screen: EditCard },
    PreviewCard : { screen: PreviewCard},
    Billing: { screen: Billing },
    NewBill: { screen: NewBill },
    BillingList: { screen: BillingList },
    ChangePassword: { screen: ChangePassword },
    PastEncounters: { screen: PastEncounters },
    PastEncountersDetail: { screen: PastEncountersDetail },
    Setting: { screen: Setting },
    NotificationSetting: { screen: NotificationSetting },
    SettingAppointments: { screen: SettingAppointments },
    PrescriptionTemplate: { screen: PrescriptionTemplate },
    PreviewPdf: { screen: PreviewPdf },
    PreviewRx: { screen: PreviewRx },
    BillingComplete: { screen: BillingComplete },
    FileListHome: { screen: FileListHome },
    AddFiles: { screen: AddFiles },
    FilePreview: { screen: FilePreview },
    Preview1: { screen: Preview1 },
    AddAssistant: { screen: AddAssistant },
    AssistantProfile: { screen: AssistantProfile },
    AssistantPasswordSetup: { screen: AssistantPasswordSetup },
    AssistantPasswordChangeSuccess: { screen: AssistantPasswordChangeSuccess },
    Signature: { screen: Signature },
    DrawSignature: { screen: DrawSignature },
    ConfirmSignature: { screen: ConfirmSignature },
    SignatureSettings: { screen: SignatureSettings },
    ClinicSetupMessage: { screen: ClinicSetupMessage },
    ClinicSetupStep1: { screen: ClinicSetupStep1 },
    ClinicSetupStep2: { screen: ClinicSetupStep2 },
    ClinicSetupStep3: { screen: ClinicSetupStep3 },
    WebPagePreview: { screen: WebPagePreview },
    GenerateQrCode: { screen: GenerateQrCode },
    DisplayQrCode: { screen: DisplayQrCode },
    VaccinationList: { screen: VaccinationList },
    EarningScreen: { screen: EarningScreen},
    AssistantSignupComplete: { screen: AssistantSignupComplete},
    PregnancyList: { screen: PregnancyList },
    AddPrescription: { screen: AddPrescription },
    AddNewMedicine: { screen: AddNewMedicine },
    PrivateNotes: { screen: PrivateNotes },
    TimeSlotTreatment: { screen: TimeSlotTreatment },
    AddDentistAppoinment: { screen: AddDentistAppoinment },
    WorkdoneSave: { screen: WorkdoneSave },
    WorkdoneDetails: { screen: WorkdoneDetails },
    TreatmentPlanSummary: { screen: TreatmentPlanSummary },
    FinishWebPage: { screen: FinishWebPage },
    AddFamilyMember: { screen: AddFamilyMember },
    ChooseClinic: { screen: ChooseClinic },
    ChooseClinicBeforeEdit: { screen: ChooseClinicBeforeEdit },
    AllPrescriptionList: { screen: AllPrescriptionList },
    LoadTemplate: { screen: LoadTemplate },
  },
  {
    gestureEnabled: false,
    initialRouteName: 'GetStarted', //GetStarted
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  },
);
//const AppContainer = createAppContainer(AppNavigator);
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

const AppContainer = createAppContainer(AppNavigator);
export default () => (
  <AppContainer
    onNavigationStateChange={
      async (prevState, currentState) => {
        const currentRouteName = getActiveRouteName(currentState);
        const previousRouteName = getActiveRouteName(prevState);

        if (previousRouteName !== currentRouteName) {
          // the line below uses the @react-native-firebase/analytics tracker
          // change the tracker here to use other Mobile analytics SDK.
          setupScreenName(currentRouteName)
        }
      }}
  />
);
//export default () => <AppContainer />;
/* eslint-disable no-alert */
import {SIGNUP_DETAILS} from '../constants';
const initialState = {
  signupDetails: {
    fname: '',
    lname: '',
    mname: '',
    doctorFullName: '',
    userLoginType:'normal',
    userLoginId:'',
    profileImgUrl:null,
    normalLoginIdType:'email',
    email:'',
    mobile:'',
    UserGuid:'',
    accessToken:'',
    password:'',
    clinicGuid:null,
    doctorGuid:'',
    clinicName:'',
    clinicImageUrl:'',
    scheduleTypeGuid:'',
    drSpeciality:'',
    fcmToken:'',
    kycStatus:'',
    drRegistrationNo:'',
    subscription:'',
    dob:'',
    gender:'',
    clinicStatus:'Approved',
    appoinmentGuid:'',
    patientGuid:'',
    selectedDate:'',
    patientProfileUrl:'',
    shareLinkUrl:'',
    isAssistantUser : false,    
    isAllowMedicalHistoryAssistant : false,    
    isAllowPatientFilesAssistant : false,    
    isAllowMessagesAssistant : false,    
    isAllowClinicDetailsAssistant : false,    
    isAllowBillingAssistant : false, 
    userName:'',  
    assistantMobile:'',
    drProfileImgUrlinAssistantLogin:null,
    iseSignatureAvailable:false,
    globalTabIndex:2,
    confirmAppoinmentDate:'',
    serverDateTime:'',
    consultType:'',
    roleCode:'',
    salt:'',
    
    firebasePhoneNumber : '',
    firebaseDOB : '',
    firebaseLocation : '',
    firebaseUserType : '',
    firebaseLocation : '',
    returnValueFromTwilio:false,
  },
  listData: [
    {pName: '1356FH', key: '1356FH', isSelect: false},
  ],
};

const signupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_DETAILS: {
      return {
        ...state,
        signupDetails: action.payload,
      };
    }

    default:
      return state;
  }
};
export default signupReducer;

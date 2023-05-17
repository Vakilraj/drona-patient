import {Platform} from 'react-native';
var init = () => {
  global.DRONA = (() => {
    let clinicList =[],doctorFee={
      "consultationFee": "",
      "followUpFee": "",
      "followUpValidFor": 0
  } , clinicType='InClinic',
  doctorGuid='',clinicGuid='',selectedIndexClinic=0,
  scheduleTypeGuid='', startDate='',endDate='',selectedAppoinDate=''
  customerCareNo='',customerCareEmail='',questionListHeader='',answerDetailsHeader='FAQ',that = null,address='',subscription='',twilioToken='',
  roomName='',showAppoinmentCompleteMsg=0,isDrTimingsUpdated=true,isAddAppointmentModal=0,isReloadApi=true,isNetConnected=true,isConsultationChange=false,isNeedForTabChane=false,isServiceVailable=true,subjectSebscription=null,rxjsContext=null;
   
    return {
   
      setClinicList: t => {
        clinicList = t;
      },
      getClinicList: () => {
        return clinicList;
      },
      setDoctorFee: t => {
        doctorFee = t;
      },
      getDoctorFee: () => {
        return doctorFee;
      },
      setClinicType: t => {
        clinicType = t;
      },
      getClinicType: () => {
        return clinicType;
      },
      setDoctorGuid: t => {
        doctorGuid = t;
      },
      getDoctorGuid: () => {
        return doctorGuid;
      },
      setClinicGuid: t => {
        clinicGuid = t;
      },
      getClinicGuid: () => {
        return clinicGuid;
      },
      
      setSelectedIndexClinic: t => {
        selectedIndexClinic = t;
      },
      getSelectedIndexClinic: () => {
        return selectedIndexClinic;
      },
      
      setScheduleTypeGuid: t => {
        scheduleTypeGuid = t;
      },
      getScheduleTypeGuid: () => {
        return scheduleTypeGuid;
      },
      
      setStartDate: t => {
        startDate = t;
      },
      getStartDate: () => {
        return startDate;
      },
      
      setEndDate: t => {
        endDate = t;
      },
      getEndDate: () => {
        return endDate;
      },
      
      setSelectedAppoinDate: t => {
        selectedAppoinDate = t;
      },
      getSelectedAppoinDate: () => {
        return selectedAppoinDate;
      },

      setCustomerCareNo: t => {
        customerCareNo = t;
      },
      getCustomerCareNo: () => {
        return customerCareNo;
      },
      setCustomerCareEmail: t => {
        customerCareEmail = t;
      },
      getCustomerCareEmail: () => {
        return customerCareEmail;
      },
      
      setQuestionListHeader: t => {
        questionListHeader = t;
      },
      getQuestionListHeader: () => {
        return questionListHeader;
      },
      
      setAnswerDetailsHeader: t => {
        answerDetailsHeader = t;
      },
      getAnswerDetailsHeader: () => {
        return answerDetailsHeader;
      },
      setThat: thisObj => {
        that = thisObj;
      },
      getThat: () => {
        return that;
      }, 
      
      setAddress: t => {
        address = t;
      },
      getAddress: () => {
        return address;
      },
      setSubscription: t => {
        subscription = t;
      },
      getSubscription: () => {
        return subscription;
      },
      setTwilioToken: t => {
        twilioToken = t;
      },
      getTwilioToken: () => {
        return twilioToken;
      },
      setRoomName: t => {
        roomName = t;
      },
      getRoomName: () => {
        return roomName;
      },
      setShowAppoinmentCompleteMsg: t => {
        showAppoinmentCompleteMsg = t;
      },
      getShowAppoinmentCompleteMsg: () => {
        return showAppoinmentCompleteMsg;
      },
      setIsDrTimingsUpdated: t => {
        isDrTimingsUpdated = t;
      },
      getIsDrTimingsUpdated: () => {
        return isDrTimingsUpdated;
      },

      setIsAddAppointmentModal: t => {
        isAddAppointmentModal = t;
      },
      getIsAddAppointmentModal: () => {
        return isAddAppointmentModal;
      },
      setIsReloadApi: t => {
        isReloadApi = t;
      },
      getIsReloadApi: () => {
        return isReloadApi;
      },
      setIsNetConnected: t => {
        isNetConnected = t;
      },
      getIsNetConnected: () => {
        return isNetConnected;
      },

      setIsConsultationChange: t => {
        isConsultationChange = t;
      },
      getIsConsultationChange: () => {
        return isConsultationChange;
      },

      setIsNeedForTabChane: t => {
        isNeedForTabChane = t;
      },
      getIsNeedForTabChane: () => {
        return isNeedForTabChane;
      },

      setIsServiceVailable: t => {
        isServiceVailable = t;
      },
      getIsServiceVailable: () => {
        return isServiceVailable;
      },


      setSubjectSebscription: t => {
        subjectSebscription = t;
      },
      getSubjectSebscription: () => {
        return subjectSebscription;
      },

      setRxjsContext: t => {
        rxjsContext = t;
      },
      getRxjsContext: () => {
        return rxjsContext;
      },
    };
  })();
};
module.exports = {init};

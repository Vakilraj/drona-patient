import { API_SUCCESS } from "../constants";
import { API_BEGIN } from "../constants";
import { API_FAIL } from "../constants";
import { NO_LOADER } from "../constants";
// var RNFS = require('react-native-fs');
// var path = RNFS.DocumentDirectoryPath + '/test.txt';
import AsyncStorage from 'react-native-encrypted-storage';
import axios from "axios";
//import NetInfo from "@react-native-community/netinfo";
import {Clipboard} from 'react-native'
export const fetchProductsBegin = () => ({
  type: API_BEGIN,
});

export const removeLoader = () => ({
  type: NO_LOADER,
});

export const fetchProductsSuccess = (data) => ({
  type: API_SUCCESS,
  payload: data,
});

export const fetchProductsFailure = (error) => ({
  type: API_FAIL,
  payload: { error },
});
export const fetchProductsFailureLogin = (error) => ({
  type: API_FAIL,
  payload: { tag: "login", invalidCred: true },
});
//USING AXIOS
const showAert = (tagName, msg) => {
  if (msg && msg != 'Something went wrong. Please try again later') {
    if (tagName == 'GetCommunityInfoSaved') {
      alert('Sorry, we are not able to fetch the information, Please try again');
    }
    // else if(tagName=='CancelAppointment'){
    //   alert('Sorry, appointment can not be cancelled. Please try again');
    // }
    else {
      alert(msg)
    }
  } else {
    if (tagName == 'homeComponentApi') {
      alert('Please try again, something went wrong! ');
    } else if (tagName == 'postWalkinConfirm' || tagName == 'postConfirm') {
      alert('Sorry! the appointment can not be booked now. Please try again');
    } else if (tagName == 'verifyOtp' || tagName == 'verifyOtpForLogin') {
      alert('It seems, there is some network issue. Please try again.');
    } else if (tagName == 'GetVisitInfoIndex') {
      alert('Sorry, we are not able to redirect you on consult page. Please try again');
    } else if (tagName === 'GetCommunityInfo' || tagName === "GetFilter" || tagName === "GetCommunityInfoSaved") {
      alert('Sorry, we are not able to fetch the information, Please try again');
    } else if (tagName == 'completeConsultation') {
      alert('Sorry, appointment can not be completed. Please try again');
    } else if (tagName == 'AddPatient') {
      alert('Sorry, Patient can not be added or modified, please try again.');
    } else if (tagName == 'sendMessage') {
      alert('Sorry, The message can not be sent, Please try again');
    } else if (tagName == 'createAccount') {
      alert('Sorry, The user can not be registered, please try again');
    } else if (tagName == 'reschedule') {
      alert('Sorry, appointment can not be rescheduled. Please try again');
    } else if (tagName == 'CancelAppointment') {
      alert('Sorry, appointment can not be cancelled. Please try again');
    } else {
      setTimeout(() => {
        if (tagName != 'viewpost')
          alert('Oops, Something went wrong. Please try again');
      }, 300)
    }
  }

  //dispatch(fetchProductsSuccess({ tag: tagName, error: true }));
}
export function callLogin(url, apiType, params, token, tagName = null) {
  let baseUrl = "";
  //mnkdronadoctorappdev  mnkdronadoctorappstag mnkdronadoctorapplive mnkdronadoctorapptest
  // mnkdronadoctorapploadtesting  mnkdronadoctorappprepilot pilot mankindtesting mnkdronadoctorapplive mnkdronawebapplive dotnetcore6

  // LocationEnabler    important thing--> it is comment for ios and open for Android 
  if (tagName === 'afterShareLink' || tagName === 'getserverDateTime') {
    baseUrl = 'https://mnkdrona-apim.azure-api.net/WebApp/Dev/';
  }
  else {
    baseUrl = 'https://mnkdrona-apim.azure-api.net/DoctorApp/Dev/'  // Dev  Pilot Stag Live
  }
  
  if (apiType === "get") {
    baseUrl = "https://api.postalpincode.in/pincode/";
    const request = axios.get(baseUrl + url, {
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
        Authorization: "Bearer " + token,
      },
      timeout: 20000,
    });
    return (dispatch) => {
      if (tagName === "refreshToken") {
        dispatch(removeLoader());
      } else {
        dispatch(fetchProductsBegin());
      }

      return request
        .then((data) => {
          // Handle Success response here
          let modifyData = data.data;
          if (tagName) {
            modifyData.tag = tagName;
          }

          dispatch(fetchProductsSuccess(modifyData));
          return modifyData;
        })
        .catch((error) => {
          // Handle error here, you can show error alert here or within reducer
          dispatch(fetchProductsFailure(error));
        });
    };
  } else {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") { } else { console.log = function () { }; }

    const headersValue = {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      Authorization: "Bearer " + token,
    }
    const request = axios.post(baseUrl + url, params, {
      headers: headersValue,
      timeout: 180000,
    });
    console.log("\n\n" + baseUrl + url + " request- " + JSON.stringify(params))
    console.log("\n\n" + url + " headers- " + JSON.stringify(headersValue))
    
    return (dispatch) => {
      let str = 'GetCommunityInfo GetFilter viewpost SearchForSymptom SearchForSymptom SearchForFindings SearchForDiagnosis SearchForMedicine SearchForInvestigation SearchForInstructions SearchFamilyConditions SearchForConditions SearchForcurrentMedication SearchFoAllergies sharepostby AddSymptoms getserverDateTime ResentOtpForLogin GetActivationPackages tt GetWeekPasswordList GetWeekPass AddInvestigation AddInstruction ReasonOfVisitList'
      if (str.includes(tagName)) {
        dispatch(removeLoader());
      } else {
        dispatch(fetchProductsBegin());
      }

      return request
        .then((data) => {
          let modifyData = data.data;
          if (tagName) {
            modifyData.tag = tagName;
          }

          if (modifyData.statusCode == -9 ) { // || modifyData.statusCode == -3
            if (tagName == 'login' || tagName == 'getStarted' || tagName == 'ApplyPromoCode') {
              dispatch(fetchProductsSuccess(modifyData));
            }
            else {
              showAert(tagName, modifyData.statusMessage);
              dispatch(fetchProductsSuccess({ tag: 'dronaheltherrors' }));
            }
          } else {
            dispatch(fetchProductsSuccess(modifyData));
          }

          console.log("\n\n" + url + " response- " + JSON.stringify(modifyData))
      //     try {
      //       RNFS.appendFile(path, "\n\n" + url + " response- " + JSON.stringify(modifyData) , 'utf8')
      //         .then((success) => {
      //           console.log('FILE WRITTEN!'+path);
      //         })
      //         .catch((err) => {
      //           console.log(err.message);
      //         });
      //     } catch (error) {
      // console.log(error)
      //     }

          return modifyData;
        })
        .catch((error) => {
          try {
            console.log(url + "  error message--------- " + error.message)
            if (error.message.includes('401')) {
              AsyncStorage.setItem('profile_complete', 'logout');
              DRONA.getThat().props.navigation.navigate('GetStarted');
            } else if (error.message.includes('Network Error')) {
              alert(error.message);
            }
            else {
              showAert(tagName, null);
            }

          } catch (error) {

          }
      //     try {
      //       RNFS.appendFile(path, url + "  error " + error.message , 'utf8')
      //         .then((success) => {
      //           console.log('FILE WRITTEN!'+path);
      //         })
      //         .catch((err) => {
      //           console.log(err.message);
      //         });
      //     } catch (error) {
      // console.log(error)
      //     }
          dispatch(fetchProductsFailure(error));
        });
    };
  }
}

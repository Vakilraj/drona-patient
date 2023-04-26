import { Platform} from 'react-native';
import perf from '@react-native-firebase/perf';
import analytics from '@react-native-firebase/analytics';
let trace;

export default class Trace {
    static startTrace = async (timeRange, mobNo, age, drSpe, scName, location) => {
      trace = await perf().startTrace(scName);
		// Define trace meta details
			trace.putAttribute('Mobile', mobNo? mobNo: '');
			trace.putAttribute('Speciality', drSpe? drSpe : '');
            trace.putAttribute('Age', age? age.toString():'');
            trace.putAttribute('TimeRange', timeRange? timeRange : '');
			trace.putAttribute('Location', location? location : '');  
			// alert("Trace added" + '=== '+ location + ' ---- ' + scName + ' ' + mobNo + '  ' + age + '  ' + drSpe + '  ' + timeRange) 
  }

  static startTracePrintoutSetup = async (timeRange, mobNo, printSet, drSpe, scName, location) => {
	trace = await perf().startTrace(scName);
	  // Define trace meta details
		  trace.putAttribute('Mobile', mobNo? mobNo: '');
		  trace.putAttribute('Speciality', drSpe? drSpe : '');
		  trace.putAttribute('Template_Print_Setup', printSet);
		  trace.putAttribute('TimeRange', timeRange? timeRange : '');
		  trace.putAttribute('Location', location? location : '');  
		  //alert("Trace added" + '=== '+ location + ' ---- ' + scName + ' ' + mobNo + '  ' + age + '  ' + drSpe + '  ' + timeRange) 
}

  static stopTrace = async () => {
    await trace.stop();
    // alert("Trace Stoped")
}

static getAge =(dob) => {
	let dobArr = [];
	let age = '';
	if(dob && dob.includes(" ")){
		dobArr = dob.split(" ");
		var dob = new Date(dobArr[0]);  
		//calculate month difference from current date in time  
		var month_diff = Date.now() - dob.getTime();  
		//convert the calculated difference in date format  
		var age_dt = new Date(month_diff);   
		//extract year from date      
		var year = age_dt.getUTCFullYear();  
		//now calculate the age of the user  
		age = Math.abs(year - 1970); 
		
		let sum = 0, ageGroup = '';
		for (let i = 0; i < age;  i = i + 5) {
		  sum = i;
		  if (age >= sum && age <= i + 5) {
			ageGroup = sum.toString() + ' - ' + (i + 5).toString();
		  }
		}
		
	}
	else{
		age = 'dob not set'
	}
	
		return age;
}


static startTraceAssistant = async (timeRange, mobNo, age, drSpe, scName, AssistantStatus) => {
	trace = await perf().startTrace(scName);
	  // Define trace meta details
		  trace.putAttribute('Mobile', mobNo);
		  trace.putAttribute('Speciality', drSpe);
		  trace.putAttribute('Age', age.toString());
		  trace.putAttribute('TimeRange', timeRange);
		  // trace.putAttribute('Location', location);
		  trace.putAttribute('AssistntStatus', AssistantStatus);
		 // this.screenTrace[traceName].putMetric(scName, 100)
		//   alert('Trace start!!!! Now  assistant')
}

static setLogEventWithTrace = async (eventName, data)=> {
    // async () => {
       try{
        if(!data) data ={}
        data.source=Platform.OS;
        await analytics().logEvent( eventName, data);
       } catch(e){
           alert(e)
       }
    // }
}




static getTimeRange = () =>{
     var date = new Date().getDate();
			//Get Current Month
			var month = new Date().getMonth() + 1;
			//Get Current Year
			var year = new Date().getFullYear();
			//Get Current Time Hours
			var hours = new Date().getHours();
			//Get Current Time Minutes
			var min = new Date().getMinutes();
			//var finalObject = date + '/' + month + '/' + year + ' ' + hours + ':' + min;
			
			if(hours >= 0 && hours < 2){
				timeRange = "00am-02am"
			}
			else if(hours >= 2 && hours < 4){
				timeRange = "02am-04am"
			}
			else if(hours >= 4 && hours < 6){
				timeRange = "04am-06am"
			}
			else if(hours >= 6 && hours < 8){
				timeRange = "06am-08am"
			}
			else if(hours >= 8 && hours < 10){
				timeRange = "08am-10am"
			}
			else if(hours >= 10 && hours < 12){
				timeRange = "10am-12pm"
			}
			else if(hours >= 12 && hours < 14){
				timeRange = "12pm-02pm"
			}
			 else if(hours >= 14 && hours < 16){
				timeRange = "02pm-04pm"
			}
			else if(hours >= 16 && hours < 18){
				timeRange = "04pm-06pm"
			}
			else if(hours >= 18 && hours < 20){
				timeRange = "06pm-08pm"
			}
			else if(hours >= 20 && hours < 22){
				timeRange = "08pm-10pm"
			}
			else if(hours >= 22 && hours < 24){
				timeRange = "10pm-12am"
			}
       return timeRange;
    }
}

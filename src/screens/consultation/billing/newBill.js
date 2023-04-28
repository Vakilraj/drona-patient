import _, { isArray } from 'lodash';
import Moment from 'moment';
import React from 'react';
import {
    Image, KeyboardAvoidingView,
    Platform, SafeAreaView, ScrollView, FlatList, StatusBar, Text, TextInput, TouchableOpacity, View, PermissionsAndroid
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Modal from 'react-native-modal';
import {
    responsiveHeight,
    responsiveWidth
} from 'react-native-responsive-dimensions';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import add_new from '../../../../assets/followupplus.png';
import ArrowBackIcon from '../../../../assets/back_blue.png';
import CrossTxt from '../../../../assets/cross_insearch.png';
import cross_new from '../../../../assets/cross_primary.png';
import TickIcon from '../../../../assets/green_tick.png';
import subtract_new from '../../../../assets/followupminus.png';
import edit_blue from '../../../../assets/edit_blue.png';
import Color from '../../../components/Colors';
import CommonStyle from '../../../components/CommonStyle.js';
import CustomFont from '../../../components/CustomFont';
import Toolbar from '../../../customviews/Toolbar.js';
import * as apiActions from '../../../redux/actions/apiActions';
import * as signupActions from '../../../redux/actions/signupActions';
import { setApiHandle } from "../../../service/ApiHandle";
import CalendarModal from './CalendarModal';
import CalendarRecordModal from './CalendarRecordModal';
import { setLogEvent } from '../../../service/Analytics';
import styles from './style';

let startDate = '', endingDate = '', tempContent = '';
let paymentModeGuid = "";
let billingMasterFullArray = [];
let selectedItemIndex = 0;
let billingDate = "";
let filePath = "", billingNumber = '', appoinmentGuid = '', clinicInfo = '', doctorInfo = '', doctorEducation = '', doctorSpeciality = '', consultationTypes = '', patientInfo = '';
class NewBill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            calendarType: 'single',
            isSelectItemModalOpen: false,
            isRecordPayment: false,
            paymentDate: '',
            paymentModeList: [],
            reference: "",
            billingTypeDetailsArray: '',
            selectedBillingMasterFullArray: [],
            isAddEditNewItem: -1, // 0 for add, 1 for edit, 2 for add new item
            itemQuantity: 1,
            itemPrice: 0,

            BillingItemGuid: '',
            itemName: '',
            billingTypeSearchTxt: '',
            recordData: null,
            isBillCreated: false,
            isBillPopUp: false,
            billListData: [],
            subTotalAmount: 0,
            totalAmount: 0,
            billingDetailsGuid: '',
            //billingNumber: '',
            isDue: false,
            isMore: false,
            billingDateAvailable: "",
            isCancel: false,
            paymentMode: "",
            paymentDate: "",
            isModalVisible: false,
            paymentSuccessful: false,
            successPdfGeneration: false,
            filePath: '',
            borderColor: Color.inputdefaultBorder,
            borderColorItem: Color.inputdefaultBorder,
            referenceInputColor: Color.inputdefaultBorder,
            billingStatusFornonEdit: '',
            billingAppointmentStatus: '',
        };
    }

    refreshRecordData = (val) => {
        this.getDate(val, true)
    }

    refreshData = (val) => {
        this.getDate(val, false)
    }

    callIsFucused = () => {
        this.setState({ borderColor: Color.primary })
    }
    callIsBlur = () => {
        this.setState({ borderColor: Color.inputdefaultBorder })
    }
    pressOnBlur = () => {
        this.setState({ borderColorItem: Color.inputdefaultBorder })
    }
    pressOnFocus = () => {
        this.setState({ borderColorItem: Color.primary })
    }
    callFocusRef = () => {
        this.setState({ referenceInputColor: Color.primary })
    }
    callBlurRef = () => {
        this.setState({ referenceInputColor: Color.inputdefaultBorder })
    }

    getDate = (val, isRecord) => {
        if (val) {
            startDate = val.startDate;
            endingDate = val.endingDate;
            let temp = '';
            if (endingDate) {
                let reformatStDate = Moment(startDate).format('DD MMM YYYY');
                let reformatEndDate = Moment(endingDate).format('DD MMM YYYY');
                temp = tempContent.replace("@DateRange", 'from ' + reformatStDate + ' - ' + reformatEndDate).replace("@Date", 'from ' + reformatStDate + ' - ' + reformatEndDate)
                if (isRecord) this.state.recordData.billingDate = reformatStDate
                else { billingDate = Moment(startDate).format('YYYY-MM-DD'); this.setState({ billingDateAvailable: Moment(billingDate).format('DD/MM/YYYY') }) }
            } else {
                let reformatStDate = Moment(startDate).format('DD MMM YYYY');
                temp = tempContent.replace("@DateRange", 'on ' + reformatStDate).replace("@Date", 'on ' + reformatStDate)
                if (isRecord) this.state.recordData.billingDate = reformatStDate
                else { billingDate = Moment(startDate).format('YYYY-MM-DD'); this.setState({ billingDateAvailable: Moment(billingDate).format('DD/MM/YYYY') }) }
            }
            this.setState({ content: temp })
        }
    }

    componentDidMount() {
        let item = this.props.navigation.state.params.item
        // console.log("item-------------"  +  JSON.stringify(item));
        this.setState({ billingStatusFornonEdit: item.billingStatus })
        appoinmentGuid = item.appointmentGuid;
        let isPaid = false
        if (item != null) {
            this.setState({ billingDateAvailable: Moment(item.billingDate).format('DD/MM/YYYY') })
            this.setState({ billingDetailsGuid: item.billingDetailsGuid })
            this.setState({ isDue: item.billingStatus == "Due", isCancel: item.billingStatus == "Cancelled" })
            isPaid = item.billingStatus == "Paid"
        } else {
            billingDate = Moment(new Date()).format('YYYY-MM-DD');
            this.setState({ billingDateAvailable: Moment(new Date()).format('DD/MM/YYYY') })
        }
        this.getConsultationTypeList(item ? item.billingDetailsGuid : "", isPaid);

        //alert(JSON.stringify(this.props.from))
    }

    addItem = () => {
        this.setState({ itemQuantity: parseInt(this.state.itemQuantity) + 1 })
    }

    minusItem = () => {
        if (this.state.itemQuantity > 1) this.setState({ itemQuantity: this.state.itemQuantity - 1 })
    }

    getConsultationTypeList = (item, isPaid) => {
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            "PatientGuid": signupDetails.patientGuid,
            "Version": "",
            "Data": {
                "version": null,
                "AppointmentGuid": appoinmentGuid,
                "BillingDetailsGuid": item,
            }
        }
        actions.callLogin(isPaid ? 'V12/FuncForDrAppToGetBillingReceipt' : 'V12/FuncForDrAppToGetEditBillingItem', 'post',
            params, signupDetails.accessToken, isPaid ? 'getBill' : 'consultationList');
    }

    clickOnBillingTypeItem = (item) => {
         //alert(JSON.stringify(item))
         //console.log('-----'+JSON.stringify(item))
        this.setState({ itemPrice: item.billingItemPrice })
        this.setState({ itemQuantity: item.billingItemQuantity })
        this.setState({ itemName: item.billingItemName })
        this.setState({ BillingItemGuid: item.billingItemGuid })

        // this.setState({selectedBillingMasterFullArray: item})
    }

    addBilling = () => {
        //if (this.state.itemPrice > 0) {
            this.setTotalAmount();
            billingDate = Moment(new Date()).format('YYYY-MM-DD');
            // alert(billingDate);
            //if (this.state.itemPrice && this.state.itemPrice != 0) {
                let { actions, signupDetails } = this.props;
                let params = {

                    "UserGuid": signupDetails.UserGuid,
                    "DoctorGuid": signupDetails.doctorGuid,
                    "ClinicGuid": signupDetails.clinicGuid,
                    "Data": {
                        "AppointmentGuid": appoinmentGuid,
                        "BillingdetailsGuid": this.state.billingDetailsGuid,
                        "BillingDate": billingDate,
                        "Subtotal": this.state.subTotalAmount,
                        "Taxes": "0",
                        "TaxPercentage": "0",
                        "TotalAmount": this.state.totalAmount,
                        "BillingItemDetails": this.state.billListData,

                    }
                }
                actions.callLogin('V1/FuncForDrAppToAddConsulationBilling', 'post', params, signupDetails.accessToken, 'addBilling');
                DRONA.setIsDrTimingsUpdated(true);
        //     }
        // } else {
        //     Snackbar.show({ text: 'Item price should not be 0', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
        // }

    }

    searchBillingType = (text) => {
        var searchResult = _.filter(billingMasterFullArray, function (item) {
            return item.billingItemName.toLowerCase().indexOf(text.toLowerCase()) > -1;
        });
        this.setState({
            billingTypeDetailsArray: searchResult, billingTypeSearchTxt: text
        });
    }

    setPrice = (price) => {
        if (price != "") {
            this.setState({ itemPrice: price })
        }
        else this.setState({ itemPrice: 0 })
    }

    getRecordPayment = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "Data": {
                "BillingDetailsGuid": this.state.billingDetailsGuid,
            }
        }
        actions.callLogin('V1/FuncForDrAppToGetRecordPayment', 'post', params, signupDetails.accessToken, 'getRecordPayment');
    }

    addRecordPayment = () => {
        if (this.state.recordData.billingDate === "") {
            Snackbar.show({ text: 'Please select date of payment', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
        } else if (paymentModeGuid == "") {
            Snackbar.show({ text: 'Please select mode of payment', duration: Snackbar.LENGTH_SHORT, backgroundColor: Color.primary });
            // alert("Please select mode of payment")
            // "Amount": this.state.recordData.totalAmount,
        } else {
            this.setState({ isRecordPayment: false })
            billingDate = Moment(new Date()).format('YYYY-MM-DD');
            let { actions, signupDetails } = this.props;
            let params = {
                "UserGuid": signupDetails.UserGuid,
                Data: {
                    "BillingRecordPaymentGuid": "",
                    "PaymentDate": billingDate,
                    "BillingDetailsGuid": this.state.recordData.billingDetailsGuid,
                    "Amount": this.state.subTotalAmount,
                    "SelectedPaymentMode": { "PaymentModeGuid": paymentModeGuid },
                    "ReferenceNumber": this.state.reference,
                }
            }
            actions.callLogin('V1/FuncForDrAppToAddUpdateRecordPayment', 'post', params, signupDetails.accessToken, 'addRecordPayment');
            DRONA.setIsDrTimingsUpdated(true);
        }
    }

    cancelBill = () => {
        let { actions, signupDetails } = this.props;
        let params = {
            "UserGuid": signupDetails.UserGuid,
            "DoctorGuid": signupDetails.doctorGuid,
            "ClinicGuid": signupDetails.clinicGuid,
            Data: {
                BillingDetailsGuid: this.state.billingDetailsGuid,
            }
        }
        actions.callLogin('V1/FuncForDrAppToCancelBilling', 'post', params, signupDetails.accessToken, 'cancelBill');
        DRONA.setIsDrTimingsUpdated(true);
        setLogEvent("new_bill", { "cancel": "click", "UserGuid": signupDetails.UserGuid, })
    }

    saveBillingRecieptPdf = (path) => {
        filePath = path
        RNFS.readFile(path, "base64").then(result => {
            let { actions, signupDetails } = this.props;
            let params = {

                "DoctorGuid": signupDetails.doctorGuid,
                "UserGuid": signupDetails.UserGuid,

                Data: {
                    BillingDetailsGuid: this.state.billingDetailsGuid,
                    Attachment: {
                        "OrgFileName": this.state.billingDetailsGuid + "bills",
                        "SysFileExt": ".pdf",
                        "OrgFileExt": ".pdf",
                        "SysFileName": this.state.billingDetailsGuid + "bill",
                        "AttachmentUrl": null,
                        "attachmentGuid": null,
                        "UploadedOnCloud": 0,
                        "DelMark": 0,
                        "FileBytes": result
                    }
                }
            }
            //console.log('------'+JSON.stringify(params))
            actions.callLogin('V11/FuncForDrAppToSaveBillingRecieptPdf', 'post', params, signupDetails.accessToken, 'saveBillingRecieptPdf');
            DRONA.setIsDrTimingsUpdated(true);
        })
    }

    async UNSAFE_componentWillReceiveProps(newProps) {
        setApiHandle(this.handleApi, newProps)

    }

    handleApi = (response, tag, statusMessage, statusCodeData) => {
        if (tag === 'consultationList') {
            billingNumber = response.billingNumber;
            clinicInfo = response.clinicInfo
            doctorInfo = response.doctorInfo;
            doctorEducation = doctorInfo.doctorEducation
            doctorSpeciality = doctorInfo.doctorSpeciality
            consultationTypes = response.consultationTypes
            patientInfo = response.patientInfo
            
            billingMasterFullArray = response.billingItemMaster;
            this.setState({ billingTypeDetailsArray: billingMasterFullArray });
            if (response.billingItemDetails != null && response.billingItemDetails.length > 0) {
                billingDate = Moment(response.billingDate).format('DD/MM/YYYY')
                setTimeout(() => {
                    this.setState({ billingDateAvailable: billingDate, isBillCreated: true, billListData: response.billingItemDetails })
                }, 1000)
                this.setState({ subTotalAmount: response.totalAmount, totalAmount: response.totalAmount })
                this.setState({ billingAppointmentStatus: response.billingAppointmentType });
                //this.setState({ billingNumber: response.billingNumber })
            }
        } else if (tag === "getBill") {
            billingNumber = response.billingNumber
            clinicInfo = response.clinicInfo
            doctorInfo = response.doctorInfo;
            doctorEducation = doctorInfo.doctorEducation
            doctorSpeciality = doctorInfo.doctorSpeciality
            consultationTypes = response.consultationTypes
            patientInfo = response.patientInfo
            // alert(doctorEducation[0].degree)


            billingDate = Moment(response.billingDate).format('DD/MM/YYYY')
            this.setState({ isDue: false, billingDateAvailable: billingDate, isBillCreated: true, billListData: response.billingItemDetails })
            this.setState({ subTotalAmount: response.totalAmount, totalAmount: response.totalAmount })
            this.setState({
                paymentMode: response.paymentmode,
                paymentDate: Moment(response.billingRecordPaymentDetail.paymentDate).format('DD/MM/YYYY')
            })
        } else if (tag === "getRecordPayment") {
            response.billingDate = Moment(new Date()).format('DD/MM/YYYY')
            this.setState({ recordData: response })
            this.state.paymentModeList = []
            for (const item of response.paymentModeList) {
                this.state.paymentModeList.push({ label: item.paymentMode, paymentModeGuid: item.paymentModeGuid })
            }
            this.setState({ paymentModeList: this.state.paymentModeList })
            setTimeout(() => {
                this.setState({ isRecordPayment: true });
            }, 800);


        } else if (tag === "addRecordPayment") {
            paymentModeGuid = ""
            this.setState({ reference: "", paymentDate: this.state.recordData && this.state.recordData.billingDate ? this.state.recordData.billingDate : '' })
            // this.setState({ isBillCreated: true })
            this.setState({ isDue: false, isRecordPayment: false });
            setTimeout(() => {
                this.setState({ paymentSuccessful: true });
            }, 1000)
            setLogEvent("add_record_payment");

            // console.log("5555555555" + statusCodeData);

            if (statusCodeData == '-1') {
                setTimeout(() => {
                    this.chePermissionForPDF('Bill');
                }, 2000)

            }
        }
        else if (tag === "addBilling") {
            billingNumber = response.billingNumber;
            paymentModeGuid = ""
            this.setState({ reference: "" })
            setTimeout(() => {
                this.setState({ isBillCreated: true, isBillPopUp: true })
            }, 400);

            setTimeout(() => {
                this.setState({ isDue: true })
            }, 1000)
            this.setState({ billingDetailsGuid: response.billingDetailsGuid })
            if (response.billingItemDetails) {
                this.setState({ billListData: response.billingItemDetails });
            }
            //this.setState({ billingNumber: response.billingNumber })
        } else if (tag === "cancelBill") {
            setTimeout(() => {
                this.setState({ isDue: false })
            }, 400);
            setTimeout(() => {
                this.setState({ isCancel: true })
            }, 1000);
            this.props.navigation.goBack();
        } else if (tag === "saveBillingRecieptPdf") {
            try {
                let pdfUrl = response.billingRecieptAsPDFUrl;
                this.props.navigation.navigate("Preview1", { PreviewPdfPath: filePath, pdfUrl: pdfUrl });
            } catch (error) {

            }

        }
    }

    addItemInLocal = (isAddEditNewItem) => {
        let isExist = false
        if (isAddEditNewItem == 2 || isAddEditNewItem == 0) {
            for (let i = 0; i < this.state.billListData.length; i++) {
                let item = this.state.billListData[i]
                if (item.billingItemName == this.state.itemName) {
                    isExist = true
                }
            }
            if (isExist) {
                alert("Item name is already exist")
                return
            }
            if (this.state.itemPrice && this.state.itemPrice == 0) {
                Snackbar.show({ text: 'Item price should not be 0', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
            }
            else {
                this.state.billListData.push({
                    "billingItemDetailsGuid": null,
                    "billingItemGuid": this.state.BillingItemGuid,
                    "billingItemName": this.state.itemName,
                    "billingItemPrice": this.state.itemPrice,
                    "billingItemQuantity": this.state.itemQuantity,
                    "billingItemAmount": this.state.itemQuantity * this.state.itemPrice,
                })
            }

        } else {
            let item = this.state.billListData[selectedItemIndex]
            item.billingItemName = this.state.itemName
            item.billingItemPrice = this.state.itemPrice
            item.billingItemQuantity = this.state.itemQuantity
            item.billingItemAmount = this.state.itemQuantity * this.state.itemPrice
        }
        this.setState({ billListData: this.state.billListData, })
        this.setTotalAmount()
    }

    setTotalAmount = () => {
        let tempTotal = 0;
        let temp = 0;
        if (this.state.billListData)
            for (let i = 0; i < this.state.billListData.length; i++) {

                // let item = this.state.billListData[i]

                // temp = JSON.stringify(item.billingItemAmount);
                // if(temp.includes(".")) {
                //     let str = temp.split(".");
                //     tempTotal = str[0].substr(1);
                //     // alert(tempTotal);
                // }
                tempTotal += parseFloat(this.state.billListData[i].billingItemAmount)
            }
        this.setState({ billListData: this.state.billListData, subTotalAmount: tempTotal, totalAmount: tempTotal })
    }

    removeItem = () => {
        this.setState({ isAddEditNewItem: -1 })
        this.state.billListData.splice(selectedItemIndex, 1)
        this.setState({ billListData: this.state.billListData })
        this.setTotalAmount()
    }

    renderList = (item, index) => {
        return (
            <TouchableOpacity onPress={() => {
                if (!this.state.isCancel) {
                    selectedItemIndex = index;
                    if (this.state.billingStatusFornonEdit == "Paid" || this.state.paymentSuccessful == true) {
                        setTimeout(() => {
                            this.setState({ isAddEditNewItem: -1 });
                        }, 800);
                    }
                    else {
                        setTimeout(() => {
                            let { signupDetails } = this.props;
                            setLogEvent("select_bill_item", { UserGuid: signupDetails.UserGuid })
                            this.setState({ isAddEditNewItem: 1 });
                        }, 800);
                    }
                    this.setState({ isSelectItemModalOpen: false }); this.clickOnBillingTypeItem(item);
                }
            }}
                style={{ borderWidth: 1, borderRadius: responsiveWidth(1.5), borderColor: Color.buttonSecondary, flexDirection: 'row', paddingStart: responsiveWidth(3), marginBottom: responsiveHeight(2), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(4) }}>

                <View style={{ flex: 6 }}>
                    <View style={{ justifyContent: 'flex-start', }} >
                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.textItem, fontSize: CustomFont.font14, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(2), marginBottom: responsiveHeight(1.3), }}>{item.billingItemName}</Text>
                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.textItem, fontSize: CustomFont.font14, marginTop: responsiveHeight(0), marginLeft: responsiveWidth(2), marginBottom: responsiveHeight(1.3) }}>{item.billingItemQuantity} x ₹{item.billingItemPrice}</Text>
                    </View>
                </View>
                <View style={{ flex: 5, alignItems: 'flex-start', marginRight: responsiveWidth(3) }}>
                    <View style={{ justifyContent: 'flex-start', }}>
                        <Text style={{ textAlign: 'left', fontFamily: CustomFont.fontName, color: Color.text2, fontSize: CustomFont.font14, marginTop: responsiveHeight(1.7), marginLeft: responsiveWidth(2), marginBottom: responsiveHeight(1.3), }}>₹{item.billingItemAmount}</Text>
                    </View>
                </View>
                {
                    this.state.billingStatusFornonEdit == "Paid" || this.state.isCancel ? null : <View style={{ flex: 1, alignItems: 'flex-end', marginRight: responsiveWidth(3) }}>
                        <Image source={edit_blue} style={{ marginTop: responsiveHeight(3), marginLeft: responsiveWidth(4), height: responsiveWidth(4), width: responsiveWidth(4), }} />
                    </View>
                }

            </TouchableOpacity>
        )
    }

    createBiillView = () => {
        let temp = []
        let billList = this.state.billListData;
        for (var i = 0; i < billList.length; i++) {
            let tempi = parseInt(i + 1);
            const htmlCode = `
            <table style="width:100%;margin-top: 20px">            
            <tr style="display: table-row; vertical-align: inherit;border-color: inherit; ">
            <th width="10%" style="color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ tempi + `</th>
            <th width="30%" style="color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ billList[i].billingItemName + `</th>
            <th width="15%" style="color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ billList[i].billingItemQuantity + `</th>      
            <th width="20%" style="color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ billList[i].billingItemPrice + `</th>      
            <th width="20%" style="color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">`+ billList[i].billingItemAmount + `</th>
            </tr>
            </table>
			 `
            temp.push(htmlCode)
        }
        return temp.join("")
    }
    itemRowVia = (first, second) => {
        const htmlCode = `
        <div style="margin-right:20px">
             <table width="100%">
             <tr>
               <td style="text-align: left;font-size: 18px;color: #000000D9;">`+ first + `</td>
               <td style="text-align: right;font-size: 18px;color: #000000D9;">₹`+ second + `</td>
             </tr>
             </table>
             </div>
			 `
        return htmlCode
    }

    itemRow = (first, second) => {

        const htmlCode = `
        <div style="margin-right:20px">
             <table width="100%">
             <tr>
             <td style="text-align: left;font-size: 18px;color: #000000D9;">`+ first + `</td>
             <td style="text-align: right;font-size: 18px;color: #000000D9;">₹`+ second + `</td>
             </tr>
             </table>
             </div>
			 `
        return htmlCode
    }
    chePermissionForPDF = async (from) => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.createPDF(from)
                } else {
                    alert('Permission Denied!');
                }
            } else {
                this.createPDF(from)
            }
        } catch (err) {
            console.warn(err);
        }
    }

    showOriginalValueView = (value) => {
        let temp = []
        if (isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                if (value[i].degree) {
                    const htmlCode =
                        `` + value[i].degree + ``
                    temp.push(htmlCode)
                } else {
                    const htmlCode = `
                    &nbsp 
                    `
                    temp.push(htmlCode)
                }
                return temp
            }

        }
        else {
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

        }

    }

    showOriginalValueSpecialityView = (value) => {
        let temp = []
        if (isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                if (value[i].specialtyName) {
                    const htmlCode =
                        `` + value[i].specialtyName + ``
                    temp.push(htmlCode)
                } else {
                    const htmlCode = `
                    &nbsp 
                    `
                    temp.push(htmlCode)
                }
                return temp
            }

        }

    }


    createPDF = async (from) => {

        let { signupDetails } = this.props;
        // let billList = this.state.billListData;
        // let billList = this.state.billListData;
        // let billList = this.state.billListData;
        //let dateForBilling = this.state.paymentDate ? this.state.paymentDate : billingDate
        let dateForBilling = billingDate;

        const htmlContent = `
		<style>
	table, th, td {
	  
	  border-collapse: collapse;
	}
	th, td {
	  padding: 5px;
	  text-align: left;
	}
	</style>
	    <table style="width:100%">
		<tr>
				<td width="20%">
					 <img width="100" height="100" src=`+ clinicInfo.clinicImageUrl + ` />		  
				</td>
				<td width="50%" style="vertical-align:top; ">			
					  <h2>`+ this.showOriginalValueView(clinicInfo.clinicName) + `</h2>
					  <p>`+ this.showOriginalValueView(clinicInfo.clinicAddress) + `</p>
					  `+ this.showOriginalValueView(clinicInfo.clinicNumber) + `
				</td>
				<td width="30%" style="vertical-align:top;">
						<h2> `+ `Dr.` + this.showOriginalValueView(doctorInfo.firstName) + ` ` + this.showOriginalValueView(doctorInfo.lastName) + `</h2>
						`+ this.showOriginalValueView(doctorEducation) + '</br>' + `
						`+ this.showOriginalValueSpecialityView(doctorSpeciality) + `
						<p>Reg no. : ` + this.showOriginalValueView(doctorInfo.registrationNumber) + `</p>
				</td>
		</tr>
	   </table>
	
		 <hr style="height:1px"/>
        
         <table style="width:100%">
         <tr>
                 <td width="6tkl00%" style="vertical-align:top; ">			
                 <p>Name :&ensp; ` + `<b>` + this.showOriginalValueView(patientInfo.name) + `</b>` + `</p>
                 <p>Sex/Age :&ensp; ` + `<b>` + this.showOriginalValueView(patientInfo.sexAge) + `</b>` + `</p>
                 <p>Mobile :&ensp; ` + `<b>` + this.showOriginalValueView(patientInfo.mobile) + `</b>` + `</p>
                 <p>Consult ID :&ensp; ` + `<b>` + this.showOriginalValueView(patientInfo.patientCode) + `</b>` + `</p>
                 </td>
                 <td width="30%" style="vertical-align:top;">
                 <p>Bill No. :&ensp; ` + `<b>` + this.showOriginalValueView(billingNumber) + `</b>` + `</p>                        
                 <p>Date of bill :&ensp; ` + `<b>` + this.showOriginalValueView(dateForBilling) + `</b>` + `</p>   
                 <p>Consultation type :&ensp; ` + `<b>` + this.showOriginalValueView(consultationTypes.consultationTypes) + `</b>` + `</p>                   
                 </td>
         </tr>
        </table>
        
         <!-- old code of biiling details
        <div>
            <table style="width:100% ;line-height:50px;border-collapse: collapse;">
            <tr>
            <td style="margin-left:10px;color: #000000D9;font-size: 18px;">BIll No.</td>
            <td style="color: #000000D9;font-size: 18px;">Date of bill:</td>
            <td style="color: #000000D9;font-size: 18px;">Doctor:</td>
            <td style="color: #000000D9;font-size: 18px;">Clinic:</td>
            </tr>
            <tr style="line-height:20px">
            <td style="margin-left:10px; color: #000000D9;font-size: 18px;">`+ billingNumber + `</td>
            <td style="color: #000000D9;font-size: 18px;">`+ dateForBilling + `</td>
            <td style="color: #000000D9;font-size: 18px;">Dr. `+ signupDetails.fname + ` ` + signupDetails.lname + `</td>
            <td style="color: #000000D9;font-size: 18px;">`+ signupDetails.clinicName + `</td>
            </tr>
        
            </table>
        </div>
        -->

              
            <table style="width:100%;margin-top: 20px ; border: 1px solid #EDEDED; background-color: #EDEDED; ">
	   
            <tr style="display: table-row; vertical-align: inherit;border-color: inherit; border-radius: 3px 3px 0px 0px;">
            <th width="10%" style="color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">S No.</th>
            <th width="30%" style="color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">Item</th>
            <th width="15%" style="color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">Quantity</th>      
            <th width="20%" style=";color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">Unit price</th>      
            <th width="20%" style="color: #000000D9;text-align: left;font-size: 18px;
              border-left: 1px solid #f1f1f1; padding: 8px;line-height: 1.42857143;" rowspan="2">Amount</th>
            </tr>
            <tr style="color: #000000D9;">
            `+ this.createBiillView() + `
            </tr>
          </table>
        
          <hr style="height:.4px;border-bottom:1px solid #F9FAFB;margin-top:30px "/>
              
          <table style="line-height: 30px"><tr><td>&nbsp;</td></tr></table>
          <div style="color: #000000D9;font-size:18px;">
          `+ this.itemRow("Total Amount", this.state.totalAmount) + `
          </div>
          <hr style="height:.4px;border-bottom:1px solid #F9FAFB;margin-top:30px "/>
          <table style="line-height: 20px"><tr><td>&nbsp;</td></tr></table>
          <div style="font-size:18px;style="color: #000000D9;">
          `+ this.itemRowVia(from == 'Bill' ? "Payment received on " + this.state.paymentDate + " via " + this.state.paymentMode : 'Total Due', this.state.totalAmount) + `
          </div>
          <hr style="height:.4px;border-bottom:1px solid #F9FAFB;margin-top:30px "/>             
            `;
        let options = {
            html: htmlContent,
            fileNamey: 'test',
            directory: 'Documents',
        };

        let file = await RNHTMLtoPDF.convert(options);
        this.saveBillingRecieptPdf(file.filePath)
        //this.props.navigation.navigate("Preview1", { PreviewPdfPath: filePath });
    }

    render() {

        return (
            <SafeAreaView style={CommonStyle.containerlightBg}>
                <StatusBar backgroundColor={Color.statusBarNewColor} barStyle="dark-content" />
                <View style={{ flex: 1, }}>
                    <Toolbar title={this.state.isBillCreated && billingNumber ? "Bill #" + billingNumber : this.state.isBillCreated ? "Bill #" : "New Bill"}
                        onBackPress={() => {
                            this.props.navigation.goBack()
                        }} />

                    <View style={{ flex: 1, bottom: -20, marginTop: responsiveWidth(-2), }}>
                        <ScrollView>
                            <View>
                                <View style={{ borderRadius: responsiveHeight(1.5), height: responsiveHeight(12), backgroundColor: Color.white, flexDirection: 'row', alignItems: 'center', marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2) }}>
                                    <View style={{ flex: 3, }}>
                                        <Text style={{ marginLeft: responsiveWidth(4), fontSize: CustomFont.font14, fontWeight: 'bold', fontFamily: CustomFont.fontName, color: Color.text2, }}>Bill Date</Text>
                                    </View>
                                    <View style={{ flex: 3, marginRight: responsiveWidth(3) }}>
                                        <CalendarModal dateAvailable={this.state.billingDateAvailable} isClickable={this.state.isBillCreated} Refresh={this.refreshData} nav={this.state.calendarType}></CalendarModal>
                                    </View>
                                </View>

                                <View style={{ height: responsiveHeight(4), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text></Text>
                                </View>

                                <View style={{ marginTop: responsiveWidth(-2), marginBottom: responsiveWidth(1), borderRadius: responsiveHeight(1.5), backgroundColor: Color.white, marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2), paddingBottom: responsiveWidth(2), paddingTop: responsiveWidth(2) }}>

                                    <Text style={{ marginTop: responsiveHeight(1), fontWeight: 'bold', fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(4), color: Color.text2, marginBottom: responsiveHeight(2), }}>Items</Text>

                                    <FlatList
                                        data={this.state.billListData}
                                        renderItem={({ item, index }) => this.renderList(item, index)} />

                                    {/* {this.state.isBillCreated ? null : */}
                                    {this.state.billingStatusFornonEdit == "Paid" || this.state.isCancel ? null :
                                        <TouchableOpacity onPress={() => {
                                            this.getConsultationTypeList(null, false);
                                            setTimeout(() => {
                                                this.setState({ isSelectItemModalOpen: true });
                                            }, 800);
                                            let { signupDetails } = this.props;
                                            setLogEvent("add_item", { UserGuid: signupDetails.UserGuid })
                                        }} style={{ marginBottom: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: responsiveWidth(1.5), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveHeight(7), backgroundColor: Color.buttonSecondary, marginTop: responsiveWidth(4) }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(0), color: Color.primaryBlue, opacity: 0.7 }}>Add item</Text>
                                        </TouchableOpacity>
                                    }

                                </View>
                            </View>

                            <View style={{ marginTop: responsiveHeight(2), borderRadius: responsiveHeight(1.5), height: responsiveHeight(20), backgroundColor: Color.white, flexDirection: 'row', alignItems: 'center', marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2), paddingBottom: responsiveWidth(2), paddingTop: responsiveWidth(2) }}>
                                <View style={{ flex: 12 }}>
                                    <Text style={{ marginLeft: responsiveWidth(4), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.feeText, opacity: 0.6 }}>Subtotal</Text>
                                    <Text style={{ borderColor: '#DDD0F6', borderBottomWidth: 1, marginLeft: responsiveWidth(4) }} />
                                    <Text style={{ marginTop: responsiveWidth(2), marginLeft: responsiveWidth(4), fontWeight: this.state.isBillCreated ? 'normal' : 'bold', fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.text1, }}>Total</Text>
                                </View>
                                <View style={{ flex: 6, alignContent: 'flex-end', marginRight: responsiveWidth(2), }}>
                                    <Text style={{ paddingRight: responsiveWidth(4), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.feeText, opacity: 0.6, textAlign: 'right' }}>₹{this.state.subTotalAmount}</Text>
                                    <Text style={{ borderColor: '#DDD0F6', borderBottomWidth: 1, marginRight: responsiveWidth(5) }} />
                                    <Text style={{ marginTop: responsiveWidth(2), paddingRight: responsiveWidth(4), fontSize: CustomFont.font14, fontWeight: this.state.isBillCreated ? 'normal' : 'bold', fontFamily: CustomFont.fontName, color: Color.text1, textAlign: 'right' }}>₹ {this.state.totalAmount}</Text>
                                </View>
                            </View>

                            {!this.state.isBillCreated ? null :
                                <View style={{ marginLeft: responsiveWidth(2), marginRight: responsiveWidth(2), borderRadius: responsiveHeight(1.5) }}>
                                    {
                                        this.state.isCancel || this.state.isDue ? null :
                                            <View style={{ borderRadius: responsiveHeight(1.5), backgroundColor: Color.white, flexDirection: 'row', paddingTop: 15, paddingBottom: 15, marginTop: 10 }}>
                                                <View style={{ flex: 12, }}>
                                                    <Text style={{ marginLeft: responsiveWidth(4), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.feeText }}>Pay by {this.state.paymentMode}</Text>
                                                    <Text style={{ borderColor: '#DDD0F6', borderBottomWidth: 1, marginLeft: responsiveWidth(4) }} />
                                                    <Text style={{ marginTop: responsiveWidth(2), marginLeft: responsiveWidth(4), fontWeight: 'bold', fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.text1, }}>Due</Text>
                                                </View>
                                                <View style={{ flex: 6, alignContent: 'flex-end', marginRight: responsiveWidth(2), }}>
                                                    <Text style={{ paddingRight: responsiveWidth(4), fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, color: Color.feeText, opacity: 0.6, textAlign: 'right' }}>₹{this.state.totalAmount}</Text>
                                                    <Text style={{ borderColor: '#DDD0F6', borderBottomWidth: 1, marginRight: responsiveWidth(5) }} />
                                                    <Text style={{ marginTop: responsiveWidth(2), paddingRight: responsiveWidth(4), fontSize: CustomFont.font14, fontWeight: 'bold', fontFamily: CustomFont.fontName, textAlign: 'right', color: this.state.isDue ? Color.red : Color.text2, }}>₹ {this.state.isDue ? this.state.totalAmount : 0}</Text>
                                                </View>
                                            </View>
                                    }
                                    {/* <View style={{borderBottomLeftRadius:responsiveHeight(1.5),borderBottomRightRadius:responsiveHeight(1.5), backgroundColor: Color.white, flexDirection: 'row', paddingTop: 15, paddingBottom: 15, marginTop: this.state.isDue ? 20 : 2 }}>
                                    <View style={{ flex: 12, flexDirection: 'row' }}>
                                        
                                    </View>
                                    <View style={{ flex: 3, alignContent: 'flex-end', marginRight: responsiveWidth(-3) }}>
                                        
                                    </View>
                                </View>*/}
                                </View>
                            }
                        </ScrollView>
                        {this.state.billListData && this.state.billListData.length > 0 ?
                            <View style={{ borderRadius: responsiveWidth(1.5), marginBottom: responsiveHeight(3), flexDirection: 'row', marginTop: responsiveHeight(6), marginBottom: responsiveHeight(4), backgroundColor: Color.white, padding: responsiveHeight(2) }}>
                                {this.state.isBillCreated && !this.state.isDue || this.state.isCancel ? <View style={{ width: responsiveWidth(0), marginLeft: responsiveWidth(5), marginRight: 10 }} />
                                    : <TouchableOpacity style={{ isVisible: false, height: responsiveHeight(6), width: responsiveWidth(35), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(5), backgroundColor: Color.white, borderRadius: 5, marginRight: 10, opacity: 0.8, borderWidth: 1, borderColor: '#16081633' }}
                                        onPress={() => {
                                            if (this.state.isBillCreated) {
                                                setTimeout(() => {
                                                    this.setState({ isMore: true })
                                                }, 800);
                                            } else {
                                                if (billingDate == "") {
                                                    alert("Please select billing date")
                                                } else if (this.state.billListData && this.state.billListData.length == 0) {
                                                    alert("Please add billing item")
                                                }
                                                else this.addBilling()
                                            }
                                        }}>
                                        <Text style={{ color: Color.primaryBlue, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: 'bold' }}>More</Text>
                                    </TouchableOpacity>}
                                {this.state.isCancel ? null :
                                    <TouchableOpacity onPress={() => {
                                        if (this.state.isBillCreated && !this.state.isDue) {
                                            this.chePermissionForPDF('Bill')
                                            // this.props.navigation.navigate("Preview1")
                                        } else {
                                            if (this.state.billingDetailsGuid == "") {
                                                alert("Please create bill")
                                            } else {
                                                this.getRecordPayment();
                                            }
                                        }
                                    }} >
                                        <View style={{ borderRadius: responsiveWidth(2.5) }}>
                                            {/* <Text style={{ color: Color.white, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: 'bold' }}>{this.state.isBillCreated && !this.state.isDue ? "Print Receipt" : "Record Payment"}</Text> */}
                                            {this.state.isBillCreated && !this.state.isDue ?
                                                <TouchableOpacity onPress={() => this.chePermissionForPDF('Bill')} style={{ marginLeft: responsiveWidth(-55), height: responsiveHeight(6), width: responsiveWidth(75), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(2), backgroundColor: Color.primary, borderRadius: 5, marginRight: 10 }}>
                                                    <Text style={{ color: Color.white, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: 'bold' }}>Print Receipt</Text>
                                                </TouchableOpacity>
                                                : this.state.billingAppointmentStatus == 'Virtual Tentative' ? null :
                                                    <TouchableOpacity onPress={() => {
                                                        this.getRecordPayment();
                                                        let { signupDetails } = this.props;
                                                        setLogEvent("bill", { "record_payment": "click", UserGuid: signupDetails.UserGuid })
                                                    }} style={{ height: responsiveHeight(6), width: responsiveWidth(45), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(2), backgroundColor: Color.primary, borderRadius: 5, marginRight: 10 }}>
                                                        <Text style={{ color: Color.white, fontFamily: CustomFont.fontName, fontSize: CustomFont.font14, fontWeight: 'bold' }}>Record Payment</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                }

                            </View> : null}
                    </View>

                    {/* -----------------Select Item modal------------- */}
                    <Modal isVisible={this.state.isSelectItemModalOpen} onRequestClose={() => this.setState({ isSelectItemModalOpen: false })}>
                        <View style={[styles.modelViewAbout]}>

                            <View style={{ margin: responsiveWidth(3), marginBottom: responsiveHeight(-1) }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: responsiveWidth(4) }}>
                                    <Text style={{ marginLeft: responsiveWidth(2), fontFamily: CustomFont.fontName, fontSize: CustomFont.font18, color: Color.black, fontWeight: '700' }}>Add Billing Item</Text>
                                    <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ borderColor: Color.inputdefaultBorder, isSelectItemModalOpen: false, billingTypeSearchTxt: '' })}>
                                        <Image source={cross_new} style={{ marginLeft: responsiveWidth(48), height: responsiveWidth(3), width: responsiveWidth(3), }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.searchView, { borderColor: this.state.borderColor, borderWidth: 1, marginBottom: responsiveWidth(4) }]}>
                                    <TextInput returnKeyType="done" onBlur={this.callIsBlur} onFocus={this.callIsFucused} style={styles.searchInput} placeholder="Type to add an item" placeholderTextColor={Color.placeHolderColor} value={this.state.billingTypeSearchTxt}
                                        onChangeText={(billingTypeSearchTxt) => this.searchBillingType(billingTypeSearchTxt)} />
                                    {this.state.billingTypeSearchTxt ? <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ billingTypeSearchTxt: '', billingTypeDetailsArray: billingMasterFullArray }); }}>
                                        <Image style={styles.crossSearch} source={CrossTxt} />
                                    </TouchableOpacity> : null}
                                </View>
                            </View>

                            <ScrollView>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', marginLeft: responsiveWidth(4), marginRight: responsiveWidth(4) }}>
                                    {this.state.billingTypeDetailsArray && this.state.billingTypeDetailsArray.length > 0 ? this.state.billingTypeDetailsArray.map((item, index) => {
                                        return (
                                            <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: responsiveWidth(1.5), borderColor: Color.buttonSecondary, marginBottom: responsiveWidth(2) }}>
                                                <View style={{ flex: 5 }}>
                                                    <TouchableOpacity style={{ justifyContent: 'flex-start', }} onPress={() => {
                                                        this.setState({ isSelectItemModalOpen: false, itemQuantity: 1 });
                                                        setTimeout(() => {
                                                            this.setState({ isAddEditNewItem: 0 });
                                                        }, 800);
                                                        this.clickOnBillingTypeItem(item);
                                                    }}>
                                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.textItem, fontSize: CustomFont.font14, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(2), marginBottom: responsiveHeight(1.3) }}>{item.billingItemName}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ flex: 5, alignItems: 'flex-end', marginRight: responsiveWidth(2) }}>
                                                    <TouchableOpacity style={{ justifyContent: 'flex-start', }} onPress={() => {
                                                        setTimeout(() => {
                                                            this.setState({ isAddEditNewItem: 0 });
                                                        }, 800);
                                                        this.setState({ isSelectItemModalOpen: false }); this.clickOnBillingTypeItem(item);
                                                    }}>
                                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.text2, fontSize: CustomFont.font14, marginTop: responsiveHeight(1.3), marginLeft: responsiveWidth(20), marginBottom: responsiveHeight(1.3), }}>₹{item.billingItemPrice}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    }, this) : null}
                                </View>
                            </ScrollView>

                            <View style={{ position: 'absolute', marginLeft: responsiveWidth(2), bottom: responsiveHeight(28) }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ itemName: "", itemPrice: 0, itemQuantity: 1, BillingItemGuid: null })
                                    this.setState({ isSelectItemModalOpen: false });
                                    setTimeout(() => {

                                        this.setState({ itemName: this.state.billingTypeSearchTxt, isAddEditNewItem: 2 });
                                    }, 800);
                                }}>
                                    <View style={{ marginBottom: responsiveHeight(1), marginLeft: responsiveWidth(3), marginRight: responsiveWidth(3), borderRadius: responsiveWidth(1.5), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveHeight(7), backgroundColor: Color.buttonSecondary, marginTop: responsiveWidth(4) }}>
                                        <Text style={{ fontSize: CustomFont.font14, fontFamily: CustomFont.fontName, marginLeft: responsiveWidth(0), color: Color.primaryBlue, }}>Create New Item</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Modal>

                    <Modal isVisible={this.state.isAddEditNewItem >= 0} onRequestClose={() => this.setState({ isAddEditNewItem: false })}>
                        <View style={[styles.modelViewMessage1]}>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : 'padding'} keyboardVerticalOffset={-2200}>
                                <ScrollView>
                                    <View style={{
                                        flex: 1,
                                        height: responsiveHeight(110),
                                        width: responsiveWidth(101),
                                    }}>
                                        <View style={{ borderTopStartRadius: 20, borderTopEndRadius: 20, flexDirection: 'row', padding: 20, paddingStart: 20, paddingEnd: 20, marginTop: responsiveHeight(5), alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => {
                                                this.setState({ isAddEditNewItem: -1 })
                                                // setTimeout(() => {
                                                //     this.setState({ borderColorItem: Color.inputdefaultBorder, isSelectItemModalOpen: true, })
                                                // }, 800);
                                            }}>
                                                <Image style={{ resizeMode: 'contain', paddingLeft: responsiveWidth(6), width: responsiveWidth(2), height: responsiveHeight(3) }} source={ArrowBackIcon} />
                                            </TouchableOpacity>
                                            <Text style={{ fontWeight: '700', textAlign: 'center', flex: 1, fontFamily: CustomFont.fontName, color: Color.black, fontSize: CustomFont.font18 }}>{this.state.isAddEditNewItem == 1 ? "Edit Item" : this.state.isAddEditNewItem == 2 ? "Add Billing Item" : "Add Billing Item"}</Text>
                                        </View>
                                        <View style={{ marginTop: responsiveHeight(5) }}>
                                            {
                                                this.state.isAddEditNewItem == 2 ?
                                                    <View style={{ marginLeft: responsiveWidth(2), padding: 10, backgroundColor: Color.white, }}>
                                                        <Text style={{ fontSize: CustomFont.font12, fontWeight: CustomFont.fontWeight500, color: Color.fontColor }}>Item Name</Text>
                                                        <View style={{ width: responsiveWidth(91.5), flexDirection: 'row', marginTop: 8, height: 40, borderWidth: 1, borderColor: this.state.borderColorItem, borderRadius: 5, }}
                                                        >
                                                            <TextInput returnKeyType="done"
                                                                onBlur={this.pressOnBlur} onFocus={this.pressOnFocus}
                                                                value={this.state.itemName} onChangeText={name => this.setState({ itemName: name })} style={{ marginStart: 10, marginEnd: 10, flex: 1, color: Color.fontColor }} />
                                                        </View>
                                                    </View> :
                                                    <Text style={{ backgroundColor: Color.white, padding: 20, fontFamily: CustomFont.fontName, color: Color.text2, fontSize: CustomFont.font14, fontWeight: 'bold' }}>{this.state.itemName}</Text>
                                            }

                                            <View style={{ backgroundColor: Color.white, marginTop: 1, }}>
                                                <Text style={{ marginLeft: responsiveWidth(5), marginTop: responsiveWidth(2), fontFamily: CustomFont.fontName, color: Color.textItem, fontSize: CustomFont.font12 }}>Fee</Text>
                                                <TouchableOpacity style={{ width: responsiveWidth(91.5), alignContent: 'center', flexDirection: 'row', justifiyContent: 'center', marginTop: responsiveHeight(1), borderRadius: 5, borderWidth: 1, borderColor: Color.primary, height: 40, marginLeft: responsiveHeight(3) }}
                                                    onPress={() => this.refs.price.focus()}>
                                                    <Text style={{ alignSelf: 'center', color: Color.textGrey, marginLeft: responsiveWidth(2), fontSize: CustomFont.font16 }}>{"₹ "}</Text>
                                                    <TextInput returnKeyType="done" ref='price' style={{ textAlign: 'left', marginStart: 5, color: Color.fontColor }} keyboardType={'numeric'} value={this.state.itemPrice} onChangeText={this.setPrice} onBlur={this.pressOnBlur} onFocus={this.pressOnFocus} maxLength={7} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ marginTop: 1, backgroundColor: Color.white, }}>
                                                <Text style={{ marginLeft: responsiveWidth(5), marginTop: responsiveWidth(2), fontFamily: CustomFont.fontName, color: Color.textItem, fontSize: CustomFont.font12 }}>Quantity</Text>
                                                <View style={{ marginLeft: responsiveWidth(5), marginTop: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', marginEnd: 20, borderWidth: 1, borderRadius: 5, borderColor: Color.createInputBorder, paddingLeft: responsiveHeight(5), paddingRight: responsiveHeight(5), }}>
                                                    <View style={{ flex: 8 }}>
                                                        <Text style={{ textAlign: 'left', color: Color.fontColor }}>{this.state.itemQuantity}</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <TouchableOpacity onPress={() => this.minusItem()} style={{ height: 40, width: 40, justifyContent: "center", alignItems: 'center', }}>
                                                            <Image source={subtract_new} style={{ resizeMode: 'contain', width: responsiveWidth(6), height: responsiveHeight(6) }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ flex: 1, marginLeft: 15 }}>
                                                        <TouchableOpacity onPress={() => this.addItem()} style={{ height: 40, width: 40, justifyContent: "center", alignItems: 'center' }}>
                                                            <Image source={add_new} style={{ resizeMode: 'contain', width: responsiveWidth(6), height: responsiveHeight(6) }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ backgroundColor: Color.white, paddingStart: 20, paddingEnd: 20, marginTop: 15 }}>
                                                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                                    <Text style={{ flex: 1, fontFamily: CustomFont.fontName, fontWeight: CustomFont.fontWeight500, color: Color.text1, fontSize: CustomFont.font14 }}>{this.state.itemQuantity + " x ₹" + this.state.itemPrice}</Text>
                                                    <Text style={{ fontFamily: CustomFont.fontName, color: Color.text, fontSize: CustomFont.font14, fontWeight: CustomFont.fontWeight400 }}>₹{this.state.itemQuantity * this.state.itemPrice}</Text>
                                                </View>
                                                <Text style={{ borderColor: '#DDD0F6', borderBottomWidth: 1, marginLeft: responsiveWidth(0) }} />
                                                <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15 }}>
                                                    <Text style={{ fontWeight: 'bold', flex: 1, fontFamily: CustomFont.fontNameBold, color: Color.text2, fontSize: CustomFont.font14 }}>Item Total</Text>
                                                    <Text style={{ fontWeight: 'bold', fontFamily: CustomFont.fontNameBold, color: Color.text2, fontSize: CustomFont.font14 }}>₹{this.state.itemQuantity * this.state.itemPrice}</Text>
                                                </View>
                                            </View>

                                            {/* <TouchableOpacity onPress={() => {
                                                this.setState({ isAddEditNewItem: -1 })
                                                setTimeout(() => {
                                                    this.setState({ borderColorItem: Color.inputdefaultBorder, isSelectItemModalOpen: true, })
                                                }, 800);
                                            }}>
                                                <Text style={{ textAlign: 'center', fontFamily: CustomFont.fontName, color: Color.green, fontSize: CustomFont.font16, backgroundColor: Color.white, marginTop: 15 }}>Add New Item</Text>
                                            </TouchableOpacity> */}

                                            {
                                                this.state.isAddEditNewItem !== 1 ? null :
                                                    <Text onPress={() => {
                                                        let { signupDetails } = this.props;
                                                        setLogEvent("remove_item", { UserGuid: signupDetails.UserGuid })
                                                        this.removeItem()
                                                    }} style={{ textAlign: 'center', fontFamily: CustomFont.fontName, color: Color.status_color1, fontSize: CustomFont.font16, backgroundColor: Color.white, paddingTop: 14, paddingBottom: 14, marginTop: 15 }}>Remove Item</Text>
                                            }
                                        </View>

                                        <TouchableOpacity onPress={() => {
                                            if (this.state.isAddEditNewItem == 2 && this.state.itemName.trim() == "") {
                                                alert("Please add item name")
                                            } else {
                                                if (this.state.itemPrice > 0) {
                                                    this.addItemInLocal(this.state.isAddEditNewItem);
                                                    this.setState({ isAddEditNewItem: -1, borderColorItem: Color.inputdefaultBorder });
                                                } else {
                                                    Snackbar.show({ text: 'Item price should not be 0', duration: Snackbar.LENGTH_LONG, backgroundColor: Color.primary });
                                                }
                                            };
                                            setTimeout(() => {
                                                this.addBilling()
                                            }, 800);
                                        }} style={{ marginTop: responsiveHeight(3), paddingTop: responsiveHeight(1.5), paddingBottom: responsiveHeight(1.5), marginRight: responsiveWidth(4), marginLeft: responsiveWidth(4), width: "92%", justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, borderRadius: 6, }}>
                                            <Text style={{ fontWeight: CustomFont.fontWeight600, fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font14 }}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.isRecordPayment} onRequestClose={() => this.setState({ isRecordPayment: false })}>
                        <View style={[styles.modelViewMessage1, { bottom: responsiveHeight(-30), paddingTop: 25 }]}>
                            <View style={{ flexDirection: 'row', paddingStart: 20, paddingEnd: 20, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'left', flex: 1, fontWeight: 'bold', fontFamily: CustomFont.fontNameBold, color: Color.black, fontSize: CustomFont.font18 }}>Record Payment</Text>
                                <TouchableOpacity onPress={() => { this.setState({ inputdefaultBorder: Color.inputdefaultBorder, isRecordPayment: false }); paymentModeGuid = "" }}>
                                    <Image source={cross_new} style={{ height: responsiveWidth(3), width: responsiveWidth(3), resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginLeft: responsiveWidth(5), marginRight: responsiveWidth(5), borderRadius: responsiveWidth(1.5), borderColor: Color.textDate, borderWidth: 1, backgroundColor: Color.billBack, marginTop: responsiveHeight(3), paddingStart: 20, paddingEnd: 20, padding: 10 }}>
                                <View style={{ flexDirection: 'row', marginTop: 11, }}>
                                    <Text style={[styles.titleTop, { flex: 1, }]}>Bill No.</Text>
                                    <Text style={styles.titleTop}>Amount</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: 11, }}>
                                    <Text style={[styles.titleBottom, { flex: 1 }]}>#{this.state.recordData && this.state.recordData.billingNumber ? this.state.recordData.billingNumber : ""}</Text>
                                    <Text style={styles.titleBottom}>₹{this.state.recordData ? this.state.subTotalAmount : ""}</Text>
                                </View>
                            </View>
                            <View style={{ marginStart: 20, marginEnd: 20 }}>
                                <Text style={styles.textTitle}>Date of Payment</Text>
                                <View>
                                    {/* <Text style={{ flex: 1 }}>{this.state.paymentDate}</Text>
                                <Image source={CalendarIcon} /> */}
                                    <CalendarRecordModal paymentDate={this.state.recordData ? this.state.recordData.billingDate : Moment(new Date).format('DD MMM YYYY')} Refresh={this.refreshRecordData} nav={this.state.calendarType}></CalendarRecordModal>
                                </View>

                                <Text style={styles.textTitle}>Mode of Payment</Text>
                            </View>
                            <DropDownPicker
                                minWidth={50}
                                zIndex={999}
                                items={this.state.paymentModeList}
                                // defaultValue={this.title}
                                containerStyle={{ height: 45, marginStart: 20, marginEnd: 20 }}
                                style={{ borderColor: Color.createInputBorder, marginTop: 4 }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                globalTextStyle={{ color: Color.fontColor }}
                                dropDownStyle={{ backgroundColor: '#fafafa', minHeight: responsiveHeight(25) }}
                                onChangeItem={item => { paymentModeGuid = item.paymentModeGuid; this.setState({ paymentMode: item.label }) }}
                                placeholder="Select"
                                placeholderTextColor={Color.placeHolderColor}
                                labelStyle={{ fontSize: CustomFont.font14, color: Color.feeText }} />
                            <View style={{ marginStart: 20, marginEnd: 20 }}>
                                <Text style={styles.textTitle}>Reference Number</Text>

                                <TextInput returnKeyType="done" onFocus={this.callFocusRef} onBlur={this.callBlurRef} placeholderTextColor={Color.placeHolderColor} style={[styles.createInputStyle, { borderColor: this.state.referenceInputColor, borderWidth: 1, color: Color.feeText, height: responsiveHeight(6), borderWidth: 1 }]} placeholder="optional (eg. check no, etc.)"
                                    onChangeText={(text) => this.setState({ reference: text })} value={this.state.reference} />
                            </View>


                            <TouchableOpacity onPress={() => this.addRecordPayment()} style={{ marginTop: responsiveHeight(4), paddingTop: responsiveHeight(1.5), paddingBottom: responsiveHeight(1.5), marginRight: responsiveWidth(4), marginLeft: responsiveWidth(4), width: "92%", justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, borderRadius: 6 }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font14 }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.isBillPopUp} onRequestClose={() => this.setState({ isBillPopUp: false })}>
                        <View style={[styles.modelViewMessage2]}>
                            <Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
                            <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
                                Bill #{billingNumber} Created Successfully
                            </Text>
                            {this.state.billingAppointmentStatus == 'Virtual Tentative' ? null : <TouchableOpacity
                                onPress={() => {
                                    let { signupDetails } = this.props;
                                    setLogEvent("bill", { "record_payment": "click", UserGuid: signupDetails.UserGuid })
                                    this.getRecordPayment();
                                    this.setState({ isBillPopUp: false })
                                }}
                                style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Record Payment</Text>
                            </TouchableOpacity>}

                            <Text onPress={() => this.setState({ isBillPopUp: false })} style={{ marginBottom: 30, marginTop: this.state.billingAppointmentStatus == 'Virtual Tentative' ? 30 : 5, color: Color.darkText, fontSize: CustomFont.font14, fontFamily: CustomFont.fontName }}>Close</Text>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.isMore} onRequestClose={() => this.setState({ isMore: false })}>
                        <View style={[styles.modelViewMore, { bottom: responsiveHeight(-30), paddingTop: 20 }]}>
                            <View style={{ flexDirection: 'row-reverse' }}>
                                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => { this.setState({ isMore: false }); }}>
                                    <Image source={cross_new} style={{ height: responsiveWidth(3), width: responsiveWidth(3), resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            </View>

                            {/* <Text onPress={() => { this.setState({ isMore: false }); this.setState({ isModalVisible: true }) }} style={{backgroundColor:Color.grayBack, borderRadius:responsiveHeight(2), padding:responsiveHeight(2), textAlign:'center', marginTop: 20, marginStart: 20,marginRight: responsiveHeight(5), width:responsiveHeight(60), color: Color.darkText, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName }}>Cancel Bill</Text> */}
                            <TouchableOpacity onPress={() => {
                                this.setState({ isMore: false });
                                setTimeout(() => {
                                    this.setState({ isModalVisible: true })
                                }, 1000)
                            }} style={{ marginTop: responsiveHeight(2), height: responsiveHeight(6), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(5), backgroundColor: Color.primary, borderRadius: 5, marginRight: 10 }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName }}>Cancel Bill</Text>
                            </TouchableOpacity>

                            <View style={{ height: 3, color: Color.darkText }} />
                            <TouchableOpacity style={{ marginTop: responsiveHeight(2), height: responsiveHeight(6), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(5), backgroundColor: Color.primary, borderRadius: 5, marginRight: 10 }} onPress={() => {
                                let { signupDetails } = this.props;
                                setLogEvent("patient_appointment", { "print_bill": "click", UserGuid: signupDetails.UserGuid })
                                this.chePermissionForPDF('Due');
                                this.setState({ isMore: false });
                                // this.props.navigation.navigate("Preview1")
                            }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName }}>Print Bill</Text>
                            </TouchableOpacity>
                            <View style={{ height: 3, color: Color.darkText }} />
                            <TouchableOpacity onPress={() => {
                                let { signupDetails } = this.props;
                                setLogEvent("patient_appointment", { "save_bill": "click", UserGuid: signupDetails.UserGuid })
                                this.addBilling();
                                this.setState({ isMore: false });
                            }} style={{ marginTop: responsiveHeight(2), height: responsiveHeight(6), width: responsiveWidth(90), justifyContent: 'center', alignItems: 'center', marginLeft: responsiveWidth(5), backgroundColor: Color.primary, borderRadius: 5, marginRight: 10 }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName }}>Save Bill</Text>
                            </TouchableOpacity>
                            {/* <Text onPress={() => {this.addBilling(); this.setState({ isMore: false }); }} style={{ marginTop: 20, marginStart: 20, color: Color.darkText, fontSize: CustomFont.font18, fontFamily: CustomFont.fontName }}>Save Bill</Text> */}
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.isModalVisible} onRequestClose={() => this.setState({ isModalVisible: false })}>
                        <View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 10, borderRadius: 7 }}>
                            <View style={{ alignItems: 'center' }}>
                                {/* <Text style={{ fontFamily: CustomFont.fontName, marginTop: 10, color: Color.fontColor, fontSize: CustomFont.font18, fontWeight: 'bold', textAlign: 'center' }}>Exit DrOnA Health </Text> */}
                                <Text style={{ fontFamily: CustomFont.fontName, marginTop: 20, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Are you sure want to Cancel? </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), marginBottom: 20 }}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.5), width: responsiveWidth(25) }} onPress={() => this.setState({ isModalVisible: false })}>
                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.fontColor, fontSize: CustomFont.font16, textAlign: 'center' }}>Cancel </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: Color.grayBorder, borderWidth: 1, height: responsiveHeight(5.8), width: responsiveWidth(25), backgroundColor: Color.primary }} onPress={() => {
                                        let { signupDetails } = this.props;
                                        setLogEvent("patient_appointment", { "cancel_bill": "click", UserGuid: signupDetails.UserGuid })
                                        this.setState({ isModalVisible: false })
                                        this.cancelBill();
                                    }}>
                                        <Text style={{ fontFamily: CustomFont.fontName, color: Color.white, fontSize: CustomFont.font16, textAlign: 'center' }}>OK </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.paymentSuccessful} onRequestClose={() => this.setState({ paymentSuccessful: false, })}>
                        <View style={[styles.modelViewMessage2]}>
                            <Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
                            <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
                                Payment Recorded Successfully
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ paymentSuccessful: false, billingStatusFornonEdit: "Paid" })
                                }}
                                style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal isVisible={this.state.successPdfGeneration} onRequestClose={() => this.setState({ successPdfGeneration: false })}>
                        <View style={[styles.modelViewMessage2]}>
                            <Image source={TickIcon} style={{ height: 65, width: 65, marginTop: 30 }} />
                            <Text style={{ marginTop: 20, textAlign: 'center', color: Color.darkText, fontSize: CustomFont.font22, fontFamily: CustomFont.fontName }}>
                                Pdf generated Successfully
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ successPdfGeneration: false });
                                    this.props.navigation.navigate("Preview1", { PreviewPdfPath: this.state.filePath });
                                    //alert("dfdf")
                                }}
                                style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.primary, margin: 20, paddingTop: 8, paddingBottom: 8, paddingStart: 27, paddingEnd: 27 }}>
                                <Text style={{ color: Color.white, fontSize: CustomFont.font16, fontFamily: CustomFont.fontName }}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

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
)(NewBill);

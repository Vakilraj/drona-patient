export function setApiHandle(handleApi, props) {
    if (props.responseData) {
        // child.hide();
        try {
            let statusCodeData = props.responseData.statusCode
            if (props.responseData.statusCode === '0' || props.responseData.statusCode === '-1') {
                let response = props.responseData.data
                let tag = props.responseData.tag
                let statusMessage = props.responseData.statusMessage
                handleApi(response, tag, statusMessage, statusCodeData)
            } else {
                let data = props.responseData
                let isNotError = Object.keys(data).indexOf('error') == -1
                if (Platform.OS === 'ios') {
                    setTimeout(() => {
                        //alert(isNotError ? data.statusMessage : data.error.message)
                    }, 510);
                } else {
                    //alert(isNotError ? data.statusMessage : data.error.message)
                }
            }
        } catch (e) {
            // saving error
            //console.log(e)
        }
    }
}

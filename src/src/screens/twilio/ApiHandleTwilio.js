export function setApiHandle(handleApi, props) {
    if (props.responseData && props.responseData.tag === 'twilio') {
        //child.hide();
        try {
            if (props.responseData.statusCode === '0') {
                let response = props.responseData.data
                let tag = props.responseData.tag
                handleApi(response, tag)
            } else {
                let data = newProps.responseData
                let isNotError = Object.keys(data).indexOf('error') == -1
                if (Platform.OS === 'ios') {
                    setTimeout(() => {
                        alert(isNotError ? data.statusMessage : data.error.message)
                    }, 510);
                } else {
                    alert(isNotError ? data.statusMessage : data.error.message)
                }
            }
        } catch (e) {
            // saving error
            //console.log(e)
        }
    }
}
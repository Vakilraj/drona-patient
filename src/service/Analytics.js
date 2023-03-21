import analytics from '@react-native-firebase/analytics';
import { Platform} from 'react-native';
export async function setupScreenName(currentRouteName) {
    // async () => {
        await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName
        });
    // }
}

export async function setLogSelectContent(contentType, itemId) {
    // async () => {
        await analytics().logSelectContent({
            content_type: contentType,
            item_id: itemId,
        });
    // }
}

export async function setSignUp(signUpMethod) {
    // async () => {
        await analytics().logSignUp({
            method: signUpMethod,
        });
    // }
}

export async function setLogin(loginMethod) {
    // async () => {
        await analytics().logLogin({
            method: loginMethod,
        });
    // }
}

// Custom Event
export async function setLogEvent(eventName, data) {
    //alert(JSON.stringify(data))
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


export async function setLogShare(data) {
    // async () => {
        await analytics().logShare(data);
    // }
}
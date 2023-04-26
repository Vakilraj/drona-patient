import PushNotification from "react-native-push-notification";
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';

export function setupPushNotification(handleNotification) {

    messaging().onMessage(async remoteMessage => {
        //console.log('------------------receive noti1');
        PushNotification.localNotification({
            message: remoteMessage.notification.body,
            title: remoteMessage.notification.title,
            smallIcon: '',
            largeIcon: '',
            data: remoteMessage.data,
            channelId: "DronaChannel",
            channelName: "Drona",
        });
    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            //console.log('------------------receive noti2'+JSON.stringify(remoteMessage));
            if (remoteMessage) {
                // let status = notification.data.status
                // if (status === 'Booked' || status === 'Cancelled' || status === 'Rescheduled') {
                    handleNotification(notification)
                //}
            }
        });

    PushNotification.createChannel(
        {
            channelId: "DronaChannel", // (required)
            channelName: "Drona", // (required)
            // channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
            playSound: false, // (optional) default: true
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );

    PushNotification.configure({
        onNotification: function (notification) {
            //console.log('------------------receive noti3');
            // let status = notification.data.status
            // if (status === 'Request' ) {
                handleNotification(notification)
            //}
        },

        popInitialNotification: true,
        requestPermissions: true,
    })

    return PushNotification
}
import { COUNTER_CHANGE } from '../constants';
const initialState = {
isLoading: false,
};
const loadingReducer = (state = initialState, action) => {
switch(action.type) {
case 'SHOWLOADING':
    return {
      ...state,
      isLoading:action.payload
     };
case 'HIDELOADING':{
    return {
        ...state,
        isLoading:false
       };
}
 default:
   return state;
   }
}
export default loadingReducer;
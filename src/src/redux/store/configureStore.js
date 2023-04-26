import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//import countReducer from './../reducers/countReducer';
import apiReducer from './../reducers/apiReducer';
//import loadingReducer from './../reducers/loadingReducer';
import signupReducer from './../reducers/signupReducer';
// import globalReducer from './../reducers/globalReducer';
// import drivingAnalysisReducer from './../reducers/drivingAnalysisReducer';
// import choosePolicyReducer from './../reducers/choosePolicyReducer';

const rootReducer = combineReducers(
{ signupReducerConfig : signupReducer ,
apiResponseDataConfig : apiReducer, 
// globalReducerConfig : globalReducer, 
// loadingConfig : loadingReducer, 
// drivingAnalysisConfig : drivingAnalysisReducer,
// countReducerConfig : countReducer,
// choosePolicyDataConfig : choosePolicyReducer
}
);
const configureStore = () => {
return createStore(rootReducer, applyMiddleware(thunk));
}
export default configureStore;
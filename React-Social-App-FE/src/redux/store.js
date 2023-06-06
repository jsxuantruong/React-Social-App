import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
import { composeWithDevTools } from "redux-devtools-extension";


const composeEnhancers = composeWithDevTools(applyMiddleware(thunk));

export default createStore(rootReducer, composeEnhancers);

import {applyMiddleware, createStore} from "redux";
import rootReducer from "../reducers/RootReducer";
import thunk from "redux-thunk";

export default createStore(rootReducer, applyMiddleware(thunk));
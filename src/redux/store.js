import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';




export const storeWithMiddleWare = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    fetchDocumentResult, fetchIssue,fetchCommit,fetchHistory,
} from './action';
import { combineReducers } from 'redux';
import { DocumentResult ,IssueResult ,CommitResult ,HistoryResult} from '../model';
import { show } from 'js-snackbar';
import { graph, GraphState } from './graphReducer';

function showError(message: string) {
  show({
    text: message,
    pos: 'bottom-center',
    duration: 1000
  });
}

function withError<V>(message: string, value: V): V {
  showError(message);
  return value;
}

export interface DocumentResultState {
  fetching: boolean;
  query: string;
  result?: DocumentResult[];
}

export interface IssueResultState {
    fetching: boolean;
    query: string;
    result?: IssueResult[];
}

export interface CommitResultState{
    fetching:boolean;
    query:string;
    result?:CommitResult[];
}
export interface HistoryResultState{
    fetching:boolean;
    query:string;
    result?:HistoryResult[];
}

export interface RootState {
  fetchingRandomQuestion: boolean;
  graph: GraphState;
  documentResult: DocumentResultState;
  issueResult:IssueResultState;
  commitResult:CommitResultState;
  historyResult:HistoryResultState;
}

const documentResult =
  reducerWithInitialState<DocumentResultState>({fetching: false, query: ''})
    .case(fetchDocumentResult.started, (state, payload) => ({fetching: true, query: payload.query}))
    .case(fetchDocumentResult.done, (state, payload) => {
      for (let i = 0; i < payload.result.length; ++i) {
        payload.result[i].rank = i + 1;
      }
      return {
        fetching: false, query: payload.params.query, result: payload.result
      };
    })
    .case(fetchDocumentResult.failed, (state, payload) =>
      withError('Failed to rank', {fetching: false, query: payload.params.query}));


const issueResult =
    reducerWithInitialState<IssueResultState>({fetching: false, query: ''})
        .case(fetchIssue.started, (state, payload) => ({fetching: true, query: payload.query}))
        .case(fetchIssue.done, (state, payload) => ({ fetching: false, query: payload.params.query, result: payload.result
        }))
        .case(fetchIssue.failed, (state, payload) =>
            withError('Failed to present', {fetching: false, query: payload.params.query}));



const commitResult =
    reducerWithInitialState<CommitResultState>({fetching: false, query: ''})
        .case(fetchCommit.started, (state, payload) => ({fetching: true, query: payload.query}))
        .case(fetchCommit.done, (state, payload) => ({ fetching: false, query: payload.params.query, result: payload.result
        }))
        .case(fetchCommit.failed, (state, payload) =>
            withError('Failed to present', {fetching: false, query: payload.params.query}));

const historyResult =
    reducerWithInitialState<HistoryResultState>({fetching: false, query: ''})
        .case(fetchHistory.started, (state, payload) => ({fetching: true, query: payload.query}))
        .case(fetchHistory.done, (state, payload) => ({ fetching: false, query: payload.params.query, result: payload.result
        }))
        .case(fetchHistory.failed, (state, payload) =>
            withError('Failed to present', {fetching: false, query: payload.params.query}));


export const appReducer = combineReducers({
  graph, documentResult ,issueResult, commitResult ,historyResult
});
import * as React from 'react';
import {withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { IssueResultState, CommitResultState, RootState, HistoryResultState } from '../../../redux/reducer';
import CodeInputForm from '../../../components/CodeInputForm';
import { connect } from 'react-redux';
import { fetchIssueWorker ,fetchCommitWorker ,fetchHistoryWorker} from '../../../redux/action';
import {Route, RouteComponentProps, Switch} from 'react-router';
import { container} from '../../../variables/styles';
import CommitTab from "./CommitTab";
import IssueTab from "./IssueTab";
import Button from 'material-ui/Button';
import {Link} from "react-router-dom";
import History from "./History";



const styles = (theme: Theme) => ({
    container: {
        ...container,
    },
    progress: {
        flexGrow: 1,
        margin: theme.spacing.unit * 4
    },
    right:{
     //   paddingTop:'20px',
        paddingleft:'30%',
   //     paddingright:'3px',
        width:'90%',
    /*    float:'right',
        display:'fixed',*/

    },
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    issueResult: state.issueResult,
    commitResult:state.commitResult,
    historyResult:state.historyResult
});

interface CodeTraceTabRouteProps {
    project: string;
}

interface CodeTraceTabProps extends RouteComponentProps<CodeTraceTabRouteProps> {
    issueResult: IssueResultState;
    commitResult: CommitResultState;
    historyResult: HistoryResultState;
}

type CodeTraceTabStyle = WithStyles<'container' | 'progress' | 'right'>;

class CodeTraceTab extends React.Component<CodeTraceTabProps & CodeTraceTabStyle, {}> {

    render() {
        const { issueResult , classes } = this.props;
        const project = this.props.match.params.project;

        return (
            <div>
                <CodeInputForm
                    query={issueResult.query}
                    issueCallback={(param: { query: string }) => fetchIssueWorker({project, query: param.query})}
                    commitCallback={(param: { query: string }) => fetchCommitWorker({project, query: param.query})}
                    historyCallback={(param: { query: string }) => fetchHistoryWorker({project, query: param.query})}
                    project={project}
                />

                <div className={classes.right}>
                    <Button >
                        <Link to={{
                            pathname: `/demo/${project}/codetrace`
                        }}>
                            COMMIT
                        </Link>
                    </Button>
                    <Button >
                        <Link to={{
                            pathname: `/demo/${project}/codetrace/issue`
                        }}>
                            ISSUE
                        </Link>
                    </Button>
                    <Button >
                        <Link to={{
                            pathname: `/demo/${project}/codetrace/history`
                        }}>
                            History
                        </Link>
                    </Button>
                    <Switch>
                        <Route path='/demo/:project/codetrace/issue' component={IssueTab}/>
                        <Route exact={true} path='/demo/:project/codetrace' component={CommitTab}/>
                        <Route path='/demo/:project/codetrace/history' component={History}/>
                    </Switch>
                </div>

            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(CodeTraceTab));
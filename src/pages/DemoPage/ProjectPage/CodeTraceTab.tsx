import * as React from 'react';
import {withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { IssueResultState, CommitResultState , RootState } from '../../../redux/reducer';
import CodeInputForm from '../../../components/CodeInputForm';
import { connect } from 'react-redux';
import { fetchIssueWorker ,fetchCommitWorker} from '../../../redux/action';
import {Route, RouteComponentProps, Switch} from 'react-router';
import { container} from '../../../variables/styles';
import CommitTab from "./CommitTab";
import IssueTab from "./IssueTab";
import Button from 'material-ui/Button';
import {Link} from "react-router-dom";

const styles = (theme: Theme) => ({
    container: {
        ...container,
    },
    progress: {
        flexGrow: 1,
        margin: theme.spacing.unit * 4
    },
    right:{
        right:'100px',
        display:'fixed',
        float:'right',
    },
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    issueResult: state.issueResult,
    commitResult:state.commitResult
});

interface CodeTraceTabRouteProps {
    project: string;
}

interface CodeTraceTabProps extends RouteComponentProps<CodeTraceTabRouteProps> {
    issueResult: IssueResultState;
    commitResult: CommitResultState;
}

type CodeTraceTabStyle = WithStyles<'container' | 'progress' | 'right'>;

class CodeTraceTab extends React.Component<CodeTraceTabProps & CodeTraceTabStyle, {}> {

    render() {
        const { issueResult ,classes} = this.props;
        const project = this.props.match.params.project;

        return (
            <div>
                <CodeInputForm
                    query={issueResult.query}
                    issueCallback={(param: { query: string }) => fetchIssueWorker({project, query: param.query})}
                    commitCallback={(param: { query: string }) => fetchCommitWorker({project, query: param.query})}
                />
                <div className={classes.right}>
                    <Button >
                        <Link to={{
                            pathname: `/demo/${project}/codetrace`
                        }}>
                            ISSUE
                        </Link>
                    </Button>
                    <Button >
                        <Link to={{
                            pathname: `/demo/${project}/codetrace/commit`
                        }}>
                            COMMIT
                        </Link>
                    </Button>

                </div>
               {/* <div>

                </div>*/}


                <Switch>
                    <Route exact={true} path='/demo/:project/codetrace' component={IssueTab}/>
                    <Route path='/demo/:project/codetrace/commit' component={CommitTab}/>
                </Switch>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(CodeTraceTab));
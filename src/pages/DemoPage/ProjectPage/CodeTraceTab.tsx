import * as React from 'react';
import { LinearProgress, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { IssueResultState, CommitResultState , RootState } from '../../../redux/reducer';
import RankRow from '../../../components/RankRow';
import CodeInputForm from '../../../components/CodeInputForm';
import { connect } from 'react-redux';
import { fetchIssueWorker ,fetchCommitWorker} from '../../../redux/action';
import { RouteComponentProps } from 'react-router';
import MatTable from '../../../components/MatTable/MatTable';
import { container,leftcontainer,rightcontainer } from '../../../variables/styles';

const styles = (theme: Theme) => ({
    container: {
        ...container,
    },
    leftcontainer:{
        ...leftcontainer,
    },
    rightcontainer:{
        ...rightcontainer,
    },
    progress: {
        flexGrow: 1,
        margin: theme.spacing.unit * 4
    }
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

type CodeTraceTabStyle = WithStyles<'container' | 'progress' | 'leftcontainer' | 'rightcontainer'>;

class CodeTraceTab extends React.Component<CodeTraceTabProps & CodeTraceTabStyle, {}> {

    render() {
        const {classes, issueResult ,commitResult} = this.props;
        const project = this.props.match.params.project;

        return (
            <div>
                <CodeInputForm
                    query={issueResult.query}
                    issueCallback={(param: { query: string }) => fetchIssueWorker({project, query: param.query})}
                    commitCallback={(param: { query: string }) => fetchCommitWorker({project, query: param.query})}
                />
                <div className={classes.leftcontainer}>
                    {issueResult.fetching && <LinearProgress className={classes.progress}/>}
                    {issueResult.result != null &&
                    <MatTable
                        tableHead={['Rank', 'ID', 'Answer']}
                        tableData={issueResult.result.map(r => ({
                            columns: [`${r.properties.crearorName}`, `${r.properties.createdDate}`, <RankRow
                                key={r.id}
                                initExpand={false}
                                title={'['  + r.label + '] ' + (r.properties.summary == null ? "" : r.properties.summary)}
                                detail={r.properties.description}
                            />]
                        }))}
                    />}
                </div>

                <div className={classes.rightcontainer}>
                    {commitResult.fetching && <LinearProgress className={classes.progress}/>}
                    {commitResult.result != null &&
                    <MatTable
                        tableHead={['commitTime', 'id', 'message']}
                        tableData={commitResult.result.map(r => ({
                            columns: [`${r.properties.commitTime}`, `${r.properties.name}`, <RankRow
                                key={r.id}
                                initExpand={false}
                                title={'['  + r.label + '] ' + (r.properties.message == null ? "" : r.properties.message)}
                                detail={r.properties.diffSummary}
                            />]
                        }))}
                    />}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(CodeTraceTab));

import * as React from 'react';
import { LinearProgress, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { IssueResultState,  RootState } from '../../../redux/reducer';
import RankRow from '../../../components/RankRow';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import MatTable from '../../../components/MatTable/MatTable';
import { container } from '../../../variables/styles';

const styles = (theme: Theme) => ({
    container: {
        ...container,
    },
    progress: {
        flexGrow: 1,
        margin: theme.spacing.unit * 4
    }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    issueResult: state.issueResult
});

interface IssueTabRouteProps {
    project: string;
}

interface IssueTabProps extends RouteComponentProps<IssueTabRouteProps> {
    issueResult: IssueResultState;
}

type IssueTabStyle = WithStyles<'container' | 'progress'>;

class IssueTab extends React.Component<IssueTabProps & IssueTabStyle, {}> {
    render() {
        const {classes, issueResult } = this.props;
        return (
                <div className={classes.container}>
                    {issueResult.fetching && <LinearProgress className={classes.progress}/>}
                    {issueResult.result != null &&
                    <MatTable
                        tableHead={['Id', 'Date', 'summary']}
                        tableData={issueResult.result.map(r => ({
                            columns: [`${r.properties._title}`, `${r.properties.createdDate}`, <RankRow
                                key={r.id}
                                initExpand={false}
                                title={'['  + r.label + '] ' + (r.properties.summary == null ? "" : r.properties.summary)}
                                detail={r.properties.description}
                            />]
                        }))}
                    />}
                </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(IssueTab));
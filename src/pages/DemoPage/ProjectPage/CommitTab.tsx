import * as React from 'react';
import { LinearProgress, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import {CommitResultState , RootState } from '../../../redux/reducer';
import RankRow from '../../../components/RankRow';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import MatTable from '../../../components/MatTable/MatTable';
//import { container } from '../../../variables/styles';

const styles = (theme: Theme) => ({
    container: {
//        ...container,
 /*       width:'50%',
        float:'right',
        display:'fixed',*/
        paddingleft:'50px'
    },
    progress: {
        flexGrow: 1,
        margin: theme.spacing.unit * 4
    }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    commitResult:state.commitResult
});

interface CommitTabRouteProps {
    project: string;
}

interface CommitTabProps extends RouteComponentProps<CommitTabRouteProps> {
    commitResult: CommitResultState;
}

type CommitTabStyle = WithStyles<'container' | 'progress' >;

class CommitTab extends React.Component<CommitTabProps & CommitTabStyle, {}> {

    render() {
        const {classes, commitResult} = this.props;
        return (
                <div className={classes.container}>
                    {commitResult.fetching && <LinearProgress className={classes.progress}/>}
                    {commitResult.result  &&
                    <MatTable
                        tableHead={['Id', 'time', 'message']}
                        tableData={commitResult.result.map(r => ({
                            columns: [`${r.properties.name.substring(0,7)}`, `${r.properties.commitTime}`, <RankRow
                                key={r.id}
                                initExpand={false}
                                title={(r.properties.message == null ? "" : r.properties.message)}
                                detail={r.properties.diffSummary}
                            />]
                        }))}
                    />}
                </div>
        );
    }
}
export default withStyles(styles)<{}>(connect(mapStateToProps)(CommitTab));
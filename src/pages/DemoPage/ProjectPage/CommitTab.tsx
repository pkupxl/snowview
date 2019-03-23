import * as React from 'react';
import {LinearProgress, TextField, withStyles, WithStyles} from 'material-ui';
import { Theme } from 'material-ui/styles';
import {CommitResultState, RootState } from '../../../redux/reducer';
import RankRow from '../../../components/RankRow';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import MatTable from '../../../components/MatTable/MatTable';
import {ChangeEvent} from "react";

const styles = (theme: Theme) => ({
    container: {
        paddingleft:'10px'
    },
    progress: {
        flexGrow: 1,
        margin: theme.spacing.unit * 4
    },
    search: {
        width: '100%'
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

type CommitTabStyle = WithStyles<'container' | 'progress' | 'search'>;

class CommitTab extends React.Component<CommitTabProps & CommitTabStyle, {filter:string}> {


    constructor(props:CommitTabProps&CommitTabStyle) {
        super(props);
        this.state = {
            filter: '',
        };
    }

    handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({filter: event.target.value});
    }

    render() {
        const {classes, commitResult} = this.props;
        const {filter} = this.state;
        return (
                <div className={classes.container}>
                    {commitResult.fetching && <LinearProgress className={classes.progress}/>}
                    {commitResult.result  &&
                    <div>
                    <TextField
                        label="Filter Commits"
                       type="search"
                        className={classes.search}
                        onChange={this.handleFilterChange}
                    />
                    <MatTable
                        tableHead={['Commitor', 'time', 'Message']}
                        tableData={commitResult.result.filter(p => p.commitMessage.toLowerCase().includes(filter.toLowerCase())).map(r => ({
                            columns: [`${r.gitUser}`, `${r.commitTime}`, <RankRow
                                key={r.id}
                                initExpand={false}
                                title={(r.commitMessage == null ? "" : r.commitMessage)}
                                detail={<pre>{r.diffMessage}</pre>}
                            />]
                        }))}
                    />
                        </div>
                    }
                </div>
        );
    }
}
export default withStyles(styles)<{}>(connect(mapStateToProps)(CommitTab));
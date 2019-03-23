import * as React from 'react';
import {LinearProgress, TextField, withStyles, WithStyles} from 'material-ui';
import { Theme } from 'material-ui/styles';
import { IssueResultState,  RootState } from '../../../redux/reducer';
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
    },
    HighLight: {
        background: 'red'
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

type IssueTabStyle = WithStyles<'container' | 'progress' | 'search' | 'HighLight'>;

class IssueTab extends React.Component<IssueTabProps & IssueTabStyle, {filter:string}> {
    constructor(props:IssueTabProps & IssueTabStyle) {
        super(props);
        this.state = {
            filter: '',
        };
    }

    handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({filter: event.target.value});
    }

    render() {
        const {filter} = this.state;
        const {classes, issueResult } = this.props;
        return (
                <div className={classes.container}>
                    {issueResult.fetching && <LinearProgress className={classes.progress}/>}
                    {issueResult.result &&
                        <div>
                            <TextField
                     //           id="search"
                                label="Filter Issue"
                               type="search"
                                className={classes.search}
                                onChange={this.handleFilterChange}
                            />
                            <MatTable
                                tableHead={['Id', 'Date', 'Type', 'summary']}
                                tableData={issueResult.result
                                    .filter(p =>
                                        p.properties.summary.toLowerCase().includes(filter.toLowerCase())||
                                        p.properties.description.toLowerCase().includes(filter.toLowerCase())
                                    ).map(r => {
                                        let description=r.properties.description;
                                        /*if(filter!==''){
                                            var re =new RegExp(filter,"g"); //定义正则
                                            description= r.properties.description.replace(re, `<span className=${classes.HighLight}>${filter}</span>`);
                                        }*/
                                         /*  return ({
                                                   columns: [`${r.properties._title}`, `${r.properties.createdDate}`, `${r.properties.type}`,
                                                       <RankRow
                                                           key={r.id}
                                                           initExpand={false}
                                                           title={'[' + r.label + '] ' + (r.properties.summary == null ? "" : r.properties.summary)}
                                                           detail={<div><pre>{description}</pre></div>}
                                                       />]
                                               }
                                            )*/
                                        return ({
                                                columns: [`${r.properties._title}`, `${r.properties.createdDate}`, `${r.properties.type}`,


                                                    <RankRow
                                                        key={r.id}
                                                        initExpand={false}
                                                        title={'[' + r.label + '] ' + (r.properties.summary == null ? "" : r.properties.summary)}
                                                        detail={<div><pre>{description}</pre></div>}
                                                    />]
                                            }
                                        )
                                    })}
                            />
                        </div>
                    }
                </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(IssueTab));
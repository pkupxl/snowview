import * as React from 'react';
import {LinearProgress, withStyles, WithStyles} from 'material-ui';
import { Theme } from 'material-ui/styles';
import {  RootState, HistoryResultState } from '../../../redux/reducer';
import { connect } from 'react-redux';
import {RouteComponentProps} from 'react-router';
import AceDiff from "ace-diff";

const styles = (theme: Theme) => ({
    form: {
        paddingTop: '15px',
        //  paddingBottom: '100px',
        width: '95%',
        //       left:'100px',
        //       display:'fixed',
        float: 'left',
    },
    progress:{
        flexGrow: 1,
        margin: theme.spacing.unit * 4
    },
    right:{
    //    ...theme.mixins.gutters(1),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    historyResult:state.historyResult
});

interface HistoryRouteProps {
    project: string;
}

interface HistoryProps extends RouteComponentProps<HistoryRouteProps> {
    historyResult: HistoryResultState;
}

type HistoryStyle = WithStyles<'form' | 'progress' | 'right'>;

class History extends React.Component<HistoryProps & HistoryStyle, {}> {

    componentDidUpdate(){
        require('../../../assets/css/cs.css');
        const { historyResult } = this.props;
        if (historyResult.result) {
            for (let i = 0 ; i < historyResult.result.length; ++i) {
                new AceDiff({
                    element: '.acediff-' + i,
                    diffGranularity: 'broad',
                    left: {
                        content : historyResult.result[i].preContent === null ? '' : historyResult.result[i].preContent,
                    },
                    right: {
                        content : historyResult.result[i].content === null ? '' : historyResult.result[i].content,
                    },
                    classes: {
                        diff: 'acediff__diffLine',
                        connector: 'acediff__connector',
                        newCodeConnectorLinkContent: '&#8594;',
                        deletedCodeConnectorLinkContent: '&#8592;',
                    },
                });
            }
        }

    }
    componentDidMount(){
        require('../../../assets/css/cs.css');
        const { historyResult } = this.props;
        if (historyResult.result) {
            for (let i = 0 ; i < historyResult.result.length; ++i) {
                new AceDiff({
                    element: '.acediff-' + i,
                    diffGranularity: 'broad',
                    left: {
                        content : historyResult.result[i].preContent === null ? '' : historyResult.result[i].preContent,
                    },
                    right: {
                        content : historyResult.result[i].content === null ? '' : historyResult.result[i].content,
                    },
                    classes: {
                        diff: 'acediff__diffLine',
                        connector: 'acediff__connector',
                        newCodeConnectorLinkContent: '&#8594;',
                        deletedCodeConnectorLinkContent: '&#8592;',
                    },
                });
            }
        }

    }

    render() {
        require('../../../assets/css/cs.css');
        const { historyResult ,classes } = this.props;
        var htmlContent = '<div class="slider" style="height:100%">';
        if (historyResult.result) {
            /*for(let i=0;i<historyResult.result.length; ++i){
                htmlContent += '<a href="#slide-' + (historyResult.result.length-1-i).toString() + '">' + i.toString() + '</a>';
            }*/

            htmlContent += '<div class="slides">';
            for (let i = historyResult.result.length-1 ; i >= 0; --i) {
                htmlContent += '<div id ="slide-' + i.toString() + '" style="display:flex; height: available">';
                          htmlContent +='<div>' +'<h1>CommitMessage</h1>'+historyResult.result[i].commitMessage + '</div>'+'<br/>';
                htmlContent += '<div class = "acediff-' + i + '" style="height:10%;bottom:0px;width:100%;background:#000000; padding-top: 10%"></div>';
                htmlContent += '</div>';
            }
            htmlContent += '</div>';
        }
        htmlContent += '</div>';

        return (
            <div className={classes.form}>
                {historyResult.fetching && <LinearProgress className={classes.progress}/>}
               {historyResult.result && <div dangerouslySetInnerHTML={{__html:htmlContent}}/>}
               {/* {historyResult.result &&
                    <div>
                    <div className={'slider'} >
                        {
                            historyResult.result.map((r,index)=>(
                                    <a href={"#slide-" + index}>{index}</a>
                                )
                            )
                        }
                        <div className="slides">
                        {
                            historyResult.result.map((r,index) => {
                                return (
                                        <div>
                                            <div>
                                                <Paper className={classes.right} elevation={1}>
                                                    <Typography >
                                                        {historyResult.result && historyResult.result[index].commitMessage}
                                                    </Typography>
                                                </Paper>
                                                <div>CommitMessage</div>
                                                <div>{historyResult.result && historyResult.result[index].commitMessage}</div>
                                            </div>
                                            <br/>
                                            <div id={"slide-"+index} className={"slide-"}>
                                                <div id={"acediff-" + index} className={"acediffstyle"}>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                        }
                        </div>

                    </div>
                    </div>
                }*/}
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(History));
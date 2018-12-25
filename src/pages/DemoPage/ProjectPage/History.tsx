import * as React from 'react';
import {withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { IssueResultState, CommitResultState, RootState, HistoryResultState } from '../../../redux/reducer';
import { connect } from 'react-redux';
import {RouteComponentProps} from 'react-router';
import AceDiff from "ace-diff";



const styles = (theme: Theme) => ({
    container:{

    } ,
    progress:{

    },
    right:{

    }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    issueResult: state.issueResult,
    commitResult:state.commitResult,
    historyResult:state.historyResult
});

interface HistoryRouteProps {
    project: string;
}

interface HistoryProps extends RouteComponentProps<HistoryRouteProps> {
    issueResult: IssueResultState;
    commitResult: CommitResultState;
    historyResult: HistoryResultState;
}

type HistoryStyle = WithStyles<'container' | 'progress' | 'right'>;

class History extends React.Component<HistoryProps & HistoryStyle, {}> {

    componentDidMount(){
        require('../../../assets/css/cs.css');
        const { historyResult  } = this.props;
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
        const { historyResult  } = this.props;
        var htmlContent = '<div class="slider" style="height:50%">';
        if (historyResult.result) {
            for(let i=0;i<historyResult.result.length; ++i){
                htmlContent += '<a href="#slide-' + (historyResult.result.length-1-i).toString() + '">' + i.toString() + '</a>';
            }
            htmlContent += '<div class="slides">';
            for (let i = historyResult.result.length-1 ; i >= 0; --i) {
                htmlContent += '<div id ="slide-' + i.toString() + '" style="display:flex; height: available">';
                //           htmlContent +='<div>' +'<h1>CommitMessage</h1>'+historyResult.result[i].commitMessage + '</div>'+'<br/>';
                htmlContent += '<div class = "acediff-' + i + '" style="height:100%;bottom:0px;width:100%;background:#000000;"></div>';
                htmlContent += '</div>';
            }
            htmlContent += '</div>';
        }
        htmlContent += '</div>';
        return (
            <div>
                <div dangerouslySetInnerHTML={{__html:htmlContent}}/>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(History));
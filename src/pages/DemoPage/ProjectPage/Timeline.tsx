import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import * as React from 'react';
import WorkIcon from 'material-ui-icons/Work';
import {Theme, withStyles, WithStyles} from "material-ui/styles";
import {RouteComponentProps} from "react-router";
import {HistoryResultState, IssueResultState, RootState} from "../../../redux/reducer";
import {connect} from "react-redux";
import {LinearProgress} from "material-ui";
import Typography from 'material-ui/Typography';
import AceDiff from "ace-diff";
import CodeModal from '../../../components/CodeModal';
import AceEditor from "react-ace";

const styles = (theme: Theme) => ({
    timeline: {
       background: "#D8D8D8",
    },
    progress: {
        flexGrow: 1,
        margin: theme.spacing.unit * 4
    },
    cellTitle: {
        fontSize: 16,
        color: '#3f51b5',
        fontWeight: 'bold' as 'bold',
        display: 'inline',
    },
    slide:{
        display:'flex',
        height: '500px',
    },
    acediff:{
        height:'100%',
        bottom:'0px',
        width:'100%',
        background:'#000000',
    },

}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    timelineResult:state.historyResult,
    issueResult: state.issueResult
});

type timelineStyle = WithStyles<'timeline' | 'progress' | 'cellTitle' | 'slide' | 'acediff'>;

interface TimelineRouteProps {
    project: string;
}

interface TimelineProps extends RouteComponentProps<TimelineRouteProps> {
    timelineResult: HistoryResultState;
    issueResult: IssueResultState;
}

class Timeline extends React.Component<TimelineProps&timelineStyle,{}>{
    componentDidMount(){
        require('../../../assets/css/cs.css');
        const { timelineResult } = this.props;
        if (timelineResult.result) {
            for (let i = 0 ; i < timelineResult.result.length; ++i) {
                new AceDiff({
                    element: '#acediff-' + i,
                    diffGranularity: 'broad',
                    left: {
                        content : timelineResult.result[i].preContent === null ? '' : timelineResult.result[i].preContent,
                    },
                    right: {
                        content : timelineResult.result[i].content === null ? '' : timelineResult.result[i].content,
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

    componentDidUpdate(){
        require('../../../assets/css/cs.css');
        const { timelineResult } = this.props;
        if (timelineResult.result) {
            for (let i = 0 ; i < timelineResult.result.length; ++i) {
                new AceDiff({
                    element: '#acediff-' + i,
                    diffGranularity: 'broad',
                    left: {
                        content : timelineResult.result[i].preContent === null ? '' : timelineResult.result[i].preContent,
                    },
                    right: {
                        content : timelineResult.result[i].content === null ? '' : timelineResult.result[i].content,
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

    render(){
        const { classes,timelineResult,issueResult } = this.props;
        return(
            <div>
                {timelineResult.fetching && <LinearProgress className={classes.progress}/>}
                {timelineResult.result &&
                <VerticalTimeline className={classes.timeline} layout="1-column">
                    {
                        timelineResult.result.map((r,index) =>{
                            let summary="";
                            if(r.changeSummary){
                                for(let i=0;i<r.changeSummary.length;++i){
                                    summary+=r.changeSummary[i];
                                }
                            }
                            const content=
                                <div id ={"slide-"+index} className={classes.slide}>
                                    <div id={"acediff-"+index} className={classes.acediff}>

                                    </div>;
                                </div>;

                            let issueDescription=null;
                            let issueSummary=null;
                            if(issueResult.result){
                                for(let i=0;i<issueResult.result.length;++i){
                                    if(issueResult.result[i].properties._title==r.issueId) {
                                        issueDescription=issueResult.result[i].properties.description;
                                        issueSummary=issueResult.result[i].properties.summary;
                                    }
                                }
                            }
                            const Issue=(
                                <div>
                                    <Typography className={classes.cellTitle}>{"[JiraIssue]:"+issueSummary}</Typography>
                                    <div>
                                        {issueDescription}
                                    </div>
                                </div>)
                               ;

                            return (
                                <VerticalTimelineElement
                                    className="vertical-timeline-element--work"
                                    date={`${r.time}`}
                                    iconStyle={{background: 'rgb(33, 150, 243)', color: r.hasIssue?'#FF0000':'#fff'}}
                                    icon={<WorkIcon/>}
                                >
                                    <Typography className={classes.cellTitle}>{`${r.commitMessage}`}</Typography>
                                        <CodeModal
                                        code={true}
                                        label="show difference with preversion"
                                        content={content}
                                        />
                                    <CodeModal
                                   //     code={true}
                                        code={false}
                                        label="show Issue"
                                        content={Issue}
                                    />
                                    {
                                        r.content.length>=500?
                                            <CodeModal
                                            code={true}
                                            label="show current code"
                                            content={r.content}
                                        />:
                                            <AceEditor
                                                mode="java"
                                                theme="github"
                                                value={r.content}
                                                name="UNIQUE_ID_OF_DIV"
                                                editorProps={{$blockScrolling: true}}
                                                width={'100%'}
                                                height={'100px'}
                                            />
                                    }

                                    <div className={classes.cellTitle}>
                                        <Typography className={classes.cellTitle}>Change Summary : </Typography>
                                        <pre >
                                            {summary}
                                        </pre>
                                    </div>
                                </VerticalTimelineElement>
                            )
                        })
                    }
                    { !timelineResult.fetching &&
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        iconStyle={{background: 'rgb(33, 150, 243)', color: '#fff'}}
                        icon={<WorkIcon/>}
                    >
                            The code is already the first version.
                    </VerticalTimelineElement>
                    }
                </VerticalTimeline>
                }
            </div>
        )
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(Timeline));
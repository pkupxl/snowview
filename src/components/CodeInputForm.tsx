import * as React from 'react';
import { connect } from 'react-redux';
import {  withStyles, WithStyles } from 'material-ui';
import { RootState , HistoryResultState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { Theme } from 'material-ui/styles';
import { ChangeEvent } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';
import Button from 'material-ui/Button/Button';
import RegularCard from './Cards/RegularCard';
import 'ace-diff/dist/ace-diff.min.css';
import AceDiff from 'ace-diff';
import Swal from 'sweetalert2';


const styles = (theme: Theme) => ({
    container: {
        margin: theme.spacing.unit * 2
    },
    form: {
        paddingTop: '15px',
      //  paddingBottom: '100px',
        width: '95%',
 //       left:'100px',
 //       display:'fixed',
        float: 'left',
    },
    search: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        width: `calc(100% - ${theme.spacing.unit * 4}px)`,
        flex: 1,
    },
    button: {
        margin: theme.spacing.unit,
        float: 'right',
    },

    acediff: {
        height: '80%',
        bottom: '0px',
        width: '100%',
        background: '#000000',
    }
});

interface CodeInputFormProps {
    query?: string;
    issueCallback: Function;
    commitCallback: Function;
    historyCallback: Function;
    dispatch: Dispatch<RootState>;
    historyResult: HistoryResultState;
}

const mapStateToProps = (state: RootState) => ({
    historyResult: state.historyResult
});

type CodeInputFormStyles = WithStyles<'container' | 'form' | 'search' | 'button' | 'acediff'>;

class CodeInputForm extends React.Component<CodeInputFormProps & CodeInputFormStyles , { input: string }> {
    state = {
        input: ''
    };

    componentDidMount() {
        this.setState({input: this.props.query || ''});
    }

    componentWillReceiveProps(nextProps: CodeInputFormProps & CodeInputFormStyles) {
        this.setState({input: nextProps.query || ''});
    }

    handleSubmit = (event: {}) => {
     //   event.preventDefault();
        const {dispatch, issueCallback, commitCallback , historyCallback } = this.props;

        dispatch(issueCallback({query: this.state.input}));
        dispatch(commitCallback({query: this.state.input}));
        dispatch(historyCallback({query: this.state.input}));
    }

    handleChange = (s: string, event: ChangeEvent<HTMLInputElement>) => {
        this.setState({input: s});
    }

    handleTrace = () => {
        require('../assets/css/cs.css');
        const {historyResult} =this.props;
        var htmlContent = '<div class="slider" style="height:50%">';
        if (historyResult.result) {
            for(let i=0;i<historyResult.result.length; ++i){
                htmlContent += '<a href="#slide-' + (historyResult.result.length-1-i).toString() + '">' + i.toString() + '</a>';
            }
            htmlContent += '<div class="slides">';
            for (let i = historyResult.result.length-1 ; i >= 0; --i) {
                htmlContent += '<div id ="slide-' + i.toString() + '" style="display:flex; height: available">';
     //           htmlContent +='<div>' +'<h1>CommitMessage</h1>'+historyResult.result[i].commitMessage + '</div>'+'<br/>';
                htmlContent += '<div class = "acediff-' + i + '" style="height:70%;bottom:0px;width:100%;background:#000000;"></div>';
                htmlContent += '</div>';
            }
            htmlContent += '</div>';
        }
        htmlContent += '</div>';

        Swal({
            html: htmlContent,
            width: '90%',
      //      heightAuto: true,
       //     grow: 'column',
        });


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
        const {classes } = this.props;
        return (
            <div className={classes.form}>
                <RegularCard headerColor="blue" cardTitle="请输入代码:">
                <AceEditor
                    mode="java"
                    theme="github"
                    value={this.state.input}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{$blockScrolling: true}}
                    onChange={this.handleChange}
                    width={'100%'}
                       height={'300px'}
                />
                    <Button color="primary" className={classes.button} onClick={this.handleTrace}>
                        回溯历史
                    </Button>
                <Button color="primary" className={classes.button} onClick={this.handleSubmit}>
                    提交
                </Button>
                </RegularCard>
            </div>
        );
    }
}

export default withStyles(styles)<{
    issueCallback: Function, commitCallback: Function, historyCallback: Function, query?: string
}>(connect(mapStateToProps)(CodeInputForm));
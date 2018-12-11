import * as React from 'react';
import { connect } from 'react-redux';
import {  withStyles, WithStyles } from 'material-ui';
import { RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { Theme } from 'material-ui/styles';
import { ChangeEvent } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';
import Button from "material-ui/Button/Button";
import RegularCard from "./Cards/RegularCard";

const styles = (theme: Theme) => ({
    container: {
        margin: theme.spacing.unit * 2
    },
    form: {
        paddingTop:'15px',
        width: '95%',
        height: '50%',
 //       left:'100px',
 //       display:'fixed',
        float:'left',
    },
    search: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        width: `calc(100% - ${theme.spacing.unit * 4}px)`,
        flex: 1,
    },
    button:{
        margin: theme.spacing.unit,
        float:'right',
    }
});


interface CodeInputFormProps{
    query?: string;
    issueCallback: Function;
    commitCallback: Function;
    dispatch: Dispatch<RootState>;
}

type CodeInputFormStyles = WithStyles<'container' | 'form' | 'search' | 'button'>;

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

    handleSubmit = (event: any) => {
        event.preventDefault();
        const {dispatch, issueCallback,commitCallback} = this.props;

        dispatch(issueCallback({query: this.state.input}));
        dispatch(commitCallback({query: this.state.input}));
    }

    handleChange = (s:string,event: ChangeEvent<HTMLInputElement>) => {
        this.setState({input: s});
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
                />
                <Button color="primary" className={classes.button} onClick={this.handleSubmit}>
                    提交
                </Button>
                </RegularCard>
            </div>
        );
    }
}

export default withStyles(styles)<{
    issueCallback: Function, commitCallback: Function, query?: string
}>(connect()(CodeInputForm));
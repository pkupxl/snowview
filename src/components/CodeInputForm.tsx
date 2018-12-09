import * as React from 'react';
import { connect } from 'react-redux';
import { Input, withStyles, WithStyles } from 'material-ui';
import { RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { Theme } from 'material-ui/styles';
import { ChangeEvent, FormEvent } from 'react';

const styles = (theme: Theme) => ({
    container: {
        margin: theme.spacing.unit * 2
    },
    form: {
        width: '100%',
    },
    search: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        width: `calc(100% - ${theme.spacing.unit * 4}px)`,
        flex: 1,
    },
});

interface CodeInputFormProps {
    query?: string;
    issueCallback: Function;
    commitCallback: Function;
    dispatch: Dispatch<RootState>;
}

type CodeInputFormStyles = WithStyles<'container' | 'form' | 'search'>;

class CodeInputForm extends React.Component<CodeInputFormProps & CodeInputFormStyles, { input: string }> {
    state = {
        input: ''
    };

    componentDidMount() {
        this.setState({input: this.props.query || ''});
    }

    componentWillReceiveProps(nextProps: CodeInputFormProps & CodeInputFormStyles) {
        this.setState({input: nextProps.query || ''});
    }

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {dispatch, issueCallback,commitCallback} = this.props;

        dispatch(issueCallback({query: this.state.input}));
        dispatch(commitCallback({query: this.state.input}));
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({input: event.target.value});
    }

    render() {
        const {classes} = this.props;
        return (
            <form className={classes.form} onSubmit={this.handleSubmit}>
                <Input
                    className={classes.search}
                    type="search"
                    placeholder="input code here..."
                    value={this.state.input}
                    onChange={this.handleChange}
                />
            </form>
        );
    }
}

export default withStyles(styles)<{
    issueCallback: Function, commitCallback: Function, query?: string
}>(connect()(CodeInputForm));
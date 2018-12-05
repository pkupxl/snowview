import * as React from 'react';
import { connect } from 'react-redux';
import {
  InputLabel, FormControl, LinearProgress, withStyles,
  WithStyles, FormGroup
} from 'material-ui';
import { Theme } from 'material-ui/styles';
import { RootState } from '../../../redux/reducer';
import { Dispatch } from 'redux';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { FormEvent } from 'react';
import { Option } from 'ts-option';
import * as _ from 'lodash';
import { fetchNodeWorker, removeNode, showRelations } from '../../../redux/action';
import { RelationListsState, RelationsState } from '../../../redux/graphReducer';
import { Chance } from 'chance';
import RegularCard from '../../../components/Cards/RegularCard';

const chance = new Chance();

const styles = (theme: Theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 240,
  }
});

const mapStateToProps = (state: RootState) => ({
  selectedNode: state.graph.selectedNode,
  relations: state.graph.relations,
  relationLists: state.graph.relationLists,
});

interface FindEntityPanelProps {
  selectedNode: Option<number>;
  relations: RelationsState;
  relationLists: RelationListsState;
  dispatch: Dispatch<RootState>;
  project: string;
}

class FindEntityPanel extends React.Component<FindEntityPanelProps & WithStyles<'formControl'>, {}> {
  input: HTMLInputElement;

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const catalog = this.input.value;
    const {dispatch, selectedNode, relationLists, relations, project} = this.props;

    const relationList = relationLists.get(selectedNode.get);

    const rels = relationList.get
      .map(x => relations.get(x))
      .filter(x => !x.shown)
      .filter(x => x.types.some(t => t === catalog));

    const readyToShow = rels.length > 0 ? chance.pickset(rels, 5) : [];

    readyToShow.forEach(r => {
      const source = r.source, target = r.target;
      const otherID = source === selectedNode.get ? target : source;
      dispatch(fetchNodeWorker({project, id: otherID}));
    });

    dispatch(showRelations(readyToShow.map(x => x.id)));
  }

  render() {
    let body = null;

    const {dispatch, selectedNode, relationLists, relations} = this.props;

    if (selectedNode.isEmpty) {
      body = <Typography component="p"> No entity selected. </Typography>;
    } else {
      const selected = selectedNode.get;
      const selectedRelationList = relationLists.get(selected);

      if (selectedRelationList.isEmpty) {
        body = <LinearProgress/>;
      } else {
        const relationTypes = _.chain(selectedRelationList.get)
          .flatMap(x => relations.get(x).types)
          .uniq()
          .value();
        body = (
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <FormControl className={this.props.classes.formControl}>
                <InputLabel htmlFor="relation-type">Relation Type</InputLabel>
                <Select
                  native={true}
                  input={<Input id="relation-type" inputRef={(input) => this.input = input}/>}
                >
                  {relationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </FormControl>
            </FormGroup>
            <Button type="submit">EXPAND</Button>
            <Button onClick={() => dispatch(removeNode(selected))}>HIDE</Button>
          </form>
        );
      }
    }

    return (
      <RegularCard headerColor="blue" cardTitle="Surf in the knowledge graph">
        {body}
      </RegularCard>

    );
  }
}

export default withStyles(styles)<{ project: string }>(connect(mapStateToProps)(FindEntityPanel));

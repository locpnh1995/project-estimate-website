import React from 'react';
import {connect} from 'react-redux';
import {
    Table
} from 'semantic-ui-react';

import {
  getBruteforceStaffs
} from '../estimate/estimateActions';

import _ from 'lodash';


class BruteforceStaffs extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    column: null,
    data: this.props.estimateReducer.bruteforceStaffs,
    direction: null,
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState(Object.assign({...this.state},{data: nextProps.estimateReducer.bruteforceStaffs}));
  }

  render() {
    const { column, data, direction } = this.state
    return (
       <Table sortable celled fixed striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell >
              STT
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'name' ? direction : null} onClick={this.handleSort('name')}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell>
              Available Time/Month
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'timeAffordable' ? direction : null} onClick={this.handleSort('timeAffordable')}>
              Hour Affordable
            </Table.HeaderCell>
            <Table.HeaderCell>
              Cost/Hour
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'cost' ? direction : null} onClick={this.handleSort('cost')}>
              Total Cost
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(data, (combinationInfos, index) => (
            <Table.Row key={'bruteforceStaff'+index} 
                negative={ (combinationInfos.timeAffordable < this.props.estimateReducer.estimatedResult.original.PMs*152) ? true : false}
                positive={ (combinationInfos.timeAffordable < this.props.estimateReducer.estimatedResult.original.PMs*152) ? false : true}
            >
              <Table.Cell>{index+1}</Table.Cell>
              <Table.Cell>
              {combinationInfos.staffs.map((staff, index) => (
                <p>{staff.lastname+' '+staff.firstname}</p>
                ))}
              </Table.Cell>
              <Table.Cell>
                {combinationInfos.staffs.map((staff, index) => (
                <p>{(8 - staff.work_time.office)}</p>
                ))}
              </Table.Cell>
              <Table.Cell>{Math.round(combinationInfos.timeAffordable*100)/100}</Table.Cell>
              <Table.Cell>
                {combinationInfos.staffs.map((staff, index) => (
                <p>{Math.round((staff.salary/152)*100)/100}</p>
                ))}
              </Table.Cell>
              <Table.Cell>{Math.round(combinationInfos.cost*100)/100}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

// export default Estimate;


const mapStateToProps = (state) => {
    return {
        estimateReducer: state.estimateReducer
    };
}

const mapDispatchToProps = {
  getBruteforceStaffs
};

export default connect(mapStateToProps, mapDispatchToProps)(BruteforceStaffs);
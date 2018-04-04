import React from 'react';
import {connect} from 'react-redux';
import {
    Grid,
    Header,
    Icon,
    Statistic,
    Popup
} from 'semantic-ui-react';



const NOT_DECIDED = -1, ACCEPTED = 1, DECLINED = 0;

class EstimatedStatistics extends React.Component {
    constructor(props) {
        super(props);
        // this.close = this.close.bind(this);
        this.distinctStaff = this.distinctStaff.bind(this);
    }

    distinctStaff(staffs){
        if(staffs.length == 0)
            return [];

        let distinctStaffsId = [];
        let distinctStaffs = [];
        for(let staff of staffs)
        {
            if(distinctStaffsId.indexOf(staff._id)<0)
            {
                distinctStaffsId.push(staff._id);
                distinctStaffs.push(staff);
            }
        }
        return distinctStaffs;
    }
    // state = {
    //   modal: 
    //   {
    //     StaffAfforableTimelineModal: false  
    //   }
    // }

    // open( element => {
    //   let currentState            = {...this.state};
    //   currentState.modal[element] = true;
    //   this.setState(currentState);
    // })

    // close( element => {
    //   let currentState            = {...this.state};
    //   currentState.modal[element] = false;
    //   this.setState(currentState);
    // })

    render() {

      return (
          <Grid columns={2}>
              <Grid.Row textAlign="center">
                  <Grid.Column textAlign="center">
                    <Header as='h3'>Thông số ban đầu</Header>
                    <Statistic size="tiny">
                      <Statistic.Value>
                        {Math.round(this.props.projectReducer.projectWillCreate.duration*100)/100} <Icon name="calendar"/>
                      </Statistic.Value>
                      <Statistic.Label>Tháng</Statistic.Label>
                    </Statistic>

                    <Statistic size="tiny">
                      <Statistic.Value>
                        {Math.round(this.props.estimateReducer.KLOC*1000*100)/100} <Icon name="file text outline"/>
                      </Statistic.Value>
                      <Statistic.Label>SLOC</Statistic.Label>
                    </Statistic>

                    <Statistic size="tiny">
                      <Statistic.Value>
                        {
                          Math.round(Math.round(this.props.estimateReducer.estimatedResult.original.PMs*152*100)/100)
                        } <Icon name="clock"/>
                      </Statistic.Value>
                      <Statistic.Label>Giờ</Statistic.Label>
                    </Statistic>

                  </Grid.Column>

                  <Grid.Column textAlign="center">
                    <Header as='h3'>Thông số ước tính</Header>
                    <Statistic size="tiny">
                      <Statistic.Value>
                        {
                          Math.round(this.props.projectReducer.projectWillCreate.duration*100)/100
                        } <Icon name="calendar"/>
                      </Statistic.Value>
                      <Statistic.Label>Tháng</Statistic.Label>
                    </Statistic>

                    <Statistic size="tiny">
                      <Statistic.Value>
                        {
                          this.distinctStaff(this.props.estimateReducer.estimatedResult.suitableStaffs).length
                        } <Icon name='users'/>
                      </Statistic.Value>
                      <Statistic.Label>Người</Statistic.Label>
                    </Statistic>

                    {/*<Statistic size="tiny">
                      <Statistic.Value>
                        {Math.round(this.props.estimateReducer.estimatedResult.projectCostPerMonth*100)/100} <Icon name="usd"/>
                      </Statistic.Value>
                      <Statistic.Label>Chi Phí/Tháng</Statistic.Label>
                    </Statistic>*/}

                    <Statistic size="tiny">
                      <Statistic.Value>
                        {
                          Math.round(Math.round(this.props.estimateReducer.estimatedResult.totalTimeTeamAfforable*100)/100)
                        } <Icon name="clock"/>
                      </Statistic.Value>
                      <Statistic.Label>Giờ <Popup
                            trigger={ <Icon className="cursor-pointer-hover" name="external share"/>}
                            content="Biểu đồ thời gian của từng nhân viên."
                            basic
                          />
                      </Statistic.Label>
                    </Statistic>

                    <Statistic size="tiny">
                      <Statistic.Value>
                        {
                          Math.round(Math.round(this.props.estimateReducer.estimatedResult.totalProjectCost*100)/100)
                        } <Icon name="usd"/>
                      </Statistic.Value>
                      <Statistic.Label>Tổng chi phí</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
              </Grid.Row>
          </Grid>
      );
    }
}

// export default Estimate;


const mapStateToProps = (state) => {
    return {
        estimateReducer: state.estimateReducer,
        projectReducer: state.projectReducer
    };
}

export default connect(mapStateToProps)(EstimatedStatistics);
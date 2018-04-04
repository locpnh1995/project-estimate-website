import React from 'react';
import {connect} from 'react-redux';

import moment from 'moment';
import Timeline from 'react-calendar-timeline/lib';




const NOT_DECIDED = -1, ACCEPTED = 1, DECLINED = 0;

class StaffAfforableTimeline extends React.Component {
    constructor(props) {
        super(props);
        
    }
    // componentWillReceiveProps(nextProps)
    // {
    //   let groups = [];
    //   nextProps.estimateReducer.estimatedResult.suitableStaffs.map((staff, staffIndex) => {
    //     groups.push({
    //       id: staffIndex+1,
    //       title: staff.lastname+' '+staff.firstname
    //     });
    //   });
    //   this.setState({groups: groups});
    //   console.log(groups);
    // }
    componentDidMount()
    {
      
      let groups = [];
      let staffsId_tempId = {
        officeIds: []
      };
      this.props.estimateReducer.estimatedResult.suitableStaffs.map((staff, staffIndex) => {
        if(staffsId_tempId[staff._id] === undefined)
        {
          staffsId_tempId[staff._id] = {};
          staffsId_tempId[staff._id]['id'] = staffIndex+1;
          staffsId_tempId[staff._id]['items'] = [];
          if(staff.typeWork === "OFFICE")
          {
            staffsId_tempId["officeIds"].push(staff._id);
          }
          groups.push({
            id: staffsId_tempId[staff._id]['id'],
            title: staff.lastname+' '+staff.firstname
          });
        }
      });
      this.setState({groups: groups});

      /*---------------------------------------------*/
      // console.log('staffsId_tempId',staffsId_tempId);
      
      let items = [];
      let item_id = 1;
      this.props.estimateReducer.estimatedResult.suitableStaffs.map((staff, staffIndex) => {
        staff.timeOfDayForProject.map((timeFrame, timeFrameIndex) =>{
          if(staff.typeWork === "OVERTIME")
          {
            if(staffsId_tempId["officeIds"].indexOf(staff._id)>-1)
            {
              for(let item of staffsId_tempId[staff._id]['items'])
              {
                if(items[item-1].start_time.utc().format() == moment(timeFrame.from).startOf('day').utc().format() &&
                  items[item-1].end_time.utc().format() == moment(timeFrame.to).utc().format())
                {
                  items[item-1].title+=' | Tăng ca: '+timeFrame.overtime+' giờ';
                }
                // console.log('item',item);
                // console.log(items[item-1]['start_time']);
                // console.log(items[item-1].start_time.utc().format());
                // console.log(moment(timeFrame.from).startOf('day').utc().format());

                // console.log(items[item-1].end_time.utc().format());
                // console.log(moment(timeFrame.to).utc().format());
                // console.log('--------------------------------------------');
              }
              
            }
            else
            {
              items.push({
                id: item_id,
                group: staffsId_tempId[staff._id]['id'],
                title: staff.typeWork === "OFFICE" ? 'Hành chính: '+timeFrame.office+' giờ' : 'Tăng ca: '+timeFrame.overtime+' giờ',
                start_time: moment(timeFrame.from).startOf('day'),
                end_time: moment(timeFrame.to),
                canResize:false
              });
              staffsId_tempId[staff._id]['items'].push(item_id++);
            }
          }
          else
          {
            items.push({
              id: item_id,
              group: staffsId_tempId[staff._id]['id'],
              title: staff.typeWork === "OFFICE" ? 'Hành chính: '+timeFrame.office+' giờ' : 'Tăng ca: '+timeFrame.overtime+' giờ',
              start_time: moment(timeFrame.from).startOf('day'),
              end_time: moment(timeFrame.to),
              canResize:false
            });
            staffsId_tempId[staff._id]['items'].push(item_id++);
          }
          
        });
      });

      this.setState({items: items});
    }

    state = {
      groups: [],
      items: []
    };

    render() {
      return (
            <Timeline groups={this.state.groups}
              items={this.state.items}
              defaultTimeStart={moment(this.props.projectReducer.projectWillCreate.start_day).startOf('day')}
              defaultTimeEnd={moment(this.props.projectReducer.projectWillCreate.end_day).startOf('day')}
              traditionalZoom = {true}
            />
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

export default connect(mapStateToProps)(StaffAfforableTimeline);
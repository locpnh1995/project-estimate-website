import React from 'react';
import {connect} from 'react-redux';
import {
    Container, 
    Button,
    Grid,
    Form,
    Icon,
    Header
} from 'semantic-ui-react';

import {getUsersInCompanyInfo} from '../user/UserActions';

import Timeline from 'react-calendar-timeline/lib';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
import 'moment-duration-format';
import userAPI from '../utils/user';
import companyUtilites from '../utils/company';

const BUSY = 'BUSY';
const FREE = 'FREE';

class AllStaffTimeline extends React.Component {
    constructor(props) {
        super(props);
        this.handleStartDateChange  = this.handleStartDateChange.bind(this);
        this.handleEndDateChange  = this.handleEndDateChange.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleOnClickChangeViewMethod = this.handleOnClickChangeViewMethod.bind(this);
        this.displayTimeline = this.displayTimeline.bind(this);
        // this.handleScrollBody = this.handleScrollBody.bind(this);
    }

    state = { 
        time:{
            start_day: moment(),
            end_day: moment().add(3,'months')
        },
        timeline:{
            groups: [],
            items: []
        },
        visible:{
            dayInput: true
        },
        viewMethod: FREE,
        staffsWithTimeline: []
    }

    // componentDidMount() {
    //     window.addEventListener('scroll', this.handleScrollBody);
    // }
    
    // componentWillUnmount() {
    //     window.removeEventListener('scroll', this.handleScrollBody);
    // }

    // handleScrollBody()
    // {
    //   console.log('scroll');
    // }


    handleSubmitForm()
    {
        let companyId = this.props.profileUser.profile.current_company._id;
        let start_day = this.state.time.start_day.startOf('day').utc().format();
        let end_day = this.state.time.end_day.startOf('day').utc().format();

        companyUtilites.getAllStaffTimeline(companyId,start_day,end_day)
        .then((response) => {
            console.log(response);
            if(response.staffsWithTimeline !== undefined)
            {
              let staffsWithTimeline = response.staffsWithTimeline;

              let currentState = {...this.state};
              currentState.staffsWithTimeline = staffsWithTimeline;
              this.setState(currentState);

              this.displayTimeline(staffsWithTimeline);
            }
        });

    }

    displayTimeline(staffsWithTimeline,viewMethod = FREE)
    {

          let groups = [];
          let staffsId_tempId = {
            officeIds: []
          };
          staffsWithTimeline.map((staff, staffIndex) => {
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

          let totalOfficeTime = 8;
          let totalOverTime = 4;
          let backgroundColor = 'rtc-busy-time';
          if(viewMethod == FREE)
          {
            totalOfficeTime = 0;
            totalOverTime = 0;
            backgroundColor = 'rtc-free-time';
          }

          let items = [];
          let item_id = 1;
          staffsWithTimeline.map((staff, staffIndex) => {
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
                      items[item-1].title+=' | Tăng ca: '+Math.abs(totalOverTime-timeFrame.overtime)+' giờ';
                    }
                  }
                  
                }
                else
                {
                  items.push({
                    id: item_id,
                    group: staffsId_tempId[staff._id]['id'],
                    title: staff.typeWork === "OFFICE" ? 'Hành chính: '+Math.abs(totalOfficeTime-timeFrame.office)+' giờ' : 'Tăng ca: '+Math.abs(totalOverTime-timeFrame.overtime)+' giờ',
                    start_time: moment(timeFrame.from).startOf('day'),
                    end_time: moment(timeFrame.to),
                    canResize:false,
                    className: backgroundColor
                  });
                  staffsId_tempId[staff._id]['items'].push(item_id++);
                }
              }
              else
              {
                items.push({
                  id: item_id,
                  group: staffsId_tempId[staff._id]['id'],
                  title: staff.typeWork === "OFFICE" ? 'Hành chính: '+Math.abs(totalOfficeTime-timeFrame.office)+' giờ' : 'Tăng ca: '+Math.abs(totalOverTime-timeFrame.overtime)+' giờ',
                  start_time: moment(timeFrame.from).startOf('day'),
                  end_time: moment(timeFrame.to),
                  canResize:false,
                  className: backgroundColor
                });
                staffsId_tempId[staff._id]['items'].push(item_id++);
              }
              
            });
          });

          // console.log('here');
          // console.log('items',items);

          let currentState = {...this.state};
          currentState.timeline.groups = groups;
          currentState.timeline.items = items;
          currentState.visible.dayInput = false;
          this.setState(currentState);
    }

    handleStartDateChange(date) {
        // console.log(date);
      let currentState = {...this.state};
      currentState.time.start_day = date;
      this.setState(currentState);
    }

    handleEndDateChange(date) {
        // console.log(date);
      let currentState = {...this.state};
      currentState.time.end_day = date;
      this.setState(currentState);
    }

    handleOnClickChangeViewMethod(){
        let currentState = {...this.state};

        if(this.state.viewMethod == FREE)
        {
            currentState.viewMethod = BUSY;
        }
        else
        {
            currentState.viewMethod = FREE;   
        }

        this.setState(currentState);
        
        //setState collision, so must setTimeout
        setTimeout(()=>{this.displayTimeline(this.state.staffsWithTimeline,currentState.viewMethod)},1);
        
    }

    render() {
        const beginEndForm = 
            <Form onSubmit={this.handleSubmitForm}>
                <h2>Hãy nhập mốc thời gian cần xem:</h2>
                <Grid columns={3}>
                    <Grid.Column>
                        <Grid.Row>
                            <Form.Field className="required">
                                <label>Ngày bắt đầu</label>
                                <DatePicker required selected={this.state.time.start_day}
                                    name='start_date'
                                    dateFormat="DD/MM/YYYY"
                                    onChange={this.handleStartDateChange}
                                    className="date-picker-input-width"
                                  />
                            </Form.Field>
                            <Form.Field className="required">
                                <label>Ngày kết thúc</label>
                                <DatePicker required selected={this.state.time.end_day}
                                    name='end_day'
                                    dateFormat="DD/MM/YYYY"
                                    onChange={this.handleEndDateChange}
                                    className="date-picker-input-width"
                                  />
                            </Form.Field>
                            <Button type='submit' primary floated="right"><Icon name="search"/> Xem</Button>
                      </Grid.Row>
                    </Grid.Column>
                
                    <Grid.Column>

                    </Grid.Column>

                    <Grid.Column>
                    </Grid.Column>
               </Grid>
            </Form>

            const timeline = 
                <Timeline groups={this.state.timeline.groups}
                  items={this.state.timeline.items}
                  defaultTimeStart={moment(this.state.time.start_day).startOf('day')}
                  defaultTimeEnd={moment(this.state.time.end_day).startOf('day')}
                  fixedHeader="fixed"
                  traditionalZoom = {true}
                />

            const viewMethodControl = 
                <Form>
                    {
                        this.state.viewMethod == BUSY ? 
                            <Button floated="right" 
                                onClick={this.handleOnClickChangeViewMethod}
                                color='green'
                                className="change-view-method-fixed"
                            >  
                                <Icon name="hourglass empty" /> Xem thời gian rảnh
                            </Button>
                        :
                            <Button floated="right" 
                                onClick={this.handleOnClickChangeViewMethod}
                                color='red'
                                className="change-view-method-fixed"
                            >  
                                <Icon name="hourglass full" /> Xem thời gian làm việc
                            </Button>
                    }
                </Form>

        return (
            <Container style={{width: '100%', height: 'calc(100vh - 59px)', overflow: 'auto', marginTop: '-1rem', padding: 10, position: 'relative'}}>
                {
                  this.state.visible.dayInput ? beginEndForm : ''
                }
                <Grid columns={2} className="margin-bot-1">
                  <Grid.Column width={13}>
                    {
                      this.state.visible.dayInput ? '' :   
                        this.state.viewMethod == BUSY ? 
                            <Header as="h2" color="red">Bảng thời gian làm việc của nhân viên</Header>
                        :
                            <Header as="h2" color="green">Bảng thời gian rảnh rỗi của nhân viên</Header>
                    }
                    { 
                      this.state.visible.dayInput ? '' : timeline
                    }
                  </Grid.Column>
                  <Grid.Column width={3}>
                    {
                      this.state.visible.dayInput ? '' : viewMethodControl  
                    }
                  </Grid.Column>
                </Grid>
                
            </Container>
        )
    }
}
const mapStateToProps = (state) => {
    return {
		profileUser: state.userReducer
	};
}

const mapDispatchToProps = {
    getUsersInCompanyInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(AllStaffTimeline);
//export default Meeting;

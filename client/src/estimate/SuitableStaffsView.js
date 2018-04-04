import React from 'react';
import {connect} from 'react-redux';
import {
    Grid,
    Icon,
    Rating,
    Image
} from 'semantic-ui-react';

const NOT_DECIDED = -1, ACCEPTED = 1, DECLINED = 0;
class SuitableStaffsView extends React.Component {
    constructor(props) {
        super(props);
        this.distinctStaff = this.distinctStaff.bind(this);
    }

    state = {
        activeIndex: 0,
        suitableStaffsDistinct: []
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            suitableStaffsDistinct: this.distinctStaff(nextProps.estimateReducer.estimatedResult.suitableStaffs)
        });
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

    render() {
        const suitableStaffs =
         this.state.suitableStaffsDistinct.map((staff, staffIndex) => {
            return (
          <Grid.Column className="suitable_staff" key={`suitable_staff_${staffIndex}`}>
            <Grid.Row>
                <Grid.Column>
                    <Image className="margin_top_7" src={`/images/users/${staff.gender ? 'male' : 'female'}/${Math.round(Math.random()*14+1)}.jpg`} width="173" height="173" centered/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="suitable_staff_content">
                <Grid.Column>
                    <Grid columns={2} className="no_margin">
                        <Grid.Row>
                            <Grid.Column width={13} className="no_padding">
                                <p className="suitable_staff_name">{staff.lastname+' '+staff.firstname}</p>
                            </Grid.Column>
                            <Grid.Column textAlign="right" width={3} className="no_padding">
                                <Icon name={staff.gender ? 'man' : 'woman'} size="large" color={staff.gender ? 'blue' : 'pink'}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid.Row>
                      <Grid.Column className="no_padding">
                        <p><Icon name="money" />Lương: {staff.salary}<Icon name="usd" /></p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid columns={2} className="no_margin">
                            <Grid.Row>
                                <Grid.Column className="no_padding">
                                    <div><Icon name="write" />ACAP: {staff.analyst_capability+1}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></div>
                                    <div><Icon name="code" />PCAP: {staff.programmer_capability+1}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></div>
                                </Grid.Column>
                                <Grid.Column className="no_padding">
                                    <div><Icon name="edit" />APEX: {staff.application_experience+1}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></div>
                                    <div><Icon name="cloud upload" />PLEX: {staff.platform_experience+1}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></div>
                                    <div><Icon name="wrench" />LTEX: {staff.language_and_toolset_experience+1}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                    {/*<Divider section className="no_margin"/>
                    <Grid className="no_margin">
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <Button color='blue'>Thông tin cá nhân</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>*/}
                </Grid.Column>
            </Grid.Row>
          </Grid.Column>
            )
        });
         const { activeIndex } = this.state
         return(

            <div>
                {/*<Button.Group>
                    <Button color='blue'><Icon name="dollar"/>Chi phí thấp</Button>
                    <Button color='blue'><Icon name="calendar"/>Làm nhanh nhất</Button>
                    <Button color='blue'>Blue</Button>
                </Button.Group>*/}
                <Grid columns={3}>
                    {suitableStaffs}
                </Grid>
            </div>
            )
    }
}

const mapStateToProps = (state) => {
    return {
        estimateReducer: state.estimateReducer,
        projectReducer: state.projectReducer
    };
}


export default connect(mapStateToProps)(SuitableStaffsView);
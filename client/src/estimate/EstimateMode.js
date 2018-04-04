import React from 'react';
import {connect} from 'react-redux';
import {
	Table,
	Popup,
	Header,
	Grid,
	Container,
	Modal,
	Icon,
	Divider
} from 'semantic-ui-react';

import {
	changeCreateMode,
	changeVisibleCreateModeModal
} from '../project/ProjectActions';


const CREATE_MODE_NOT_DECIDED = 0;
const MANUAL_PICK_STAFF = 1;
const AUTO_PICK_STAFF = 2;
const COMPLETELY_AUTO_PICK_STAFF = 3;
const PRE_PICK_STAFF = 4;

class EstimateMode extends React.Component {
	constructor(props) {
		super(props);
		this.changeCreateProjectMode = this.changeCreateProjectMode.bind(this);
		this.show = this.show.bind(this);
		this.close = this.close.bind(this);
	}

	state = {
		visible: {
			create_mode_modal: true,
			pick_staff_modal: false				
		},
		create_project_mode: CREATE_MODE_NOT_DECIDED
	}

	componentWillReceiveProps(nextProps)
	{
		if(nextProps.projectReducer.visibleCreateModeModal)
		{
			this.show('create_mode_modal');
		}
	}

  	show(modal_name){
  		let currentState            = {...this.state};
        currentState.visible[modal_name] = true;
        this.setState(currentState);
  	} 
  	
  	close(modal_name){
  		let currentState            = {...this.state};
        currentState.visible[modal_name] = false;
        this.setState(currentState);
  	} 
		
	changeCreateProjectMode(create_project_mode_input)
	{
		this.props.changeCreateMode(create_project_mode_input);

		// if(this.props.projectReducer.createMode == MANUAL_PICK_STAFF || 
		// 	this.props.projectReducer.createMode == COMPLETELY_AUTO_PICK_STAFF || 
		// 	this.props.projectReducer.createMode == PRE_PICK_STAFF)
		// {
			this.props.changeVisibleCreateModeModal(false);
		// }
		// this.setState(currentState);
	}

    render() {
        return (
        	<section id="estimate_mode_selector">
        		{
        			this.props.projectReducer.visibleCreateModeModal &&
	      			<Modal size={"tiny"} open={this.state.visible.create_mode_modal} onClose={() => this.close('create_mode_modal')}
	      			>
			          <Modal.Content>
			          	<Container>
			          		<Header as="h2">Tạo dự án</Header>
			          		<Divider/>
				          	<Grid column={2} centered>
				          	 	<Grid.Column width={8} textAlign="center" className="cursor-pointer-hover auto-pick-staff"
				          	 		onClick={() => {
				          	 			this.changeCreateProjectMode(AUTO_PICK_STAFF);
				          	 			this.show('pick_staff_modal');
				          	 			}
				          	 		}
				          	 	>
					            	<Icon name="refresh" size="huge" /><br/>
					            	SỬ DỤNG ƯỚC LƯỢNG
				            	</Grid.Column>
				            	
				            	<Grid.Column width={8} textAlign="center" className="cursor-pointer-hover manual-pick-staff"
				            		onClick={() => {
				            			this.changeCreateProjectMode(MANUAL_PICK_STAFF);
				            			this.props.showModal('CreateProjectModal');
				            			}
				            		}
				            	>
					            	<Icon name="configure" size="huge" /><br/>
					            	KHÔNG SỬ DỤNG ƯỚC LƯỢNG
					          	</Grid.Column>
				            </Grid>
				          </Container>
			          </Modal.Content>
			        </Modal>
			    }
		        { 
		        	this.props.projectReducer.createMode == AUTO_PICK_STAFF &&
			        <Modal size={"tiny"} open={this.state.visible.pick_staff_modal} onClose={() => this.close('pick_staff_modal')}>
			          <Modal.Content>
			          	<Container>
			          		<Header as="h2">Cách thức chọn nhân viên</Header>
			          		<Divider/>
				          	<Grid column={2} centered>
				          	 	<Grid.Column width={8} textAlign="center" className="cursor-pointer-hover pre-pick-staff"
				          	 		onClick={() => {
				          	 			this.changeCreateProjectMode(PRE_PICK_STAFF);
				          	 			this.props.showModal('PrePickStaffModal');
				          	 			}
				          	 		}
				          	 	>
					            	<Icon name="users" size="huge" /><br/>
					            	CHỌN TRƯỚC MỘT SỐ NHÂN VIÊN
				            	</Grid.Column>
				            	
				            	<Grid.Column width={8} textAlign="center" className="cursor-pointer-hover completely-auto-pick-staff"
				            		onClick={() => {
				            			this.props.showEstimateModal('ProjectTimeModal');
				            			this.changeCreateProjectMode(COMPLETELY_AUTO_PICK_STAFF);
				            		}}
				            	>
					            	<Icon name="settings" size="huge" /><br/>
					            	HOÀN TOÀN TỰ ĐỘNG
					          	</Grid.Column>
				            </Grid>
				          </Container>
			          </Modal.Content>
			        </Modal>
			      }
		    	</section>

        );
    }
}

const mapStateToProps = (state) => {
    return {projectReducer: state.projectReducer};
}

const mapDispatchToProps = {
    changeCreateMode,
    changeVisibleCreateModeModal
};

export default connect(mapStateToProps, mapDispatchToProps)(EstimateMode);
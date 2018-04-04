import React from 'react';
import {connect} from 'react-redux';
import {
    Button,
    Grid,
    Input,
    Label,
    Modal,
    Icon,
    Transition,
    Step
} from 'semantic-ui-react';

import {
    SCALE_FACTORS,
    NOMINAL_RATING_VALUE,
    EAF,
    COEFFICIENT
 } from '../app/COCOMO.js'
 
import CostDriver from './CostDriver';
import ScaleFactor from './ScaleFactor';
import FunctionPoint from './FunctionPoint';

import {
    changeKLOC,
    getSuitableStaffs,
    changeEstimatedResult,
    changeStaffRequirements,
    getBruteforceStaffs,
    changeBruteforceStaffs
} from './estimateActions'

import {
    changeResponsibleUser,
    changeFindTeamBugdetError,
    setAcceptSuggestionStatus,
    changeProjectWillCreate
} from '../project/ProjectActions'

import SuitableStaffsView from './SuitableStaffsView';
import SuggestSuitableStaffsView from './SuggestSuitableStaffsView';
import CocomoStatisticsTable from './CocomoStatisticsTable';
import EstimatedStatistics from './EstimatedStatistics';
import BruteforceStaffs from './BruteforceStaffs'

const NOT_DECIDED = -1, ACCEPTED = 1, DECLINED = 0;

class CreateProjectStep extends React.Component {
    constructor(props) {
        super(props);
    }
   
    show = element => () => {
        if(element != 'SuitableStaffsModal')
        {
            this.props.setAcceptSuggestionStatus(NOT_DECIDED);
        }
        // this.setState({[element]: true })  
        if(element != 'SLOCModal')
        {
          let currentState;
          if (this.props.estimateReducer.KLOC == 0)
          {
            currentState                 = {...this.state};
            currentState.input.slocInput = true;
            this.setState(currentState);
            if(!this.state.transition.fpVisible)
              document.querySelectorAll('#sloc')[0].focus();
            return
          }
          else
          {
            currentState                 = {...this.state};
            currentState.input.slocInput = false;
            this.setState(currentState);
          }

          

        }
        else
        {   
            //isSLOCModal
            this.setState({isGetSuitableStaffDone: false});

            // let budget = document.querySelectorAll('input[name="budget"]')[0].value;
            //check budget & deadline is entered
            if(this.props.projectReducer.projectWillCreate.budget == 0)
            {
                this.props.changeFindTeamBugdetError(true);
                document.querySelectorAll('input[name="budget"]')[0].focus();
                return;
            }
            if(!this.state.transition.fpVisible)
            {
            
                setTimeout(() =>{
                    document.querySelectorAll('#sloc')[0].value = this.props.estimateReducer.KLOC * 1000
                },100);
              
            }
        }

        for(let modal_name in this.state.modal)
        {
            let currentState;
            if(modal_name == element){
                currentState                   = {...this.state};
                currentState.modal[modal_name] = true;
                this.setState(currentState);
            }
            else{
                currentState                   = {...this.state};
                currentState.modal[modal_name] = false;
                this.setState(currentState);
            }
        }   
        // if(element == 'SLOCModal')  
          // document.querySelectorAll('#sloc').focus()
    }

    close = element => () => {
        if(element == 'SuitableStaffsModal'){
            this.props.changeResponsibleUser(this.props.estimateReducer.estimatedResult.suitableStaffs.map(user=>user._id));
            if(this.props.projectReducer.acceptSuggestionStatus == ACCEPTED)
            {
                this.props.changeProjectWillCreate(Object.assign(
                    {...this.props.projectReducer.projectWillCreate},
                    {budget:this.props.estimateReducer.estimatedResult.projectCost}
                ));
                
                let budgetInput = document.querySelectorAll('input[name="budget"]')[0];
                if(budgetInput !== undefined)
                    budgetInput.value=this.props.estimateReducer.estimatedResult.projectCost;
            }
        }
        let currentState            = {...this.state};
        currentState.modal[element] = false;
        this.setState(currentState);
    }

    handleVisibility = transition_name => () => {
        let currentState                         = {...this.state};
        currentState.transition[transition_name] = !this.state.transition[transition_name];
        this.setState(currentState);

        // hidden sloc error message
        currentState                 = {...this.state};
        currentState.input.slocInput = false;
        this.setState(currentState);
    }

    render() {
        const { 
            SLOCModal, 
            CostDriverModal, 
            ScaleFactorModal, 
            SuitableStaffsModal, 
            ProjectTimeModal, 
            SummaryProjectModal 
        } = this.props.estimateViewReducer.modal

        return (    
             <Step.Group attached='top'>
                <Step active = {ProjectTimeModal} completed ={!ProjectTimeModal} onClick={this.show('ProjectTimeModal')}
                    className="estimate_step">
                    <Icon name='clock' size='large'/>
                  <Step.Content>
                    <Step.Title>Mốc thời gian</Step.Title>
                    <Step.Description>Chọn thời gian bắt đầu & kết thúc của dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {SLOCModal} completed ={((ProjectTimeModal == false) && (SLOCModal == false)) ? true : false} onClick={this.show('SLOCModal')}
                    className="estimate_step">
                    <Icon name='align justify' size='large'/>
                  <Step.Content>
                    <Step.Title>Size In Source Lines of Code</Step.Title>
                    <Step.Description>Xác định độ lớn của dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {ScaleFactorModal} completed={((ProjectTimeModal == false) && (SLOCModal == false) && (ScaleFactorModal == false)) ? true : false}
                      onClick={this.show('ScaleFactorModal')}
                      className="estimate_step">
                  <Icon name='signal' size='large'/>
                  <Step.Content>
                    <Step.Title>Scale Factors</Step.Title>
                    <Step.Description>Yếu tố ngoài dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {CostDriverModal} completed={((ProjectTimeModal == false) && (SLOCModal == false) && (ScaleFactorModal == false) && (CostDriverModal == false)) ? true : false}
                      onClick={this.show('CostDriverModal')}
                      className="estimate_step">
                  <Icon name='tasks' size='large'/>
                  <Step.Content>
                    <Step.Title>Cost Drivers</Step.Title>
                    <Step.Description>Yếu tố ảnh hưởng trực tiếp đến dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {SuitableStaffsModal} completed={((ProjectTimeModal == false) && (SLOCModal == false) && (ScaleFactorModal == false) && (CostDriverModal == false) && (SuitableStaffsModal == false)) ? true : false}
                    onClick={this.estimate}
                    className="estimate_step">
                  <Icon name='trophy' size='large'/>
                  <Step.Content>
                    <Step.Title>Kết quả ước lượng</Step.Title>
                    <Step.Description>Đội ngũ nhân viên phù hợp</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {SummaryProjectModal} onClick={this.show('SummaryProjectModal')}
                    className="estimate_step">
                  <Icon name='checkmark box' size='large'/>
                  <Step.Content>
                    <Step.Title>Tạo dự án</Step.Title>
                    <Step.Description>Tóm tắt thông tin dự án</Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>
        );
    }
}

// export default Estimate;


const mapStateToProps = (state) => {
    return {
        estimateViewReducer: state.estimateViewReducer
    };
}

const mapDispatchToProps = {
    changeEstimateViewModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProjectStep);
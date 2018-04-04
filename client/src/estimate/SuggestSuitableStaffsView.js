import React from 'react';
import {connect} from 'react-redux';
import {
    Button,
    Message
} from 'semantic-ui-react';

import {
    changeProjectWillCreate,
    setAcceptSuggestionStatus
} from '../project/ProjectActions';

const NOT_DECIDED = -1, ACCEPTED = 1, DECLINED = 0;
class SuggestSuitableStaffsView extends React.Component {

    constructor(props) {
        super(props);
        this.responseSuggest = this.responseSuggest.bind(this);
        
        this.state = { 
            isEstimatedBudgetError: false,
            responseSuggestStatus: NOT_DECIDED,
            isCheckBudgetError: false
        }
    }

    componentWillReceiveProps(nextProps){

        if(this.state.isCheckBudgetError)
            return;
        this.setState({isCheckBudgetError: true});

        let projectCost = nextProps.estimateReducer.estimatedResult.projectCost
        let budget = nextProps.projectReducer.projectWillCreate.budget;

        if(projectCost>budget)
        {
            this.setState({isEstimatedBudgetError: true});
        }
        else
        {
            this.setState({isEstimatedBudgetError: false});
        }
    }

    responseSuggest(isAccept){
        if(isAccept){
            // this.props.changeProjectWillCreate(Object.assign(
            //     {...this.props.projectReducer.projectWillCreate},
            //     {budget:this.props.estimateReducer.estimatedResult.projectCost}
            // ));
            this.setState({isEstimatedBudgetError: false});
            this.props.setAcceptSuggestionStatus(ACCEPTED);

        }
        else
        {
            this.props.setAcceptSuggestionStatus(DECLINED);
        }
    }

    render() {
         return (
            <div id="suggest_suitable_staffs_view">
            {this.state.isEstimatedBudgetError && 
                <div id="suggest_suitable_staffs_budget_error">
                      <Message negative>
                        <Message.Header className="estimate_error_message">Không thể tìm đội ngũ nhân viên phù hợp</Message.Header>
                        <p className="estimate_error_details">Ngân sách không đủ. Ngân sách cần có: <b>{this.props.estimateReducer.estimatedResult.projectCost}$</b>.</p>
                      </Message>
                    
                    {(this.props.projectReducer.acceptSuggestionStatus == NOT_DECIDED) &&
                      <Message info>
                        <Message.Header>Gợi ý</Message.Header>
                        <p className="estimate_error_details">Ngân sách bạn hiện có: <b>{this.props.projectReducer.projectWillCreate.budget}$</b></p>
                        <p className="estimate_error_details">Bạn cần đầu tư thêm <b>{
                            this.props.estimateReducer.estimatedResult.projectCost
                                - this.props.projectReducer.projectWillCreate.budget
                            }$</b> để có được đội ngũ nhân viên dưới đây.</p>
                        <Button.Group attached='bottom'>
                            <Button color='red' onClick={()=>this.responseSuggest(false)}>Từ chối</Button>
                            <Button color='blue' onClick={()=>this.responseSuggest(true)}>Đồng ý</Button>
                        </Button.Group>
                      </Message>
                    }
                </div>
            }
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        estimateReducer: state.estimateReducer,
        projectReducer: state.projectReducer
    };
};

const mapDispatchToProps = {
    changeProjectWillCreate,
    setAcceptSuggestionStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(SuggestSuitableStaffsView);
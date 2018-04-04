import React from 'react';
import {connect} from 'react-redux';
import {
    Dropdown,
    Icon,
    Table,
    Popup,
    Grid,
    Statistic,
    Form,
    Button,
    Label,
    Header,
    Message
} from 'semantic-ui-react';

import {
    FUNCTION_POINT,
    FUNCTION_POINT_TO_SLOC
 } from '../app/COCOMO.js';

 import {
    changeKLOC
} from './estimateActions';

import {
  changeValueState,
  changeVisibleState,
  changeFPTableArray,
  setFunctionPointDone
} from './function_point/FunctionPointActions';

class FunctionPoint extends React.Component {
        constructor(props) {
            super(props);
            this.caculateAndDisplaySLOC = this.caculateAndDisplaySLOC.bind(this);
            this.caculateAndDisplayTotalFP = this.caculateAndDisplayTotalFP.bind(this);
            this.dropdownOnChange = this.dropdownOnChange.bind(this);
            this.onInputChange = this.onInputChange.bind(this);
            this.onInputNumberOfLanguages = this.onInputNumberOfLanguages.bind(this);
            this.submitNumberOfLanguages = this.submitNumberOfLanguages.bind(this);
            this.submitFunctionPoint = this.submitFunctionPoint.bind(this);
            this.selectedLanguage = '';
            this.languageList = [
                {
                    key:'c',
                    value:'c',
                    text: 'C',
                    SLOC: 99
                },
                {
                    key:'c++',
                    value:'c++',
                    text: 'C++',
                    SLOC: 53
                },
                {
                    key:'c#',
                    value:'c#',
                    text: 'C#',
                    SLOC: 59
                },
                {
                    key:'html',
                    value:'html',
                    text: 'HTML',
                    SLOC: 40
                },
                {
                    key:'.net',
                    value:'.net',
                    text: '.NET',
                    SLOC: 60
                },
                {
                    key:'php',
                    value:'php',
                    text: 'PHP',
                    SLOC: 67
                },
                {
                    key:'java',
                    value:'java',
                    text: 'Java',
                    SLOC: 53
                },
                {
                    key:'javascript',
                    value:'javascript',
                    text: 'Java Script',
                    SLOC: 53
                },
            ];
        this.FUNCTION_POINT = {};
        }

        state = {
          numberOfProgrammingLanguagesVisible: true,
          lastLanguage: '',
          alertVisible: false,
          completeFunctionPoint: false,
          currentPhaseSLOC: 0
        };

        handleDismiss = () => {
          this.setState({ alertVisible: false })

          // setTimeout(() => {
          //   this.setState({ alertVisible: true })
          // }, 2000)
        }

        caculateAndDisplayTotalFP(){
            var totalFP = 0;
            var inputsFP = document.getElementsByClassName("FP");
            Array.prototype.forEach.call(inputsFP, function(inputFP) {
                var fpCount = inputFP.value;
                    var elementId = inputFP.id;
                    var fp_type = elementId.split("_")[0];
                    var weightLevel = elementId.split("_")[1];
                if(fpCount != 0)
                {
                    totalFP+= fpCount*FUNCTION_POINT.find(fps_type => Object.keys(fps_type) == fp_type)[fp_type].weight[weightLevel];
                }
            });
            document.getElementById("total_fp").innerHTML=totalFP;
            return totalFP;
            
        }
        caculateAndDisplaySLOC(totalFP, selectedLanguage){
            var SLOC = 0;
            if(totalFP > 0)
            {
                SLOC=totalFP*FUNCTION_POINT_TO_SLOC[selectedLanguage];
            }
            if(!(isNaN(SLOC)))
            {
                document.getElementById('total_SLOC').innerHTML=SLOC;
            }
            if(!(isNaN(SLOC)) && SLOC != '' && SLOC != null)
            {
              this.setState({currentPhaseSLOC: SLOC});
              // this.props.changeKLOC(this.props.estimateReducer.KLOC+SLOC/1000);
            }
            return SLOC;
        }
        
        dropdownOnChange(event,selectedOption){
            this.setState({alertVisible: false});
            this.selectedLanguage = selectedOption.value;
            var totalFP = this.caculateAndDisplayTotalFP();
            this.caculateAndDisplaySLOC(totalFP, selectedOption.value);
        }
        
        onInputNumberOfLanguages(e){
          // this.props.changeValueState
        }

        onInputChange(e){
            var totalFP = this.caculateAndDisplayTotalFP();
            this.caculateAndDisplaySLOC(totalFP, this.selectedLanguage);
        }

        submitFunctionPoint(){
          var totalFP = document.getElementById('total_fp').innerHTML;
          var totalSLOC = document.getElementById('total_SLOC').innerHTML;
          // console.log(totalFP);
          // console.log(totalSLOC);
          if(totalFP == 0)
          {
            return false;
          }

          if(totalSLOC == 0)
          {
            return false;
          }

          this.props.changeKLOC(this.props.estimateReducer.KLOC+(this.state.currentPhaseSLOC/1000));

          let currentFPTableIndex = this.props.functionPointReducer.functionPointTableArray.currentIndex;
          FUNCTION_POINT.map((fpType, fpTypeIndex) =>{
            
            let fpName = Object.keys(fpType);
            let newValueArray = this.props.functionPointReducer.functionPointTableArray.value;
            let fpNeedEdit = newValueArray[currentFPTableIndex];
            

            if(fpNeedEdit.FPDetails[fpName] === undefined)
            {
              fpNeedEdit.FPDetails[fpName] = [];
            }


            fpNeedEdit.FPDetails[fpName].push(
              ((document.getElementById(fpName+'_0').value == "") || (isNaN(document.getElementById(fpName+'_0').value))) ? 0 : document.getElementById(fpName+'_0').value,
              ((document.getElementById(fpName+'_1').value == "") || (isNaN(document.getElementById(fpName+'_1').value))) ? 0 : document.getElementById(fpName+'_1').value,
              ((document.getElementById(fpName+'_2').value == "") || (isNaN(document.getElementById(fpName+'_2').value))) ? 0 : document.getElementById(fpName+'_2').value
            );
            
            fpNeedEdit.FPDetails[fpName].push(
              ((document.getElementById(fpName+'_0').value == "") || (isNaN(document.getElementById(fpName+'_0').value))) ? 0 : document.getElementById(fpName+'_0').value,
              ((document.getElementById(fpName+'_1').value == "") || (isNaN(document.getElementById(fpName+'_1').value))) ? 0 : document.getElementById(fpName+'_1').value,
              ((document.getElementById(fpName+'_2').value == "") || (isNaN(document.getElementById(fpName+'_2').value))) ? 0 : document.getElementById(fpName+'_2').value
            );

            fpNeedEdit.FP = totalFP;
            fpNeedEdit.SLOC = totalSLOC;

            newValueArray[currentFPTableIndex] = fpNeedEdit;

            this.props.changeFPTableArray(
              Object.assign({...this.props.functionPointReducer.functionPointTableArray},
                  {
                    value: newValueArray,
                    currentIndex: currentFPTableIndex < this.props.functionPointReducer.functionPointTableArray.value.length-1 ? currentFPTableIndex+1 : currentFPTableIndex
                  }
                )
              );

          });

          if(currentFPTableIndex == this.props.functionPointReducer.functionPointTableArray.value.length-1)
          {
            this.setState({completeFunctionPoint: true});
            this.props.setFunctionPointDone({isFunctionPointDone: true});
          }
          else
          {
            this.setState({completeFunctionPoint: false});
          }

          this.setState({
            alertVisible: true,
            lastLanguage: this.selectedLanguage
          });
          setTimeout(()=>{
            this.setState({
              alertVisible: false
            });
          },3000)
          this.resetFunctionPoint();
        }
        
        resetFunctionPoint(){
          for(var i=0;i<document.getElementsByClassName('FP').length;i++)
          {
            document.getElementsByClassName('FP')[i].value = 0;
          }
          document.getElementById('total_fp').innerHTML = document.getElementById('total_SLOC').innerHTML = 0;

        }

        submitNumberOfLanguages(){
          var numberOfProgrammingLanguages = document.getElementById('number_of_programming_laguages').value;
          if(!isNaN(numberOfProgrammingLanguages) && numberOfProgrammingLanguages != '')
          {

            var fpTableArray = [];
            for(var i=0; i<numberOfProgrammingLanguages; i++)
            {
              var visible = false;
              if(i==0)
              {
                visible = true;
              }
              fpTableArray.push({
                visible: visible,
                language: '',
                FP: 0,
                SLOC: 0,
                FPDetails:{}
              });
              
            }
            
            this.props.changeValueState(numberOfProgrammingLanguages);
            this.props.changeVisibleState(
              Object.assign(
                {...this.props.functionPointReducer.visible},
                {
                  numberOfProgrammingLanguagesErrorLabel: false,
                  numberOfProgrammingLanguages: false
                }
              ));
            this.props.changeFPTableArray(
              Object.assign({...this.props.functionPointReducer.functionPointTableArray},
                  {
                    value: fpTableArray,
                    currentIndex: 0
                  }
                )
              );
          }
          else
          {
            this.props.changeVisibleState(
              Object.assign(
                {...this.props.functionPointReducer.visible},
                {numberOfProgrammingLanguagesErrorLabel: true}
              ));
          }
        }
    render() {
            const fpNumberOfProgrammingLanguages = 
                <Form>
                  <Form.Field>
                    <label>Số ngôn ngữ lập trình mà dự án thực hiện:</label>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width={5}>
                          <Form.Input id="number_of_programming_laguages" name="number_of_programming_laguages" placeholder='Số ngôn ngữ lập trình mà dự án thực hiện...' autoFocus required 
                            onChange={this.onInputNumberOfLanguages}
                          />
                          {this.props.functionPointReducer.visible.numberOfProgrammingLanguagesErrorLabel &&
                            <Label basic color='red' pointing>Giá trị là một số!</Label>
                          }
                        </Grid.Column>
                        <Grid.Column width={3}>
                          <Button type="button" animated color='blue' onClick={this.submitNumberOfLanguages}>
                            <Button.Content visible>Xác nhận</Button.Content>
                            <Button.Content hidden>
                              <Icon name='right arrow' />
                            </Button.Content>
                          </Button>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Form.Field>
                </Form>
            
            const fpHelpTable = 
                <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Loại FP</Table.HeaderCell>
                        <Table.HeaderCell>Mô tả</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {
                        FUNCTION_POINT.map((fpType, fpTypeIndex) => (
                                <Table.Row key={fpTypeIndex}>
                                    <Table.Cell key={'cell_1_' + fpTypeIndex}>
                                        {fpType[Object.keys(fpType)].standfor+' ('+Object.keys(fpType)+')'}
                                    </Table.Cell>
                                    <Table.Cell width={12} key={'cell_2_' + fpTypeIndex}>
                                        {fpType[Object.keys(fpType)].description}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        )
                      }
                    </Table.Body>                   
                </Table>                

            const fpTableInputs = 
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Function Point</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">Simple</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">Average</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">High</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {
                        FUNCTION_POINT.map((fpType, fpTypeIndex) => {
                          return (
                              <Table.Row key={fpTypeIndex}>
                                  <Table.Cell key={'cell_' + fpTypeIndex}>{fpType[Object.keys(fpType)].standfor+' ('+Object.keys(fpType)+')'}</Table.Cell>
                                  {
                                      fpType[Object.keys(fpType)].weight.map((fpWeight, fpWeightIndex) => (
                                              <Table.Cell key={fpWeightIndex}>
                                                  <div className="ui input">
                                                      <input  type="text" 
                                                              id={Object.keys(fpType)+'_'+fpWeightIndex} 
                                                              className="FP"
                                                              placeholder="0" size="10" 
                                                              onChange={this.onInputChange}
                                                              val={0}/>
                                                  </div>
                                              </Table.Cell>
                                      ))
                                  }
                                  
                              </Table.Row>
                            )
                        })
                      }
                    </Table.Body> 
                  </Table>

        return (
        <section id="function_point">
          {this.props.functionPointReducer.visible.numberOfProgrammingLanguages && fpNumberOfProgrammingLanguages}
          { this.state.completeFunctionPoint &&
            <Message info>
              <Message.Header>Hoàn tất!</Message.Header>
              <p>Bạn đã thiết lập Function Point xong. Nhấn <b>Tiếp</b> phía bên dưới để tiếp tục.</p>
            </Message>
          }
          {(!this.props.functionPointReducer.visible.numberOfProgrammingLanguages) && (!this.state.completeFunctionPoint) &&
            <div id="fp-evaluate">
                {this.state.alertVisible &&
                  <Message
                    positive
                    onDismiss={this.handleDismiss}
                    header='Thành công!'  
                  >Các thông số Function Point cho ngôn ngữ <b>{this.state.lastLanguage.toUpperCase()}</b> đã được lưu.
                  </Message>
                }
                <Header color="orange" as="h2">
                  Ngôn ngữ lập trình thứ {this.props.functionPointReducer.functionPointTableArray.currentIndex+1}/{this.props.functionPointReducer.functionPointTableArray.value.length}
                </Header>
                <h2>
                  Function Point 
                  <Popup
                    trigger={<Icon name="help circle"/>}
                    position='top left'
                    flowing
                    hoverable
                    >
                    {fpHelpTable}
                  </Popup>
                </h2>
              <Grid>
                <Grid.Row columns={2}>
                  <Grid.Column textAlign="center" width={11}>
                    {fpTableInputs}
                  </Grid.Column>
                
                    <Grid.Column width={5}>
                      <Icon name="world" size="big" />
                      <Dropdown id="languageDropDown" placeholder='Hãy chọn một ngôn ngữ' search selection options={this.languageList} onChange={this.dropdownOnChange}/>
                      <Statistic.Group>
                          <Statistic color='blue'>
                            <Statistic.Value><span id="total_fp">0</span></Statistic.Value>
                            <Statistic.Label>FP</Statistic.Label>
                          </Statistic>
                          <Statistic color='red'>
                            <Statistic.Value><span id="total_SLOC">0</span></Statistic.Value>
                            <Statistic.Label>SLOC</Statistic.Label>
                          </Statistic>
                      </Statistic.Group>
                      <br/>
                      <Button color="orange" fluid onClick={this.submitFunctionPoint}>
                       { this.props.functionPointReducer.functionPointTableArray.currentIndex+1 == this.props.functionPointReducer.functionPointTableArray.value.length ?
                        'Hoàn thành' : 'Ngôn ngữ tiếp theo' }
                       <Icon name="right chevron" /></Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            }
            </section>

        );
    }
}

const mapStateToProps = (state) => {
    return {
      estimateReducer: state.estimateReducer,
      functionPointReducer: state.functionPointReducer
    };
}

const mapDispatchToProps = {
    changeKLOC,
    changeValueState,
    changeVisibleState,
    changeFPTableArray,
    setFunctionPointDone
};

export default connect(mapStateToProps, mapDispatchToProps)(FunctionPoint);
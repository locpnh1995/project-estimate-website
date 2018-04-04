import React from 'react';
import {connect} from 'react-redux';
import {
	Table,
	Popup
} from 'semantic-ui-react';

import {
	SCALE_FACTORS
 } from '../app/COCOMO.js'

 import {
    changeScaleFactors
} from './estimateActions'


class ScaleFactor extends React.Component {

		constructor(props) {
			super(props);
			this.starOnMouseOver = this.starOnMouseOver.bind(this);
			this.starOnMouseOut = this.starOnMouseOut.bind(this);
			this.starOnClick = this.starOnClick.bind(this);
			// this.caculateScaleFactors = this.caculateScaleFactors.bind(this);

  			this.SCALE_FACTORS = {};
		}
		caculateScaleFactors(){

			return this.SCALE_FACTORS;
		}
		starOnMouseOver(e){
			let starOveredId = e.target.id;
			let overedValue = starOveredId.split('_')[1];
			let overedFactor = starOveredId.split('_')[0];
			
			for(let i=0; i<=overedValue;i++)
			{
				//console.log(hoveredFactor+i);
				document.getElementById(overedFactor+'_'+i).classList.add('selected');
			}
		}
		starOnMouseOut(e){
			let starOutedId = e.target.id;
			let outedValue = starOutedId.split('_')[1];
			let outedFactor = starOutedId.split('_')[0];
			
			for(let i=0; i<=outedValue;i++)
			{
				//console.log(hoveredFactor+i);
				document.getElementById(outedFactor+'_'+i).classList.remove('selected');
			}
		}
		starOnClick(e){
			let starClickedId = e.target.id;
			let clickedValue = starClickedId.split('_')[1];
			let clickedFactor = starClickedId.split('_')[0];

			for(let i=0; i<=5;i++)
			{
				if(i>clickedValue)
				{
					document.getElementById(clickedFactor+'_'+i).classList.remove('active');
				}
				else
				{
					document.getElementById(clickedFactor+'_'+i).classList.add('active');
				}
			}
			document.getElementById(clickedFactor+'_description').innerHTML=SCALE_FACTORS.find(factor => Object.keys(factor) == clickedFactor)[clickedFactor].rating[clickedValue].description;
			this.SCALE_FACTORS[clickedFactor] = clickedValue;
			//console.log(this.SCALE_FACTORS);
			this.props.changeScaleFactors(
				Object.assign(
					{...this.props.input_project.SCALE_FACTORS},
					{[clickedFactor]: clickedValue}
				)
			);
			
		}
    render() {
    		const NOMINAL_RATING_VALUE = 2;
    		const factors = SCALE_FACTORS.map((factor, factorIndex) => {
    			return (
    				<Table.Row>
				        <Table.Cell width={1}>{Object.keys(factor)}</Table.Cell>
				        <Table.Cell width={6}>{factor[Object.keys(factor)].description}</Table.Cell>
				        <Table.Cell width={4}>
				        	<div className="ui star huge rating" role="radiogroup">
					        	{
				        			factor[Object.keys(factor)].rating.map((rating,ratingIndex) =>{
				        				return (
			        					    <Popup
										      trigger={<i id={Object.keys(factor)+'_'+ratingIndex} 
					      						  className={(this.props.input_project.SCALE_FACTORS[Object.keys(factor)] === undefined) ? ( (ratingIndex > NOMINAL_RATING_VALUE) ? 'icon' : 'icon active') : ((ratingIndex > this.props.input_project.SCALE_FACTORS[Object.keys(factor)]) ? 'icon' : 'icon active')}
												  onClick={this.starOnClick}
											      onMouseOver={this.starOnMouseOver} 
											      onMouseOut={this.starOnMouseOut}></i>}
										      content={
										      	rating.description ? rating.description :'n/a'
										      }
										      size='large'
										    />
				        					)
				        			})
					        	}
				        	</div>
		        		</Table.Cell>
				        <Table.Cell width={5} id={Object.keys(factor)+'_description'}>{factor[Object.keys(factor)].rating[NOMINAL_RATING_VALUE].description}</Table.Cell>
				    </Table.Row>
    			)
    		})

        return (
        <section id="scale_factor">
        	<h2> Scale Factor </h2>
			  	<Table celled>
				    <Table.Header>
				      <Table.Row>
				        <Table.HeaderCell>Scale Factor</Table.HeaderCell>
				        <Table.HeaderCell>Yếu tố</Table.HeaderCell>
				        <Table.HeaderCell>Đánh giá</Table.HeaderCell>
				        <Table.HeaderCell>Mô tả</Table.HeaderCell>
				      </Table.Row>
				    </Table.Header>
			   		<Table.Body>
				      {factors}
			    	</Table.Body>           		
			    </Table>
		    </section>

        );
    }
}

const mapStateToProps = (state) => {
    return {input_project: state.estimateReducer};
}

const mapDispatchToProps = {
    changeScaleFactors
};

export default connect(mapStateToProps, mapDispatchToProps)(ScaleFactor);
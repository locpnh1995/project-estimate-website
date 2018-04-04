import React from 'react';
import { Header, Form } from 'semantic-ui-react';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.hanbdleSubmit = this.hanbdleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({company: e.target.value})
    }
    hanbdleSubmit() {
        this.props.history.push(`/${this.state.company}`);
    }
    render() {
        return (
            <div style={{height: '100vh',
                        width: '100%',
                        textAlign: 'center', 
                        display: 'table', 
                        backgroundImage: 'url("/assets/images/background.jpg")', 
                        opacity: 0.8, 
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'}}>
                <div style={{verticalAlign: 'middle', display: 'table-cell'}}>
                    <Form style={{width: 300, margin: '0 auto'}} onSubmit={this.hanbdleSubmit}>
                        <Form.Input onChange={this.handleChange} icon='search' size='massive' placeholder='Tên công ty của bạn' transparent autoFocus />
                        <Form.Input type='submit' style={{display: 'none'}} />
                    </Form>
                    <Header as='h4' onClick={() => this.props.history.push('/signup')} style={{cursor: 'pointer'}}>Hoặc tạo công ty của bạn</Header>
                </div>    
            </div>
        )
    } 
}

export default Home;
import React from 'react';
import { Image, Header, Icon, Modal, Button, Card } from 'semantic-ui-react';

class ModalManageUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateView: true,
            stateAdd: false,
            openModal: false,
            users: this.props.users
        }
    }

    openModal = () => this.setState({ openModal: true })
    closeModal = () => this.setState({ openModal: false })

    render() {
        const { openModal } = this.state;
        return (
            <Modal open={openModal} onClose={this.closeModal} trigger={<Button icon='users' content='Danh sách nhân viên' onClick={this.openModal} />} size='small' closeIcon>
                    <Header icon='hashtag' content='Danh sách nhân viên'/>
                    <Modal.Content scrolling>
                    {this.state.users.length > 0 ? (
                        <Card.Group itemsPerRow={3}>
                            {this.state.users.map(user => (
                                <Card key={user._id}>
                                    <Image src={user.image} />
                                    <Card.Content>
                                        <Card.Header>{user.firstname} {user.lastname}</Card.Header>
                                        <Card.Meta>{user.email}</Card.Meta>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Card.Group>
                        ) : (
                        <Header as='h2' icon textAlign='center'>
                            <Icon name='x' />
                            <Header.Content>
                                Trống
                            </Header.Content>
                        </Header>
                    )}
                </Modal.Content>
            </Modal>
        );
    }
}

export default ModalManageUsers;
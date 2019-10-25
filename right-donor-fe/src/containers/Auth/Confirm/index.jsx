import React from 'react';

import classnames from 'classnames';

import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col
} from 'reactstrap';

import { Auth } from 'aws-amplify';
import ducker from 'duckerdbg';

class Confirm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focusedCode: false,
            code: ''
        };

        this.gotoSignIn = this.gotoSignIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    gotoSignIn() {
        this.props.onStateChange('signIn', {});
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const code = this.state.code;
        const { user } = this.props.authData;

        Auth.confirmSignUp(user.username, code.toString(), {
            forceAliasCreation: true
        }).then(data => {
            console.log(data);
            this.gotoSignIn();
        }).catch(e => ducker.quack('Error perro.'));
    }

    render() {
        const {
            code,
            focusedCode
        } = this.state;

        return(
            <React.Fragment>
                { this.props.authState === 'confirmSignUp' &&
                    <Container className='mt-8 pb-5'>
                        <Row className='justify-content-center'>
                            <Col lg='5' md='7'>
                                <Card className='bg-secondary border-0 mb-0'>
                                    <CardBody className='bg-transparent pb-5'>
                                        <div className='text-muted text-center mt-2 mb-3'>
                                            <h3>Confirmar cuenta</h3>
                                        </div>
                                        <div className='text-muted text-center mt-2 mb-3'>
                                            <small>Se mandó un código de confirmación a su correo</small>
                                        </div>
                                        <Form role='form' onSubmit={this.handleSubmit}>
                                            <FormGroup
                                                className={classnames('mb-3', {
                                                    focused: focusedCode
                                                })}
                                            >
                                                <InputGroup className='input-group-merge input-group-alternative'>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <InputGroupText>
                                                            <i className='ni ni-key-25' />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input 
                                                        placeholder='Código'
                                                        type='number'
                                                        name='code'
                                                        value={code}
                                                        onChange={this.handleChange}
                                                        onFocus={() => this.setState({ focusedCode: true })}
                                                        onBlur={() => this.setState({ focusedCode: false })}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                            <div className='text-center'>
                                                <Button className='my-4' color='info' type='submit'>
                                                    Confirmar
                                                </Button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                }
            </React.Fragment>
        );
    }
}

export default Confirm;
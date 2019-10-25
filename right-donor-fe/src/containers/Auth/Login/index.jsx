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

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focusedEmail: false,
            focusedPassword: false,
            email: '',
            password: ''
        };

        this.gotoSignedIn = this.gotoSignedIn.bind(this);
        this.gotoSignUp = this.gotoSignUp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    gotoSignedIn(user) {
        this.props.onStateChange('signedIn', user);
    }

    gotoSignUp() {
        this.props.onStateChange('signUp', {});
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        
        
    }    

    render() {
        const { 
            email, 
            password,
            focusedEmail,
            focusedPassword
        } = this.state;

        return(
            <React.Fragment>
                { this.props.authState === 'signIn' &&
                <Container className='mt-8 pb-5'>
                    <Row className='justify-content-center'>
                        <Col lg='5' md='7'>
                            <Card className='bg-secondary border-0 mb-0'>
                                <CardBody className='bg-transparent pb-5'>
                                    <div className='text-muted text-center mt-2 mb-3'>
                                        <h3>Inicia sesión</h3>
                                    </div>
                                    <Form role='form' onSubmit={this.handleSubmit}>
                                        <FormGroup
                                            className={classnames('mb-3', {
                                                focused: focusedEmail
                                            })}
                                        >
                                            <InputGroup className='input-group-merge input-group-alternative'>
                                                <InputGroupAddon addonType='prepend'>
                                                    <InputGroupText>
                                                        <i className='ni ni-email-83' />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input 
                                                    placeholder='Email'
                                                    type='email'
                                                    name='email'
                                                    value={email}
                                                    onChange={this.handleChange}
                                                    onFocus={() => this.setState({ focusedEmail: true })}
                                                    onBlur={() => this.setState({ focusedEmail: false })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup
                                            className={classnames('mb-3', {
                                                focused: focusedPassword
                                            })}
                                        >
                                            <InputGroup className='input-group-merge input-group-alternative'>
                                                <InputGroupAddon addonType='prepend'>
                                                    <InputGroupText>
                                                        <i className='ni ni-lock-circle-open' />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder='Contraseña'
                                                    type='password'
                                                    name='password'
                                                    value={password}
                                                    onChange={this.handleChange}
                                                    onFocus={() => this.setState({ focusedPassword: true })}
                                                    onBlur={() => this.setState({ focusedPassword: false })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <div className='text-center'>
                                            <Button className='my-4' color='info' type='submit'>
                                                Iniciar Sesión
                                            </Button>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                            <Row className='mt-3'>
                                <Col xs='6'>
                                    <a
                                        className='text-info'
                                        href='#rd'
                                        onClick={e => e.preventDefault()}
                                    >
                                        <small>¿Olvidaste tu contraseña?</small>
                                    </a>
                                </Col>
                                <Col className='text-right' xs='6'>
                                    <a
                                        href='#newAccount'
                                        className='text-info'
                                        onClick={this.gotoSignUp}
                                    >
                                        <small>Crear nueva cuenta</small>
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                }
            </React.Fragment>
        );
    }
}

export default Login;
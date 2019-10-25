import React from 'react';

import classnames from 'classnames';
import ReactDatetime from 'react-datetime';

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

import { Auth, API, graphqlOperation } from 'aws-amplify';
import ducker from 'duckerdbg';

const createDonor = `mutation CreateDonor($input: CreateDonorInput!) {
    createDonor(input: $input) {
        id
        firstname
        secondname
        birthday
        blood {
            type
            rh
        }
    }
}
`;

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focusedEmail: false,
            focusedPassword: false,
            focusedFName: false,
            focusedSName: false,
            focusedBd: false,
            focusedBlood: false,
            email: '',
            password: '',
            firstName: '',
            secondName: '',
            bd: '',
            bloodType: ''
        };

        this.gotoConfirmSignUp = this.gotoConfirmSignUp.bind(this);
        this.gotoSignIn = this.gotoSignIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async gotoConfirmSignUp(data) {
        this.props.onStateChange('confirmSignUp', data);
    }

    gotoSignIn() {
        this.props.onStateChange('signIn', {});
    }

    handleChange = (cumple) => (event) => {
        if (!cumple) {
            this.setState({ [event.target.name]: event.target.value });
        } else {
            this.setState({ bd: event });
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const username = this.state.email.toString();
        const password = this.state.password.toString();
        const email = this.state.email.toString();

        Auth.signUp({ username, password, attributes: { email }})
            .then(data => {
                console.log(data);

                let input = {};
                input.id = data.userSub;
                input.firstname = this.state.firstName;
                input.secondname = this.state.secondName;
                input.birthday = this.state.bd;
                let { type, rh} = this.checkBloodType(this.state.bloodType.toString());
                input.type = type;
                input.rh = rh;

                API.graphql(graphqlOperation(createDonor, {input: input}))
                    .then(result => {
                        console.log(result);
                    })
                    .catch(e => console.log(e));
                    
                this.gotoConfirmSignUp(data);
            })
            .catch(e => console.log(e));
    }

    checkBloodType(str) {
        let type = '';
        let rh = '';
        for (let i = 0; i < str.length; i++) {
            if (str.charAt(i) !== '+' && str.charAt(i) !== '-') {
                type += str.charAt(i);
            } else {
                rh = str.charAt(i);
            }
        }
        return { type, rh };
    }

    render() {
        const {
            email,
            password,
            firstName,
            secondName,
            bd,
            bloodType,
            focusedEmail,
            focusedPassword,
            focusedFName,
            focusedSName,
            focusedBd,
            focusedBlood
        } = this.state;

        return(
            <React.Fragment>
                { this.props.authState === 'signUp' &&
                <Container className='mt-8 pb-5'>
                    <Row className='justify-content-center'>
                        <Col lg='5' md='7'>
                            <Card className='bg-secondary border-0 mb-0'>
                                <CardBody className='bg-transparent pb-5'>
                                    <div className='text-muted text-center mt-2 mb-3'>
                                        <h3>Crea una cuenta nueva</h3>
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
                                                    onChange={this.handleChange(false)}
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
                                                    onChange={this.handleChange(false)}
                                                    onFocus={() => this.setState({ focusedPassword: true })}
                                                    onBlur={() => this.setState({ focusedPassword: false })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup
                                            className={classnames('mb-3', {
                                                focused: focusedFName
                                            })}
                                        >
                                            <InputGroup className='input-group-merge input-group-alternative'>
                                                <InputGroupAddon addonType='prepend'>
                                                    <InputGroupText>
                                                        <i className='ni ni-single-02' />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder='Nombre(s)'
                                                    type='text'
                                                    name='firstName'
                                                    value={firstName}
                                                    onChange={this.handleChange(false)}
                                                    onFocus={() => this.setState({ focusedFName: true })}
                                                    onBlur={() => this.setState({ focusedFName: false })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup
                                            className={classnames('mb-3', {
                                                focused: focusedSName
                                            })}
                                        >
                                            <InputGroup className='input-group-merge input-group-alternative'>
                                                <InputGroupAddon addonType='prepend'>
                                                    <InputGroupText>
                                                        <i className='ni ni-single-02' />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder='Apellido(s)'
                                                    type='text'
                                                    name='secondName'
                                                    value={secondName}
                                                    onChange={this.handleChange(false)}
                                                    onFocus={() => this.setState({ focusedSName: true })}
                                                    onBlur={() => this.setState({ focusedSName: false })}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup
                                            className={classnames('mb-3', {
                                                focused: focusedBlood
                                            })}
                                        >
                                            <InputGroup className='input-group-merge input-group-alternative'>
                                                <InputGroupAddon addonType='prepend'>
                                                    <InputGroupText>
                                                        <i className='ni ni-ambulance' />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder='Tipo de sangre'
                                                    type='select'
                                                    name='bloodType'
                                                    value={bloodType}
                                                    onChange={this.handleChange(false)}
                                                    onFocus={() => this.setState({ focusedBlood: true })}
                                                    onBlur={() => this.setState({ focusedBlood: false })}
                                                >
                                                    <option>A-</option>
                                                    <option>A+</option>
                                                    <option>AB+</option>
                                                    <option>AB-</option>
                                                    <option>B+</option>
                                                    <option>B-</option>
                                                    <option>O+</option>
                                                    <option>O-</option>
                                                </Input>
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup
                                            className={classnames('mb-3', {
                                                focused: focusedBd
                                            })}
                                        >
                                            <InputGroup className='input-group-merge input-group-alternative'>
                                                <InputGroupAddon addonType='prepend'>
                                                    <InputGroupText>
                                                        <i className='ni ni-air-baloon' />
                                                    </InputGroupText>
                                                    <ReactDatetime
                                                        inputProps={{
                                                            placeholder: 'Cumpleaños'
                                                        }}
                                                        value={bd}
                                                        timeFormat={false}
                                                        name='bd'
                                                        onChange={this.handleChange(true)}
                                                        onFocus={() => this.setState({ focusedBd: true })}
                                                        onBlur={() => this.setState({ focusedBd: false })}
                                                    />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormGroup>
                                        <div className='text-center'>
                                            <Button className='my-4' color='info' type='submit'>
                                                Crear cuenta
                                            </Button>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                            <Row className='mt-3'>
                                <Col xs='6'>
                                    <a
                                        className='text-info'
                                        href='#login'
                                        onClick={this.gotoSignIn}
                                    >
                                        <small>Regresar a inicio de sesión</small>
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

export default SignUp;
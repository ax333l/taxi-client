import React, {Component} from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import PropTypes from "prop-types";
import { config } from "../config"

export default class CreateUser extends Component {

  constructor(props) {

    const search = props.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const id = params.get('name'); // bar

    
    super(props)
    // Setting up functions
    this.onChangeDriverName = this.onChangeDriverName.bind(this);
    this.onChangeDriverEmail = this.onChangeDriverEmail.bind(this);
    this.onChangeDriverTel = this.onChangeDriverTel.bind(this);
    this.onChangeDriverPassword = this.onChangeDriverPassword.bind(this);
    this.onChangeDriverRole = this.onChangeDriverRole.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // Setting up state
    this.state = {
      id: id,
      name: '',
      password: '',
      role: 'Driver'
    }
  }

  onChangeDriverName(e) {
    this.setState({name: e.target.value})
  }

  onChangeDriverEmail(e) {
    this.setState({email: e.target.value})
  }

  onChangeDriverTel(e) {
    this.setState({tel: e.target.value})
  }

  onChangeDriverPassword(e) {
    this.setState({password: e.target.value})
  }

  onChangeDriverRole(e) {
    this.setState({role: e.target.value})
  }

  async onSubmit(e) {
    e.preventDefault()

    const userObj = {
      id: this.state.id,
      name: this.state.name,
      password: this.state.password,
      role: this.state.role
    };

    axios.post(`${config.URL}api/users/`, userObj)
      // .then(res => console.log(res.data));
      .then(function (res) {
        
  
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('id', res.data.user._id);
        localStorage.setItem('name', res.data.user.name);
        localStorage.setItem('password', res.data.user.password);
        localStorage.setItem('role', res.data.user.role);
        setTimeout(changeLocation(res.data.user.role), 1000);
          
     })
     .catch(function (error) {
       console.log("There is a problem with registration", error);
     })

     let changeLocation = (role) => {
      this.props.history.push(role === 'Driver' ? '/driver' : '/client');
    }
     
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if(token){
      this.props.history.push(role === 'Driver' ? '/driver' : '/client');
      return;
    }
    axios.get(`${config.URL}api/users/exists/${this.state.id}`)
      .then(res => {
        if(res.status){
          this.props.history.push(`/login/?name=${this.state.id}`)
        }
      })
  }

  render() {
    return (
      <div className="form-wrapper">
        <Form onSubmit={ this.onSubmit }>
          <Form.Group controlId="Name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={this.state.name} onChange={this.onChangeDriverName} />
          </Form.Group>

          <Form.Group controlId="Password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={this.state.password} onChange={this.onChangeDriverPassword}/>
          </Form.Group>

          <Form.Group controlId="Role">
            <Form.Label>Choose your role</Form.Label>
            <Form.Control as="select" value={this.state.role} onChange={this.onChangeDriverRole}>
              <option value="driver">Driver</option>
              <option value="client">Client</option>
            </Form.Control>
          </Form.Group>

          <Button variant="danger" size="lg" block="block" type="submit">
            Create Account
          </Button>
        </Form>
      </div>
    ); 
  }
}

CreateUser.propTypes = {
  history: PropTypes.object.isRequired
};
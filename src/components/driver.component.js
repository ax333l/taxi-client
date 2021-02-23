import React, {Component} from "react";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
// import history from './history';
import DefaultImg from '../default-img/driver-default-img.png';
import {
  Switch,
  Link
} from "react-router-dom";
import { config } from "../config"

const token = localStorage.getItem('token')
axios.defaults.headers.common['x-access-token'] = token



export default class driverProfile extends Component {

  constructor(props) {
    super(props)
    // Setting up functions
    this.onChangeAssignedTo = this.onChangeAssignedTo.bind(this);
    this.onChangeTruckType = this.onChangeTruckType.bind(this);
    this.createTruck = this.createTruck.bind(this);
    this.showTrucks = this.showTrucks.bind(this);
    this.deleteTruck = this.deleteTruck.bind(this);

    this.toggleAddTruckForm = this.toggleAddTruckForm.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.uploadImage = this.uploadImage.bind(this);

    this.onChangeUserOldPassword = this.onChangeUserOldPassword.bind(this);
    this.onChangeUserNewPassword = this.onChangeUserNewPassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRef = this.onRef.bind(this);
    this.takeOrder = this.takeOrder.bind(this);

    // Setting up state
    this.state = {
      multerImage: DefaultImg,
      oldPassword: '',
      newPassword: '',
      showForm: false,
      showAddTruckForm: false,
      truckType: 'Sprinter',
      assigned_to: 'none',
      trucks: [],
      truckId: '',
      orders: null,
      isLoading: true
    }
  }

  onChangeAssignedTo(e) {
    const id = localStorage.getItem('id');
    let assignedTo = e.target.value;
    assignedTo = 'me' ? id : 'none';
    this.setState({assigned_to: assignedTo})
  }

  onChangeTruckType(e) {
    this.setState({truckType: e.target.value})
  }

  createTruck(e) {
    e.preventDefault()
    const id = localStorage.getItem('id');
    const truckObj = {
      created_by: id,
      assigned_to: this.state.assigned_to,
      status: 'IS',
      type: this.state.truckType
    };

    axios.post(config.URL+'api/driver/' + id, truckObj)
      .then(function (res) {
        console.log(res.data.truck); 
     })
     .catch(function (error) {
       console.log("There is a problem during truck, check insereted data", error);
     })
     
    this.setState({assigned_to: '', truckType: ''})

    console.log(`Truck successfully created!`);
    console.log(`Type: ${this.state.truckType}`);
    console.log(`Assigned to: ${this.state.assigned_to}`);
  }

  showTrucks(e) {
    e.preventDefault()
    const id = localStorage.getItem('id');
    axios.get(config.URL+'api/driver/' + id)
      .then(res => {
        const trucks = res.data;
        this.setState({ trucks });
      })
     .catch(function (error) {
       console.log("Look like user has no trucks..", error);
     })
  }

  toggleAddTruckForm(e) {
    e.preventDefault();
    this.setState({
      showAddTruckForm: !this.state.showAddTruckForm
    })
  }

  toggleForm(e) {
    e.preventDefault();
    this.setState({
      showForm: !this.state.showForm
    })
  }

  deleteTruck(e, id) {
    e.preventDefault();

    axios.delete(`${config.URL}api/driver/bin/${id}`)
      .then(res => {
          const trucks = res.data;
          this.setState({ trucks });
      })
      .catch(err => alert("truck not deleted", err))
  }

  setDefaultImg( e, uploadType ) {
    if ( uploadType === "multer" ) {
      this.setState({
        multerImage: e.target.files[0]
      });
    } 
  }

  uploadImage( e, method ) {

    if( method === "multer" ) {
      let imageFormObj = new FormData();

      imageFormObj.append( "imageName", "multer-image-" + Date.now());
      imageFormObj.append( "imageData", e.target.files[0]);
    
      //store a readable instance of 
      //the image being uploaded using multer
      this.setState({
        multerImage: URL.createObjectURL(e.target.files[0])
      });

      const id = localStorage.getItem('id');
      axios.post(config.URL+'api/user/image/' + id, imageFormObj)
        .then((data) => {
          if( data.data.success) {
            alert("Image has been successfully uploaded using multer ");
            this.setDefaultImg(e.persist(), "multer");
          }
        })
        .catch((err) => {
          console.log("Error while uploading image using multer.");
          this.setDefaultImg("multer");
        })
    }
  }

  onChangeUserOldPassword(e) {
    this.setState({oldPassword: e.target.value})
  }

  onChangeUserNewPassword(e) {
    this.setState({newPassword: e.target.value})
  }

  onRef(e){
    axios.post(`${config.URL}api/users/mapref`, {
      e
    })
  }

  takeOrder(e, i){
    axios.post(`${config.URL}api/users/takeorder`, {id: e._id})
    .then(res => {
      const orders = this.state.orders
      localStorage.setItem('order',orders[i]._id.toString())
      this.props.history.push('/order/'+orders[i]._id.toString())
      orders.splice(i,1)
      this.setState({orders: orders})
    })
  }

  onSubmit(e) {
    e.preventDefault()

    const userObj = {
      token: localStorage.getItem('token'),
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword
    };

    const id = localStorage.getItem('id');
    axios.put(config.URL+'api/users/'+ id, userObj)
     
      .then((res) => {
        alert(res.data);
      })
      .catch(err => alert("SERVER ERROR TO CLIENT:", err))
     
    this.setState({ newPassword: ''})

  }

  componentDidMount() {
    axios.get(config.URL+'api/users/orders')
    .then(res => {
      this.setState({orders: res.data, isLoading: false});
    })
  }

  render() {
    let name = localStorage.getItem('name');
    let role = localStorage.getItem('role');

    if(this.state.isLoading){
      return <div>Loading...</div>
    }

    return (
      <>
        <div className="form-wrapper">
          <h3>
            <Row>
              <Col xs={12} sm={8}><h2>{ name } <span role="img" aria-label="2 finger icon">✌️</span></h2></Col>
              <Col xs={6} sm={4}><Badge variant="secondary"> { role } profile </Badge></Col>
            </Row>
          </h3>
            
          <div className="profile">
             <div className="profile__img">
                <input type="file" 
                        className="image-inpt" 
                        onChange={(e) => this.uploadImage(e, "multer")}>
                </input>
                <img src={ this.state.multerImage} 
                    alt="upload-yourphoto"
                    className="image">
                </img>
             </div>
        
            
          </div>

          <div>
            {this.state.orders.map((order, i) => (
              <div className="buttons">
                <Button variant="secondary" onClick={() => this.onRef(order.departure) }>Departure</Button>
                <Button variant="secondary" onClick={() => this.onRef(order.destination) }>Destination</Button>
                <Button variant="secondary" onClick={() => this.takeOrder(order, i) }>Take order</Button>
              </div>
            ))}
          </div>
              
          <div className="buttons">
            <Row className="buttons__block">
              <Col><Button variant="secondary" onClick={ this.toggleForm }>Change password</Button></Col>
            </Row>
            <Row>
              <Col>
                <Switch>
                  <>
                    <Link to="/reset">
                        Reset password
                    </Link>
                  </>
                </Switch>
              </Col>
            </Row>
          </div>
          
          { this.state.showForm ?
            (<Form onSubmit={ this.onSubmit }>
        
              <Form.Group controlId="oldPassword">
                <Form.Label>Old password</Form.Label>
                <Form.Control type="password" value={this.state.oldPassword} onChange={this.onChangeUserOldPassword}/>
              </Form.Group>
          
              <Form.Group controlId="newPassword">
                <Form.Label>New password</Form.Label>
                <Form.Control type="password" value={this.state.newPassword} onChange={this.onChangeUserNewPassword}/>
              </Form.Group>
        
              <Button variant="danger" size="lg" block="block" type="submit">
                Change password
              </Button>
            </Form>
          ) : (
            <></>
          ) 
          }
        </div>
        <div className="trucks">
            <ul className="trucks__list">
              
              {this.state.trucks.map(function(truck, index){
                return (
                    <li key={index} className="trucks__item">
                      <Button variant="outline-warning" size="sm" block="block" type="submit"  
                      onClick={ () => this.deleteTruck(truck._id)}  
                      // onClick={ this.deleteTruck(truck._id).bind(this)} 
                      >
                        Delete
                      </Button>
                      <div className="trucks__img"></div>
                      <p>Assigned to: {truck.assigned_to.length > 4 ? 'me' : 'none'}</p>
                      <p>Status: {truck.status}</p>
                      <p>Type: {truck.type}</p>
                    </li>
                  )
                }
              )}
            </ul>
          </div>
      </>
    );
  }
}
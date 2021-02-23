import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { config } from "../config"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


const token = localStorage.getItem('token')
const role = localStorage.getItem('role')
axios.defaults.headers.common['x-access-token'] = token

function App(props) {

    const [data, setData] = useState(null)

    const [isLoading, setIsLoading] = useState(true)

    const order = props.match.params.id

    function onRef(e){
        axios.post(`${config.URL}api/users/mapref`, {
          e
        })
      }

    function complete(){
        axios.delete(`${config.URL}api/users/order/${order}`)
        .then(res => {
            props.history.push(role === 'Driver' ? '/driver' : '/client')
        })
    }

    useEffect(() => {
        axios.get(`${config.URL}api/users/order/${order}`)
        .then(res => {
            setData(res.data)
            setIsLoading(false)
        })
    }, [])

    if(isLoading){
        return (
            <div>Loading...</div>
        )
    }

    return(
        <div className="buttons">
            <Button variant="secondary" onClick={() => onRef(data.departure) }>Departure</Button>
            <Button variant="secondary" onClick={() => onRef(data.destination) }>Destination</Button>
            <Button variant="secondary" onClick={() => complete() }>Complete order</Button>
        </div>
    )
}

export default App
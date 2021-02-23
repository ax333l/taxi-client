import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { config } from "../config"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


const token = localStorage.getItem('token')
axios.defaults.headers.common['x-access-token'] = token

function App(props) {
    const [data, setData] = React.useState(null)

    const [isLoading, setIsLoading] = React.useState(true)

    let defaultOption
    const [option, setOption] = React.useState(null)

    const [selectSecond, setSelectSecond] = React.useState(false)
    const [order, setOrder] = React.useState({
        departure: {},
        destination: {}
    })

    const handleChange = (e) => {
        const index = data.findIndex(el => el._id.toString() == e.value);
        const region = {
            latitude: data[index].variables.latitude,
            longitude: data[index].variables.longitude
        }
        if(!selectSecond){
            setOrder({
                ...order,
                departure: region
            })
        }
        else{
            setOrder({
                ...order,
                destination: region
            })
        }
        axios.post(`${config.URL}api/users/mapref`, {
            region
        })
    }

    const handleOrder = () => {
        axios.post(`${config.URL}api/users/order`, order)
        .then(res => {
            if(res.data.status){
                console.log('+')
            }
        })
        props.history.push('/client')
    }

    const userObj = {
        token: localStorage.getItem('token'),
    }    
    useEffect(() => {   
        axios.get(`${config.URL}api/users/map`, userObj)
        .then(res => {
            let options = []
            res.data.map(e => {
                options.push({label: e.variables.title, value: e._id.toString()})
            })
            setOption(options)
            defaultOption = options[0]
            setData(res.data)
            setIsLoading(false)
        })
    }, [])
  const element = (
    <div>
    {JSON.stringify(data)}
    </div>
  )

  if(isLoading) return <div>Loading</div>

  

  return(
      <div>
        <Dropdown options={option} onChange={(e) => handleChange(e)} value={defaultOption} placeholder="Select an location" />
        {!selectSecond?(
            <Button variant="danger" size="lg" block="block" type="submit" onClick={() => setSelectSecond(true)}>
                Select destination
            </Button>
        ):(
            <Button variant="danger" size="lg" block="block" type="submit" onClick={() => handleOrder()}>
                Submit order
            </Button>
        )}
      </div>
  )
}

export default App
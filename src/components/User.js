import { userSession } from "./ConnectWallet";
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import { Badge, ButtonGroup, Card, Col, Dropdown, DropdownButton, Form, Row } from "react-bootstrap";
import "../css/ContractCallCorneta.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserSession } from "@stacks/connect";
import ContractCallCorneta from "./ContractCallCorneta";
import { Navigate, useNavigate } from 'react-router-dom';
// ST1X0C07T1WN52DQXGAASMQ7P5M357HJGV4PFF6JC.bet-test-nara

// http://44.201.160.92/corneta/user/signin
const User = () => {
  // const navigate = useNavigate();
  // const url = 'http://44.201.160.92';
  // // const blockChainCode = userSession.loadUserData().profile.stxAddress.testnet;
  // const [newUser, setNewUser] = useState(null);
  // const [state, setState] = useState({
  //   name: "",
  //   email: "",
  //   blockChainCode: null
  // });

  // const headers = {
  //   'Content-Type': 'application/json',
  //   "Access-Control-Allow-Origin": "*"
  // }

  useEffect(() => {
    console.log('fui chamando');
    // userExists();
  }, []);

  function userExists() {
    console.log('here');
    // axios.post(`${url}/corneta/user/signin`, { blockChainCode: blockChainCode }).then((response) => {
    //   console.log('response: ', response);

    // }).catch((err) => {
    //   console.log(' deu erro: ', err);
    //   if (err.response.status === 401) {
    //     setNewUser(false);
    //     console.log('caiu aqui');
    //   }
    // });
  }

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setState((prevProps) => ({
  //     ...prevProps,
  //     [name]: value
  //   }));
  // };

  // const clearFields = () => {
  //   const initialState = {
  //     name: "",
  //     email: "",
  //     identityAddress: JSON.parse(localStorage.getItem('blockstack-session')).userData.identityAddress
  //   };

  //   setState({ ...initialState });
  // }

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(state);
  //   axios.post(`${url}/dwallet/user`, state, { headers: headers }).then((response) => {
  //     console.log(response);
  //     if (response.status === 201) {
  //       clearFields();
  //       // navigate("/home");
  //     }
  //   })
  // };

  // const nave = () => {
  //   navigate('/match');
  // }

  return (
    <>
      {/* {
        newUser === true ? <div>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nome ou apelido</Form.Label>
              <Form.Control type="text" name="name" value={state.name}
                onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email" name="email" value={state.email}
                onChange={handleInputChange} />
            </Form.Group>

            <Button variant="primary" onClick={handleSubmit}>Cadastrar</Button>
          </Form>
        </div> : <div>
            <ContractCallCorneta/>
        </div>
      } */}

      <h1>Aqui</h1>
      {/* <button type="button" onClick={() => nave()}>nav</button> */}
    </>
  );
};

export default User;

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Navbar, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';
import "../Message.css"
import { toast, ToastContainer } from 'react-toastify';

// URL publicada http://3.82.200.237/
const Messages = () => {
  const { state } = useLocation();
  const url = 'http://3.82.200.237:3000';
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [infoContractBet, setInfoContractBet] = useState(null);
  const [totalReceived, setTotalReceived] = useState(null);
  const [totalSent, setTotalSent] = useState(null);

  useEffect(() => {
    console.log('fui chamando', state);
    getReceivedComments();
    getInfoBetContract();
  }, []);

  const getInfoBetContract = () => {
    const urlInfoContract = 'https://stacks-node-api.testnet.stacks.co/extended/v1/address/ST1X0C07T1WN52DQXGAASMQ7P5M357HJGV4PFF6JC.corneta-match95/stx'
    axios.get(`${urlInfoContract}`).then((response) => {
      // console.log(response.data);
      // setInfoContractBet(response.data);
      sanitizeValueContract(response.data);
    });
  }

  const sanitizeValueContract = (data) => {
    console.log(data.total_received);
    setTotalReceived(data.total_received/1000000);
    setTotalSent(data.total_sent / 1000000);
  }

  const getReceivedComments = () => {
    // axios.get(`http://3.82.200.237:3000/receivedMessage?idBetTo=12`).then((response) => {
    //   console.log(response.data);
    //   if (response.data.length > 0) {
    //     setCommentList([...response.data]);
    //   }
    // });

    const mock = [
      {
        "idBetTo": 1,
        "idUserFrom": 1,
        "userName": "Joaquina da Silve",
        "message": "meu comentario",
        "id": 1
      },
      {
        "idBetTo": 1,
        "idUserFrom": 1,
        "userName": "Maria Costa",
        "message": "Mensagem",
        "id": 7
      },
      {
        "idBetTo": 1,
        "idUserFrom": 1,
        "userName": "Jose Silva",
        "message": "fsfds",
        "id": 9
      }
    ];
    setCommentList(mock);
  }

  const handleCommentChange = event => {
    setComment(event.target.value);
    console.log(event.target.value);
  };

  const notifyMessage = () => toast.success(
    'Cornetada enviada com sucesso', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const createComment = () => {
    const messageData = {
      idBetTo: 1,
      idUserFrom: 1,
      userName: "Username mock teste",
      message: comment
    }

    console.log(messageData);

    setCommentList([...commentList, messageData]);

    setComment('');
    notifyMessage();

    // setComment();

    // axios.post('http://3.82.200.237:3000/message', messageData).then((response) => {
    //   console.log(response);
    //   setComment('');
    //   getReceivedComments();
    //   notifyMessage();
    // });
  }



  return (
    <>
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#home" className="brand">
            <img
              src="https://img.icons8.com/external-stickers-smashing-stocks/70/000000/external-26-independence-day-4th-of-july-stickers-smashing-stocks.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />{' '}
            Corneta
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <ConnectWallet />
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ToastContainer />

      <Container>
        <Row>
          <Col>
            <Link to={-1}>
              <Button variant="link">Voltar</Button>
            </Link>
          </Col>
          <Col>
            Valor total rateado: { totalSent } - Valor total de apostas: {totalReceived}
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Cornetadas</h2>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Escreva sua cornetada</Form.Label>
                <Form.Control as="textarea" rows={3} value={comment} onChange={handleCommentChange} />
              </Form.Group>

              <Button className='message-btn' disabled={!comment} onClick={createComment}>Cornetar</Button>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col>
            <section>
              <hr className='line' />
              <h5 className="list-comments-title box-comment">Lista de cornetadas</h5>
              <>
                {commentList && commentList.map((item, i) => {
                  return (
                    <div key={i} className="box-comment">
                      <div>
                        <h6 key={i} className="user-name">{item.userName}</h6>
                      </div>
                      <Card key={i}>
                        <Card.Body className="card-body">{item.message}</Card.Body>
                      </Card>
                    </div>
                  )
                })}

                {commentList.length <= 0 ? <div>N??o ha cornetadas no momento</div> : null}
              </>
            </section>
          </Col>
        </Row>

      </Container>
    </>

  )
}

export default Messages;
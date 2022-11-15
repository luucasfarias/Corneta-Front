import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import {
  AnchorMode,
  falseCV,
  FungibleConditionCode,
  intCV,
  makeContractSTXPostCondition,
  makeStandardSTXPostCondition,
  PostConditionMode,
  trueCV,
  tupleCV,
} from "@stacks/transactions";
import { userSession } from "./ConnectWallet";
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import { Badge, ButtonGroup, Card, Col, Container, Dropdown, DropdownButton, Form, Row } from "react-bootstrap";
import "../ContractCallCorneta.css";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// ST1X0C07T1WN52DQXGAASMQ7P5M357HJGV4PFF6JC.bet-test-nara

const ContractCallCorneta = () => {
  // http://44.201.160.92/corneta/matches
  // const url = 'http://44.201.160.92';
  const url = 'http://localhost:3000';
  const defaultRound = 'Grupos 1';
  const { doContractCall } = useConnect();
  const [match, setMatch] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [doBet, setDoBetForUser] = useState(null);
  const [guessHomeTeam, setGuessHomeTeam] = useState('');
  const [guessVisitingTeam, setGuessVisitingTeam] = useState('');
  const [roundSelected, setRoundSelected] = useState(defaultRound);
  const [withMoney, setWithMoney] = useState(true);

  const [newUser, setNewUser] = useState(null);
  const [state, setState] = useState({
    nickName: "",
    email: "",
    blockChainCode: userSession.loadUserData().profile.stxAddress.testnet
  });
  const [error, setError] = useState(null);
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [buttonDisable, setButtonDisable] = useState(true);
  const [errorNickName, setErrorNickName] = useState(false);

  const headers = {
    'Accept': '*',
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    'Authorization': '*'
  }

  useEffect(() => {
    loadMatchBet(defaultRound);
    userExists();
  }, []);


  function userExists() {
    axios.post(`http://44.201.160.92/corneta/user/signin`,
      { blockChainCode: userSession.loadUserData().profile.stxAddress.testnet },
      { headers: headers }).then((response) => {
        setNewUser(false);
      }).catch((err) => {
        console.log(' deu erro: ', err);
        if (err.response.status === 401) {
          setNewUser(false); // mudar pra true
        }
      })
  }

  // TODO: Alterar para url de prod
  function loadMatchBet(round) {
    const url = 'http://44.201.160.92/corneta/matches';
    axios.get(`${url}/matches`, { headers: headers }).then((response) => {
      const group = response.data.filter((match) => match.round === round);
      console.log(group);
      setMatch(group);
    });
  }

  const scoreboardHomeTeam = index => e => {
    console.log('Value: ', index, e.target.value);
    const indexInArray = match.findIndex((match) => match.id === index);
    console.log(indexInArray);
    setGuessHomeTeam(e.target.value);
    const matchCopy = [...match];
    matchCopy[indexInArray].homeTeam.scoreboard = e.target.value;
    console.log('matchCopy: ', matchCopy);
    setMatch(matchCopy);
    hasScoreboard(matchCopy[indexInArray]);
  }

  const scoreboardVisitingTeam = index => e => {
    console.log('visiting: ', e.target.value);
    const indexInArray = match.findIndex((match) => match.id === index);
    setGuessVisitingTeam(e.target.value);
    const matchCopy = [...match];
    matchCopy[indexInArray].visitingTeam.scoreboard = e.target.value;
    setMatch(matchCopy);
    hasScoreboard(matchCopy[indexInArray]);
  }

  function callSaveMatch(item) {
    saveMatchBet(item);
  }

  function hasScoreboard(match) {
    if (match.homeTeam.scoreboard.length >= 0 && match.visitingTeam.scoreboard.length >= 0) {
      document.getElementById(`save-bet-${match.id}`).disabled = false;
      document.getElementById(`save-bet-${match.id}`).addEventListener("click", function (event) {
        document.getElementById(`save-bet-${match.id}`).disabled = true;
        event.preventDefault();
        if (!event.detail || event.detail === 1) {
          callSaveMatch(match);
          event.stopPropagation();
        }
      });
    }

    if (match.homeTeam.scoreboard.length <= 0 || match.visitingTeam.scoreboard.length <= 0) {
      document.getElementById(`save-bet-${match.id}`).disabled = true;
    }
  }

  function selectRound(round) {
    loadMatchBet(round);
    setRoundSelected(round);
  }

  const saveDoBetForUser = (item, i) => {
    console.log(item);
    const bet = {
      guessHomeTeam: item.homeTeam.scoreboard,
      guessVisitingTeam: item.visitingTeam.scoreboard,
      betMade: false,
      discountFromWallet: false
    };

    console.log('bet: ', bet);

    // /corneta/bet/{idBet}/user/{idUser}
    // localhost:8888/corneta/bet/{idBet}/user/{idUser}
    // O id do match eh id da bet
    axios.post(`${url}/doBetForUser`, bet).then((response) => {
      console.log('aposta salva: ', response);
      delete item.homeTeam.scoreboard;
      delete item.visitingTeam.scoreboard;

      Array.from(document.querySelectorAll(`#score-board-${item.id}`)).forEach(
        input => (input.value = "")
      );

      document.getElementById(`save-bet-${item.id}`).disabled = true;
    });
  }

  const notifyError = () => toast.error(
    'Erro, transação cancelada', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }
  )

  const notifyFinalizeBet = () => toast.success(
    'Palpite finalizado com sucesso', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  })

  const sanitizeDate = (date) => {
    const options = {
      dateStyle: ('full' || 'long' || 'medium' || 'short')
    };

    return new Date(date).toLocaleDateString('pt-br', options);
  }

  const notify = () => toast.success(
    'Palpite salvo com sucesso', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const notifyNewUser = () => toast.success(
    'Cadastro efetuado com sucesso', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const postConditionCode = FungibleConditionCode.Equal;
  const postConditionAmount = withMoney === true ? 5000000n : 0n;

  const contractSTXPostCondition = makeStandardSTXPostCondition(
    userSession.loadUserData().profile.stxAddress.testnet,
    postConditionCode,
    postConditionAmount
  );

  //  "ST1X0C07T1WN52DQXGAASMQ7P5M357HJGV4PFF6JC", "bet-test-nara"
  function saveMatchBet(item) {
    console.log(item);
    const splitHashCode = item.contractHashCode.split('.');
    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: `${splitHashCode[0]}`,
      contractName: `${splitHashCode[1]}`,
      functionName: "save-bet",
      functionArgs: [tupleCV({
        s1: intCV(item.homeTeam.scoreboard),
        s2: intCV(item.visitingTeam.scoreboard),
        free: falseCV()
      })],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [contractSTXPostCondition],
      onFinish: (data) => {
        console.log("onFinish:", data);
        saveDoBetForUser(item);
        notify();
        // Primeiro salva do lado da blockchain
        // No response da transacao com a blockchain pegar o txId e salvar no userBet da API Corneta
        // Depois de finalizado salva na api corneta

        // window
        //   .open(
        //     `https://explorer.stacks.co/txid/${data.txId}?chain=testnet`,
        //     "_blank"
        //   )
        //   .focus();
      },
      onCancel: () => {
        notifyError();
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  function finalizaMatchBet(item) {
    console.log(item);
    const splitHashCode = item.contractHashCode.split('.');
    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: `${splitHashCode[0]}`,
      contractName: `${splitHashCode[1]}`,
      functionName: "finalize-bet",
      functionArgs: [intCV(item.homeTeam.scoreboard), intCV(item.visitingTeam.scoreboard)], // valores que serao o placar final do jogo
      postConditionMode: PostConditionMode.Deny,
      postConditions: [makeContractSTXPostCondition(
        splitHashCode[0],
        splitHashCode[1],
        FungibleConditionCode.Greater,
        0n
      )],
      onFinish: (data) => {
        console.log("onFinish:", data);
        notifyFinalizeBet();
        window.location.reload();
      },
      onCancel: () => {
        notifyError();
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  if (!userSession.isUserSignedIn()) {
    return null;
  }

  function isValidEmail(email) {
    // eslint-disable-next-line no-useless-escape
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    return regex.test(email);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(event, name, value);
    if (!isValidEmail(value)) {
      setError('Email invalido');
    } else {
      setError(null);
    }
    setState((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const handleInputNickName = (event) => {
    console.log(event.target.value.length);
    if (event.target.value.length === 0) {
      console.log('aqui');
      setErrorNickName(true);
    } else {
      setErrorNickName(false);
      setNickName(event.target.value);
    }
  }

  const handleInputEmail = (event) => {
    console.log(event.target.value);
    if (!isValidEmail(event.target.value)) {
      setError('Email invalido');
    } else {
      setError(null);
      setEmail(event.target.value);
    }
  }

  const clearFields = () => {
    const initialState = {
      nickName: "",
      email: "",
      identityAddress: JSON.parse(localStorage.getItem('blockstack-session')).userData.identityAddress
    };

    setState({ ...initialState });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(state);
    notifyNewUser();
    setNewUser(false);
    // axios.post(`${url}/corneta/user`, state, { headers: headers }).then((response) => {
    //   console.log(response);
    //   if (response.status === 201) {
    //     clearFields();
    //     // navigate("/home");
    //   }
    // })
  };

  const switchMoney = (e) => {
    console.log(e.target.checked);
    setWithMoney(e.target.checked);
  }

  const test = (item) => {
    console.log('meu birro: ', item);
    finalizaMatchBet(item);
  }

  return (
    <>
      {
        newUser === true ?
          <>
            <Container className="container-form">
              <h2>Preencher cadastro</h2>
              <Card className="card-form">
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Nome ou apelido</Form.Label>
                    <Form.Control type="text" name="nickName"
                      onChange={handleInputNickName} required />
                    {errorNickName && <span style={{ color: 'red' }}>{errorNickName}</span>}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" name="email"
                      onChange={handleInputEmail} required />
                    {error && <span style={{ color: 'red' }}>{error}</span>}
                  </Form.Group>
                  <Button className="btn-form" disabled={nickName.length <= 0 || (email.length <= 0 || error)} onClick={handleSubmit}>Cadastrar</Button>
                </Form>
              </Card>
            </Container>
          </> :
          <>
            <ButtonGroup className="menu-round" aria-label="Basic example">
              <Button variant="light" onClick={() => loadMatchBet(defaultRound)}>1ª Rodada</Button>
              <Button variant="light" onClick={() => loadMatchBet('Grupos 2')}>2ª Rodada</Button>
              <Button variant="light" onClick={() => loadMatchBet('Grupos 3')}>3ª Rodada</Button>
            </ButtonGroup>

            <ToastContainer />

            {/* {
              match && match[0].round === 'Grupos 1' ? <h2>Jogos da 1ª rodada</h2> :
                match[0].round === 'Grupos 2' ? <h2>Jogos da 2ª rodada</h2> : <h2>Jogos da 3ª rodada</h2>
            } */}

            <h2>Lista de jogos</h2>

            {
              match && (
                Array.from({ length: Math.ceil(match.length / 4) }, (_, i) => {
                  return (
                    <Row className="box-row" key={i}>
                      {
                        match.slice(i * 4, (i + 1) * 4).map((item, i) => {
                          return (
                            <Col className="col-cards" key={i}>
                              <Card className="card-width">
                                <Card.Body>
                                  <Card.Title>
                                    {item.round === 'Grupos 1' ? <span>1ª Rodada</span> : item.round === 'Grupos 2' ? <span>2ª Rodada</span> : <span>3ª Rodada</span>}
                                  </Card.Title>
                                  <hr></hr>
                                  <Card.Subtitle className="mb-2 text-muted">
                                    <div className="details">
                                      <img
                                        src="https://i.pinimg.com/564x/c4/63/98/c4639855e84f992b7dbed318972b86fd.jpg"
                                        width="70"
                                        height="70"
                                        className="d-inline-block align-top"
                                        alt="logo"
                                      />{' '}

                                      <Link to={'messages'} state={{ idBet: 1, idUser: 1 }}>
                                        <Button variant="link">Visualizar detalhes</Button>
                                      </Link>
                                    </div>
                                  </Card.Subtitle>
                                  <div>
                                    <span className="box-match">
                                      <div className="teams">
                                        <label>{item.homeTeam.initials}</label>
                                        <div className={`flag fi fi-${item.homeTeam.flag}`}></div>
                                        <input type="number" id={`score-board-${item.id}`} min="0" max="10" value={item.name} onChange={scoreboardHomeTeam(item.id)} />
                                      </div>
                                      <i className="fa-sharp fa-solid fa-x"></i>
                                      <div className="teams">
                                        <input type="number" id={`score-board-${item.id}`} min="0" max="10" value={item.name} onChange={scoreboardVisitingTeam(item.id)} />
                                        <div className={`flag fi fi-${item.visitingTeam.flag}`}></div>
                                        <label className="visitingTeam">{item.visitingTeam.initials}</label>
                                      </div>
                                    </span>

                                    <Row>
                                      <Col className="box-info-match">
                                        <Badge pill bg="light" text="dark">
                                          <i className="icon fa-regular fa-calendar-days"></i>
                                          {sanitizeDate(item.gameDate)}
                                        </Badge>
                                      </Col>

                                      <Col>
                                        <Form.Check
                                          className="with-money"
                                          type="switch"
                                          id={`custom-switch-${item.id}`}
                                          label="Jogar com dinheiro STX"
                                          defaultChecked={withMoney}
                                          onChange={switchMoney}
                                        />
                                      </Col>

                                      {withMoney}
                                    </Row>
                                  </div>
                                  <Button type="button" id={`save-bet-${item.id}`} className="save-bet"
                                    disabled={true}
                                    onClick={() => saveMatchBet(item)}>Salvar palpite</Button>

                                  <Button type="button" id={`finish-bet-${item.id}`} variant="light" className="finish" onClick={() => test(item)}>Finalizar palpite</Button>
                                </Card.Body>
                              </Card>
                            </Col>
                          )
                        })
                      }
                    </Row>
                  )
                })
              )
            }

          </>
      }
    </>
  );
};

export default ContractCallCorneta;

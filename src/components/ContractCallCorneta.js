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
        if (err.response.status === 401) {
          setNewUser(false); // mudar pra true
        }
      })
  }

  // TODO: Alterar para url de prod
  function loadMatchBet(round) {
    // const url = 'http://44.201.160.92/corneta/matches';
    // axios.get(`${url}/bets`, { headers: headers }).then((response) => {
    //   const group = response.data.filter((bet) => bet.match.round === round);
    //   setMatch(group);
    // });

    const mockBet = [
      {
        "id": 1,
        "match": {
          "id": 1,
          "homeTeam": {
            "id": 1,
            "name": "Catar",
            "initials": "CAT",
            "group": "A",
            "flag": "qa"
          },
          "visitingTeam": {
            "id": 2,
            "name": "Equador",
            "initials": "EQU",
            "group": "A",
            "flag": "ec"
          },
          "gameDate": "2022-11-20T00:00:00",
          "round": "Grupos 1"
        },
        "contractHashCode": "ST1X0C07T1WN52DQXGAASMQ7P5M357HJGV4PFF6JC.corneta-match94"
      },
      {
        "id": 2,
        "match": {
          "id": 2,
          "homeTeam": {
            "id": 3,
            "name": "França",
            "initials": "FRA",
            "group": "D",
            "flag": "fr"
          },
          "visitingTeam": {
            "id": 4,
            "name": "Austrália",
            "initials": "AUS",
            "group": "D",
            "flag": "au"
          },
          "gameDate": "2022-11-22T00:00:00",
          "round": "Grupos 1"
        },
        "contractHashCode": "ST1X0C07T1WN52DQXGAASMQ7P5M357HJGV4PFF6JC.corneta-match95"
      },
      {
        "id": 3,
        "match": {
          "id": 3,
          "homeTeam": {
            "id": 5,
            "name": "Brasil",
            "initials": "BRA",
            "group": "G",
            "flag": "br"
          },
          "visitingTeam": {
            "id": 6,
            "name": "Sérvia",
            "initials": "SER",
            "group": "G",
            "flag": "rs"
          },
          "gameDate": "2022-11-24T00:00:00",
          "round": "Grupos 1"
        },
        "contractHashCode": "ST1X0C07T1WN52DQXGAASMQ7P5M357HJGV4PFF6JC.corneta-match93"
      }
    ];

    setMatch(mockBet);
  }

  const scoreboardHomeTeam = index => e => {
    const indexInArray = match.findIndex((bet) => bet.match.id === index);
    console.log(indexInArray);
    setGuessHomeTeam(e.target.value);
    const matchCopy = [...match];
    matchCopy[indexInArray].match.homeTeam.scoreboard = e.target.value;
    console.log('matchCopy: ', matchCopy);
    setMatch(matchCopy);
    hasScoreboard(matchCopy[indexInArray]);
  }

  const scoreboardVisitingTeam = index => e => {
    const indexInArray = match.findIndex((bet) => bet.match.id === index);
    setGuessVisitingTeam(e.target.value);
    const matchCopy = [...match];
    matchCopy[indexInArray].match.visitingTeam.scoreboard = e.target.value;
    setMatch(matchCopy);
    hasScoreboard(matchCopy[indexInArray]);
  }

  function callSaveMatch(item) {
    saveMatchBet(item);
  }

  function hasScoreboard(bet) {
    if (bet.match.homeTeam.scoreboard.length >= 0 && bet.match.visitingTeam.scoreboard.length >= 0) {
      document.getElementById(`save-bet-${bet.match.id}`).disabled = false;
      document.getElementById(`save-bet-${bet.match.id}`).addEventListener("click", function (event) {
        document.getElementById(`save-bet-${bet.match.id}`).disabled = true;
        event.preventDefault();
        if (!event.detail || event.detail === 1) {
          callSaveMatch(bet);
          event.stopPropagation();
        }
      });
    }

    if (bet.match.homeTeam.scoreboard.length <= 0 || bet.match.visitingTeam.scoreboard.length <= 0) {
      document.getElementById(`save-bet-${bet.match.id}`).disabled = true;
    }
  }

  function selectRound(round) {
    loadMatchBet(round);
    setRoundSelected(round);
  }

  const saveDoBetForUser = (item, i) => {
    console.log(item);
    const bet = {
      guessHomeTeam: item.match.homeTeam.scoreboard,
      guessVisitingTeam: item.match.visitingTeam.scoreboard,
      betMade: false,
      discountFromWallet: false
    };

    console.log('bet: ', bet);

    // /corneta/bet/{idBet}/user/{idUser}
    // localhost:8888/corneta/bet/{idBet}/user/{idUser}
    // O id do match eh id da bet
    axios.post(`${url}/doBetForUser`, bet).then((response) => {
      console.log('aposta salva: ', response);
      delete item.match.homeTeam.scoreboard;
      delete item.match.visitingTeam.scoreboard;

      Array.from(document.querySelectorAll(`#score-board-${item.match.id}`)).forEach(
        input => (input.value = "")
      );

      document.getElementById(`save-bet-${item.match.id}`).disabled = true;
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
        s1: intCV(item.match.homeTeam.scoreboard),
        s2: intCV(item.match.visitingTeam.scoreboard),
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
            {/* 
              TODO: Habilitar depois
            <ButtonGroup className="menu-round" aria-label="Basic example">
              <Button variant="light" onClick={() => loadMatchBet(defaultRound)}>1ª Rodada</Button>
              <Button variant="light" onClick={() => loadMatchBet('Grupos 2')}>2ª Rodada</Button>
              <Button variant="light" onClick={() => loadMatchBet('Grupos 3')}>3ª Rodada</Button>
            </ButtonGroup> */}

            <ToastContainer />

            {/* {
              match && match[0].round === 'Grupos 1' ? <h2>Jogos da 1ª rodada</h2> :
                match[0].round === 'Grupos 2' ? <h2>Jogos da 2ª rodada</h2> : <h2>Jogos da 3ª rodada</h2>
            } */}

            <div className='block-title'>
              <h2>Lista de jogos</h2>
            </div>

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
                                    <span>Grupo {item.match.homeTeam.group}</span> { ' - ' }
                                    {item.match.round === 'Grupos 1' ? <span>1ª Rodada</span> : item.match.round === 'Grupos 2' ? <span>2ª Rodada</span> : <span>3ª Rodada</span>}
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
                                        <label>{item.match.homeTeam.initials}</label>
                                        <div className={`flag fi fi-${item.match.homeTeam.flag}`}></div>
                                        <input type="number" id={`score-board-${item.match.id}`} min="0" max="10" value={item.match.name} onChange={scoreboardHomeTeam(item.match.id)} />
                                      </div>
                                      <i className="fa-sharp fa-solid fa-x"></i>
                                      <div className="teams">
                                        <input type="number" id={`score-board-${item.match.id}`} min="0" max="10" value={item.match.name} onChange={scoreboardVisitingTeam(item.match.id)} />
                                        <div className={`flag fi fi-${item.match.visitingTeam.flag}`}></div>
                                        <label className="visitingTeam">{item.match.visitingTeam.initials}</label>
                                      </div>
                                    </span>

                                    <Row>
                                      <Col className="box-info-match">
                                        <Badge pill bg="light" text="dark">
                                          <i className="icon fa-regular fa-calendar-days"></i>
                                          {sanitizeDate(item.match.gameDate)}
                                        </Badge>
                                      </Col>

                                      <Col>
                                        <Form.Check
                                          className="with-money"
                                          type="switch"
                                          id={`custom-switch-${item.match.id}`}
                                          label="Jogar com dinheiro STX"
                                          defaultChecked={withMoney}
                                          onChange={switchMoney}
                                        />
                                      </Col>

                                      {withMoney}
                                    </Row>
                                  </div>
                                  <Button type="button" id={`save-bet-${item.match.id}`} className="save-bet"
                                    disabled={true}
                                    onClick={() => saveMatchBet(item.match)}>Salvar palpite</Button>

                                  <Button type="button" id={`finish-bet-${item.match.id}`} variant="light" className="finish" onClick={() => test(item.match)}>Finalizar palpite</Button>
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

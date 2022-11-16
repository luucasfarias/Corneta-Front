import React from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { Button } from "react-bootstrap";
import "../css/CallWallet.css";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "Conecte a sua carteira",
      icon: "https://i.pinimg.com/564x/c4/63/98/c4639855e84f992b7dbed318972b86fd.jpg",
    },
    redirectTo: "/",
    onFinish: () => {
      console.log('logdd');
      window.location.reload();

    },
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut("/");
}

const ConnectWallet = () => {
  if (userSession.isUserSignedIn()) {
    return (
      <div>
        <Button variant="light" onClick={disconnect}>
          Desconectar carteira
        </Button>
        {/* <p>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</p>
        <p>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</p> */}
      </div>
    );
  }

  return (
    <Button className="btn-conect-wallet" onClick={authenticate}>
      Conectar carteira
    </Button>
  );
};

export default ConnectWallet;

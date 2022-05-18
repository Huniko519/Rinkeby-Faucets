import React, { useRef, useEffect, useState } from "react";
import logo from "./assets/images/logo-faucet.svg";
import help from "./assets/images/Help.svg";
import "./App.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";

import { options } from "./constants/constant";
import Abi from "./contracts/abi.json";

function App() {
  var tokenAddress = "0xFb351C2c69a1Cad77e8e6Ad02C04352a521Aac85";
  var myContract = new ethers.Contract(tokenAddress, Abi);

  const acco_address = useRef("");
  const [tokenamount, setTokenAmount] = useState(0);
  const [balance, setBalance] = useState("");

  useEffect(() => {
    connectWallet();
  }, []);

  const getBalance = async () => {
    if (window.ethereum) {
      try {
        var provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        var MyContract = myContract.connect(signer);
        let balance = await MyContract.balanceOf(
          window.ethereum.selectedAddress
        );

        setBalance(balance);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const connectWallet = () => {
    if (window.ethereum) {
      try {
        window.ethereum.enable().then((res) => {
          console.log("Public Key is ", window.ethereum.selectedAddress);
          setWalletAddress(window.ethereum.selectedAddress);
          if (res) {
            getBalance();
          }
        });
      } catch (e) {}
    }
  };

  const handleTransfer = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    var MyContract = myContract.connect(signer);
    var tx = await MyContract.transfer(acco_address.current.value, tokenamount)
      .then((res) => {
        toast.success("Transfer successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAmount1 = () => {
    setTokenAmount(100);
  };

  const handleAmount2 = () => {
    setTokenAmount(1000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="col-md-9">
          <img src={logo} className="logo" alt="logo" />
        </div>
      </header>
      <section className="App-section1">
        <div className="col-md-9">
          <div className="App-container">
            <div className="App-container-Description">
              <div>
                <div className="Container-DescTitle">Request testnet LINK</div>
                <div className="Container-DescContent">
                  Get testnet LINK for an account on one of the supported
                  blockchain testnets so you can create and test your own oracle
                  and Chainlinked smart contract.
                  <br />
                  <a href="#">Learn more</a>
                </div>
              </div>
            </div>
            <div className="App-container-Options">
              <div className="Container-Options-Network">
                <div className="Options-Network-Container">
                  <div className="Options-Text">Network</div>
                  <Select options={options} />
                </div>
                <div className="Options-Network-Container">
                  <div className="Options-Text">Testnet account address</div>
                  <input
                    type="text"
                    placeholder="Ex: 0x9d647F5A306e0C38C31292666fbD6d93f1D5C6DA"
                    className="account-address"
                    ref={acco_address}
                  />
                </div>
              </div>
              <div className="Options-Text">Request Amount</div>
              <div className="Container-Options-RequestAmount">
                <div className="Container-Options-Request">
                  <input
                    type="radio"
                    id="hundred"
                    name="tokenamount"
                    className="form-check-input"
                    onClick={handleAmount1}
                  />
                  100 test token
                </div>
                <div className="Container-Options-Request">
                  <input
                    type="radio"
                    id="thousand"
                    name="tokenamount"
                    className="form-check-input"
                    onClick={handleAmount2}
                  />
                  1000 test token
                </div>
              </div>
              <div className="Button-Container">
                <div
                  className="Container-Options-SendBtn"
                  onClick={handleTransfer}
                >
                  Send Request
                </div>
              </div>
              <div className="Container-Options-Chainlink">
                <img src={help} alt="help" /> Email us at{" "}
                <a href="#">faucets@chain.link</a> if there is an issue here,
                thanks!
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;

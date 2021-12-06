import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, buyToken, getTotalRaisedAmount } from "./utils/interact";

const Saler = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [bnbAmount, setBNBAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [raisedBNB, setRaisedBNB] = useState(0);
  const [url, setURL] = useState("");
 
  useEffect(async () => { //TODO: implement
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  useEffect(() => {
    setTokenAmount(5000 * bnbAmount);
  }, [bnbAmount])

  useEffect(async () => {
    let raisedAmount = await getTotalRaisedAmount();
    setRaisedBNB(raisedAmount);
    console.log("raisedAmount =", raisedAmount);
  }, [status])

  const connectWalletPressed = async () => { //TODO: implement
    const { address, status } = await connectWallet();
    setWallet(address);
    setStatus(status);
  };

  const onBuyPressed = async () => { //TODO: implement
    const { status } = await buyToken(bnbAmount);
    setStatus(status);
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Put BNB Amount in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      })
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );  
    }
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <h2>(5, 000 NVD per 1 BNB) </h2>
      <h1>Total Raised: {raisedBNB} BNB</h1>
      <h1>Total Token Sold: {raisedBNB*5000} NVD</h1>
      <br></br>
      <form>
        <h1>BNB value</h1>
        <input
          type="text"
          placeholder="0"
          value={bnbAmount}
          onChange={(event) => setBNBAmount(event.target.value)}
        />
      </form>
      <h1>
        NVD Amount :
        { tokenAmount } NVD
      </h1>

      <button id="mintButton" onClick={onBuyPressed}>
        BUY NVD Token
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Saler;

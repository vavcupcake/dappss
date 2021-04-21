import React, { Component } from "react";
import BankContract from "./contracts/Bank.json";
import getWeb3 from "./getWeb3";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import "./App.css";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = { balance: null, web3: null, accounts: null, contract: null };

    this.deposit = this.deposit.bind(this);
    this.withdraw = this.withdraw.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BankContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BankContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const balance = await instance.methods.get().call({ from: accounts[0] });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, balance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  deposit = async (e) => {
    e.preventDefault();

    const { accounts, contract, depositAmount } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.deposit().send({ from: accounts[0], value: depositAmount });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call({ from: accounts[0] });

    // Update state with the result.
    this.setState({ balance: response });
    return false;
  };

  withdraw = async (e) => {
    e.preventDefault();

    const { accounts, contract, withdrawAmount } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.withdraw(withdrawAmount).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const balance = await contract.methods.get().call({ from: accounts[0] });

    // Update state with the result.
    this.setState({ balance });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="container">
          <h3>Account: {this.state.accounts[0]}</h3>
          <h4>Your balance: {this.state.balance}</h4>
          <div className="mb-5">
            <h6>Deposit</h6>
              <Form onSubmit={this.deposit}>
                <Form.Group controlId="form-amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" placeholder="Deposit amount" value={this.state.depositAmount} onChange={(e) => this.setState({depositAmount: e.target.value}) } />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Deposit
                </Button>
              </Form>
          </div>
          <div className="mb-5">
            <h6>Withdraw</h6>
            <Form onSubmit={this.withdraw}>
                <Form.Group controlId="form-amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" placeholder="Withdraw amount"  value={this.state.withdrawAmount} onChange={(e) => this.setState({withdrawAmount: e.target.value}) }/>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Withdraw
                </Button>
              </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

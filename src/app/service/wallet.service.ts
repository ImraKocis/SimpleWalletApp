import { Injectable } from '@angular/core';
import Web3 from 'web3';
// var Web3 = require('web3');

let web3 = new Web3('https://evm-t3.cronos.org/');

declare let window: any;

type BalanceAddressType = {
  formattedBallance: string;
  currentAddress: string;
};

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  metamaskInstalled = false;
  metamaskAddress = '';
  constructor() {}

  checkMetamaskStatus(): boolean {
    if (window.ethereum) return window.ethereum.isConnected();

    return false;
  }
  // getMetamaskAddress = async () => {
  //   if (window.ethereum !== undefined) {
  //     console.log('pero');
  //     // await window.ethereum.enable();
  //     let addresses = await window.ethereum.request({
  //       method: 'eth_requestAccounts',
  //     });
  //     return addresses[0];
  //   }
  //   return null;
  // };

  private _getMetaMaskPrivateAddress = async () => {
    if (window.ethereum !== undefined) {
      let addresses = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      this.metamaskAddress = addresses[0];
      return addresses[0];
    }
    return null;
  };

  checkWalletDisconnect = async () => {
    if (window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', async () => {
        location.reload();
      });
    }
  };

  getWalletBalance = async (): Promise<BalanceAddressType> => {
    let currentAddress: string = '';
    let balance: string = '';
    let formattedBallance: string = '0';

    if (this.checkMetamaskStatus()) {
      currentAddress = await this._getMetaMaskPrivateAddress();
      await web3.eth.getBalance(currentAddress).then((res) => {
        balance = res;
      });
      formattedBallance = web3.utils.fromWei(balance);
    }

    return { formattedBallance, currentAddress };
  };

  transactionHandler = async (toAddress?: string) => {
    if (window.ethereum) {
      console.log(this.metamaskAddress);
      let txHash = '';
      let params = [
        {
          from: this.metamaskAddress,
          // to: '0x8f9bfD0aADA01393D04B06B1CF58863963a25beD',
          to: toAddress,
          gas: '0x76c0',
          gasPrice: '0x9184e72a000',
          value: '0xDE0B6B3A7640000',
        },
      ];
      await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params,
        })
        .then((res: string) => {
          console.log(res);
          txHash = res;
          // return res;
        })
        .catch((err: any) => {
          console.log(err);
          return 'Error';
        });

      return txHash;
    } else return '0';
  };

  // getBalanceFromMarcel() {}

  // loadMetamask = async () => {
  //   if (window.ethereum !== undefined) {
  //     await window.ethereum.enable();
  //     web3 = new Web3(window.ethereum);
  //     let accounts = await window.ethereum.request({
  //       method: 'eth_requestAccounts',
  //     });
  //     window.location.reload();
  //     this.address = accounts[0];
  //     return accounts[0];
  //   }
  // };

  // getWeb3State = async () => {
  //   const web3private = new Web3(window.ethereum);
  //   window.ethereum.enable();

  //   // return await web3private.eth.getAccounts().then(console.log);
  //   console.log(web3private.eth.getAccounts());
  // };
}

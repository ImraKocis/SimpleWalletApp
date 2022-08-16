import { Injectable } from '@angular/core';
import Web3 from 'web3';
import * as ethers from 'ethers';
import { ERC20_abi } from '../shared/abi';
// var Web3 = require('web3');

declare let window: any;
let web3 = new Web3('https://evm-t3.cronos.org/');
const CustomTokenContractAddress = '0x453bf2e10180eB366C513941B3B3e79D488708f3';

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
      let web3private = new Web3(window.ethereum);
      currentAddress = await this._getMetaMaskPrivateAddress();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = provider.getSigner();

      await web3.eth.getBalance(currentAddress).then((res) => {
        balance = res;
      });
      formattedBallance = web3.utils.fromWei(balance);
    }

    return { formattedBallance, currentAddress };
  };

  transactionHandler = async (toAddress?: string, amount: number = 0) => {
    if (window.ethereum) {
      let web3private = new Web3(
        new Web3.providers.HttpProvider(window.ethereum)
      );
      let value = web3.utils.toWei(amount?.toString(), 'ether');
      let hexValue = web3.utils.toHex(value);

      console.log(this.metamaskAddress);
      let txHash = '';
      let params = [
        {
          from: this.metamaskAddress,
          // to: '0x8f9bfD0aADA01393D04B06B1CF58863963a25beD',
          to: toAddress,
          gas: '0x76c0',
          gasPrice: '0x9184e72a000',
          // value: '0xDE0B6B3A7640000',
          value: hexValue,
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

  web3TransactionHandler = async (toAddress?: string, amount?: number) => {
    console.log(amount);

    let value = web3.utils.toWei(amount!.toString(), 'ether');
    let hexValue = web3.utils.toHex(value);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    const signer = provider.getSigner();
    const tx = signer
      .sendTransaction({
        to: toAddress,
        // value: '0xDE0B6B3A7640000',
        value: hexValue,
      })
      .then((res) => {
        console.log(res);
        return res.hash;
      });

    return tx;
  };

  web3CustomTokenTransactionHandler =
    async (/*toAddress?: string, amount?: number*/) => {
      // let value = web3.utils.toWei(amount!.toString(), 'ether');
      // let hexValue = web3.utils.toHex(value);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const byteCode = await web3.eth.getCode(
        '0x453bf2e10180eB366C513941B3B3e79D488708f3'
      );

      const contract = new ethers.Contract(
        CustomTokenContractAddress,
        ERC20_abi,
        signer
      );

      try {
        // const transactionResponse = await contract.balanceOf
      } catch (error) {}
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

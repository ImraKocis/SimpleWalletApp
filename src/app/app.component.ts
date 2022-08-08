import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { WalletService } from './service/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'WalletApp';
  balance: string = '';
  userWalletAddress: string = '';
  txHash: string = '';
  isTransactionPending: boolean = false;
  isLoaded: boolean = false;

  // window: any;
  constructor(private _walletService: WalletService) {}
  ngOnInit() {
    console.log(this._walletService.checkMetamaskStatus());
    this._walletService.getWalletBalance().then((res) => {
      // console.log(res);
      this.balance = res.formattedBallance;
      this.userWalletAddress = res.currentAddress;
      this.isLoaded = true;
    });
    // this.getAddressFromService();
  }

  handleTransaction = async () => {
    this.isTransactionPending = true;
    // console.log('Pending');
    this.txHash = await this._walletService.transactionHandler();
  };

  // getAddressFromService = async () => {
  //   // console.log(await this._walletService.getMetamaskAddress());
  //   this.userWalletAddress = await this._walletService.getMetamaskAddress();
  // };
}

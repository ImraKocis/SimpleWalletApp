import { Component, OnInit } from '@angular/core';
import { async, flush } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { WalletService } from './service/wallet.service';
import { addressInputValidator } from './shared/forbiden-input.directive';
import { ValidateAddressInput } from './shared/validate-address-input.directive';

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
  targetAddress?: string;
  targetAmount?: number;
  form: any;
  isError: boolean = true;

  constructor(private _walletService: WalletService) {}
  ngOnInit() {
    console.log(this._walletService.checkMetamaskStatus());
    if (!this.balance) this.getData();
    setInterval(() => {
      if (this.balance) {
        this.getData();
        console.log(this.balance);
      }
    }, 5000);
    this.test();
    // this.form = new FormGroup({
    //   address: new FormControl(this.targetAddress, [
    //     addressInputValidator(/^0x([A-Fa-f0-9]{64})$/),
    //   ]),
    // });
    // this.getAddressFromService();
  }

  getData() {
    this._walletService.getWalletBalance().then((res) => {
      // console.log(res);
      this.balance = res.formattedBallance;
      this.userWalletAddress = res.currentAddress;
      this.isLoaded = true;
    });
  }

  handleTransaction = async (
    targetAddress?: typeof this.targetAddress,
    targetAmount?: typeof this.targetAmount
  ) => {
    if (targetAddress?.match(/^0x[a-fA-F0-9]{40}$/g) && targetAmount! > 0) {
      this.isTransactionPending = true;

      this.txHash = await this._walletService.web3TransactionHandler(
        targetAddress,
        targetAmount
      );
      this.isTransactionPending = false;
    } else {
      alert('Please enter correct address and amount!');
    }
  };

  handleCustomTokenTransaction(
    targetAddress?: typeof this.targetAddress,
    targetAmount?: typeof this.targetAmount
  ) {}

  test = async () => {
    await this._walletService.web3CustomTokenTransactionHandler();
  };

  // getAddressFromService = async () => {
  //   // console.log(await this._walletService.getMetamaskAddress());
  //   this.userWalletAddress = await this._walletService.getMetamaskAddress();
  // };
}

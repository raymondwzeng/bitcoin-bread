import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bitcoin-price-client',
  templateUrl: './bitcoin-price-client.component.html',
  styleUrls: ['./bitcoin-price-client.component.css']
})
export class BitcoinPriceClientComponent implements OnInit {
  price : Number = 0;
  yesterdayComparison : String = "Change from last update*: ";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:4000/api/').subscribe(data => {
      if(data.price == 0) {
        this.price = 0;
      } else {
        this.price = Number((data.breadPrice / data.price).toFixed(5));
      }
      let priceChange = Number((data.price - data.yesterdayPrice).toFixed(5));
      this.yesterdayComparison += (("$" + priceChange.toFixed(2)).toString()+" ("+ (data.breadPrice/priceChange).toFixed(2) +" USD)");
    })
  }

}

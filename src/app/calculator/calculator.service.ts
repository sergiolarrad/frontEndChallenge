import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


export interface CombinationInterface {
  equal?: CalculatorComponentValue;
  floor?: CalculatorComponentValue;
  ceil?: CalculatorComponentValue;
}

export interface CalculatorComponentValue {
  value: number;
  cards: number[];
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  API = 'http://localhost:3000';
  AUTH_TOKEN = 'tokenTest123';
  SHOP_NUMBER = 5;


  constructor(private http: HttpClient) {
  }

  getCombination(amount: number): Observable<CombinationInterface> {
    return this.http.get<CombinationInterface>(this.API + '/shop/' + this.SHOP_NUMBER + '/search-combination', {
      headers: {
        Authorization: this.AUTH_TOKEN
      }, params: {
        amount
      }
    })
  }

}

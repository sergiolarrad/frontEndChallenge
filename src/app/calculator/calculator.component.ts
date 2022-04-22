import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { CalculatorService, CombinationInterface} from "./calculator.service";


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  @Output()
  amountEmitter: EventEmitter<number> = new EventEmitter<number>();
  cards: number[] = [];

  amountControl!: FormControl;
  formGroup!: FormGroup;
  possibleCombination!: CombinationInterface;

  constructor(private calculatorService: CalculatorService) {
  }

  ngOnInit(): void {
    this.amountControl = new FormControl(0, [Validators.required, Validators.min(0)]);
    this.formGroup = new FormGroup({amount: this.amountControl});
  }

  validateForm(): void {
    if (this.formGroup.valid) {
      this.calculatorService.getCombination(this.amountControl.value).subscribe({
        next: (combination) => {
          this.possibleCombination = combination;
          if (this.possibleCombination.equal) {
            this.possibleCombination.equal;
            this.amountEmitter.emit(this.amountControl.value);
          }
        }
      })
    }
  }

  choosePrevious(): void {
    if (this.possibleCombination.floor) {
      this.possibleCombination.equal = this.possibleCombination.floor;
      this.amountControl.setValue(this.possibleCombination.floor?.value);
      this.amountEmitter.emit(this.amountControl.value);
    }
  }

  chooseNext(): void {
    if (this.possibleCombination.ceil) {
      this.possibleCombination.equal = this.possibleCombination.ceil;
      this.amountControl.setValue(this.possibleCombination.ceil?.value);
      this.amountEmitter.emit(this.amountControl.value);
    }
  }

}

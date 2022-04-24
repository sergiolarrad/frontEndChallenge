import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CalculatorService, CombinationInterface} from "./calculator.service";


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  @Output()
  calculatorComponentEmitter: EventEmitter<CombinationInterface> = new EventEmitter<CombinationInterface>();

  valueControl: FormControl = new FormControl(1, [Validators.required, Validators.min(1), Validators.pattern(/[0-9]*/)]);
  cardsControl: FormControl = new FormControl();

  formGroup: FormGroup = new FormGroup({value: this.valueControl, cards: this.cardsControl});
  cardCombination: CombinationInterface | undefined;

  constructor(private calculatorService: CalculatorService) {
  }

  ngOnInit(): void {
  }

  submitForm(): void {
    if (this.formGroup.valid) {
      this.calculatorService.getCombination(this.valueControl.value).subscribe({
        next: (combination) => {
          this.cardCombination = combination;
          if (this.cardCombination.equal) {
            this.cardsControl.setValue(combination.equal?.cards);
            this.calculatorComponentEmitter.emit(this.formGroup.value);
          }
        }
      })
    }
  }

  clearCardCombination(): void {
    this.cardCombination = undefined;
  }

  askForCeilOrFloor(ceilOrFloor: 'ceil' | 'floor'): void {
    let nextValue: number
    if (this.formGroup.valid && this.valueControl.value) {
      nextValue = ceilOrFloor === 'ceil' ? this.valueControl.value + 1 : this.valueControl.value - 1;
    } else {
      nextValue = 1;
    }

    this.calculatorService.getCombination(nextValue).subscribe({
        next: (combination) => {
          this.valueControl.setValue(combination[ceilOrFloor]?.value ?? combination.floor?.value);
          this.cardCombination = combination;
          this.cardCombination.equal = combination[ceilOrFloor] ?? combination.floor;
          this.cardsControl.setValue(this.cardCombination.equal?.cards);
          this.calculatorComponentEmitter.emit(this.formGroup.value);
        }
      }
    );
  }

}

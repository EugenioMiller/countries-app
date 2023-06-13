import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent implements OnInit, OnDestroy { //El OnDestroy se llama cuando un componente va a ser destruído

  private debauncer : Subject<string> = new Subject<string>();
  private debauncerSuscirbe?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  ngOnInit(): void {
    this.debauncer
      .pipe(
        debounceTime(300)
      )
      .subscribe( value => {
        this.onDebounce.emit( value );
    })
  }

  ngOnDestroy(): void {
    this.debauncerSuscirbe?.unsubscribe();
  }


  emitValue(value: string): void {
    this.onValue.emit(value);
  }

  onKeyPress( searchTerm: string ): void {
    this.debauncer.next( searchTerm );
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterComponent]   // 1️⃣ declare the component under test
    });

    fixture = TestBed.createComponent(CounterComponent); // 2️⃣ build a test host for the component
    component = fixture.componentInstance;               // 3️⃣ get the class instance
    fixture.detectChanges();                             // 4️⃣ run first change detection (bind template)
  });

  it('should create', () => {
    expect(component).toBeTruthy();                      // 5️⃣ sanity check
  });

  it('should start with count 0', () => {
    expect(component.count).toBe(0);                     // 6️⃣ initial state
  });

  it('should increment count when increment() is called', () => {
    component.increment();                               // 7️⃣ call the method
    expect(component.count).toBe(1);                     // 8️⃣ verify state changed
  });

  it('should update the template when button is clicked', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');     // 9️⃣ find the button in DOM

    button.click();                                      // 🔟 simulate user click
    fixture.detectChanges();                             // 1️⃣1️⃣ update bindings after click

    const h2: HTMLHeadingElement =
      fixture.nativeElement.querySelector('h2');         // 1️⃣2️⃣ read DOM again
    expect(h2.textContent).toContain('1');               // 1️⃣3️⃣ UI reflects new state
  });
});

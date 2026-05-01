import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionStoryComponent } from './transactionStory.component';

describe('TransactionStoryComponent', () => {
  let component: TransactionStoryComponent;
  let fixture: ComponentFixture<TransactionStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

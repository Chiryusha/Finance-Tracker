import { TestBed } from '@angular/core/testing';

import { TransactionStoreService } from './transaction.store.service';

describe('TransactionStoreService', () => {
  let service: TransactionStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

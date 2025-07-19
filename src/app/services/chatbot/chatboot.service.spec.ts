import { TestBed } from '@angular/core/testing';

import { ChatbootService } from './chatboot.service';

describe('ChatbootService', () => {
  let service: ChatbootService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbootService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

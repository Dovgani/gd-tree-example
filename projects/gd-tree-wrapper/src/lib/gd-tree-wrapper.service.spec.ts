import { TestBed } from '@angular/core/testing';

import { GdTreeWrapperService } from './gd-tree-wrapper.service';

describe('GdTreeWrapperService', () => {
  let service: GdTreeWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GdTreeWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

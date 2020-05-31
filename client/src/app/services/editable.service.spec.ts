import { TestBed } from '@angular/core/testing';

import { EditableService } from './editable.service';

describe('EditableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditableService = TestBed.get(EditableService);
    expect(service).toBeTruthy();
  });
});

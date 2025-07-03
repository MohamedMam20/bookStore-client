import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleFilterMenuComponent } from './toggle-filter-menu.component';

describe('ToggleFilterMenuComponent', () => {
  let component: ToggleFilterMenuComponent;
  let fixture: ComponentFixture<ToggleFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleFilterMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToggleFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

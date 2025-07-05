import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBooksPageComponent } from './search-books-page.component';

describe('SearchBooksPageComponent', () => {
  let component: SearchBooksPageComponent;
  let fixture: ComponentFixture<SearchBooksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBooksPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchBooksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

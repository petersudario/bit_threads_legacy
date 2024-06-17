import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDeleteModalComponent } from './comment-delete-modal.component';

describe('CommentDeleteModalComponent', () => {
  let component: CommentDeleteModalComponent;
  let fixture: ComponentFixture<CommentDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

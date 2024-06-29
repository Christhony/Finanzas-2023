import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLogsignComponent } from './navbar-logsign.component';

describe('NavbarLogsignComponent', () => {
  let component: NavbarLogsignComponent;
  let fixture: ComponentFixture<NavbarLogsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarLogsignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarLogsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

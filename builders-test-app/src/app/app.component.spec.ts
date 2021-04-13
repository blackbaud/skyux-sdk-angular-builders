import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppResourcesService, SkyI18nModule } from '@skyux/i18n';
import { SkyAppResourcesTestService } from '@skyux/i18n/testing';
import { AppComponent } from './app.component';
import { SkyuxModule } from './__skyux/skyux.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SkyI18nModule,
        SkyuxModule.forRoot()
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: SkyAppResourcesService,
          useClass: SkyAppResourcesTestService
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'builders-test-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('builders-test-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('builders-test-app app is running!');
  });

  it('should render resource strings', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.app-resources-heading').textContent).toContain('Hello, world!');
  });
});

jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, waitForAsync, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LoginService } from 'app/core/login/login.service';
import { LoginModalComponent } from 'app/core/login/login-modal.component';

describe('Component Tests', () => {
  describe('LoginModalComponent', () => {
    let comp: LoginModalComponent;
    let fixture: ComponentFixture<LoginModalComponent>;
    let mockLoginService: LoginService;
    let mockRouter: Router;
    let mockActiveModal: NgbActiveModal;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [LoginModalComponent],
          providers: [
            FormBuilder,
            NgbActiveModal,
            {
              provide: LoginService,
              useValue: {
                login: jest.fn(() => of({})),
              },
            },
            {
              provide: Router,
              useValue: {
                url: '/admin/metrics',
                navigate: jest.fn(() => undefined),
              },
            },
          ],
        })
          .overrideTemplate(LoginModalComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginModalComponent);
      comp = fixture.componentInstance;
      mockLoginService = TestBed.inject(LoginService);
      mockRouter = TestBed.inject(Router);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    it('should authenticate the user', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        const credentials = {
          username: 'admin',
          password: 'admin',
          rememberMe: true,
        };

        comp.loginForm.patchValue({
          username: 'admin',
          password: 'admin',
          rememberMe: true,
        });

        // WHEN/
        comp.login();
        tick(); // simulate async

        // THEN
        expect(comp.authenticationError).toEqual(false);
        expect(mockActiveModal.close).toHaveBeenCalled();
        expect(mockLoginService.login).toHaveBeenCalledWith(credentials);
      })
    ));

    it('should empty the credentials upon cancel', () => {
      // GIVEN
      comp.loginForm.patchValue({
        username: 'admin',
        password: 'admin',
      });

      const expected = {
        username: '',
        password: '',
        rememberMe: false,
      };

      // WHEN
      comp.cancel();

      // THEN
      expect(comp.authenticationError).toEqual(false);
      expect(comp.loginForm.get('username')!.value).toEqual(expected.username);
      expect(comp.loginForm.get('password')!.value).toEqual(expected.password);
      expect(comp.loginForm.get('rememberMe')!.value).toEqual(expected.rememberMe);
      expect(mockActiveModal.dismiss).toHaveBeenCalledWith('cancel');
    });

    it('should redirect user when register', () => {
      // WHEN
      comp.register();

      // THEN
      expect(mockActiveModal.dismiss).toHaveBeenCalledWith('to state register');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/account/register']);
    });

    it('should redirect user when request password', () => {
      // WHEN
      comp.requestResetPassword();

      // THEN
      expect(mockActiveModal.dismiss).toHaveBeenCalledWith('to state requestReset');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/account/reset', 'request']);
    });
  });
});

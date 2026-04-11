import {Injectable, inject} from '@angular/core';
import {AuthService} from './auth.service';
import {UserService} from '../../features/settings/user-management/user.service';
import {filter, catchError} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class StartupService {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  load(): Promise<void> {
    this.authService.token$
      .pipe(filter(t => !!t))
      .subscribe(() => {
        this.userService.getMyself()
          .pipe(catchError(() => of(null)))
          .subscribe();
      });

    return Promise.resolve();
  }
}

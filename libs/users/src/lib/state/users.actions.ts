import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const buildUserSession = createAction('[Users] Build user session');

export const buildUserSessionSuccess = createAction(
  '[Users] Build user session Success',
  props<{ user: User }>()
);

export const buildUserSessionFailed = createAction('[Users] Build user session Failed');

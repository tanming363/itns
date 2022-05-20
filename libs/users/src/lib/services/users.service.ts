import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, retry } from 'rxjs';
import { environment } from "@env/environment";
import { User } from '../models/user.model';
import * as countriesLib from 'i18n-iso-countries';
import { UsersFacade } from '../state/users.facade';

declare const require: (arg0: string) => countriesLib.LocaleData;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiURLUser = environment.url + 'users';

  constructor(private http: HttpClient, private usersFacade: UsersFacade) {
    countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUser)
      .pipe(
        retry(5),
        map((data) => data)
      );
  }

  getUser(UserId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUser}/${UserId}`)
      .pipe(
        retry(5),
        map((data) => data)
      );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURLUser, user);
  }

  updateUser(user: User): Observable<object> {
    return this.http.put<object>(`${this.apiURLUser}/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLUser}/${userId}`);
  }

  getCountries(): { id: string, name: string }[] {
    return Object.entries(countriesLib.getNames("en", { select: "official" })).map(entry => {
      return {
        id: entry[0],
        name: entry[1],
      }
    })
  }

  getCountry(countryKey: string): string {
    return countriesLib.getName(countryKey, 'en')
  }


  getUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiURLUser}/get/count`)
      .pipe(
        map((totalusers: any) => totalusers.userCount)
      );
  }

  initAppSession() {
    this.usersFacade.buildUserSession();
  }

  observeCurrentUser() {
    return this.usersFacade.currentUser$;
  }

  isCurrentUserAuth() {
    return this.usersFacade.isAuthenticated$;
  }


}

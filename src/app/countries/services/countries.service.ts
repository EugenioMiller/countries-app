import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { Country } from '../interfaces/country';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1';
  private apiUrlCountry: string = 'https://restcountries.com/v3.1/name';
  private apiUrlRegion: string = 'https://restcountries.com/v3.1/region';

  constructor(private http: HttpClient) {}

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`;

    return this.http.get<Country[]>(url).pipe(
      map((countries) => (countries.length > 0 ? countries[0] : null)), //Si hay elementos en el attay, devuelve el primero, sino retorna null
      catchError(() => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;

    return this.http.get<Country[]>(url).pipe(catchError(() => of([]))); //El argumneto del pipe captura el error y devuelve en arreglo vacío
  }

  searchCoutry(term: string): Observable<Country[]> {
    const url = `${this.apiUrlCountry}/${term}`;

    return this.http.get<Country[]>(url).pipe(catchError(() => of([]))); //El argumneto del pipe captura el error y devuelve en arreglo vacío
  }

  searchRegion(region: string): Observable<Country[]> {
    const url = `${this.apiUrlRegion}/${region}`;

    return this.http.get<Country[]>(url).pipe(catchError(() => of([])));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1';
  private apiUrlCountry: string = 'https://restcountries.com/v3.1/name';
  private apiUrlRegion: string = 'https://restcountries.com/v3.1/region';

  public cacheStore: CacheStore = {
    byCapital: { term:'', countries: [] },
    byCountries: { term:'', countries: [] },
    byRegion: { region:'', countries: [] }
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem( 'cacheStore', JSON.stringify(this.cacheStore) );
  }

  private loadFromLocalStorage() {
    if ( !localStorage.getItem('cacheStore') ) return;

    this.cacheStore = JSON.parse( localStorage.getItem('cacheStore')! );
  }

  private getCountryByUrl( url: string ): Observable<Country[]>{
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(() => of([])),
        //delay(2000)
      );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`;

    return this.http.get<Country[]>(url).pipe(
      map((countries) => (countries.length > 0 ? countries[0] : null)), //Si hay elementos en el attay, devuelve el primero, sino retorna null
      catchError(() => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;

    return this.getCountryByUrl(url) //El argumneto del pipe captura el error y devuelve en arreglo vacío
    .pipe(
      tap( countries => this.cacheStore.byCapital = { term, countries }),
      tap( () => this.saveToLocalStorage() ),
    );
  }

  searchCoutry(term: string): Observable<Country[]> {
    const url = `${this.apiUrlCountry}/${term}`;

    return this.getCountryByUrl(url)
    .pipe(
      tap( countries => this.cacheStore.byCountries = { term, countries }),
      tap( () => this.saveToLocalStorage() ),
    );
  }

  searchRegion(region: Region): Observable<Country[]> {
    const url = `${this.apiUrlRegion}/${region}`;

    return this.getCountryByUrl(url)
    .pipe(
      tap( countries => this.cacheStore.byRegion = { region, countries }),
      tap( () => this.saveToLocalStorage() ),
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BtdUser} from "./auth.service";


export interface Result {
  id: number;
  date: string; // LocalDate from Java will be serialized as string
  confidence: number;
  classification: string;
  modelUsed: string;
  notes: string;
  patient: BtdUser;
  doctor: BtdUser;
}


export interface ResultRequest {
  confidence: number;
  classification: string;
  modelUsed: string;
  notes: string;
  patientEmbg: string;
  doctorEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private readonly baseUrl = 'http://localhost:8080/result'; // Adjust port as needed

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Get all results for a specific doctor by username
   * @param username - Doctor's username
   * @returns Observable<Result[]>
   */
  getDoctorResults(username: string): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.baseUrl}/doctor/${username}`);
  }

  /**
   * Get all results for a specific patient by username
   * @param username - Patient's username
   * @returns Observable<Result[]>
   */
  getPatientResults(username: string): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.baseUrl}/patient/${username}`);
  }

  /**
   * Save a new result
   * @param resultRequest - The result data to save
   * @returns Observable<Result>
   */
  saveResult(resultRequest: ResultRequest): Observable<Result> {
    return this.http.post<Result>(`${this.baseUrl}/save`, resultRequest, this.httpOptions);
  }

  /**
   * Alternative method to save result with individual parameters
   * @param confidence - Confidence level
   * @param classification - Classification result
   * @param modelUsed - Model used for detection
   * @param notes - Additional notes
   * @param patientEmbg - Patient ID
   * @param doctorEmail - Doctor ID
   * @returns Observable<Result>
   */
  createResult(
    confidence: number,
    classification: string,
    modelUsed: string,
    notes: string,
    patientEmbg: string,
    doctorEmail: string
  ): Observable<Result> {
    const resultRequest: ResultRequest = {
      confidence,
      classification,
      modelUsed,
      notes,
      patientEmbg,
      doctorEmail
    };
    return this.saveResult(resultRequest);
  }
}

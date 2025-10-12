import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Result, ResultRequest} from "./result.service";

// Define interfaces for type safety
export interface PredictResponse {
  model: string;
  prediction: string;
  confidence: number;
}

export interface PredictRequest{
  file: File;
  model_type: string;
}


@Injectable({
  providedIn: 'root'
})
export class ExternalModelsService {
  private apiUrl = 'http://192.168.100.244:8000';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  //  Check result

  predict(formData: FormData): Observable<PredictResponse> {
    return this.http.post<PredictResponse>(`${this.apiUrl}/predict`, formData);
  }

}

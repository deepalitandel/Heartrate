import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    constructor(private httpService: HttpClient) { }
    postFile(fileToUpload: File): Observable<boolean> {
        const endpoint = 'http://localhost:3000/api/heartrate/uploadcsv';
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        console.log(formData);
        return this.httpService
            .post(endpoint, formData).pipe(
                map(() => { return true; }));
    }
    getAverage(): Observable<any> {
        const endpoint = 'http://localhost:3000/api/heartrate/getaverage';

        return this.httpService
            .get(endpoint).pipe(
                map((res) => {
                    console.log(res)
                    return res;
                }));
    }

}

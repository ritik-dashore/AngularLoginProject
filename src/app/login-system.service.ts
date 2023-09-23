import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginSystemService {

  constructor(private http:HttpClient) { }
  url:any ="http://localhost:3000/users"

  submit(data:any){
    return this.http.post(this.url, data);
  }
  getData(){
    return this.http.get(this.url)
  }
  editUSer(id:any){
    return this.http.get(`${this.url}/${id}`)
  }
  updateUser(data:any, id:any){
    return  this.http.put(`${this.url}/${id}`, data )
  }
  deletUser(id:any){
    return this.http.delete(`${this.url}/${id}`)
  }
  updatePassword(data:any, id:any){
    return this.http.patch(`${this.url}/${id}`, data)
  }
}

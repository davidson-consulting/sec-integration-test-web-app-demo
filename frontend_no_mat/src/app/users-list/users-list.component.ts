import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService } from 'src/app/services/api-helper.service';

export class User {
  constructor(
    public id: number,
    public lastname: string,
    public firstname: string,
    public age: number,
  ) {}
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  dataSource: User[] = [];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    const resquest: Observable<any> = this.http.get('http://localhost:3000/users', { observe: 'response' });
    resquest.toPromise().then(response => this.dataSource = response.body);
  }

  ngAfterViewInit() { }

}
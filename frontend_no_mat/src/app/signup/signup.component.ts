import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHelperService } from '../services/api-helper.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private api: ApiHelperService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  signup(): void {
    const lastname: string = (document.getElementById('lastname') as HTMLInputElement).value;
    const firstname: string = (document.getElementById('firstname') as HTMLInputElement).value;
    const age: string = (document.getElementById('age') as HTMLInputElement).value;
    this.api.request({
      endpoint: '/users',
      method: 'POST',
      data: {
        lastname, firstname, age
      }
    }).then(response => this.router.navigate(['/login']));
  }
  
  back(): void {
    console.log('back');
    this.router.navigate(['login']);
  }
}

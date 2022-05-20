import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@itns/users';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  show = false;

  constructor(
    private userService: UsersService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getUsersList();
  }

  getUsersList() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    })
  }

  onEditUser(usersId: string) {
    this.router.navigateByUrl(`users/form/${usersId}`);
  }

  timer() {
    this.show = true;
    setTimeout(() => {
      this.getUsersList();
      this.show = false;
    }, 1500);
  }

  onDeleteUser(usersId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this user?',
      header: 'Delete user',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(usersId)
          .subscribe({
            next: () => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'user is deleted' }),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'user is not deleted' }),
            complete: () => console.info('complete', this.timer())
          })
      }
    });
  }

}

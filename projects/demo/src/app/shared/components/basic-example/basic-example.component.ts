import { Component } from '@angular/core';
import { Ng2SmartTableSettings } from 'ng2-smart-table';

@Component({
  selector: 'basic-example',
  template: `
    <ng2-smart-table [settings]="settings"></ng2-smart-table>
  `,
})
export class BasicExampleComponent {

  settings: Ng2SmartTableSettings = {
    columns: {
      id: {
        title: 'ID',
        width: '100px',
      },
      name: {
        title: 'Full Name',
        width: '40%',
      },
      username: {
        title: 'User Name',
      },
      email: {
        title: 'Email',
      },
    },
  };

}

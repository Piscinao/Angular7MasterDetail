import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntriesRoutingModule } from './entries-routing.module';
import { EntryListComponent } from './entry-list/entry-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EntryFormComponent } from './entry-form/entry-form.component';

import { CalendarModule} from 'primeng/calendar';
import { IMaskModule } from 'angular-imask';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    IMaskModule,
    EntriesRoutingModule
  ],
  declarations: [
    EntryListComponent,
    EntryFormComponent
  ]
})
export class EntriesModule { }

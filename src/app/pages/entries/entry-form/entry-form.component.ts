import { Component, OnInit } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import toastr from 'toastr';

import {switchMap} from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { EntryService } from '../shared/entry.service.ts.service';


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder

  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }


  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == 'new') { 
    this.createEntry();
    } else {
    this.updateEntry();
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
    this.currentAction = 'new';
    } else {
    this.currentAction = 'edit';
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry); // binds entry loader data to entryForm

        },
        (error) => alert('Erro no sv, tente mais tarde')
      );
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new') {
    this.pageTitle = 'Cadastro de Novo Lançamento';
    } else {
    const entryName = this.entry.name || '';
    this.pageTitle = 'Editando Lançamento: ' + entryName;
  }
}

private createEntry() {
  const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
  this.entryService.create(entry)
  .subscribe(
    entry => this.actionsForSuccess(entry),
    error => this.actionsForError(error)
  );
}

private updateEntry() {
  const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

  this.entryService.update(entry)
  .subscribe(
    entry => this.actionsForSuccess(entry),
    error => this.actionsForError(error)
  );

}
  actionsForError(error) {
  toastr.error('Ocorreu um erro ao processar a sua solicitação');
  this.submittingForm = false;

  if (error.status === 422) {
     this.serverErrorMessages = JSON.parse(error._body).errors;
  } else {
    this.serverErrorMessages = ['Falha na comunicação com o'];
  }


  }
  actionsForSuccess(entry: Entry) {
    toastr.success("Solicitacao processada com sucesso");
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    );
  }


}

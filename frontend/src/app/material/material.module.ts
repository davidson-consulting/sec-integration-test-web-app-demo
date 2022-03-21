import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

const MATERIAL_MODULES = [
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ...MATERIAL_MODULES
    ],
    exports: [
        ...MATERIAL_MODULES
    ]
})
export class MaterialModule {
}
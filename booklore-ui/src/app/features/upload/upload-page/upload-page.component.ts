import {Component, inject} from '@angular/core';
import {DialogLauncherService} from '../../../shared/services/dialog-launcher.service';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss'],
  standalone: true
})
export class UploadPageComponent {

  private dialogLauncher = inject(DialogLauncherService);
  isDragOver = false;

  openUploader(): void {
    this.dialogLauncher.openFileUploadDialog();
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    this.dialogLauncher.openBookUploaderDialog();
  }
}

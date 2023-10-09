import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  fileToUpload: File | null = null;
  dataSource: [];
  displayedColumns: string[];
  isUploaded: boolean = false;

  @ViewChild('myInput',{
    read: false,
    static: false
  })
  myInputVariable: ElementRef;

  constructor(private fileUploadService: FileUploadService) { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload.name.includes('.xls')) {
      this.isUploaded = true;
    } else {
      alert('Please upload excel file only!!');
    }

  }
  uploadFileToActivity() {
    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
      alert('File is uploaded successfully!!');
    }, error => {
      console.log(error);
    });
    this.isUploaded = false;
    this.myInputVariable.nativeElement.value = "";
  }
  calculateAverage() {
    this.fileUploadService.getAverage().subscribe(data => {
      this.dataSource = data;
      this.displayedColumns = Object.keys(data[0]);
    }, error => {
      console.log(error);
    });
  }
}

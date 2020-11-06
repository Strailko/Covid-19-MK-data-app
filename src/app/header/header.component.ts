import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  status = 'not-active';

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  toggleColor() {
    if(this.status === 'not-active') {
      this.status = 'active';
    }
    else if(this.status === 'active') {
      this.status = 'not-active';
    }
  }

  toggleSnackbar() {
    this.openSnackBar("Share", "Copy url").onAction().subscribe(() => {
      this.copyToClipboard(window.location);
    });
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    let config = new MatSnackBarConfig();
    config.horizontalPosition = this.horizontalPosition;
    return this.snackBar.open(message, action, {
    });
  }

  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

}

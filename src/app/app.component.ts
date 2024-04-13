import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush, SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'coffeelog';

  constructor(private snackBar: MatSnackBar, 
              private swUpdate: SwUpdate,
              private swPush: SwPush) {

  }

  registerForPush(){
    if(this.swPush.isEnabled){
      Notification.requestPermission(permission => {
        if(permission == 'granted'){
          this.swPush.requestSubscription({
            serverPublicKey: "BG-LYXWZTwfDIOI093l8WkMMifGVHAtK91D5L4tk8D0GtGYLRZ0WkSEOY0noOLPRWYTZU9PT-QbNhI7m6ZFYYk8"
          }).then(registration => {
            console.log(registration)
          })
        }
      })
      
    }
  }

  updateNetworkStatusUI() {
    if (navigator.onLine) {
      // false positives, careful
      (document.querySelector("body") as any).style = "";
    } else {
      // we are offline
      (document.querySelector("body") as any).style = "filter: grayscale(1)";
    }
  }

  ngOnInit() {

    this.updateNetworkStatusUI();
    window.addEventListener("online", this.updateNetworkStatusUI);
    window.addEventListener("offline", this.updateNetworkStatusUI);

    if(this.swUpdate.isEnabled){
      this.swUpdate.checkForUpdate();
      this.swUpdate.versionUpdates.subscribe(update => {
        if(update.type=='VERSION_READY'){
          const sb = this.snackBar.open('You want update the new version?', 'Install Now', {duration: 4000})
          sb.onAction().subscribe(() => {
            location.reload()
          })
        }
      })
    }

    if (window.matchMedia('(display-mode: browser').matches) {
      // We are in the browser
      if ('standalone' in navigator) {
        // only available in Safari
        this.snackBar.open("You can install this app, use Share > Add to Home Screen", 
            "", { duration: 3000 })
      } else {
        // it's not Safari
        window.addEventListener("beforeinstallprompt", event => {
          event.preventDefault();
          const sb = this.snackBar.open("You can install this app",
            "Install", { duration: 5000 });
          sb.onAction().subscribe( () => {
             (event as any).prompt();
             (event as any).userChoice.then( (result: any) => {
                if (result.outcome == "dismissed") {
                  // TODO:
                } else {
                  // TODO:
                }
             })
          });
        })
      }
    }
  }


}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UIService {

  constructor() { }

  setTitle(title: string) {
    document.title = title;
  }

  setThemeColor(color: string) {
    const meta = document.querySelector("meta[name=theme-color]") as any;
    meta.content = color;
  }
}

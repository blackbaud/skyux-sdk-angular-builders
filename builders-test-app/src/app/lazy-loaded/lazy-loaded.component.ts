import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-lazy-loaded',
  template: `
  Lazy loaded!
  <img src="assets/image-2.png">
  `
})
export class LazyLoadedComponent { }

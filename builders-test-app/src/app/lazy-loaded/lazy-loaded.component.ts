import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-lazy-loaded',
  template: `
<p>Lazy loaded!</p>
<img src="assets/bb-image.jpg">
`
})
export class LazyLoadedComponent { }

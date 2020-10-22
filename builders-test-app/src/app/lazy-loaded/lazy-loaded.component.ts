import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-lazy-loaded',
  template: `
<p>Lazy loaded!</p>
<h3>Image 1, lazy</h3>
<img src="assets/bb-image-1.jpg">

<h3>Image 2, lazy</h3>
<img src="assets/bb-image-2.png">
`
})
export class LazyLoadedComponent { }

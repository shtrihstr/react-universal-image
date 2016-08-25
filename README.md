# React Universal Image

![react-universal-image](https://cloud.githubusercontent.com/assets/11991783/17969114/bcd02ec6-6ad0-11e6-8dd4-34aa410863c2.gif)

## Features
* Lazy load
* Placeholder
* Progressive image loading (as on Medium.com) 
* Image error fallback


## Installation

## Usage
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Image from 'react-universal-image';

const App = () => {
    
    return (
        <div>
            <image
                src="img-400x200.jpg"
                srcSet="img-400x200.jpg 400w, img-800x400.jpg 800w"
                placeholder="img-20x10.jpg"
                ratio={2}
                fallback="image-not-found.jpg"
                className="post-image"
            />
        </div>
    );
};

ReactDOM.render(<App />, document.body);
```

## Props

### src
Type: String, Default: undefined, Required

Required property. Sets the [src](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-src) attribute of an image. 

```jsx
<Image src="img.jpg" />
```

### srcSet
Type: String, Default: undefined

Sets the [srcset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset) attribute of an image. 

```jsx
<Image src="img-800x400.jpg" srcSet="img-400x200.jpg 400w, img-800x400.jpg 800w" />
```

### placeholder
Type: String/Node, Default: undefined

Specify a placeholder image URL or Component for lazy loaded image.

```jsx
<Image src="img-800x400.jpg" placeholder="img-20x10.jpg" />
<Image src="img-800x400.jpg" placeholder="="data:image/jpeg;base64,/..." />
<Image src="img-800x400.jpg" placeholder={<span>loading...</span>} />
```

### blur
Type: Number, Default: 3

Specify a blur level of a placeholder image. Set `0` to disable blurring.   
**NOTISE** Works only if placeholder was defined as image URL

```jsx
<Image src="img-800x400.jpg" placeholder="img-20x10.jpg" blur={1} />
```

### ratio
Type: Number, Default: undefined

```jsx
<Image src="img-800x400.jpg" ratio={2.0} />
<Image src="img-800x400.jpg" ratio={800/400} />
<Image src={this.pops.src} ratio={this.pops.width / this.pops.height} />
```

### debounce
Type: Number, Default: 200

```jsx
<Image src="img.jpg" debounce={1000} />
```

### animationSpeed
Type: Number, Default: 400

```jsx
<Image src="img-800x400.jpg" placeholder="img-20x10.jpg" animationSpeed={800} />
```

### fallback
Type: String, Default: undefined

```jsx
<Image src="img.jpg" fallback="image-not-found.jpg" />
```

### maxWidth
Type: Number/String, Default: undefined

```jsx
<Image src="img.jpg" maxWidth="200px" />
<Image src="img.jpg" maxWidth={200} />
<Image src="img.jpg" maxWidth="50%" />
```

### inline
Type: Bool, Default: false

```jsx
<Image src="img.jpg" maxWidth="50%" inline />
```

### id
Type: String, Default: undefined

```jsx
<Image src="img.jpg" id="image_1" />
```

### className
Type: String, Default: undefined

```jsx
<Image src="img.jpg" className="post-image" />
```

### alt
Type: String, Default: undefined

Sets the [alt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-alt) attribute of an image and placeholder. 

```jsx
<Image src="img.jpg" alt="Nature" />
```


### crossOrigin
Type: String, Default: undefined

Sets the [crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin) attribute of an image and placeholder. 

```jsx
<Image src="img.jpg" crossorigin="anonymous" />
```

### sizes
Type: String, Default: undefined

Sets the [sizes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes) attribute of an image. 

```jsx
<Image src="img-800x400.jpg" srcSet="img-400x200.jpg 400w, img-800x400.jpg 800w" sizes="(max-width: 800px) 100vw, 800px" />
```






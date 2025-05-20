[![Debugging Visualizations (ScrollView) | scribeocr-docs](https://tse1.mm.bing.net/th?id=OIP.XvHMpL2jJ-Y3-1EexYBwawHaCX\&pid=Api)](https://docs.scribeocr.com/scrollview_debug.html)

Certainly! Here's a comprehensive guide to using `scribe.js-ocr`, a JavaScript library for Optical Character Recognition (OCR) and text extraction from images and PDFs. This documentation is tailored for AI agents operating in offline environments, providing detailed insights into the API, usage patterns, common pitfalls, and best practices.

---

## 📦 Overview

**Scribe.js** is a JavaScript library designed to perform OCR and extract text from images and PDFs. It supports:

* **Text Recognition**: Extract text from images.
* **PDF Processing**: Handle both text-based and image-based PDFs.
* **Searchable PDFs**: Generate PDFs with invisible text layers for searchability.



---

## 🚀 Installation

Install via npm:

```bash
npm install scribe.js-ocr
```

Import the library:

```javascript
// For Node.js
import scribe from 'scribe.js-ocr';

// For browser (ensure same-origin policy)
import scribe from 'node_modules/scribe.js-ocr/scribe.js';
```

> **Note**: When using in the browser, all files must be served from the same origin. Importing from a CDN is not supported.

---

## 🧪 Basic Usage

Extract text from an image:

```javascript
scribe.extractText(['https://example.com/image.png'])
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

Process a local PDF file:

```javascript
import fs from 'fs';

const pdfBuffer = fs.readFileSync('document.pdf');
scribe.extractText([pdfBuffer])
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

---

## 🧰 API Reference

### `scribe.extractText(sources, options)`

* **Parameters**:

  * `sources` (Array): List of image URLs, file paths, or buffers.
  * `options` (Object, optional): Configuration options.

* **Returns**: `Promise<Array>`: Resolves with an array of extracted text results.

* **Example**:

  ```javascript
  scribe.extractText(['image1.png', 'image2.jpg'], { lang: 'eng' })
    .then((results) => {
      results.forEach((text, index) => {
        console.log(`Text from image ${index + 1}:`, text);
      });
    });
  ```

---

## ⚙️ Configuration Options

* `lang` (string): Language code for OCR (e.g., `'eng'`, `'fra'`). Default is `'eng'`.
* `pdfOptions` (object): Options for PDF processing.

  * `addTextLayer` (boolean): Add invisible text layer to PDFs. Default is `false`.
* `preprocess` (boolean): Apply preprocessing steps like auto-rotation. Default is `true`.

---

## 🧪 Advanced Features

### Generating Searchable PDFs

Create a PDF with an invisible text layer:

```javascript
scribe.extractText(['scanned.pdf'], { pdfOptions: { addTextLayer: true } })
  .then((res) => {
    // res contains the searchable PDF
  });
```

### Debugging Visualizations

Enable visual debugging to inspect OCR processing steps:

1. Access the debugging interface.
2. Navigate to `Info` → `Debugging Visualizations` → `Enable ScrollView`.
3. Run the OCR process to view visual overlays.



---

## ⚠️ Common Pitfalls & Gotchas

### 1. **Same-Origin Policy in Browsers**

When using `scribe.js-ocr` in the browser, ensure all files are served from the same origin. Importing the library from a CDN will not work due to the lack of a UMD build.



### 2. **Image Quality**

OCR accuracy heavily depends on image quality. For optimal results:

* Use images with a resolution of at least 300 DPI.
* Ensure text is clear and not distorted.
* Avoid images with complex backgrounds.



### 3. **Language Support**

While `scribe.js-ocr` supports multiple languages, some languages may require additional trained data. Ensure the necessary language data is available and specified in the `lang` option.

---

## ✅ Best Practices

* **Preprocessing**: Apply image preprocessing techniques like binarization, noise reduction, and deskewing to improve OCR accuracy.

* **Batch Processing**: Process multiple images or pages in batches to optimize performance.

* **Error Handling**: Implement robust error handling to manage issues like unsupported file formats or missing language data.

* **Testing**: Regularly test OCR outputs against known ground truths to assess accuracy and make necessary adjustments.

---

## 📚 Additional Resources

* **Official Repository**: [scribeocr/scribe.js](https://github.com/scribeocr/scribe.js/)
* **Web Interface**: [Scribe OCR](https://scribeocr.com/)
* **Documentation**: [Scribe OCR Docs](https://docs.scribeocr.com/)

---

Feel free to reach out if you need further assistance or examples tailored to specific use cases!

const PDFDocument = require('pdfkit');
const fs = require('fs');
const _ = require('lodash')


const dr = fs.readdirSync('./xx')

for (let d of dr) {
    const doc = new PDFDocument();
    const fel = fs.readFileSync('./xx/' + d).toString('utf-8')

    const file = _.shuffle(fel.split(' ')).join(' ')

    doc
        .fontSize(25)
        .text(file, 100, 100);

    doc.pipe(fs.createWriteStream('./xpdf/' + d.split('.')[0] + _.random(1000, 9999) + '.pdf'));
    doc.end();
}


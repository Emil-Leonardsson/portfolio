(function () {
  function slugify(text) {
    return text.toLowerCase()
      .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function buildPDF(canvasEl) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: 'pt', format: 'a4' });
    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();
    var margin = 50;
    var maxWidth = pageWidth - margin * 2;
    var y = margin;

    var docTitle = canvasEl.getAttribute('data-pdf-title') || 'Mall';
    var introEl = canvasEl.querySelector('.tmpl-header p');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    var titleLines = doc.splitTextToSize(docTitle, maxWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 20 + 6;

    if (introEl && introEl.textContent.trim()) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10.5);
      doc.setTextColor(90, 90, 90);
      var introLines = doc.splitTextToSize(introEl.textContent.trim(), maxWidth);
      doc.text(introLines, margin, y);
      y += introLines.length * 13 + 16;
      doc.setTextColor(0, 0, 0);
    }

    doc.setDrawColor(210, 210, 210);
    doc.line(margin, y, pageWidth - margin, y);
    y += 22;

    var cells = canvasEl.querySelectorAll('.tmpl-cell');
    cells.forEach(function (cell) {
      var titleEl = cell.querySelector('h5');
      var promptEl = cell.querySelector('.tmpl-prompt');
      var textarea = cell.querySelector('textarea.tmpl-write');
      var title = titleEl ? titleEl.textContent.trim() : '';
      var prompt = promptEl ? promptEl.textContent.trim() : '';
      var value = textarea ? textarea.value.trim() : '';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12.5);
      var titleWrapped = doc.splitTextToSize(title, maxWidth);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      var promptWrapped = prompt ? doc.splitTextToSize(prompt, maxWidth) : [];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      var bodyWrapped = value ? doc.splitTextToSize(value, maxWidth) : [];

      var neededHeight = titleWrapped.length * 15
        + promptWrapped.length * 12
        + Math.max(bodyWrapped.length, 1) * 14 + 26;

      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12.5);
      doc.setTextColor(30, 42, 50);
      doc.text(titleWrapped, margin, y);
      y += titleWrapped.length * 15 + 2;

      if (promptWrapped.length) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(110, 110, 110);
        doc.text(promptWrapped, margin, y);
        y += promptWrapped.length * 12 + 6;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      if (bodyWrapped.length) {
        doc.text(bodyWrapped, margin, y);
        y += bodyWrapped.length * 14;
      } else {
        doc.setTextColor(170, 170, 170);
        doc.text('—', margin, y);
        doc.setTextColor(0, 0, 0);
        y += 14;
      }
      y += 18;
    });

    doc.save(slugify(docTitle) + '.pdf');
  }

  document.querySelectorAll('.tmpl-pdf-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var canvasEl = document.getElementById(btn.getAttribute('data-canvas'));
      if (canvasEl) buildPDF(canvasEl);
    });
  });
})();

import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InvoiceService } from '../../core/invoice.service';
import { Invoice } from '../../core/models';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-invoice-print',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DecimalPipe],
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.css']
})
export class InvoicePrintComponent {
  invoice?: Invoice;
  today = new Date();
  
  private decimalPipe = inject(DecimalPipe);

  constructor(route: ActivatedRoute, private svc: InvoiceService) {
    const id = Number(route.snapshot.paramMap.get('id'));
    if (id) {
      this.svc.get(id).subscribe(inv => this.invoice = inv);
    }
  }

  print() { window.print(); }

  downloadPDF() {
    if (!this.invoice) return;

    const doc = new jsPDF();
    const inv = this.invoice;

    // Header
    doc.setFontSize(20);
    doc.text('MINI ERP - FACTURE', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Facture #: ${inv.id}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);

    // Client
    doc.setFontSize(12);
    doc.text('Client:', 20, 60);
    doc.setFontSize(10);
    doc.text(`${inv.order?.customer?.nom || '-'}`, 20, 65);
    doc.text(`${inv.order?.customer?.email || '-'}`, 20, 70);
    doc.text(`${inv.order?.customer?.adresse || '-'}`, 20, 75);

    // Table
    const tableData = (inv.order?.items || []).map(it => [
      it.product.nom,
      it.quantity.toString(),
      this.decimalPipe.transform(it.product.prix, '1.0-2') + ' TND',
      this.decimalPipe.transform((it.product.prix || 0) * it.quantity, '1.0-2') + ' TND'
    ]);

    autoTable(doc, {
      startY: 85,
      head: [['Produit', 'Quantité', 'Prix HT', 'Total HT']],
      body: tableData,
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Total HT: ${this.decimalPipe.transform(inv.montant, '1.0-2')} TND`, 140, finalY);
    doc.text(`TVA (19%): ${this.decimalPipe.transform((inv.montant || 0) * 0.19, '1.0-2')} TND`, 140, finalY + 5);
    doc.setFontSize(12);
    doc.text(`Total TTC: ${this.decimalPipe.transform((inv.montant || 0) * 1.19, '1.0-2')} TND`, 140, finalY + 12);

    doc.save(`Facture_${inv.id}.pdf`);
  }
}

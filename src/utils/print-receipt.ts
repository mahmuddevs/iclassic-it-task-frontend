import type { SaleDoc } from "../types/sales-types";

export function handlePrintReceipt(sale: SaleDoc, operatorName: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Set the document title
  printWindow.document.title = `Receipt - ${sale.invoiceId}`;

  // Create style element for the receipt print layout
  const styleEl = printWindow.document.createElement("style");
  styleEl.textContent = `
    @media print {
      body {
        margin: 0;
        padding: 10px;
      }
    }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      line-height: 1.4;
      color: #000;
      max-width: 300px;
      margin: 0 auto;
      padding: 15px;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .bold { font-weight: bold; }
    .divider { border-top: 1px dashed #000; margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 5px; }
    th, td { padding: 4px 0; font-size: 13px; vertical-align: top; }
    .header-title { font-size: 16px; font-weight: bold; margin-bottom: 2px; }
    .receipt-details { font-size: 12px; margin-bottom: 5px; }
    .footer { font-size: 11px; margin-top: 20px; text-align: center; }
  `;
  printWindow.document.head.appendChild(styleEl);

  // Set the print body contents directly
  printWindow.document.body.innerHTML = `
    <div class="text-center header-title">iCLASSIC IT ERP</div>
    <div class="text-center font-semibold">Sales Transaction</div>
    <div class="divider"></div>
    <div class="receipt-details">
      <div><b>Invoice ID:</b> ${sale.invoiceId}</div>
      <div><b>Date:</b> ${new Date(sale.createdAt).toLocaleString()}</div>
      <div><b>Operator:</b> ${operatorName}</div>
    </div>
    <div class="divider"></div>
    <table>
      <thead>
        <tr style="border-bottom: 1px dashed #000;">
          <th align="left">Item</th>
          <th align="center">Qty</th>
          <th align="right">Price</th>
          <th align="right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${sale.products
      .map(
        (item) => `
          <tr>
            <td>${item.product?.name || "Deleted Product"}</td>
            <td align="center">${item.quantity}</td>
            <td align="right">$${item.unitPrice.toFixed(2)}</td>
            <td align="right">$${(item.quantity * item.unitPrice).toFixed(2)}</td>
          </tr>
        `
      )
      .join("")}
      </tbody>
    </table>
    <div class="divider"></div>
    <table>
      <tr>
        <td><b>Grand Total:</b></td>
        <td align="right" class="bold">$${sale.grandTotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Paid Amount:</td>
        <td align="right">$${sale.paidAmount.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Change Given:</td>
        <td align="right">$${sale.changeAmount.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Due Amount:</td>
        <td align="right" class="bold ${sale.dueAmount > 0 ? "text-red-500" : ""}">$${sale.dueAmount.toFixed(2)}</td>
      </tr>
    </table>
    <div class="divider"></div>
    <div class="text-center footer">
      Thank you for shopping with us!<br>
      Please retain receipt for verification.<br>
      Have a wonderful day!
    </div>
  `;

  // Trigger browser print and close dialog
  printWindow.print();
  printWindow.close();
}

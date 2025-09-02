// components/pdf/OrderInvoicePDF.js
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../assets/Group 468.png";

// 1) Import local fonts that include the ₹ glyph
import NotoSansRegular from "../../assets/fonts/NotoSans-Regular.ttf";
import NotoSansBold from "../../assets/fonts/NotoSans-Bold.ttf";

// 2) Register a dedicated family ONLY for the ₹ glyph
Font.register({
  family: "RupeeFont",
  fonts: [
    { src: NotoSansRegular, fontWeight: "normal" },
    { src: NotoSansBold, fontWeight: "bold" },
  ],
});

// ✅ Your original design stays the same (Helvetica everywhere)
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 11, fontFamily: "Helvetica" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1 solid #000",
    padding: 12,
    marginBottom: 14,
    backgroundColor: "#f9f9f9",
  },
  logo: { width: 70, height: 25 },
  invoiceTitle: { fontSize: 18, fontWeight: "bold", alignSelf: "center" },

  // Section
  sectionBox: {
    border: "1 solid #000",
    padding: 12,
    marginBottom: 12,
  },
  label: { fontWeight: "bold", fontSize: 12, marginBottom: 3 },
  text: { fontSize: 11 },

  // Two-column layout
  row: { flexDirection: "row", justifyContent: "space-between" },
  col: { width: "48%" },

  // Table
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 18,
  },
  tableRow: { flexDirection: "row" },
  tableHeaderCell: {
    borderStyle: "solid",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    backgroundColor: "#f2f2f2",
    fontSize: 12,
    fontWeight: "bold",
    padding: 7,
    textAlign: "center",
  },
  tableCell: {
    borderStyle: "solid",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    fontSize: 11,
    padding: 7,
  },
  productCol: { flex: 3 },
  qtyCol: { flex: 1, textAlign: "center" },
  sizeCol: { flex: 1, textAlign: "center" },
  priceCol: { flex: 1, textAlign: "right" },
  totalCol: { flex: 1.2, textAlign: "right" },

  // Alternate row styling
  oddRow: { backgroundColor: "#ffffff" },
  evenRow: { backgroundColor: "#f9f9f9" },

  // Totals
  totalBox: {
    border: "1 solid #000",
    padding: 12,
    marginTop: 12,
  },
  totalText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 4,
  },

  // Footer
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: "center",
    borderTop: "1 solid #000",
    paddingTop: 8,
  },

  // Inline styles specifically for the ₹ glyph
  rupee: { fontFamily: "RupeeFont", fontWeight: "normal" },
  rupeeBold: { fontFamily: "RupeeFont", fontWeight: "bold" },
});

const OrderInvoicePDF = ({ order }) => {
  console.log(order);
  
  return (
    <Document>
      <Page style={styles.page}>
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
        </View>

        {/* ---------- CUSTOMER & SELLER ---------- */}
        <View style={[styles.sectionBox, styles.row]}>
          <View style={styles.col}>
            <Text style={styles.label}>Bill To:</Text>
            <Text style={styles.text}>{order.shippingAdress?.Name}</Text>
            <Text style={styles.text}>{order.shippingAdress?.phone}</Text>
            <Text style={styles.text}>{order.shippingAdress?.address}</Text>
            <Text style={styles.text}>
              {order.shippingAdress?.city}, {order.shippingAdress?.state}
            </Text>
            <Text style={styles.text}>
              {order.shippingAdress?.country} - {order.shippingAdress?.pincode}
            </Text>
          </View>

     <View style={styles.col}>
  <Text style={styles.label}>Seller:</Text>
  <Text style={styles.text}>GRAZIE, 1st Floor, Gokulam Building</Text>
  <Text style={styles.text}>Near SBI Bank, Elamakkara</Text>
  <Text style={styles.text}>Kochi - 682026</Text>
  <Text style={styles.text}>Phone: 8893804142 / 9567760206</Text>
</View>


        </View>

        {/* ---------- ORDER INFO ---------- */}
        <View style={styles.sectionBox}>
          <Text style={styles.label}>
            Order ID: <Text style={styles.text}>{order.orderId}</Text>
          </Text>
          <Text style={styles.label}>
            Date:{" "}
            <Text style={styles.text}>
              {order.paidAt
                ? new Date(order.paidAt).toLocaleDateString()
                : "N/A"}
            </Text>
          </Text>
          <Text style={styles.label}>
            Status: <Text style={styles.text}>{order.status}</Text>
          </Text>
           <Text style={styles.label}>
            shippingMethod: <Text style={styles.text}>{order.shippingMethod}</Text>
          </Text>
        </View>

        {/* ---------- ITEMS TABLE ---------- */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderCell, styles.productCol]}>
              Product
            </Text>
            <Text style={[styles.tableHeaderCell, styles.qtyCol]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.sizeCol]}>Size</Text>
            <Text style={[styles.tableHeaderCell, styles.priceCol]}>
              Unit Price
            </Text>
            <Text style={[styles.tableHeaderCell, styles.totalCol]}>Total</Text>
          </View>

          {/* Items */}
          {order.orderItems?.map((item, idx) => (
            <View
              style={[
                styles.tableRow,
                idx % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
              key={idx}
            >
              <Text style={[styles.tableCell, styles.productCol]}>
                {item.productName}
              </Text>
              <Text style={[styles.tableCell, styles.qtyCol]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.sizeCol]}>
                {item.sizes || "-"}
              </Text>

              {/* Unit Price (₹ uses RupeeFont inline) */}
              <Text style={[styles.tableCell, styles.priceCol]}>
                <Text style={styles.rupee}>₹</Text> {item.Price}
              </Text>

              {/* Line Total (₹ uses RupeeFont inline) */}
              <Text style={[styles.tableCell, styles.totalCol]}>
                <Text style={styles.rupee}>₹</Text>{" "}
                {(item.Price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* ---------- TOTAL ---------- */}
        <View style={styles.totalBox}>
          {/* Totals text is bold, so use rupeeBold for the glyph */}
          <Text style={styles.totalText}>
            Subtotal: <Text style={styles.rupeeBold}>₹</Text> {order.totalprice}
          </Text>
          <Text style={styles.totalText}>Payment: {order.paymentMethod}</Text>
                    <Text style={styles.totalText}>Status: {order.paymentStatus}</Text>

        </View>

        {/* ---------- FOOTER ---------- */}
        <Text style={styles.footer}>
          Thank you for shopping with us. This is a computer generated invoice
          and does not require a signature.
        </Text>
      </Page>
    </Document>
  );
};

export default OrderInvoicePDF;

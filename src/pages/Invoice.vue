<script setup lang="ts">
import type { InvoiceItem } from "@/interfaces/invoice.interface";
import { toWords } from "to-words";
import { computed, ref } from "vue";
import data from "@/data/data.json";
import { Printer } from "lucide-vue-next";

const date = new Date();
const today = Intl.DateTimeFormat("en-CA").format(date);
const invoiceNumber = ref(
  `FCI/${date.getFullYear() - 1}-${date.getFullYear()}/`,
);

const items = ref<InvoiceItem[]>([]);

const totalAmount = computed(() => {
  const total = items.value.reduce(
    (total, item) => total + item.quantity * item.rate,
    0,
  );
  return parseFloat(total.toFixed(2));
});

const gst = computed(() => parseFloat((totalAmount.value * 0.09).toFixed(2)));

const grossTotal = computed(() =>
  parseFloat((totalAmount.value + gst.value * 2).toFixed(2)),
);

const searchItem = ref("");

const filteredData = computed(() =>
  data.filter((item) => !items.value.map((i) => i.id).includes(item.id)),
);

function handleSelectedItem() {
  const item = data.find((item) => item.id === searchItem.value);
  if (item) {
    items.value.push({
      ...item,
      quantity: 1,
    });
    searchItem.value = "";
  }
  return 0;
}

function removeItem(id: string) {
  items.value = items.value.filter((item) => item.id !== id);
}

function handlePrint() {
  if (items.value.length == 0) {
    alert("Please add some item");
    return;
  }

  document.title = `Invoice-${invoiceNumber.value}`;
  window.print();
  document.title = "Foam Crafts India - ERP";
}

window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
    e.preventDefault();
    (document.getElementById("invoiceForm") as HTMLFormElement).requestSubmit();
  }
});
</script>

<template>
  <form
    id="invoiceForm"
    @submit.prevent="handlePrint"
    class="print:text-black print:bg-white relative flex flex-col min-h-dvh monospace max-w-lg print:max-w-full w-full mx-auto print:border-none"
  >
    <div class="heading text-xl font-bold text-center">Foam Crafts India</div>
    <!-- Address -->
    <div class="text-center font-medium text-xs py-2.5 text-balance">
      Nawrang Plot No. 416NH 56 <br />
      Airport Road (Near K J Hotel) Babatpur Bazar, Varanasi, U.P <br />
      Contacts:
      <a href="tel:7518233001">7518233001</a> /
      <a href="tel:9711534789">9711534789</a> <br />
      Email:
      <a href="mailto:foamcraftsindia01@gmail.com"
        >foamcraftsindia01@gmail.com</a
      >
      <br />
      GSTIN: 09BZQPA8675R1Z5
    </div>

    <div
      class="col-span-full mb-4 uppercase heading text-xl font-bold text-center"
    >
      Tax Invoice
    </div>
    <!-- Invoice Details   -->
    <div class="grid grid-cols-[1fr_max-content] justify-between gap-8">
      <div>
        <h3 class="heading text-sm font-bold text-center mb-3">BILL TO</h3>
        <p>
          <b>Name:</b>
          <input type="text" placeholder="Enter name" required />
        </p>
        <p>
          <b>Address:</b>
          <textarea
            type="text"
            placeholder="Enter address"
            class="print:resize-none w-full h-fit"
            rows="3"
            required
          ></textarea>
        </p>
        <p>
          <b>Vehicle No:</b>
          <input
            type="text"
            class="uppercase print:empty:hidden"
            placeholder="Enter vehicle number"
            minlength="10"
            maxlength="10"
          />
        </p>
        <p>
          <b>GSTIN:</b>
          <input
            type="text"
            class="uppercase print:empty:hidden"
            placeholder="Enter GSTIN"
            minlength="15"
            maxlength="15"
          />
        </p>
      </div>
      <div class="text-sm">
        <p class="mb-2"><b>Date:</b> <input type="date" :value="today" /></p>
        <p>
          <b>Invoice No:</b>
          <input
            type="text"
            v-model="invoiceNumber"
            maxlength="20"
            pattern="(FCI\/\d{4}-\d{4}\/\d+)"
            required
          />
        </p>
      </div>
    </div>

    <datalist id="mattressList">
      <option value="" selected>SELECT</option>
      <option v-for="item in filteredData" :value="item.id" :key="item.id">
        {{ item.description }}
      </option>
    </datalist>

    <!-- Search Input -->
    <div
      class="print:hidden flex gap-4 whitespace-nowrap justify-between items-center mt-2 mb-2"
    >
      <label for="search" class="font-bold"
        >Search product by name of code</label
      >
      <input
        id="search"
        type="text"
        min="1"
        placeholder="HSN Code"
        list="mattressList"
        v-model="searchItem"
        class="w-full outline-none border rounded text-right"
        @change="handleSelectedItem"
      />
    </div>

    <!-- Invoice Items Table -->
    <table class="h-full w-full border-collapse text-xs mt-1">
      <thead>
        <tr class="heading whitespace-nowrap">
          <th class="px-2 py-1">S. No.</th>
          <th class="px-2 py-1">Description</th>
          <th class="px-2 py-1 w-[8ch]">HSN Code</th>
          <th class="px-2 py-1 w-15">Qty</th>
          <th class="px-2 py-1 w-15">Rate</th>
          <th class="px-2 py-1">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="item.hsnCode"
          :class="{
            'h-full align-top': index === items.length - 1,
          }"
        >
          <td class="h-min px-2 py-1">{{ index + 1 }}</td>
          <td class="px-2 py-1">{{ item.description }}</td>
          <td class="px-2 py-1 text-right">
            <input
              type="text"
              min="1"
              placeholder="HSN Code"
              list="hsnCodes"
              :value="item.hsnCode"
              class="w-full outline-none text-right"
            />
          </td>
          <td class="px-2 py-1">
            <input
              type="number"
              min="1"
              v-model="item.quantity"
              class="w-full outline-none text-right"
            />
          </td>
          <td class="px-2 py-1">
            <input
              type="number"
              v-model="item.rate"
              class="w-full outline-none text-right"
            />
          </td>
          <td class="px-2 py-1 text-right">
            {{ (item.quantity * item.rate).toFixed(2) }}
            <button
              type="button"
              @click="removeItem(item.id)"
              class="print:hidden px-2 py-0.5 mt-1 bg-red-500 text-white rounded cursor-pointer"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot class="font-bold">
        <tr>
          <td colspan="4" rowspan="4" class="border px-2 py-1 align-middle">
            <b>Amount in Words:</b> <br />
            {{
              toWords(grossTotal, {
                currency: true,
                localeCode: "en-IN",
              })
            }}
          </td>
          <td class="border px-2 py-1 text-right">Total</td>
          <td class="border px-2 py-1 text-right">₹{{ totalAmount }}</td>
        </tr>
        <tr>
          <td class="border px-2 py-1 text-right">CGST(9%)</td>
          <td class="border px-2 py-1 text-right">₹{{ gst }}</td>
        </tr>
        <tr>
          <td class="border px-2 py-1 text-right">SGST(9%)</td>
          <td class="border px-2 py-1 text-right">₹{{ gst }}</td>
        </tr>
        <tr>
          <td class="border px-2 py-1 text-right whitespace-nowrap">
            Gross Total
          </td>
          <td class="border px-2 py-1 text-right">₹{{ grossTotal }}</td>
        </tr>
        <tr>
          <td colspan="4" class="py-2.5">
            PAY TO: <br />
            Account Holder Name: Foam Crafts India<br />
            Bank Name: State Bank Of India <br />
            Branch: Air Cargo Complex, Bababtpur, Varanasi <br />
            Bank Account No.: 42044475336 <br />
            Bank IFSC code: SBINO02512 <br />
          </td>
          <td class="whitespace-nowrap text-center" colspan="2">
            <img src="../assets/sign.png" alt="sign" class="h-12 mx-auto mb-1" />
            Authorised Signature
          </td>
        </tr>
      </tfoot>
    </table>

    <button
      class="print:hidden size-16 rounded-full fixed bottom-16 right-16 grid place-items-center cursor-pointer bg-blue-300 text-white shadow-lg"
    >
      <Printer />
    </button>
  </form>
</template>

<style scoped>
@reference "@/style.css";

@page {
  size: A4;
  margin: 5mm;
}

.monospace {
  font-family: "Courier New", Courier, monospace;
}

td {
  @apply print:border-gray-200;
}

tbody td {
  @apply border-x;
}

p {
  font-size: 12px;
  display: flex;
  gap: 4px;
  margin-bottom: 8px;

  b {
    min-width: 11ch;
    white-space: nowrap;
  }

  input {
    flex: 1;
    outline: none;
  }
}

.heading {
  @apply bg-blue-200 dark:not-print:bg-gray-900;
}

@media print {
  input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }
}
</style>

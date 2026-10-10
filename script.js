"use strict";

/*
  FXBOOKSTORE CONFIGURATION

  Replace these two values with your Supabase Project URL
  and Publishable/anon key.

  NEVER put a Supabase service_role or secret key here.
*/
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY";

const TELEBIRR_ACCOUNT = "0952819016";
const CBE_ACCOUNT = "1000652843453";
const SUPPORT_TELEGRAM = "https://t.me/forexbooklibrarysupport";

const clientReady =
  window.supabase &&
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  SUPABASE_KEY.length > 20 &&
  !SUPABASE_KEY.includes("YOUR_");

const db = clientReady
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/*
  Existing book catalog recovered from your website.
  Cover filenames should match the image files in your GitHub repository.
*/
const originalBooks = [
  {title:"SMART MONEY CONCEPT",price:150,image:"smcbible.jpg",category:"SMC"},
  {title:"SUPPLY & DEMAND CONCEPT",price:100,image:"sup.jpg",category:"SMC"},
  {title:"ALCHEMIST",price:100,image:"al01.jpg",category:"Other"},
  {title:"ICT TIME & PRICE",price:50,image:"ittmp.jpg",category:"ICT"},
  {title:"MSNR FULL GUIDE",price:100,image:"msnrb.jpg",category:"ICT"},
  {title:"THE DISCIPLINE TRADER",price:100,image:"tdt.jpg",category:"Psychology"},
  {title:"MSNR 2",price:100,image:"msnr2.jpg",category:"ICT"},
  {title:"MSNR በ አማርኛ",price:150,image:"msnram.jpg",category:"Amharic"},
  {title:"THE CANDEL STICKS BIBLE",price:150,image:"thc.jpg",category:"Price Action"},
  {title:"PRICE ACTION",price:150,image:"Pcr.jpg",category:"Price Action"},
  {title:"CRT & TS",price:150,image:"crt.jpg",category:"ICT"},
  {title:"SMC FULL COURSE",price:150,image:"smcq.jpg",category:"SMC"},
  {title:"ሀበሻ ICT",price:150,image:"ubsha.jpg",category:"Amharic"},
  {title:"MSNR x SMC x LIT x ICT",price:150,image:"msnr23.jpg",category:"ICT"},
  {title:"THE ICT BIBLE",price:100,image:"ictk.jpg",category:"ICT"},
  {title:"SIMPLE",price:150,image:"sim.jpg",category:"Other"},
  {title:"TRADING PSYCHOLOGY በ አማርኛ",price:100,image:"ts.jpg",category:"Amharic"},
  {title:"MSNR 3",price:150,image:"msnrf.jpg",category:"ICT"},
  {title:"TRADING IN THE ZONE",price:100,image:"tgy.jpg",category:"Psychology"},
  {title:"MSNR BIBLE",price:150,image:"msb.jpg",category:"ICT"},
  {title:"UNDERSTANDING LIQUIDITY",price:100,image:"la1.jpg",category:"ICT"},
  {title:"THE MARKET PROFILING GUIDE",price:120,image:"mlq.jpg",category:"Other"},
  {title:"SUPPORT & RESISTANCE",price:150,image:"sp6.jpg",category:"Price Action"},
  {title:"PRICE ACTION BREAK DOWN",price:150,image:"lk1.jpg",category:"Price Action"},
  {title:"MMXM MARKET MAKER MODEL",price:140,image:"mla.jpg",category:"ICT"},
  {title:"ERL & IRL LIQUIDITY",price:100,image:"l3.jpg",category:"ICT"},
  {title:"ALL ICT FOREX TRADING STRATEGY",price:250,image:"ic6.jpg",category:"ICT"},
  {title:"FORVI SUPPLY & DEMAND 7 PART",price:200,image:"fo.jpg",category:"SMC"},
  {title:"THE ULTIMATE PRICE PATTERN በ አማርኛ",price:170,image:"pc.jpg",category:"Amharic"},
  {title:"FOREX TRADING MONEY MANAGEMENT SYSTEM",price:130,image:"mg.jpg",category:"Other"},
  {title:"THE ULTIMATE PRICE ACTION STRATEGY",price:180,image:"bte.jpg",category:"Price Action"},
  {title:"FOREX GOD FATHER",price:120,image:"fd.jpg",category:"Other"},
  {title:"DAILY BAIS በ አማርኛ",price:110,image:"dv.jpg",category:"Amharic"},
  {title:"WHAT IS FOREX በ አማርኛ",price:120,image:"ab1.jpg",category:"Amharic"},
  {title:"ALCHEMIST WHITE",price:140,image:"alw.jpg",category:"Other"}
];

let books = originalBooks.map((book, index) => ({
  ...book,
  id: "original-" + index,
  description: "A trading ebook from the FXBOOKSTORE library.",
  cover_url: book.image,
  pdf_path: null,
  isOriginal: true
}));

let selectedCategory = "All";
let selectedBook = null;
let toastTimer;

/* HELPERS */

const $ = id => document.getElementById(id);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString("en-ET") + " ETB";
}

function getCover(book) {
  const path = book.cover_url || book.image || "";
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path;
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

function openModal(id) {
  const modal = $(id);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = $(id);
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.open")) {
    document.body.style.overflow = "";
  }
}

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => closeModal(button.dataset.close));
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal(modal.id);
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal.open").forEach(modal => closeModal(modal.id));
  }
});

/* NAVIGATION */

$("menuToggle").addEventListener("click", () => {
  $("mainNav").classList.toggle("open");
});

$("mainNav").querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => $("mainNav").classList.remove("open"));
});

$("year").textContent = new Date().getFullYear();

/* CATEGORY FILTERS */

$("categoryFilters").querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    $("categoryFilters").querySelectorAll(".filter-btn").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderBooks();
  });
});

$("searchInput").addEventListener("input", renderBooks);
$("sortSelect").addEventListener("change", renderBooks);

/* BOOK CATALOG */

function renderBooks() {
  const query = $("searchInput").value.trim().toLowerCase();
  let list = books.filter(book => {
    const searchable = [
      book.title,
      book.category,
      book.description
    ].join(" ").toLowerCase();

    const categoryMatch =
      selectedCategory === "All" ||
      book.category === selectedCategory ||
      (selectedCategory === "ICT" &&
        /ict|msnr|liquidity|crt|erl|irl|mmxm/i.test(book.title)) ||
      (selectedCategory === "SMC" &&
        /smc|smart money|supply|demand/i.test(book.title)) ||
      (selectedCategory === "Price Action" &&
        /price action|cand|support|resistance|pattern/i.test(book.title)) ||
      (selectedCategory === "Psychology" &&
        /psychology|discipline|zone/i.test(book.title)) ||
      (selectedCategory === "Amharic" &&
        /አማርኛ|ሀበሻ/i.test(book.title));

    return searchable.includes(query) && categoryMatch;
  });

  const sort = $("sortSelect").value;

  if (sort === "low") list.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "high") list.sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));

  $("bookCount").textContent = books.length + "+";
  $("catalogCount").textContent = list.length + " BOOKS";

  if (!list.length) {
    $("gallery").innerHTML =
      '<div class="empty-state">No books match your search. Try another title.</div>';
    return;
  }

  $("gallery").innerHTML = list.map(book => {
    const cover = getCover(book);
    const imageHTML = cover
      ? `<img src="${escapeHTML(cover)}" alt="${escapeHTML(book.title)} cover"
             loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
         <div class="cover-placeholder" style="display:none">FX</div>`
      : '<div class="cover-placeholder">FX</div>';

    return `
      <article class="book-card">
        <div class="cover-wrap">${imageHTML}</div>
        <div class="book-content">
          <span class="book-category">${escapeHTML(book.category || "Other")}</span>
          <h3>${escapeHTML(book.title)}</h3>
          <p class="book-description">${escapeHTML(book.description || "Digital trading ebook.")}</p>
          <div class="book-bottom">
            <span class="book-price">${formatPrice(book.price)}</span>
            <button class="buy-btn" data-buy="${escapeHTML(book.id)}">VIEW / BUY</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  $("gallery").querySelectorAll("[data-buy]").forEach(button => {
    button.addEventListener("click", () => {
      const book = books.find(item => item.id === button.dataset.buy);
      if (book) openBook(book);
    });
  });
}

function openBook(book) {
  selectedBook = book;
  const cover = getCover(book);

  $("modalTitle").textContent = book.title;
  $("modalDescription").textContent =
    book.description || "A digital trading ebook from FXBOOKSTORE.";
  $("modalPrice").textContent = formatPrice(book.price);
  $("modalImage").src = cover || "";
  $("modalImage").alt = book.title + " cover";
  $("paymentInfo").classList.add("hidden");
  $("paymentInfo").innerHTML = "";

  $("supportLink").href = SUPPORT_TELEGRAM;
  openModal("bookModal");
}

/* PAYMENT DISPLAY */

document.querySelectorAll("[data-payment]").forEach(button => {
  button.addEventListener("click", () => {
    const method = button.dataset.payment;
    const account = method === "TeleBirr"
      ? TELEBIRR_ACCOUNT
      : CBE_ACCOUNT;

    const info = $("paymentInfo");
    info.innerHTML = `
      <strong>${escapeHTML(method)}</strong>
      <p>Account / phone number:</p>
      <p><strong>${escapeHTML(account)}</strong></p>
      <p>Book: ${escapeHTML(selectedBook ? selectedBook.title : "")}</p>
      <p>Amount: ${escapeHTML(selectedBook ? formatPrice(selectedBook.price) : "")}</p>
      <button id="copyAccountBtn" class="secondary-btn" type="button">
        COPY ACCOUNT NUMBER
      </button>
    `;

    info.classList.remove("hidden");

    $("copyAccountBtn").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(account);
        showToast("Account number copied.");
      } catch {
        showToast("Please copy this number manually: " + account);
      }
    });
  });
});

/* SUPABASE ADMIN */

function setAdminStatus(message) {
  $("adminStatus").textContent = message;
}

function setLoginMessage(message) {
  $("loginMessage").textContent = message;
}

function openAdminLogin() {
  if (!db) {
    showToast("Supabase is not configured yet. Follow the setup instructions.");
    openModal("loginModal");
    setLoginMessage("Add your Supabase URL and public key in script.js, then configure the database.");
    return;
  }

  db.auth.getSession().then(({ data }) => {
    if (data.session) {
      checkAdminAccess();
    } else {
      openModal("loginModal");
    }
  }).catch(() => openModal("loginModal"));
}

$("adminOpen").addEventListener("click", openAdminLogin);

$("loginForm").addEventListener("submit", async event => {
  event.preventDefault();

  if (!db) {
    setLoginMessage("Supabase setup is required before login can work.");
    return;
  }

  setLoginMessage("Signing in...");

  const email = $("adminEmail").value.trim();
  const password = $("adminPassword").value;

  const { error } = await db.auth.signInWithPassword({ email, password });

  if (error) {
    setLoginMessage("Login failed: " + error.message);
    return;
  }

  $("adminPassword").value = "";
  closeModal("loginModal");
  await checkAdminAccess();
});

async function checkAdminAccess() {
  if (!db) return;

  const { data: sessionData, error: sessionError } = await db.auth.getSession();

  if (sessionError || !sessionData.session) {
    openModal("loginModal");
    return;
  }

  const user = sessionData.session.user;

  const { data: admin, error } = await db
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !admin) {
    await db.auth.signOut();
    showToast("This account is not authorized as a store administrator.");
    return;
  }

  closeModal("loginModal");
  openModal("adminModal");
  setAdminStatus("Signed in as " + user.email);
  await loadAdminBooks();
}

/*
  Public books are read from the products table.
  If the table isn't configured yet, the original catalog remains visible.
*/
async function loadOnlineBooks() {
  if (!db) return;

  const { data, error } = await db
    .from("products")
    .select("id,title,price,category,description,cover_url,pdf_path")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Online catalog not configured yet:", error.message);
    return;
  }

  const onlineBooks = (data || []).map(book => ({
    ...book,
    id: String(book.id),
    image: book.cover_url || "",
    isOriginal: false
  }));

  /*
    If online books exist, show those managed in the admin panel.
    Otherwise, keep the recovered 35-book catalog.
  */
  if (onlineBooks.length) {
    books = onlineBooks;
    renderBooks();
  }
}

/* STORAGE UPLOADS */

function safeFileName(name) {
  return name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
}

async function uploadFile(bucket, file) {
  if (!file) return null;

  const filePath = crypto.randomUUID() + "-" + safeFileName(file.name);

  const { error } = await db.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type || undefined
    });

  if (error) throw error;

  if (bucket === "book-covers") {
    const { data } = db.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Keep PDF bucket private; store only the object path.
  return filePath;
}

async function loadAdminBooks() {
  if (!db) return;

  $("adminBookList").innerHTML = '<p class="notice">Loading books...</p>';

  const { data, error } = await db
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    $("adminBookList").innerHTML = "";
    setAdminStatus("Could not load books: " + error.message);
    return;
  }

  if (!data.length) {
    $("adminBookList").innerHTML =
      '<p class="notice">No online books yet. Add your first book above.</p>';
    return;
  }

  $("adminBookList").innerHTML = data.map(book => `
    <div class="admin-book-row">
      <img src="${escapeHTML(book.cover_url || "")}" alt=""
        onerror="this.style.visibility='hidden'">
      <div class="admin-book-info">
        <strong>${escapeHTML(book.title)}</strong>
        <span>${formatPrice(book.price)} · ${escapeHTML(book.category || "Other")}</span>
      </div>
      <div class="admin-actions">
        <button class="small-btn edit" data-edit="${escapeHTML(book.id)}">Edit</button>
        <button class="small-btn delete" data-delete="${escapeHTML(book.id)}">Delete</button>
      </div>
    </div>
  `).join("");

  $("adminBookList").querySelectorAll("[data-edit]").forEach(button => {
    button.addEventListener("click", () => {
      const book = data.find(item => String(item.id) === button.dataset.edit);
      if (book) fillEditForm(book);
    });
  });

  $("adminBookList").querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => deleteBook(button.dataset.delete));
  });
}

function fillEditForm(book) {
  $("editId").value = book.id;
  $("bookTitle").value = book.title || "";
  $("bookPrice").value = book.price || 0;
  $("bookCategory").value = book.category || "Other";
  $("bookDescription").value = book.description || "";
  $("coverFile").value = "";
  $("pdfFile").value = "";
  $("saveBookBtn").textContent = "UPDATE BOOK";
  $("cancelEditBtn").classList.remove("hidden");
  $("bookTitle").scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetBookForm() {
  $("bookForm").reset();
  $("editId").value = "";
  $("saveBookBtn").textContent = "SAVE BOOK";
  $("cancelEditBtn").classList.add("hidden");
}

$("cancelEditBtn").addEventListener("click", resetBookForm);
$("refreshBooksBtn").addEventListener("click", loadAdminBooks);

$("bookForm").addEventListener("submit", async event => {
  event.preventDefault();

  if (!db) {
    setAdminStatus("Supabase is not configured.");
    return;
  }

  const saveButton = $("saveBookBtn");
  saveButton.disabled = true;
  saveButton.textContent = "SAVING...";

  try {
    const id = $("editId").value;
    const coverFile = $("coverFile").files[0];
    const pdfFile = $("pdfFile").files[0];

    const title = $("bookTitle").value.trim();
    const price = Number($("bookPrice").value);
    const category = $("bookCategory").value;
    const description = $("bookDescription").value.trim();

    if (!title || !Number.isFinite(price) || price < 0) {
      throw new Error("Enter a valid title and price.");
    }

    let cover_url = null;
    let pdf_path = null;

    if (coverFile) {
      if (!coverFile.type.startsWith("image/")) {
        throw new Error("Please choose an image file for the cover.");
      }
      cover_url = await uploadFile("book-covers", coverFile);
    }

    if (pdfFile) {
      const isPDF = pdfFile.type === "application/pdf" ||
        pdfFile.name.toLowerCase().endsWith(".pdf");

      if (!isPDF) throw new Error("Please choose a PDF file.");

      // Maximum 40 MB per PDF in this starter implementation.
      if (pdfFile.size > 40 * 1024 * 1024) {
        throw new Error("PDF is too large. Maximum supported size is 40 MB.");
      }

      pdf_path = await uploadFile("book-files", pdfFile);
    }

    const values = {
      title,
      price,
      category,
      description,
      is_active: true
    };

    if (cover_url) values.cover_url = cover_url;
    if (pdf_path) values.pdf_path = pdf_path;

    let result;

    if (id) {
      result = await db.from("products").update(values).eq("id", id);
    } else {
      if (!cover_url) {
        throw new Error("Please upload a cover image for the new book.");
      }
      if (!pdf_path) {
        throw new Error("Please upload the PDF file for the new book.");
      }
      values.cover_url = cover_url;
      values.pdf_path = pdf_path;
      result = await db.from("products").insert(values);
    }

    if (result.error) throw result.error;

    showToast(id ? "Book updated." : "Book added.");
    setAdminStatus("Changes saved successfully.");
    resetBookForm();
    await loadAdminBooks();
    await loadOnlineBooks();

  } catch (error) {
    setAdminStatus(error.message || "Could not save the book.");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = $("editId").value ? "UPDATE BOOK" : "SAVE BOOK";
  }
});

async function deleteBook(id) {
  if (!confirm("Delete this book from your online store?")) return;

  const { error } = await db.from("products").delete().eq("id", id);

  if (error) {
    setAdminStatus("Could not delete book: " + error.message);
    return;
  }

  showToast("Book deleted.");
  await loadAdminBooks();
  await loadOnlineBooks();
}

$("logoutBtn").addEventListener("click", async () => {
  if (db) await db.auth.signOut();
  resetBookForm();
  closeModal("adminModal");
  showToast("You have signed out.");
});

/* STARTUP */

renderBooks();
loadOnlineBooks().catch(error => console.warn(error));
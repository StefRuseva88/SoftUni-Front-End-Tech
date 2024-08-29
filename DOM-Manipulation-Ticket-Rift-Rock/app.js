window.addEventListener("load", solve);

function solve() {
  let numTicketsInput = document.getElementById("num-tickets");
  let seatingPreference = document.getElementById("seating-preference");
  let fullNameInput = document.getElementById("full-name");
  let emailInput = document.getElementById("email");
  let phoneInput = document.getElementById("phone-number");
  let purchaseBtn = document.getElementById("purchase-btn");
  
  let ticketPreviewList = document.getElementById("ticket-preview");
  let ticketPurchaseList = document.getElementById("ticket-purchase");
  let contentContainer = document.querySelector(".bottom-content");

  purchaseBtn.addEventListener("click", onAdd);

  function onAdd(e) {
    e.preventDefault();
    if (
      numTicketsInput.value == "" ||
      seatingPreference.value == "" ||
      fullNameInput.value == "" ||
      emailInput.value == "" ||
      phoneInput.value == ""
    ) {
      return;
    }

    let article = document.createElement("article");
    let listItem = document.createElement("li");
    listItem.setAttribute("class", "ticket-purchase");
    let btnContainer = document.createElement("div");
    btnContainer.setAttribute("class", "btn-container");

    let ticketNumber = document.createElement("p");
    ticketNumber.textContent = `Count: ${numTicketsInput.value}`;

    let seatingPref = document.createElement("p");
    seatingPref.textContent = `Preference: ${seatingPreference.value}`;

    let fullName = document.createElement("p");
    fullName.textContent = `To: ${fullNameInput.value}`;

    let email = document.createElement("p");
    email.textContent = `Email: ${emailInput.value}`;

    let phoneNumber = document.createElement("p");
    phoneNumber.textContent = `Phone Number: ${phoneInput.value}`;

    let editBtn = document.createElement("button");
    editBtn.setAttribute("class", "edit-btn");
    editBtn.textContent = "Edit";

    let nextBtn = document.createElement("button");
    nextBtn.setAttribute("class", "next-btn");
    nextBtn.textContent = "Next";

    article.appendChild(ticketNumber);
    article.appendChild(seatingPref);
    article.appendChild(fullName);
    article.appendChild(email);
    article.appendChild(phoneNumber);

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(nextBtn);

    listItem.appendChild(article);
    listItem.appendChild(btnContainer);

    ticketPreviewList.appendChild(listItem);

    let editedNumTickets = numTicketsInput.value;
    let editedSeatingPref = seatingPreference.value;
    let editedFullName = fullNameInput.value;
    let editedEmail = emailInput.value;
    let editedPhone = phoneInput.value;

    numTicketsInput.value = "";
    seatingPreference.value = "";
    fullNameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";

    purchaseBtn.disabled = true;

    editBtn.addEventListener("click", onEdit);

    function onEdit() {
      numTicketsInput.value = editedNumTickets;
      seatingPreference.value = editedSeatingPref;
      fullNameInput.value = editedFullName;
      emailInput.value = editedEmail;
      phoneInput.value = editedPhone;

      listItem.remove();
      purchaseBtn.disabled = false;
    }

    nextBtn.addEventListener("click", onNext);

    function onNext() {
      let listItemNext = document.createElement("li");
      listItemNext.setAttribute("class", "ticket-purchase");

      let articleNext = document.createElement("article");
      articleNext = article;

      let buyBtn = document.createElement("button");
      buyBtn.setAttribute("class", "buy-btn");
      buyBtn.textContent = "Buy";

      articleNext.appendChild(buyBtn);
      listItemNext.appendChild(articleNext);

      listItem.remove();
      ticketPurchaseList.appendChild(listItemNext);

      buyBtn.addEventListener("click", onBuy);

      function onBuy() {
        listItemNext.remove();

        let backBtn = document.createElement("button");
        backBtn.setAttribute("class", "back-btn");
        backBtn.textContent = "Back";

        let thankYouMessage = document.createElement("h2");
        thankYouMessage.textContent = `Thank you for your purchase!`;
        contentContainer.appendChild(thankYouMessage);
        contentContainer.appendChild(backBtn);

        backBtn.addEventListener("click", onCancel);

        function onCancel() {
          window.location.reload();
        }
      }
    }
  }
}
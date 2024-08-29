window.addEventListener('load', solution);

function solution() {

  // Initial element map
  let employeeInput = document.getElementById('employee');
  let categoryInput = document.getElementById('category');
  let urgencyInput = document.getElementById('urgency');
  let teamInput = document.getElementById('team');
  let descriptionInput = document.getElementById('description');
  let addButton = document.getElementById('add-btn');

  let previewList = document.querySelector('.preview-list');
  let pendingList = document.querySelector('.pending-list');
  let resolvedList = document.querySelector('.resolved-list');

  addButton.addEventListener('click', onAdd);

  function onAdd(e) {
    e.preventDefault();
    // Check if any field is empty
    if (
      employeeInput.value == "" ||
      categoryInput.value == "" ||
      urgencyInput.value == "" ||
      teamInput.value == "" ||
      descriptionInput.value == ""
    ) {
      return;
    }

    let listItem = document.createElement('li');
    listItem.setAttribute('class', 'problem-content');

    let article = document.createElement('article');

    let employeeP = document.createElement('p');
    employeeP.textContent = `From: ${employeeInput.value}`;

    let categoryP = document.createElement('p');
    categoryP.textContent = `Category: ${categoryInput.value}`;

    let urgencyP = document.createElement('p');
    urgencyP.textContent = `Urgency: ${urgencyInput.value}`;

    let teamP = document.createElement('p');
    teamP.textContent = `Assigned To: ${teamInput.value}`;

    let descriptionP = document.createElement('p');
    descriptionP.textContent = `Description: ${descriptionInput.value}`;

    let editButton = document.createElement('button');
    editButton.setAttribute('class', 'edit-btn');
    editButton.textContent = 'Edit';

    let continueButton = document.createElement('button');
    continueButton.setAttribute('class', 'continue-btn');
    continueButton.textContent = 'Continue';

    article.appendChild(employeeP);
    article.appendChild(categoryP);
    article.appendChild(urgencyP);
    article.appendChild(teamP);
    article.appendChild(descriptionP);

    listItem.appendChild(article);
    listItem.appendChild(editButton);
    listItem.appendChild(continueButton);

    previewList.appendChild(listItem);

    // Store input values before clearing them
    let editedEmployee = employeeInput.value;
    let editedCategory = categoryInput.value;
    let editedUrgency = urgencyInput.value;
    let editedTeam = teamInput.value;
    let editedDescription = descriptionInput.value;

    // Clear input fields
    employeeInput.value = '';
    categoryInput.value = '';
    urgencyInput.value = '';
    teamInput.value = '';
    descriptionInput.value = '';
    addButton.disabled = true;

    editButton.addEventListener('click', onEdit);

    function onEdit() {
      employeeInput.value = editedEmployee;
      categoryInput.value = editedCategory;
      urgencyInput.value = editedUrgency;
      teamInput.value = editedTeam;
      descriptionInput.value = editedDescription;

      listItem.remove();
      addButton.disabled = false;
    }

    continueButton.addEventListener('click', onContinue);

    function onContinue() {
      let listItemContinue = document.createElement('li');
      listItemContinue.setAttribute('class', 'problem-content');

      let articleItemContinue = document.createElement('article');

      // Recreate elements to avoid cloning issues
      let employeePContinue = document.createElement('p');
      employeePContinue.textContent = `From: ${editedEmployee}`;

      let categoryPContinue = document.createElement('p');
      categoryPContinue.textContent = `Category: ${editedCategory}`;

      let urgencyPContinue = document.createElement('p');
      urgencyPContinue.textContent = `Urgency: ${editedUrgency}`;

      let teamPContinue = document.createElement('p');
      teamPContinue.textContent = `Assigned To: ${editedTeam}`;

      let descriptionPContinue = document.createElement('p');
      descriptionPContinue.textContent = `Description: ${editedDescription}`;

      articleItemContinue.appendChild(employeePContinue);
      articleItemContinue.appendChild(categoryPContinue);
      articleItemContinue.appendChild(urgencyPContinue);
      articleItemContinue.appendChild(teamPContinue);
      articleItemContinue.appendChild(descriptionPContinue);

      let resolvedButton = document.createElement('button');
      resolvedButton.setAttribute('class', 'resolve-btn');
      resolvedButton.textContent = 'Resolved';

      listItemContinue.appendChild(articleItemContinue);
      listItemContinue.appendChild(resolvedButton);

      pendingList.appendChild(listItemContinue);

      listItem.remove();
      addButton.disabled = false;

      resolvedButton.addEventListener('click', onResolve);

      function onResolve() {
        let listItemResolved = document.createElement('li');
        listItemResolved.setAttribute('class', 'problem-content');

        let articleItemResolved = document.createElement('article');

        // Recreate elements to avoid cloning issues
        let employeePResolved = document.createElement('p');
        employeePResolved.textContent = `From: ${editedEmployee}`;

        let categoryPResolved = document.createElement('p');
        categoryPResolved.textContent = `Category: ${editedCategory}`;

        let urgencyPResolved = document.createElement('p');
        urgencyPResolved.textContent = `Urgency: ${editedUrgency}`;

        let teamPResolved = document.createElement('p');
        teamPResolved.textContent = `Assigned To: ${editedTeam}`;

        let descriptionPResolved = document.createElement('p');
        descriptionPResolved.textContent = `Description: ${editedDescription}`;

        articleItemResolved.appendChild(employeePResolved);
        articleItemResolved.appendChild(categoryPResolved);
        articleItemResolved.appendChild(urgencyPResolved);
        articleItemResolved.appendChild(teamPResolved);
        articleItemResolved.appendChild(descriptionPResolved);

        let clearButton = document.createElement('button');
        clearButton.setAttribute('class', 'clear-btn');
        clearButton.textContent = 'Clear';

        listItemResolved.appendChild(articleItemResolved);
        listItemResolved.appendChild(clearButton);
        resolvedList.appendChild(listItemResolved);
        listItemContinue.remove();

        clearButton.addEventListener('click', onClear);

        function onClear() {
          listItemResolved.remove();
        }
      }
    }
  }
}

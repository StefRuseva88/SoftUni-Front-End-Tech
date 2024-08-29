window.addEventListener('load', solution);

function solution() {

  //initial element map
  let employeeElement = document.getElementById('employee');
  let categoryElement = document.getElementById('category');
  let urgencyElement = document.getElementById('urgency');
  let teamElement = document.getElementById('team');
  let descriptionElement = document.getElementById('description');
  let addButtonElement = document.getElementById('add-btn');

  let previewElement = document.querySelector('.preview-list');
  let pendingElement = document.querySelector('.pending-list');
  let resolvedElement = document.querySelector('.resolved-list');

  //add listener for the add button
  addButtonElement.addEventListener('click', onNext);
  function onNext(e) {
    e.preventDefault();
    //if some of the fields is empty should not allow submit
    if (employeeElement.value == '' ||
      categoryElement.value == '' ||
      urgencyElement.value == '' ||
      teamElement.value == '' ||
      descriptionElement == ''
    ) {
      return;
    }

    // build elements to add into the UL for preview list
    let liElement = document.createElement('li');
    liElement.setAttribute('class', 'problem-content');

    let articleElement = document.createElement('article');

    let fromParagraph = document.createElement('p');
    fromParagraph.textContent = `From: ${employeeElement.value}`;

    let categoryParagraph = document.createElement('p');
    categoryParagraph.textContent = `Category: ${categoryElement.value}`;

    let urgencyParagraph = document.createElement('p');
    urgencyParagraph.textContent = `Urgency: ${urgencyElement.value}`;

    let assignedToParagraph = document.createElement('p');
    assignedToParagraph.textContent = `Assigned to: ${teamElement.value}`;

    let descriptionToParagraph = document.createElement('p');
    descriptionToParagraph.textContent = `Description: ${descriptionElement.value}`;

    let editbtn = document.createElement('button');
    editbtn.setAttribute('class', 'edit-btn');
    editbtn.textContent = "Edit";

    let continuebtn = document.createElement('button');
    continuebtn.setAttribute('class', 'continue-btn');
    continuebtn.textContent = "Continue";

    //append all children
    articleElement.appendChild(fromParagraph);
    articleElement.appendChild(categoryParagraph);
    articleElement.appendChild(urgencyParagraph);
    articleElement.appendChild(assignedToParagraph);
    articleElement.appendChild(descriptionToParagraph);

    liElement.appendChild(articleElement);
    liElement.appendChild(editbtn);
    liElement.appendChild(continuebtn);

    previewElement.appendChild(liElement);

    //before removing the values form the fields we should keep the input data
    //otherwise we will lose
    let editedEmployee = employeeElement.value;
    let editedCategory = categoryElement.value;
    let editedUrgency = urgencyElement.value;
    let editedTeam = teamElement.value;
    let editedDescription = descriptionElement.value;

    //clear the input dields
    employeeElement.value = '';
    categoryElement.value = '';
    urgencyElement.value = '';
    teamElement.value = '';
    descriptionElement.value = '';
    addButtonElement.disabled = true;

    //when click edit button
    editbtn.addEventListener('click', onEdit);

    function onEdit() {
      employeeElement.value = editedEmployee;
      categoryElement.value = editedCategory;
      urgencyElement.value = editedUrgency;
      teamElement.value = editedTeam;
      descriptionElement.value = editedDescription;

      liElement.remove();
      addButtonElement.disabled = false;
    }

    //when click continue
    continuebtn.addEventListener('click', onContinue);

    function onContinue(){
      let liElementContinue = document.createElement('li');
      liElementContinue.setAttribute('class', 'problem-content');

      let articleElementContinue = document.createElement('article');
      articleElementContinue = articleElement;

      let resolvedBtn = document.createElement('button');
      resolvedBtn.setAttribute("class", 'resolve-btn');
      resolvedBtn.textContent = "Resolved";

      liElementContinue.appendChild(articleElementContinue);
      liElementContinue.appendChild(resolvedBtn);

      pendingElement.appendChild(liElementContinue);

      liElement.remove();
      addButtonElement.disabled = false;

      //on clicking resolve button
      resolvedBtn.addEventListener('click', onResolve);

      function onResolve(){
        let liElementResolved = document.createElement('li');
        liElementResolved.setAttribute('class', 'problem-content');

        let articleElementResolved = document.createElement('article');
        articleElementResolved = articleElementContinue;

        let clearBtn = document.createElement('button');
        clearBtn.setAttribute('class', "clear-btn");
        clearBtn.textContent = "Clear";

        liElementResolved.appendChild(articleElementResolved);
        liElementResolved.appendChild(clearBtn);
        resolvedElement.appendChild(liElementResolved);
        liElementContinue.remove();

        //on clear button clicked
        clearBtn.addEventListener('click', onClear);

        function onClear(){
          liElementResolved.remove();
        }
      }
    }
  }

}





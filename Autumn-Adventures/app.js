window.addEventListener('load', solve);

function solve() {
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');
  const placeElement = document.getElementById('place');
  const eventElement = document.getElementById('event-name');
  const contactsElement = document.getElementById('email');
  const addButtonElement = document.getElementById('add-btn');
  const checkListElement = document.getElementById('check-list');
  const upcomingListElement = document.getElementById('upcoming-list');
  const finishedListElement = document.getElementById('finished-list');
  const clearButtonElement = document.getElementById('clear');

  addButtonElement.addEventListener('click', onNext);

  function onNext(e) {
    e.preventDefault();
    if (
      timeElement.value == "" ||
      dateElement.value == "" ||
      placeElement.value == "" ||
      eventElement.value == "" || 
      contactsElement.value == ""
    ) {
      return;
    }

    let liElement = document.createElement('li');
    liElement.setAttribute('class', 'event-content');

    let articleElement = document.createElement('article');

    let timeParagraph = document.createElement('p');
    timeParagraph.textContent = `Begins: ${timeElement.value} At: ${dateElement.value}`;

    let placeParagraph = document.createElement('p');
    placeParagraph.textContent = `In: ${placeElement.value}`;

    let eventParagraph = document.createElement('p');
    eventParagraph.textContent = `Event: ${eventElement.value}`;

    let contactsParagraph = document.createElement('p');
    contactsParagraph.textContent = `Contact: ${contactsElement.value}`;

    let editButton = document.createElement('button');
    editButton.setAttribute('class', 'edit-btn');
    editButton.textContent = 'Edit';

    let continueButton = document.createElement('button');
    continueButton.setAttribute('class', 'continue-btn');
    continueButton.textContent = 'Continue';

    articleElement.appendChild(timeParagraph);
    articleElement.appendChild(placeParagraph);
    articleElement.appendChild(eventParagraph);
    articleElement.appendChild(contactsParagraph);

    liElement.appendChild(articleElement);
    liElement.appendChild(editButton);
    liElement.appendChild(continueButton);

    checkListElement.appendChild(liElement);

    addButtonElement.disabled = true;

    //save the data in variables

    let editedTimeElement = timeElement.value;
    let editedDateElement = dateElement.value;
    let editedPlaceElement = placeElement.value;
    let editedEventElement = eventElement.value;
    let editedContactsElement = contactsElement.value;

    //clear the input fields

    timeElement.value = '';
    dateElement.value = '';
    placeElement.value = '';
    eventElement.value = '';
    contactsElement.value = '';
    addButtonElement.disabled = true;

    //logic for the edit button

    editButton.addEventListener('click', onEdit);

      function onEdit() {
        timeElement.value = editedTimeElement;
        dateElement.value = editedDateElement;
        placeElement.value = editedPlaceElement;
        eventElement.value = editedEventElement;
        contactsElement.value = editedContactsElement;
  
        liElement.remove();
        addButtonElement.disabled = false; 
      }

    //logic for the continue button

    continueButton.addEventListener('click',onContinue);

      function onContinue() {
        let liElementContinue = document.createElement('li');
        liElementContinue.setAttribute('class', 'event-content');

        let articleElementContinue = document.createElement('article');
        articleElementContinue = articleElement;
    
        let moveToFinishElement = document.createElement('button');
        moveToFinishElement.setAttribute('class', 'finished-btn');
        moveToFinishElement.textContent = 'Move to Finished';

        liElementContinue.appendChild(articleElementContinue);
        liElementContinue.appendChild(moveToFinishElement);

        upcomingListElement.appendChild(liElementContinue);

        liElement.remove();
        addButtonElement.disabled = false;

        //logic for the move to finish button

        moveToFinishElement.addEventListener('click', onFinished);

          function onFinished() {
            let liElementFinished = document.createElement('li');
            liElementFinished.setAttribute('class', 'event-content');

            let articleElementFinished = document.createElement('article');
            articleElementFinished = articleElementContinue;

            liElementFinished.appendChild(articleElementFinished);
            finishedListElement.appendChild(liElementFinished);
            liElementContinue.remove();

            //logic for the clear button
            clearButtonElement.addEventListener('click', onClear);

            function onClear() {
            liElementFinished.remove();
        };
      };
    }; 
  }; 
};

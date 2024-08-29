window.addEventListener('load', solve);

function solve() {
    let nextBtn = document.getElementById('next-btn');
    let carModelInput = document.getElementById('car-model');
    let carYearInput = document.getElementById('car-year');
    let partNameInput = document.getElementById('part-name');
    let partNumberInput = document.getElementById('part-number');
    let conditionInput = document.getElementById('condition');

    let infoList = document.querySelector('.info-list');
    let confirmList = document.querySelector('.confirm-list');
    let contentContainer = document.getElementById('content');

    nextBtn.addEventListener('click', onAdd);

    function onAdd(e) {
        e.preventDefault();

        if (
            carModelInput.value === '' ||
            carYearInput.value === '' ||
            partNameInput.value === '' ||
            partNumberInput.value === '' ||
            conditionInput.value === '' ||
            carYearInput.value === ''
        ) {
            return;
        }

        let listItem = document.createElement('li');
        listItem.className = 'part-content';

        let article = document.createElement('article');

        let carModelP = document.createElement('p');
        carModelP.textContent = `Car Model: ${carModelInput.value}`;

        let carYearP = document.createElement('p');
        carYearP.textContent = `Car Year: ${carYearInput.value}`;

        let partNameP = document.createElement('p');
        partNameP.textContent = `Part Name: ${partNameInput.value}`;

        let partNumberP = document.createElement('p');
        partNumberP.textContent = `Part Number: ${partNumberInput.value}`;

        let conditionP = document.createElement('p');
        conditionP.textContent = `Condition: ${conditionInput.value}`;

        let editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Edit';

        let continueButton = document.createElement('button');
        continueButton.className = 'continue-btn';
        continueButton.textContent = 'Continue';

        article.appendChild(carModelP);
        article.appendChild(carYearP);
        article.appendChild(partNameP);
        article.appendChild(partNumberP);
        article.appendChild(conditionP);

        listItem.appendChild(article);
        listItem.appendChild(editButton);
        listItem.appendChild(continueButton);

        infoList.appendChild(listItem);

        let editedCarModel = carModelInput.value;
        let editedCarYear = carYearInput.value;
        let editedPartName = partNameInput.value;
        let editedPartNumber = partNumberInput.value;
        let editedCondition = conditionInput.value;

        carModelInput.value = '';
        carYearInput.value = '';
        partNameInput.value = '';
        partNumberInput.value = '';
        conditionInput.value = '';
        nextBtn.disabled = true;

        editButton.addEventListener('click', onEdit);

        function onEdit() {
            carModelInput.value = editedCarModel;
            carYearInput.value = editedCarYear;
            partNameInput.value = editedPartName;
            partNumberInput.value = editedPartNumber;
            conditionInput.value = editedCondition;

            listItem.remove();
            nextBtn.disabled = false;
        }

        continueButton.addEventListener('click', onContinue);

        function onContinue() {
            let listItemConfirm = document.createElement('li');
            listItemConfirm.className = 'part-content';

            let articleConfirm = document.createElement('article');

            let carModelPConfirm = document.createElement('p');
            carModelPConfirm.textContent = `Car Model: ${editedCarModel}`;

            let carYearPConfirm = document.createElement('p');
            carYearPConfirm.textContent = `Car Year: ${editedCarYear}`;

            let partNamePConfirm = document.createElement('p');
            partNamePConfirm.textContent = `Part Name: ${editedPartName}`;

            let partNumberPConfirm = document.createElement('p');
            partNumberPConfirm.textContent = `Part Number: ${editedPartNumber}`;

            let conditionPConfirm = document.createElement('p');
            conditionPConfirm.textContent = `Condition: ${editedCondition}`;

            let confirmButton = document.createElement('button');
            confirmButton.className = 'confirm-btn';
            confirmButton.textContent = 'Confirm';

            let cancelButton = document.createElement('button');
            cancelButton.className = 'cancel-btn';
            cancelButton.textContent = 'Cancel';

            articleConfirm.appendChild(carModelPConfirm);
            articleConfirm.appendChild(carYearPConfirm);
            articleConfirm.appendChild(partNamePConfirm);
            articleConfirm.appendChild(partNumberPConfirm);
            articleConfirm.appendChild(conditionPConfirm);

            listItemConfirm.appendChild(articleConfirm);
            listItemConfirm.appendChild(confirmButton);
            listItemConfirm.appendChild(cancelButton);

            confirmList.appendChild(listItemConfirm);

            listItem.remove();
            nextBtn.disabled = false;

            confirmButton.addEventListener('click', onConfirm);
            cancelButton.addEventListener('click', onCancel);

            function onConfirm() {
                listItemConfirm.remove();

                let thankYouMessage = document.createElement('h2');
                thankYouMessage.textContent = 'Part is Ordered!';

                let backButton = document.createElement('button');
                backButton.className = 'back-btn';
                backButton.textContent = 'Back';

                let bottomContent = document.createElement('div');

                bottomContent.appendChild(thankYouMessage);
                bottomContent.appendChild(backButton);

                contentContainer.appendChild(bottomContent);

                backButton.addEventListener('click', onBack);

                function onBack() {
                    bottomContent.remove();
                    nextBtn.disabled = false;
                }
            }

            function onCancel() {
                listItemConfirm.remove();
                nextBtn.disabled = false;
            }
        }
    }
}

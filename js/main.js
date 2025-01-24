
(function () {
  const cargoList = [
    {
      id: "CARGO001",
      name: "Строительные материалы",
      status: "В пути",
      origin: "Москва",
      destination: "Казань",
      departureDate: "2024-11-24"
    },
    {
      id: "CARGO002",
      name: "Хрупкий груз",
      status: "Ожидает отправки",
      origin: "Санкт-Петербург",
      destination: "Екатеринбург",
      departureDate: "2029-11-26"
    }
  ];
  const statuses = {
    onWay: 'В пути',
    wait: "Ожидает отправки",
    delivered: "Доставлен"
  };

  const cities = ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Пермь", "Уфа", "Калининград", "Барнаул"];

  const createNewElement = function (tag, classes, content) {
    let element = document.createElement(tag);
    if (classes) {
      element.classList.add(classes);
    }
    if (content) {
      element.textContent = content;
    }
    return element;
  }

  let createAppTitle = function (title) {
    let appTitle = createNewElement('h2', '', title);
    return appTitle;
  };

  const createLabel = function (idElement, text) {
    const elLabel = createNewElement('label', 'form-label', text);
    elLabel.for = idElement;
    return elLabel;
  };

  const createCargoForm = function () {
    const form = createNewElement('form', 'row');
    form.classList.add('input-group', 'mb-3', 'g-3');

    const inputName = createNewElement('input', 'form-control');
    inputName.id = 'cargoname';
    inputName.placeholder = 'Название груза';
    inputName.required = 'required';
    const colNAme = createNewElement('div', 'col-md-12');
    colNAme.append(inputName);

    const cityOrigin = createSelectCity('Пункт отправления', 'select-depature');
    cityOrigin.id = 'cityorigin';
    cityOrigin.required = 'required';
    const colCityOrigin = createNewElement('div', 'col-md-6');
    colCityOrigin.append(cityOrigin);

    const cityDepature = createSelectCity('Пункт назначения');
    cityDepature.id = 'citydepature';
    cityDepature.required = 'required';
    const colCityDepature = createNewElement('div', 'col-md-6');
    colCityDepature.append(cityDepature);

    const dateDepature = createNewElement('input', 'form-control');
    dateDepature.id = 'datedepature';
    dateDepature.type = 'date';
    dateDepature.required = 'required';
    const colDate = createNewElement('div', 'col-md-6');
    const labelDate = createLabel('datedepature', 'Дата отправления');
    colDate.append(labelDate, dateDepature);

    const statusSelect = createSelectStatus('wait');
    statusSelect.id = 'status';
    statusSelect.required = 'required';
    changeColorSelected(statusSelect);
    statusFormListener(statusSelect);
    const labelStatus = createLabel('status', 'Статус груза');
    const colStatus = createNewElement('div', 'col-md-6');
    colStatus.append(labelStatus, statusSelect);

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить груз';
    button.type = 'submit';
    const colButton = createNewElement('div', 'col');
    colButton.append(button);

    form.append(
      colNAme,
      colCityOrigin,
      colCityDepature,
      colStatus,
      colDate,
      colButton
    );

    return {
      form,
      inputName,
      cityOrigin,
      cityDepature,
      dateDepature,
      statusSelect
    };
  };

  const createFilterForm = function () {
    const form = createNewElement('form', 'row');
    form.classList.add('input-group', 'mb-3');

    const statusSelect = createSelectStatus('', 'Выберите статус');
    statusSelect.id = 'status';
    statusSelect.required = 'required';
    changeColorSelected(statusSelect);
    statusFormListener(statusSelect); 
    const labelStatus = createLabel('status', 'Фильтровать по статусу');
    const colStatus = createNewElement('div', 'col-md-6');
    colStatus.append(statusSelect);


    form.append(labelStatus, colStatus);
    return {
      form,
      statusSelect
    };
  }

  const statusFormListener = function (selectElement) {
    selectElement.addEventListener('change', function () {
      changeColorSelected(this);
    });
  }

  const createSelectCity = function (value, classes) {
    const citySelect = createNewElement('select', 'form-select');
    const optionPlaceholder = createNewElement('option', '', value);
    optionPlaceholder.value = '';
    optionPlaceholder.disabled = 'disabled';
    if (classes) {
      citySelect.classList.add(classes);
    }

    citySelect.append(optionPlaceholder);

    cities.forEach((city, key) => {
      const option = createNewElement('option', '', city);
      citySelect.append(option);
      citySelect.value = 'city-' + key;
    });
    citySelect.value = '';
    return citySelect;
  };


  const createSelectStatus = function (dataStatus, placeholder) {
    const statusSelect = createNewElement('select', 'form-select');
    statusSelect.classList.add('text-secondary');
    if (placeholder) {
      const optionPlaceholder = createNewElement('option', 'text-secondary', placeholder);
      optionPlaceholder.value = '';
      optionPlaceholder.id = 'statusNotSelected';
      statusSelect.append(optionPlaceholder);
      statusSelect.value = '';
    }


    for (let key in statuses) {
      const statusText = statuses[key];
      const statusElement = createNewElement('option', '', statusText);
      statusElement.value = key;

      if (dataStatus && statusText === dataStatus) {
        statusElement.selected = 'selected';
      }

      if (key === 'onWay') {
        statusElement.classList.add('text-primary');
      }
      if (key === 'wait') {
        statusElement.classList.add('text-warning');
      }
      if (key === 'delivered') {
        statusElement.classList.add('text-success');
      }
      statusSelect.append(statusElement);
    };

    changeColorSelected(statusSelect);
    return statusSelect;
  }

  const createCargoItem = function (cargo) {
    const item = createNewElement('tr');

    // id
    const idCell = createNewElement('td', 'id', cargo.id);

    // name
    const titleCell = createNewElement('td', 'name', cargo.name);

    //  Status 
    const statusCell = createNewElement('td');
    const statusSelect = createSelectStatus(cargo.status);
    statusSelect.id = 'status-' + cargo.id;

    statusCell.append(statusSelect);

    // origin and destination
    const originDepCell = createNewElement('td', '', cargo.origin + '  -  ' + cargo.destination);

    //date

    const departureDateCell = createNewElement('td', '', cargo.departureDate);

    item.append(
      idCell,
      titleCell,
      statusCell,
      originDepCell,
      departureDateCell
    );
    statusListener(statusSelect);
    return {
      item,
      statusSelect
    };
  }

  const createCargoThead = function (headers) {
    const header = createNewElement('thead');
    const headerLine = createNewElement('tr');

    for (let i = 0; i < headers.length; i++) {
      let element = createNewElement('th', '', headers[i]);
      headerLine.append(element);
    }
    header.append(headerLine);
    return header;
  }

  const createCargoTable = function (data) {
    const table = createNewElement('table');
    const tbody = createNewElement('tbody');
    const headerTable = createCargoThead([
      'Номер груза',
      'Название груза',
      'Статус груза',
      'Пункт отправления и назначения',
      'Дата отправления',
    ]);

    table.append(headerTable);
    table.classList.add('table', 'table-bordered');

    data.forEach(cargoElementData => {
      let itemElement = createCargoItem(cargoElementData).item;
      tbody.append(itemElement);
    });

    table.append(tbody);
    return {
      table,
      tbody
    };
  };

  const getSelectedOption = function (selectNode) {
    const arrayOptions = Array.from(selectNode);
    const elementSelected = arrayOptions.find((element) => {
      return element.selected;
    });

    return elementSelected;
  };

  const clearForm = function (form) {
    form.inputName.value = '';
    form.cityOrigin.value = '';
    form.cityDepature.value = '';
    form.dateDepature.value = '';
    form.statusSelect.value = '';
  }

  const statusListener = function (statusSelect) {
    statusSelect.addEventListener('change', function (e) {
      if (this.nextSibling && this.nextSibling.classList.contains('error-status')) {
        this.nextSibling.remove();
      };
      const selectId = this.id.slice(7);
      cargoList.forEach((cargo) => {
        if (cargo.id === selectId) {
          const newStatus = getSelectedOption(this).textContent;
          const cargoDate = cargo.departureDate;
          const cargoYear = cargoDate.slice(0, 4);
          const cargoMonth = cargoDate.slice(5, 7) - 1;
          const cargoDay = cargoDate.slice(8);
          const dateFormated = new Date(cargoYear, cargoMonth, cargoDay);
          const dateNow = new Date();

          if (dateFormated > dateNow && newStatus === 'Доставлен') {
            const errorElement = createNewElement('div', 'invalid-feedback', 'Введите корректный статус');
            errorElement.classList.add('error-status');
            errorElement.style.display = 'block';

            statusSelect.insertAdjacentElement('afterend', errorElement);

            for (const status in statuses) {
              if (cargo.status === statuses[status]) {
                this.value = status;
              }
            }
            return;
          }
          else {
            cargo.status = newStatus;
          }
          return;
        }
      });
      changeColorSelected(this);
    })
  };

  const changeColorSelected = function (selectElement) {
     const selectOption = getSelectedOption(selectElement);
    const selectOptionValue = getSelectedOption(selectElement).value;
    selectElement.classList.remove('text-primary', 'text-warning', 'text-success', 'text-secondary');
    if (selectOptionValue === 'onWay') {
      selectElement.classList.add('text-primary');
    }
    if (selectOptionValue === 'wait') {
      selectElement.classList.add('text-warning');
    }
    if (selectOptionValue === 'delivered') {
      selectElement.classList.add('text-success');
    }
    if (selectOption.id === 'statusNotSelected') {
      selectElement.classList.add('text-secondary');
    }
  }

  const generateIdCargo = function () {
    let idIsExist;
    let newId;
    for (let num = 1; num <= 7; num++) {
      newId = num;
      cargoList.forEach((cargo) => {
        const idCurrent = cargo.id;
        const numberIdCurrent = Number(idCurrent.slice(5, 8));
        if (num === numberIdCurrent) {
          idIsExist = true;
          newId = false;
          return;
        }
      });
      if (newId) {
        break;
      }
    }
    const numWidthZero = String(newId).padStart(3, '0');
    return 'CARGO' + numWidthZero;
  };

  document.addEventListener('DOMContentLoaded', function () {
    generateIdCargo();
    const container = document.getElementById('cargo-app');

    const cargoAppTitle = createAppTitle('Список грузов');
    const cargoForm = createCargoForm();
    const cargoTable = createCargoTable(cargoList);
    const cargoFilterForm = createFilterForm();

    container.append(
      cargoAppTitle,
      cargoForm.form,
      cargoFilterForm.form,
      cargoTable.table
    );

    cargoForm.form.addEventListener('submit', function (e) {
      e.preventDefault();
      const newCargo = {
        id: generateIdCargo(),
        name: cargoForm.inputName.value,
        destination: getSelectedOption(cargoForm.cityDepature).textContent,
        origin: getSelectedOption(cargoForm.cityOrigin).textContent,
        status: getSelectedOption(cargoForm.statusSelect).textContent,
        departureDate: cargoForm.dateDepature.value
      }
      const newItemTable = createCargoItem(newCargo).item;
      cargoTable.tbody.append(newItemTable);
      cargoList.push(newCargo);
      clearForm(cargoForm);
    });

    cargoFilterForm.statusSelect.addEventListener('change', function () {
      const cargoListNew = [];
      container.querySelector('.table').remove();
      const selectedOption = getSelectedOption(this);

      if (selectedOption.id === 'statusNotSelected') {
        const cargoTableNew = createCargoTable(cargoList).table;
        container.append(cargoTableNew);
        return;
      }
      cargoList.forEach((cargo) => {
        if (selectedOption.textContent === cargo.status) {
          cargoListNew.push(cargo);
        }
      });

      const cargoTableNew = createCargoTable(cargoListNew).table;
      container.append(cargoTableNew);
    });
  });

})();
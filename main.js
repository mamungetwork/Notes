"use-strict";
const theDate = document.querySelector(".date");
const theTemplate = document.querySelector("template").innerHTML;
const taskContainer = document.querySelector(".task_group");
const allFilterBtn = document.querySelectorAll(".filter");
const taskAddButton = document.querySelector(".add_button");
const modalCheckBtn = document.querySelector(".modal_check");
const modalDeleteBtn = document.querySelector(".modal_delete");
const addTaskBtn = document.querySelector(`[data-modal="new-task"]`);
let taskCard = document.querySelectorAll(`.task_card`);
const allModal = document.querySelectorAll(".modal_content");
const modalOverlay = document.querySelector(".overlay");
const addNameBtn = document.querySelector(".add_name");
const usernameField = document.querySelector(".username_field");
const userName = document.querySelector("span.name");

let ourTasks = [
  {
    id: 0,
    taskName: "I Need to go to market",
    description: "I need to go to market at 12:30 PM, to get some food for us",
    status: "Pending",
  },
  {
    id: 1,
    taskName: "Doctor Appointment",
    description: "I need to meet the dentist to checkout my teeth",
    status: "Completed",
  },
  {
    id: 2,
    taskName: "Vacetions",
    description: "Me and my wife want to go on a vacetion after Eid",
    status: "Pending",
  },
];

document.addEventListener("DOMContentLoaded", (event) => {
  showModal(document.querySelector(".get_name_modal"));
});
loadDate();
loadAllTask();

addNameBtn.addEventListener("click", () => {
  let warning = document.querySelector(".warning");
  if (!(usernameField.value === "")) {
    userName.textContent = usernameField.value.split(" ")[0];
    warning.style.display = "none";
    hideModal(document.querySelector(".get_name_modal"));
    // console.log(theValue);
  } else {
    userName.textContent = "Guest";
    hideModal(document.querySelector(".get_name_modal"));
  }
});
taskAddButton.addEventListener("click", addNewTask);
modalCheckBtn.addEventListener("click", (e) => {
  handleCheckModal(e);
});
modalDeleteBtn.addEventListener("click", (e) => {
  handleDeleteModal(e);
});

const taskViewModal = document.querySelector(
  `[data-modal_content="task-card"]`
);

addTaskBtn.addEventListener("click", (e) => {
  let content = document.querySelector('[data-modal_content="new-task"]');
  showModal(content);
});

taskCard.forEach((card) => {
  card.addEventListener("click", (e) => {
    handleModal(card);
  });
});

function handleModal(card) {
  let theID = card.dataset.task_id;
  taskViewModal.querySelector("h2").textContent = ourTasks[theID].taskName;
  taskViewModal.querySelector("p").textContent = ourTasks[theID].description;
  taskViewModal.setAttribute("data-task_id", `${theID}`);
  taskViewModal.classList.remove("pending");
  taskViewModal.classList.remove("completed");
  taskViewModal.classList.add(`${ourTasks[theID].status.toLowerCase()}`);
  showModal(taskViewModal);
}

function loadDate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date();
  const theYear = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const theDay = days[date.getDay()];
  const output = `<b style="color: #3f3f3f;">It's</b> ${theDay}, ${day} ${month} ${theYear}`;
  theDate.innerHTML = output;
}

function creteCard(status, taskName, statusText, id) {
  const newCard = document.createElement("div");
  newCard.classList.add("task_card");
  newCard.classList.add(`${status}`);
  newCard.innerHTML = theTemplate;
  newCard.setAttribute("data-modal_trigger", "task-card");
  newCard.setAttribute("data-task_id", `${id}`);
  newCard.querySelector(".task_name").textContent = taskName;
  newCard.querySelector(".status").textContent = statusText;
  taskContainer.prepend(newCard);
}

function loadAllTask() {
  for (let i = 0; i < ourTasks.length; i++) {
    switch (ourTasks[i].status) {
      case "Pending":
        creteCard(
          "pending",
          ourTasks[i].taskName,
          ourTasks[i].status,
          ourTasks[i].id
        );
        break;

      case "Completed":
        creteCard(
          "completed",
          ourTasks[i].taskName,
          ourTasks[i].status,
          ourTasks[i].id
        );
        break;
    }
  }

  updateTaskCount(ourTasks.length, "All Tasks");
}

let deleteButton = document.querySelectorAll(".delete");
deleteButton.forEach((button) => {
  button.addEventListener("click", (e) => {
    handleDelete(e);
  });
});

let checkButton = document.querySelectorAll(".check");
checkButton.forEach((button) => {
  button.addEventListener("click", (e) => {
    handleCheckButton(e);
  });
});

function handleCheckButton(e) {
  e.stopPropagation();
  let parentCard = e.target.closest(".task_card");
  let theID = parentCard.dataset.task_id;
  if (ourTasks[theID].status !== "Completed") {
    ourTasks[theID].status = "Completed";
    parentCard.classList.replace("pending", "completed");
    parentCard.querySelector(".status").textContent = "Completed";
  }

  let theStatus, arrItem;
  allFilterBtn.forEach((btn) => {
    if (btn.classList.contains("active")) {
      theStatus = btn.textContent;

      switch (theStatus) {
        case "Pending":
          parentCard.style.display = "none";
          arrItem = [];
          ourTasks.forEach((item, index) => {
            if (item.status === `${theStatus}`) {
              arrItem.push(item);
            }
          });
          console.log(arrItem);
          updateTaskCount(arrItem.length, theStatus);
          break;
      }
    }
  });
}

function handleCheckModal(e) {
  let modalCard = e.target.closest(".modal_content");
  let theID = modalCard.dataset.task_id;

  if (ourTasks[theID].status !== "Completed") {
    ourTasks[theID].status = "Completed";

    taskCard.forEach((card) => {
      if (card.dataset.task_id === theID) {
        card.classList.replace("pending", "completed");
        card.querySelector(".status").textContent = "Completed";
      }
    });
    hideModal(taskViewModal);
  }
}

function handleDelete(e) {
  e.stopPropagation();
  let parentCard = e.target.closest(".task_card");
  let theID = parentCard.dataset.task_id;
  parentCard.remove();
  delete ourTasks[theID];
  updateTaskCount(document.querySelectorAll(".task_card ").length, "All Tasks");

  let theStatus, arrItem;
  allFilterBtn.forEach((btn) => {
    if (btn.classList.contains("active")) {
      theStatus = btn.textContent;

      switch (theStatus) {
        case "Pending":
          arrItem = [];
          ourTasks.forEach((item, index) => {
            if (item.status === `${theStatus}`) {
              arrItem.push(item);
            }
          });
          updateTaskCount(arrItem.length, theStatus);
          break;

        case "Completed":
          arrItem = [];
          ourTasks.forEach((item, index) => {
            if (item.status === `${theStatus}`) {
              arrItem.push(item);
            }
          });
          updateTaskCount(arrItem.length, theStatus);
          break;
      }
    }
  });
}

function handleDeleteModal(e) {
  let modalCard = e.target.closest(".modal_content");
  let theID = modalCard.dataset.task_id;

  taskCard.forEach((card) => {
    if (card.dataset.task_id === theID) {
      card.remove();
      delete ourTasks[theID];
      updateTaskCount(
        document.querySelectorAll(".task_card ").length,
        "All Tasks"
      );
    }
  });

  hideModal(taskViewModal);
}

function updateTaskCount(count, status) {
  let output;
  switch (status) {
    case "All Tasks":
      output = `You have total ${count} tasks`;
      break;

    case "Pending":
      output = `You have total ${count} tasks pending`;
      break;

    case "Completed":
      output = `You have completed ${count} tasks`;
      break;
  }
  document.querySelector(".tast_count").innerHTML = output;
}

modalOverlay.addEventListener("click", (e) => {
  allModal.forEach((modal) => {
    hideModal(modal);
  });
});

function showModal(content) {
  content.classList.toggle("show");
  modalOverlay.classList.toggle("show");
}

function hideModal(content) {
  content.classList.remove("show");
  modalOverlay.classList.remove("show");
}

function addNewTask() {
  const titleInput = document.querySelector(".task_title_field");
  const descInput = document.querySelector(".task_desc_field");
  let theTitle = titleInput.value;
  let theDesc = descInput.value;

  ourTasks.push({});
  let newTask = ourTasks[ourTasks.length - 1];
  newTask.id = ourTasks.length;
  newTask.taskName = theTitle;
  newTask.description = theDesc;
  newTask.status = "Pending";

  creteCard("pending", theTitle, "Pending", ourTasks.length - 1);
  updateTaskCount(document.querySelectorAll(".task_card ").length, "All Tasks");

  // Update checkButton NodeList after adding a new task
  checkButton = document.querySelectorAll(".check");
  deleteButton = document.querySelectorAll(".delete");
  taskCard = document.querySelectorAll(`.task_card`);

  // Attach event listener to the newly added check button
  checkButton.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      if (index === 0) {
        handleCheckButton(e);
      }
    });
  });
  deleteButton.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      if (index === 0) {
        handleDelete(e);
      }
    });
  });
  taskCard.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      if (index === 0) {
        handleModal(button);
      }
    });
  });
  let content = document.querySelector('[data-modal_content="new-task"]');

  hideModal(content);
}

allFilterBtn.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    taskCard = document.querySelectorAll(`.task_card`);
    allFilterBtn.forEach((item) => item.classList.remove("active"));
    e.target.classList.add("active");
    handleFilter(e.target.textContent);
  })
);

function handleFilter(status) {
  const filterCondition = (card, className) =>
    card.classList.contains(className)
      ? (card.style.display = "flex")
      : (card.style.display = "none");

  switch (status) {
    case "All Tasks":
      taskCard.forEach((card) => (card.style.display = "flex"));
      updateTaskCount(document.querySelectorAll(".task_card ").length, status);
      break;

    case "Pending":
    case "Completed":
      taskCard.forEach((card) => filterCondition(card, status.toLowerCase()));
      const filteredTasks = ourTasks.filter((item) => item.status === status);
      updateTaskCount(filteredTasks.length, status);
      break;
  }
}

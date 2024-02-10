"use-strict";
const theDate = document.querySelector(".date");
const theTemplate = document.querySelector("template").innerHTML;
const taskContainer = document.querySelector(".task_group");
const taskAddButton = document.querySelector(".add_button");

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

loadDate();
loadAllTask();

taskAddButton.addEventListener("click", addNewTask);

const modalTrigger = document.querySelectorAll(`[data-modal_trigger]`);
const modalContent = document.querySelectorAll(`[data-modal_content]`);
const modalOverlay = document.querySelector(".overlay");
modalTrigger.forEach((button) => {
  button.addEventListener("click", (e) => {
    modalContent.forEach((content) => {
      let theID = button.dataset.task_id;
      if (content.dataset.modal_content === button.dataset.modal_trigger) {
        if (content.dataset.modal_content === "task-card") {
          content.querySelector("h2").textContent = ourTasks[theID].taskName;
          content.querySelector("p").textContent = ourTasks[theID].description;
          content.setAttribute("data-task_id", `${theID}`);
          console.log(theID);
        }
        showModal(content);
      }
    });
  });
});

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
  const output = `${theDay}, ${day} ${month} ${theYear}`;
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

  updateTaskCount(ourTasks.length, "all");
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
}

function handleDelete(e) {
  e.stopPropagation();
  let parentCard = e.target.closest(".task_card");
  let theID = parentCard.dataset.task_id;
  parentCard.remove();
  delete ourTasks[theID];
  updateTaskCount(document.querySelectorAll(".task_card ").length, "all");
}

function updateTaskCount(count, status) {
  let output;
  switch (status) {
    case "all":
      output = `You have total ${count} tasks`;
      break;

    case "pending":
      output = `You have total ${count} tasks pending`;
      break;

    case "complete":
      output = `You have completed ${count} tasks`;
      break;
  }
  document.querySelector(".tast_count").innerHTML = output;
}

modalOverlay.addEventListener("click", (e) => {
  modalContent.forEach((content) => {
    hideModal(content);
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
  updateTaskCount(document.querySelectorAll(".task_card ").length, "all");

  // Update checkButton NodeList after adding a new task
  checkButton = document.querySelectorAll(".check");
  deleteButton = document.querySelectorAll(".delete");

  // Attach event listener to the newly added check button
  checkButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      handleCheckButton(e);
    });
  });
  deleteButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      handleDelete(e);
    });
  });
  let content = document.querySelector('[data-modal_content="new-task"]');

  hideModal(content);
}

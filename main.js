"use-strict";
const theDate = document.querySelector(".date");
const theTemplate = document.querySelector("template").innerHTML;
const taskContainer = document.querySelector(".task_group");

let ourTasks = [
  {
    id: 1,
    taskName: "I Need to go to market",
    description: "I need to go to market at 12:30 PM, to get some food for us",
    status: "Pending",
  },
  {
    id: 2,
    taskName: "Doctor Appointment",
    description: "I need to meet the dentist to checkout my teeth",
    status: "Completed",
  },
  {
    id: 3,
    taskName: "Vacetions",
    description: "Me and my wife want to go on a vacetion after Eid",
    status: "Pending",
  },
];

loadDate();
loadAllTask();
deleteTask();
completeTask();

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

function creteCard(status, taskName, statusText) {
  const newCard = document.createElement("div");
  newCard.classList.add("task_card");
  newCard.classList.add(`${status}`);
  newCard.innerHTML = theTemplate;
  newCard.querySelector(".task_name").textContent = taskName;
  newCard.querySelector(".status").textContent = statusText;
  taskContainer.appendChild(newCard);
}

function loadAllTask() {
  for (let i = 0; i < ourTasks.length; i++) {
    switch (ourTasks[i].status) {
      case "Pending":
        creteCard("pending", ourTasks[i].taskName, ourTasks[i].status);
        break;

      case "Completed":
        creteCard("completed", ourTasks[i].taskName, ourTasks[i].status);
        break;
    }
  }

  updateTaskCount(ourTasks.length, "all");
}

function deleteTask() {
  const deleteButton = document.querySelectorAll(".delete");
  deleteButton.forEach((button, index) => {
    let parentCard = button.parentElement.parentElement;
    let cardIndex = index;
    button.addEventListener("click", (e) => {
      parentCard.remove();
      delete ourTasks[cardIndex];
      updateTaskCount(document.querySelectorAll(".task_card ").length, "all");
    });
  });
}

function completeTask() {
  const checkButton = document.querySelectorAll(".check");
  checkButton.forEach((button, index) => {
    let parentCard = button.parentElement.parentElement;
    let cardIndex = index;
    button.addEventListener("click", (e) => {
      if (ourTasks[index].status !== "Completed") {
        ourTasks[index].status = "Completed";
        parentCard.classList.replace("pending", "completed");
        parentCard.querySelector(".status").textContent = "Completed";
      }
    });
  });
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

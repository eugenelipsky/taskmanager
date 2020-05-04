'use strict'

let tasklist = {
    todo: [],
    inProgress: [],
    done: []
};

//CRUD

function addTask(taskName, description, urgency, status) {
    if (taskName !== '' && description !== '' && urgency >= -1 && urgency <= 1) {
        tasklist[status].push({
            _id: generateUniqueId(),
            taskName: taskName,
            desc: description,
            urgency: urgency,
            statusValue: status
        })
    } else {
        alert('Fields are empty')
    }
}

function moveTask(taskNameToMove, from, to) {
    tasklist[from].map(item => {
        if (item.taskName === taskNameToMove) {
            addTask(item.taskName, item.desc, item.urgency, to)
        }
    })
    deleteTask(taskNameToMove, from)
}

function deleteTask(id, status) {
    tasklist[status] = tasklist[status].filter(item => item._id !== id);
}

function editTask(taskToEdit, from, taskName, description, urgency) {
    tasklist[from].map(item => {
        if (item.taskName === taskToEdit && taskName !== '' && description !== '' && urgency >= -1 && urgency <= 1) {
            item.taskName = taskName
            item.desc = description
            item.urgency = urgency
        }
    })
}

function generateUniqueId() {
    let id = `f${(~~(Math.random() * 1e8)).toString(16)}`
    return id;
}

//Get DOM objects
//Add form
let taskNameInput = document.querySelector('.task__add-name'),
    descrInput = document.querySelector('.task__add-descr'),
    urgencySelect = document.querySelector('.task__add-urgency'),
    statusSelect = document.querySelector('.task__add-status'),
    addTaskButton = document.querySelector('.task__add-submit'),
//Urgency boxes
    todoBox = document.querySelector('.todo__urgency'),
    inProgressBox = document.querySelector('.inprogress__urgency'),
    doneBox = document.querySelector('.done__urgency')

document.addEventListener('DOMContentLoaded', (e) => {
    addTaskButton.addEventListener('click', (e) => {
        e.preventDefault();
        addTask(taskNameInput.value, descrInput.value, urgencySelect.value, statusSelect.value);
        console.log(tasklist);

        tasklist[statusSelect.value].map(item => {
            function changeUrgencyIcon() {
                switch (urgencySelect.value) {
                    case '-1':
                        return "img/icons/arrow_down.svg";
                    case '1':
                        return "img/icons/arrow_up.svg";
                    default:
                        return "img/icons/arrow_right.svg";
                }
            }

            let statusValue = statusSelect.value,
                nameValue = taskNameInput.value,
                descValue = descrInput.value

            let newTaskItemName = document.createElement('div')
            newTaskItemName.classList.add('task__item-name')
            newTaskItemName.setAttribute('id', item._id)
            newTaskItemName.innerText = taskNameInput.value

            let newTaskDescr = document.createElement('div')
            newTaskDescr.classList.add('task__item-descr')
            newTaskDescr.setAttribute('id', item._id)
            newTaskDescr.innerText = descrInput.value

            let newUrgencyIcon = document.createElement('img')
            newUrgencyIcon.classList.add('task__urgency-icon')
            newUrgencyIcon.setAttribute('src', changeUrgencyIcon())

            let onEdit = document.createElement('div')
            onEdit.classList.add('task__item-onedit')
            onEdit.textContent = 'On edit'

            let newEditButton = document.createElement('button')
            newEditButton.classList.add('task__item-edit')
            newEditButton.setAttribute('id', item._id)
            newEditButton.setAttribute('data-status', item.statusValue)
            newEditButton.setAttribute('data-name', item.taskName)
            newEditButton.addEventListener('click', () => {
                if (newEditButton.id === newTaskItem.getAttribute('uid')) {
                    taskNameInput.value = item.taskName
                    descrInput.value = item.desc
                    urgencySelect.value = item.urgency
                    statusSelect.value = item.statusValue
                    newEditButton.style.display = 'none'
                    onEdit.style.display = 'block'
                    if(item._id === newEditButton.id) {
                        let editButtonMain = document.createElement('button')
                        editButtonMain.classList.add('task__edit-main')
                        editButtonMain.textContent = 'Save'
                        document.querySelector('form').appendChild(editButtonMain)
                        document.querySelector('form').removeChild(addTaskButton)
                        editButtonMain.addEventListener('click', (e) => {
                            e.preventDefault()
                            newEditButton.style.display = 'block'
                            onEdit.style.display = 'none'
                            document.querySelector('form').removeChild(editButtonMain)
                            document.querySelector('form').appendChild(addTaskButton)

                            editTask(item.taskName, newEditButton.dataset.status, taskNameInput.value, descrInput.value, urgencySelect.value)
                            if (newEditButton.id === item._id) {
                                newTaskItem.childNodes.forEach(item => {
                                    item.childNodes.forEach(item => {
                                        newTaskItemName.textContent = taskNameInput.value
                                        newTaskDescr.textContent = descrInput.value
                                        newUrgencyIcon.setAttribute('src', changeUrgencyIcon())
                                    })
                                });
                            }

                            // document.querySelector('.task__urgency-icon').setAttribute()


                            taskNameInput.value = ''
                            descrInput.value = ''
                            console.log(tasklist)
                        })
                    }
                }
            });

            let newDeleteButton = document.createElement('button')
            newDeleteButton.classList.add('task__item-delete')
            newDeleteButton.setAttribute('data-id', item._id)
            newDeleteButton.setAttribute('data-status', item.statusValue)
            newDeleteButton.addEventListener('click', () => {
                document.querySelectorAll('.task__item-delete').forEach(delButtons => {
                    if (delButtons.dataset.id === item._id) {
                        deleteTask(newTaskItem.getAttribute('uid'), newDeleteButton.dataset.status);
                        newTaskItem.remove()
                        console.log(delButtons.dataset.id)
                        console.log(tasklist)
                    }
                })
            })

            let newTopArea = document.createElement('div')
            newTopArea.classList.add('task__item-top')
            newTopArea.appendChild(newTaskItemName)
            newTopArea.appendChild(newEditButton)
            newTopArea.appendChild(onEdit)

            let newBottomArea = document.createElement('div')
            newBottomArea.classList.add('task__item-content')
            newBottomArea.appendChild(newTaskDescr)
            newBottomArea.appendChild(newUrgencyIcon)
            newBottomArea.appendChild(newDeleteButton)

            let newTaskItem = document.createElement('div')
            newTaskItem.classList.add('task__item')
            tasklist[statusValue].map(item => {
                newTaskItem.setAttribute('uid', item._id)
                newTaskItem.setAttribute('data-status', item.statusValue)
            })
            newTaskItem.appendChild(newTopArea)
            newTaskItem.appendChild(newBottomArea)

            if (statusSelect.value === 'todo' && taskNameInput !== null && descrInput !== null) {
                if (item._id === newTaskItem.getAttribute('uid')) {
                    todoBox.appendChild(newTaskItem)
                }
            } else if (statusSelect.value === 'inProgress' && taskNameInput !== null && descrInput !== null) {
                if (item._id === newTaskItem.getAttribute('uid')) {
                    inProgressBox.appendChild(newTaskItem)
                }
            } else if (statusSelect.value === 'done' && taskNameInput !== null && descrInput !== null) {
                if (item._id === newTaskItem.getAttribute('uid')) {
                    doneBox.appendChild(newTaskItem);
                }
            }
        })

        taskNameInput.value = ''
        descrInput.value = ''
    })
})
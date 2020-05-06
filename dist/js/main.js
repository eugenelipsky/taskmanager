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
        if (item._id === taskNameToMove) {
            tasklist[to].push({
                _id: item._id,
                taskName: item.taskName,
                desc: item.desc,
                urgency: item.urgency,
                statusValue: item.statusValue
            })
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
                    if (newEditButton.id === newTaskItem.id) {
                        taskNameInput.value = item.taskName
                        descrInput.value = item.desc
                        urgencySelect.value = item.urgency
                        statusSelect.value = item.statusValue
                        console.log(item.statusValue)
                        newEditButton.style.display = 'none'
                        onEdit.style.display = 'block'
                        if (item._id === newEditButton.id) {
                            let saveButton = document.createElement('button')
                            saveButton.classList.add('task__edit-main')
                            saveButton.textContent = 'Save'
                            document.querySelector('form').appendChild(saveButton)
                            document.querySelector('form').removeChild(addTaskButton)
                            saveButton.addEventListener('click', (e) => {
                                e.preventDefault()
                                newEditButton.style.display = 'block'
                                onEdit.style.display = 'none'
                                document.querySelector('form').removeChild(saveButton)
                                document.querySelector('form').appendChild(addTaskButton)

                                editTask(item.taskName, newEditButton.dataset.status, taskNameInput.value, descrInput.value, urgencySelect.value)
                                if (newEditButton.id === item._id) {
                                    switch (statusSelect.value) {
                                        case 'todo':
                                            newTaskItem.parentNode.removeChild(newTaskItem)
                                            todoBox.appendChild(newTaskItem)
                                            moveTask(newTaskItem.id, newTaskItem.dataset.status, statusSelect.value)
                                            newTaskItem.dataset.status = statusSelect.value
                                            newDeleteButton.dataset.status = statusSelect.value
                                            newEditButton.dataset.status = statusSelect.value
                                            item.statusValue = statusSelect.value
                                            newTaskItem.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'
                                            newTaskItem.style.borderBottom = '3px solid rgba(255, 0, 0, .5)'
                                            break;
                                        case 'inProgress':
                                            newTaskItem.parentNode.removeChild(newTaskItem)
                                            inProgressBox.appendChild(newTaskItem)
                                            moveTask(newTaskItem.id, newTaskItem.dataset.status, statusSelect.value)
                                            newTaskItem.dataset.status = statusSelect.value
                                            newDeleteButton.dataset.status = statusSelect.value
                                            newEditButton.dataset.status = statusSelect.value
                                            item.statusValue = statusSelect.value
                                            newTaskItem.style.backgroundColor = 'rgba(255, 247, 0, 0.2)'
                                            newTaskItem.style.borderBottom = '3px solid rgba(255, 247, 0, .5)'
                                            break;
                                        case 'done':
                                            newTaskItem.parentNode.removeChild(newTaskItem)
                                            doneBox.appendChild(newTaskItem)
                                            moveTask(newTaskItem.id, newTaskItem.dataset.status, statusSelect.value)
                                            newTaskItem.dataset.status = statusSelect.value
                                            newDeleteButton.dataset.status = statusSelect.value
                                            newEditButton.dataset.status = statusSelect.value
                                            item.statusValue = statusSelect.value
                                            newTaskItem.style.backgroundColor = 'rgba(4, 255, 0, 0.2)'
                                            newTaskItem.style.borderBottom = '3px solid rgba(4, 255, 0, .5)'
                                            break;
                                    }
                                    newTaskItem.childNodes.forEach((item) => {
                                        newTaskItemName.textContent = taskNameInput.value
                                        newTaskDescr.textContent = descrInput.value
                                        newUrgencyIcon.setAttribute('src', changeUrgencyIcon())
                                    });

                                }

                                taskNameInput.value = ''
                                descrInput.value = ''
                                console.log(tasklist)
                            })
                        }
                    }
                });

                let newDeleteButton = document.createElement('button')
                newDeleteButton.classList.add('task__item-delete')
                newDeleteButton.setAttribute('id', item._id)
                newDeleteButton.setAttribute('data-status', item.statusValue)
                newDeleteButton.addEventListener('click', () => {
                    document.querySelectorAll('.task__item-delete').forEach(delButtons => {
                        if (delButtons.id === item._id) {
                            let confirmDelete = confirm(`Do you want to delete ${item.taskName}?`)
                            if (confirmDelete === true){
                                deleteTask(newTaskItem.id, newDeleteButton.dataset.status);
                                newTaskItem.remove()
                                console.log(tasklist)
                            } 
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
                    newTaskItem.setAttribute('id', item._id)
                    newTaskItem.setAttribute('data-status', item.statusValue)
                })
                switch (newTaskItem.dataset.status) {
                    case 'todo':
                        newTaskItem.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'
                        newTaskItem.style.borderBottom = '3px solid rgba(255, 0, 0, .5)'
                        break;
                    case 'inProgress':
                        newTaskItem.style.backgroundColor = 'rgba(255, 247, 0, 0.2)'
                        newTaskItem.style.borderBottom = '3px solid rgba(255, 247, 0, .5)'

                        break;
                    case 'done':
                        newTaskItem.style.backgroundColor = 'rgba(4, 255, 0, 0.2)'
                        newTaskItem.style.borderBottom = '3px solid rgba(4, 255, 0, .5)'
                        break;
                }
                newTaskItem.appendChild(newTopArea)
                newTaskItem.appendChild(newBottomArea)

                if (statusSelect.value === 'todo' && newTaskItemName.textContent !== '' && newTaskDescr.textContent !== '') {
                    if (item._id === newTaskItem.id) {
                        todoBox.appendChild(newTaskItem)
                    }
                } else if (statusSelect.value === 'inProgress' && newTaskItemName.textContent !== '' && newTaskDescr.textContent !== '') {
                    if (item._id === newTaskItem.id) {
                        inProgressBox.appendChild(newTaskItem)
                    }
                } else if (statusSelect.value === 'done' && newTaskItemName.textContent !== '' && newTaskDescr.textContent !== '') {
                    if (item._id === newTaskItem.id) {
                        doneBox.appendChild(newTaskItem);
                    }
                }
            }
        )

        taskNameInput.value = ''
        descrInput.value = ''


    })
})


// const dragAndDrop = () => {
//
//     const taskItem = document.getElementsByClassName('task__item');
//     const taskBoxes = document.querySelectorAll('.task__box');
//
//
//     const dragStart = function (e) {
//         if (e.target.id === item._id) {
//             setTimeout(() => {
//                 this.classList.add('hide')
//             }, 0)
//         }
//     }
//
//     const dragEnd = function (e) {
//         if (e.target.id === item._id) {
//             this.classList.remove('hide');
//         }
//     }
//
//     const dragOver = function (e) {
//         e.preventDefault();
//     }
//     const dragEnter = function (e) {
//         e.preventDefault()
//         this.classList.add('hovered');
//     }
//     const dragLeave = function (e) {
//         this.classList.remove('hovered');
//     }
//     const dragDrop = function (e) {
//         for (let i = 0; i < taskItem.length; i++) {
//             if (taskItem.item(i).lastChild === item._id) {
//                 this.append(taskItem.item(i));
//                 this.classList.remove('hovered');
//             }
//         }
//     }
//
//     taskBoxes.forEach((box) => {
//         box.addEventListener('dragover', dragOver)
//         box.addEventListener('dragenter', dragEnter)
//         box.addEventListener('dragleave', dragLeave)
//         box.addEventListener('drop', dragDrop)
//
//     })
//     for (let i = 0; i < taskItem.length; i++) {
//         if (taskItem.item(i).id === item._id) {
//             taskItem.item(i).addEventListener('dragstart', dragStart)
//             taskItem.item(i).addEventListener('dragend', dragEnd)
//         }
//     }
// }
//
// dragAndDrop()